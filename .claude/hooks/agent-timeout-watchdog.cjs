#!/usr/bin/env node
'use strict';

/**
 * agent-timeout-watchdog.cjs — PostToolUse hook (Agent matcher)
 *
 * Tracks agent completions. Warns when multiple agents produce
 * empty/minimal output in a row (likely stalled agents).
 */

const fs = require('fs');
const path = require('path');

const TMPDIR = process.env.TMPDIR || process.env.TEMP || '/tmp';
const STATE_FILE = path.join(TMPDIR, 'harness-agent-tracker.json');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const response = String(data.tool_response || '');
    const prompt = String(data.tool_input?.prompt || '');
    const name = String(data.tool_input?.name || '');
    const meaningful = response.length > 50;

    // Skip team/council agents — they go idle between messages, which is normal
    const teamName = String(data.tool_input?.team_name || '');
    const isTeamAgent = /team|council|evidence-auditor|behavior-watchdog|code-reviewer|principle-guardian|scope-monitor/i.test(name)
      || /council/i.test(teamName)
      || data.tool_input?.run_in_background === true;

    // Load state
    let state = { zeroOutputCount: 0 };
    try {
      state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch {}

    if (isTeamAgent || meaningful) {
      state.zeroOutputCount = 0;
    } else {
      state.zeroOutputCount = (state.zeroOutputCount || 0) + 1;
    }

    // Save state
    fs.writeFileSync(STATE_FILE, JSON.stringify(state));

    // Warn if 2+ consecutive empty agents
    if (state.zeroOutputCount >= 2) {
      const result = {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `AGENT WATCHDOG: ${state.zeroOutputCount} agents completed with empty/minimal output. Agents may be stalling — check their tasks or relaunch.`,
        },
      };
      process.stdout.write(JSON.stringify(result));
    }
  } catch {}
  process.exit(0);
});
