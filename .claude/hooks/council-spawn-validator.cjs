#!/usr/bin/env node
'use strict';

/**
 * council-spawn-validator.cjs — PreToolUse hook (Agent tool)
 *
 * Enforces correct spawning parameters for council agents.
 * When an Agent tool call matches a council agent pattern (Evidence Auditor,
 * Behavior Watchdog, Code Reviewer), validates:
 *   - `name` parameter exists and matches expected value
 *   - `run_in_background` is true
 *   - `model` is correct (opus for auditor, sonnet for others)
 *
 * On successful validation: writes agent abbreviation to sidecar file
 * at $TMPDIR/harness-agents-active for statusbar display.
 *
 * v1.0 — S64: Created to enforce council visibility
 */

const fs = require('fs');
const path = require('path');

const TMPDIR = require('os').tmpdir();
const AGENTS_FILE = path.join(TMPDIR, 'harness-agents-active');

// Council agent definitions: prompt pattern → expected parameters
const COUNCIL_AGENTS = [
  {
    pattern: /evidence\s*auditor/i,
    expectedName: 'evidence-auditor',
    expectedModel: null, // opus = default, so model param can be absent or 'opus'
    forbiddenModel: 'sonnet',
    abbreviation: 'EA',
  },
  {
    pattern: /behavior\s*watchdog/i,
    expectedName: 'behavior-watchdog',
    expectedModel: 'sonnet',
    forbiddenModel: null,
    abbreviation: 'BW',
  },
  {
    pattern: /code\s*reviewer/i,
    expectedName: 'code-reviewer',
    expectedModel: 'sonnet',
    forbiddenModel: null,
    abbreviation: 'CR',
  },
];

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name || '';

    // Only check Agent tool
    if (toolName !== 'Agent') process.exit(0);

    const prompt = data.tool_input?.prompt || '';
    const name = data.tool_input?.name || '';
    const model = data.tool_input?.model || '';
    const teamName = data.tool_input?.team_name || '';
    const runInBackground = data.tool_input?.run_in_background;

    const subagentType = data.tool_input?.subagent_type || '';

    // EXEMPT: Explore and Plan agents are read-only research — disposable, no team needed
    // This also handles plan mode where TeamCreate is unavailable
    if (/^(Explore|Plan)$/i.test(subagentType)) process.exit(0);

    // Check if this matches any council agent
    const match = COUNCIL_AGENTS.find(a => a.pattern.test(prompt));

    // UNIVERSAL RULE: BLOCK named execution agents without team_name
    // Agents without team_name are invisible in the status display
    // The user requires ALL persistent agents to be visible
    if (!match) {
      if (!teamName && name) {
        const result = JSON.stringify({
          decision: 'block',
          reason: `BLOCKED: Agent "${name}" has no team_name — it will be INVISIBLE in the status display. Add team_name: "council" (for advisory agents) or create a worker team first with TeamCreate. ALL named agents must be on a team for visibility. (Explore/Plan agents are exempt.)`,
        });
        process.stdout.write(result);
      }
      process.exit(0);
    }

    const errors = [];

    // CHECK 1: name parameter must exist and match
    if (!name) {
      errors.push(`MISSING: name parameter. Set name: "${match.expectedName}" — without this, the agent is invisible in the terminal and cannot receive SendMessage signals.`);
    } else if (name !== match.expectedName) {
      errors.push(`WRONG: name is "${name}" but must be "${match.expectedName}" for council protocol.`);
    }

    // CHECK 2: team_name must be "council"
    if (teamName !== 'council') {
      errors.push(`MISSING: team_name must be "council". TeamCreate agents show in the native status display with full names. First run: TeamCreate(team_name: "council"). Then spawn with team_name: "council".`);
    }

    // CHECK 3: run_in_background must be true
    if (runInBackground !== true) {
      errors.push(`MISSING: run_in_background must be true. Council agents run as background observers, not foreground tasks.`);
    }

    // CHECK 4: model must be correct
    if (match.forbiddenModel && model === match.forbiddenModel) {
      errors.push(`WRONG: model is "${model}" but ${match.expectedName} must NOT use ${match.forbiddenModel}. Evidence Auditor requires Opus for judgment depth.`);
    }
    if (match.expectedModel && model !== match.expectedModel) {
      errors.push(`MISSING: model must be explicitly "${match.expectedModel}". Agents inherit parent model by default (GitHub #26179) — always set model explicitly.`);
    }

    if (errors.length > 0) {
      // BLOCK the spawn — parameters are wrong
      const result = JSON.stringify({
        decision: 'block',
        reason: `COUNCIL SPAWN BLOCKED (${match.abbreviation}): Fix these parameters before spawning:\n${errors.join('\n')}\n\nCorrect spawn requires: name="${match.expectedName}", run_in_background=true, model="${match.expectedModel || 'opus (default)'}"`,
      });
      process.stdout.write(result);
      process.exit(0);
    }

    // All checks passed — write to sidecar file for statusbar
    try {
      let existing = '';
      try {
        existing = fs.readFileSync(AGENTS_FILE, 'utf8').trim();
      } catch {}

      const agents = existing ? existing.split('|').filter(Boolean) : [];
      if (!agents.includes(match.abbreviation)) {
        agents.push(match.abbreviation);
        fs.writeFileSync(AGENTS_FILE, agents.join('|'));
      }
    } catch {}

    process.exit(0);
  } catch {
    process.exit(0);
  }
});
