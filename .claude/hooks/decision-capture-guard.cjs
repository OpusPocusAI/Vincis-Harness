#!/usr/bin/env node
'use strict';

/**
 * decision-capture-guard.cjs — PostToolUse hook (Bash)
 *
 * Warns when a git commit mentions decisions but no memory/ file was staged.
 * Converts prose rule "No decision may exist only in context" to enforcement.
 *
 * v1.0 — S59
 */

const fs = require('fs');
const path = require('path');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const cmd = data.tool_input?.command || '';

    // Only check git commit commands
    if (!cmd.includes('git commit')) {
      process.exit(0);
      return;
    }

    // Check if commit message mentions decisions
    const mentionsDecision = /decision|Decision #|user decided|agreed to/i.test(cmd);
    if (!mentionsDecision) {
      process.exit(0);
      return;
    }

    // Check if any memory/ file was in the just-committed changes
    // Uses HEAD~1 diff because this hook fires AFTER the commit (staged area is empty by then)
    const { execFileSync } = require('child_process');
    try {
      const committed = execFileSync('git', ['diff', 'HEAD~1', '--name-only'], { encoding: 'utf8' });
      const hasMemoryFile = committed.split('\n').some(f => f.startsWith('memory/'));

      if (!hasMemoryFile) {
        const result = {
          hookSpecificOutput: {
            hookEventName: "PostToolUse",
            additionalContext: "⚠️ DECISION CAPTURE: This commit mentions a decision but no memory/ file was staged. Decisions must be saved to memory/user-decisions.md + the relevant topic file. Save the decision NOW before it's lost when context clears."
          }
        };
        process.stdout.write(JSON.stringify(result));
      }
    } catch {}
  } catch {}
  process.exit(0);
});
