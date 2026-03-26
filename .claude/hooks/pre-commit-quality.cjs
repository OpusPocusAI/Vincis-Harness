#!/usr/bin/env node
'use strict';

/**
 * pre-commit-quality.cjs — PreToolUse hook (Bash containing `git commit`)
 *
 * Scans staged files for `console.log` in production code.
 * WARNING only (does not block).
 *
 * v10.0
 */

const { execFileSync } = require('child_process');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const command = data.tool_input?.command || '';

    // Only check git commit commands
    if (!/git\s+commit/.test(command)) process.exit(0);

    const staged = execFileSync('git', ['diff', '--cached', '--name-only'], { encoding: 'utf8' }).trim();
    if (!staged) process.exit(0);

    const files = staged.split('\n').filter(f => /\.(ts|tsx|js|jsx)$/.test(f));
    const warnings = [];

    for (const file of files) {
      try {
        const diff = execFileSync('git', ['diff', '--cached', '--', file], { encoding: 'utf8' });
        const addedLines = diff.split('\n')
          .filter(l => l.startsWith('+') && !l.startsWith('+++'))
          .filter(l => /console\.log\b/.test(l));

        if (addedLines.length > 0) {
          warnings.push('  ' + file + ': ' + addedLines.length + ' console.log(s)');
        }
      } catch { /* skip */ }
    }

    if (warnings.length > 0) {
      const out = JSON.stringify({
        decision: 'warn',
        reason: 'console.log detected in staged files:\n' + warnings.join('\n') + '\n\nUse logger instead of console.log in production code.'
      });
      process.stdout.write(out);
    }
    process.exit(0);
  } catch {
    process.exit(0);
  }
});
