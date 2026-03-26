#!/usr/bin/env node
'use strict';

/**
 * post-agent-verify.cjs — PostToolUse hook (Agent)
 *
 * After every Agent tool completion, inject a verification requirement.
 * Prevents the pattern: agent reports "done" → coordinator trusts report → bugs ship.
 *
 * v10.4 — S55: structural enforcement of post-agent verification protocol
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);

    // Only trigger for completed agents (not spawning)
    const response = data.tool_response || {};
    if (!response || typeof response !== 'object') {
      process.exit(0);
    }

    const result = {
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: [
          "POST-AGENT VERIFICATION (mandatory):",
          "An agent just completed. Before acting on its results:",
          "1. If it made code changes: run build + tsc to verify",
          "2. If it reported findings: spot-check at least 1 claim",
          "3. If it touched UI: take a Playwright screenshot",
          "Agent summaries without verification are stalling, not shipping."
        ].join("\n")
      }
    };
    process.stdout.write(JSON.stringify(result));
  } catch {}
  process.exit(0);
});
