#!/usr/bin/env node
'use strict';

/**
 * interjection-guard.cjs — UserPromptSubmit hook
 *
 * PROBLEM: When working on a big task, user sends a smaller request mid-work.
 * Claude handles the smaller request, then declares "done" without completing
 * the original task. This has happened repeatedly (S60 crash recovery, others).
 *
 * FIX: Track pending deliverables in a state file. When the user sends a new
 * message while deliverables are pending, inject a reminder to return to them.
 *
 * State file: .claude/hooks/state/pending-deliverables.json
 * Format: { "deliverables": ["item1", "item2"], "source": "user request text" }
 *
 * To use: Claude should write to the state file when starting a multi-part task.
 * The hook reads it on every UserPromptSubmit and reminds if items remain.
 *
 * v1.0 — S60: structural fix for interjection-causes-abandonment pattern
 */

const fs = require('fs');
const path = require('path');

const STATE_DIR = path.join(__dirname, 'state');
const STATE_FILE = path.join(STATE_DIR, 'pending-deliverables.json');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    // Check if there are pending deliverables
    if (!fs.existsSync(STATE_FILE)) {
      process.exit(0);
      return;
    }

    const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    const pending = (state.deliverables || []).filter(d => !d.done);

    if (pending.length === 0) {
      // All done, clean up
      try { fs.unlinkSync(STATE_FILE); } catch {}
      process.exit(0);
      return;
    }

    // There are pending deliverables — remind
    const list = pending.map((d, i) => `  ${i + 1}. ${d.task || d}`).join('\n');
    const result = {
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit",
        additionalContext: [
          '📋 INTERJECTION GUARD — Pending deliverables detected:',
          '',
          list,
          '',
          'Handle the user\'s new request, then RETURN to these unfinished items.',
          'Do NOT declare "done" or "wrapped up" until ALL deliverables are complete.',
          `State file: ${STATE_FILE} — mark items done or clear when truly complete.`,
        ].join('\n')
      }
    };
    process.stdout.write(JSON.stringify(result));
  } catch {}
  process.exit(0);
});
