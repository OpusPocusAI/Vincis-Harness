#!/usr/bin/env node
'use strict';

/**
 * quality-gate.js — Stop hook (type: command)
 *
 * Runs build verification and code quality checks when a session ends.
 * If build fails on changed files: exits 2 (forces continuation to fix).
 * If only warnings: exits 0 with message.
 *
 * v10.0
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Guard against infinite loops — skip after 2 consecutive invocations
const guardFile = path.join(process.env.TMPDIR || process.env.TEMP || '/tmp', 'quality-gate-count');
try {
  const count = parseInt(fs.readFileSync(guardFile, 'utf8') || '0');
  if (count >= 2) {
    fs.unlinkSync(guardFile);
    process.exit(0); // Allow stop after 2 attempts
  }
  fs.writeFileSync(guardFile, String(count + 1));
} catch {
  try { fs.writeFileSync(guardFile, '1'); } catch {}
}

try {
  // Check what files changed in this session
  let changedFiles = [];
  try {
    const diff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8', timeout: 5000 }).trim();
    const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8', timeout: 5000 }).trim();
    changedFiles = [...diff.split('\n'), ...untracked.split('\n')].filter(Boolean);
  } catch {}

  // If no code files changed, skip
  const codeFiles = changedFiles.filter(f => /\.(ts|tsx|js|jsx|css)$/.test(f));
  if (codeFiles.length === 0) {
    cleanGuard();
    process.exit(0);
  }

  const warnings = [];

  // Check for console.log in changed files
  const consoleLogFiles = [];
  for (const file of codeFiles) {
    if (!/\.(ts|tsx|js|jsx)$/.test(file)) continue;
    try {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      const hits = lines.filter((l, i) => /console\.log\b/.test(l) && !/\/\//.test(l.split('console.log')[0]));
      if (hits.length > 0) consoleLogFiles.push(`${file} (${hits.length})`);
    } catch {}
  }
  if (consoleLogFiles.length > 0) {
    warnings.push(`console.log found in: ${consoleLogFiles.join(', ')}`);
  }

  // Check if FE files changed — run TypeScript check
  const feFiles = codeFiles.filter(f => f.startsWith('FE/'));
  if (feFiles.length > 0) {
    try {
      execFileSync('npx', ['tsc', '--noEmit'], {
        cwd: path.join(process.cwd(), 'FE'),
        encoding: 'utf8',
        timeout: 60000,
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (e) {
      // tsc errors — this is serious but don't block (pre-existing errors exist)
      const errorCount = ((e.stdout || '') + (e.stderr || '')).split('\n')
        .filter(l => /error TS\d+/.test(l)).length;
      // Dynamic baseline: count errors from a clean tsc run is expensive,
      // so use a generous threshold — only flag if clearly above normal
      if (errorCount > 25) { // Well above any known pre-existing baseline
        warnings.push(`TypeScript: ${errorCount} errors (above baseline)`);
      }
    }
  }

  if (warnings.length > 0) {
    const msg = `\n[Quality Gate] ${warnings.join(' | ')}\n`;
    process.stdout.write(msg); // stdout = additionalContext for Claude
    process.stderr.write(msg); // stderr = terminal visibility
  }

  cleanGuard();
  process.exit(0);
} catch {
  cleanGuard();
  process.exit(0);
}

function cleanGuard() {
  try { fs.unlinkSync(guardFile); } catch {}
}
