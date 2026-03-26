#!/usr/bin/env node
'use strict';

/**
 * quality-cascade.cjs — PostToolUse hook (Write|Edit matcher)
 *
 * Tracks .ts/.tsx code edits. After every 5 edits, nudges quality checks.
 * After every 10 edits, reminds to commit.
 */

const fs = require('fs');
const path = require('path');

const TMPDIR = process.env.TMPDIR || process.env.TEMP || '/tmp';
const STATE_FILE = path.join(TMPDIR, 'harness-quality-cascade.json');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = data.tool_input?.file_path || '';

    // Only track .ts and .tsx files
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
      process.exit(0);
    }

    // Load state
    let state = { codeEditCount: 0 };
    try {
      state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch {}

    state.codeEditCount = (state.codeEditCount || 0) + 1;
    const count = state.codeEditCount;

    // Save state
    fs.writeFileSync(STATE_FILE, JSON.stringify(state));

    // Nudge at every 5 edits
    if (count % 5 === 0) {
      let msg = `QUALITY CASCADE (${count} code edits):\n1. Run tsc --noEmit to verify types\n2. If UI changed: take a Playwright screenshot\n3. Consider running /simplify on changed files`;

      if (count >= 10 && count % 10 === 0) {
        msg += `\nYou have ${count}+ uncommitted code edits. Consider committing.`;
      }

      const result = {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: msg,
        },
      };
      process.stdout.write(JSON.stringify(result));
    }
  } catch {}
  process.exit(0);
});
