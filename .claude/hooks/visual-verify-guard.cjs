#!/usr/bin/env node
'use strict';

/**
 * visual-verify-guard.cjs — PreToolUse hook (Bash)
 *
 * Detects git commit commands when staged .tsx component files exist
 * but no Playwright screenshot has been taken this session.
 *
 * Structural fix for the S56 0/8 Product Quality score:
 * "You committed UI changes without ever looking at them."
 *
 * v10.6 — S56
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Flag file set by visual verification (any screenshot taken)
const SCREENSHOT_FLAG = path.join(
  process.env.TMPDIR || process.env.TEMP || '/tmp',
  'harness-visual-verified'
);

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const command = (data.tool_input || {}).command || '';

    // Only check git commit commands
    if (!command.match(/\bgit\s+commit\b/)) {
      process.exit(0);
    }

    // Check if staged changes include component .tsx files
    let stagedFiles = [];
    try {
      const diff = execFileSync('git', ['diff', '--cached', '--name-only'], {
        encoding: 'utf8',
        timeout: 5000,
      }).trim();
      stagedFiles = diff.split('\n').filter(Boolean);
    } catch {
      process.exit(0); // Can't check — allow
    }

    const componentFiles = stagedFiles.filter(f =>
      f.endsWith('.tsx') && (
        f.includes('/components/') ||
        f.includes('/screens/') ||
        f.includes('/pages/')
      )
    );

    if (componentFiles.length === 0) {
      process.exit(0); // No UI files — no screenshot needed
    }

    // Check if a screenshot was taken this session
    const hasScreenshot = fs.existsSync(SCREENSHOT_FLAG);

    if (!hasScreenshot) {
      const result = {
        decision: 'warn',
        reason: `⚠️ VISUAL VERIFICATION MISSING: You're committing ${componentFiles.length} UI component file(s) but no Playwright screenshot was taken this session.\n\nFiles: ${componentFiles.slice(0, 5).join(', ')}${componentFiles.length > 5 ? '...' : ''}\n\nTake a screenshot with Playwright before committing UI changes. "Build passes" ≠ "looks correct."`
      };
      process.stdout.write(JSON.stringify(result));
    }

    process.exit(0);
  } catch {
    process.exit(0);
  }
});
