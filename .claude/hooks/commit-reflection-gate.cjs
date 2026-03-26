#!/usr/bin/env node
'use strict';

/**
 * commit-reflection-gate.cjs — PreToolUse hook (Bash containing `git commit`)
 *
 * Enforces the Pre-Transition Gate and TEL reflection before commits.
 * Outputs reflection questions via stdout (additionalContext).
 *
 * Does NOT block (exit 0) — the questions force Claude to reflect.
 * v10.1
 */

const { execFileSync } = require('child_process');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const command = data.tool_input?.command || '';

    // Only trigger on git commit
    if (!/git\s+(commit|add.*&&.*commit)/.test(command)) process.exit(0);

    // Count changed files
    let changedCount = 0;
    try {
      const diff = execFileSync('git', ['diff', '--name-only'], { encoding: 'utf8', timeout: 5000 }).trim();
      const staged = execFileSync('git', ['diff', '--cached', '--name-only'], { encoding: 'utf8', timeout: 5000 }).trim();
      changedCount = [...new Set([...diff.split('\n'), ...staged.split('\n')].filter(Boolean))].length;
    } catch {}

    const questions = [
      '[Pre-Commit Reflection Gate]',
      '',
      'Before committing, answer honestly:',
      '1. Did you VERIFY this works? (build pass, visual test, console clean)',
      '2. Did you identify anything during this work that still needs action?',
      '3. Are there agent results you haven\'t verified yet?',
      '4. Is this commit incremental (<30 files) or a mega-commit?',
    ];

    if (changedCount > 30) {
      questions.push(``, `⚠️ ${changedCount} files changed — consider splitting into smaller commits.`);
    }

    questions.push('', 'If ANY answer reveals unfinished work: STOP. Go back and finish before committing.');

    process.stdout.write(questions.join('\n') + '\n');
  } catch {}
  process.exit(0);
});
