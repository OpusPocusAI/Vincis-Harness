#!/usr/bin/env node
'use strict';

/**
 * mid-session-reflect.cjs — PostToolUse hook (Edit|Write)
 *
 * Counts tool actions. Every 5, forces TEL reflection.
 * Every 15 changes, adds harness evolution check.
 *
 * v10.4 — S55: added harness self-improvement checkpoint
 * v10.9 — S59: added council agent forwarding directive
 */

const fs = require('fs');
const path = require('path');

const counterFile = path.join(process.env.TMPDIR || process.env.TEMP || '/tmp', 'session-edit-count');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    let count = 0;
    try { count = parseInt(fs.readFileSync(counterFile, 'utf8') || '0'); } catch {}
    count++;
    fs.writeFileSync(counterFile, String(count));

    // Every 15 edits: harness evolution checkpoint (stronger)
    if (count % 15 === 0) {
      const result = {
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: [
            `[Harness Evolution Check — ${count} files changed]`,
            "",
            "MANDATORY CHECK before continuing:",
            "1. Did you repeat any manual process 3+ times this session? → Make it a hook or agent role",
            "2. Did you discover a pattern the harness doesn't enforce? → Write the hook NOW",
            "3. Did the council run? Did you act on its findings?",
            "4. Is there a CLAUDE.md rule you followed manually that could be a blocking hook?",
            "5. What would break if context cleared right now? → Save it structurally",
            "",
            "Score yourself against docs/COORDINATOR-SELF-CHECK.md — which of the 10 sections scores lowest RIGHT NOW?",
            "Address your lowest-scoring section BEFORE continuing with the next task.",
            "The harness must get better every session WITHOUT the user asking.",
            "If you can't name one structural improvement you made: you're not self-maintaining."
          ].join("\n")
        }
      };
      process.stdout.write(JSON.stringify(result));
    }
    // Every 5 edits: TEL reflection + council forwarding
    else if (count % 5 === 0) {
      const result = {
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: [
            `[Mid-Session Reflection — ${count} files changed]`,
            "",
            "PAUSE. Answer before continuing:",
            "1. What did the last 5 changes accomplish? Any patterns or gaps?",
            "2. Am I implementing or documenting? (If documenting: stop, implement instead)",
            "3. Is there a hook/agent that should exist for what I just did manually?",
            "4. What would the user challenge about my last 5 changes?",
            "",
            "COUNCIL FORWARD: SendMessage to principle-guardian, evidence-auditor, and scope-monitor with a 2-line summary of the last 5 actions.",
            "",
            "If ANY answer reveals work to do: do it NOW before the next change."
          ].join("\n")
        }
      };
      process.stdout.write(JSON.stringify(result));
    }
  } catch {}
  process.exit(0);
});
