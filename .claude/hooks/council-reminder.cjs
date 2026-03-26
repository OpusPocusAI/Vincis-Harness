#!/usr/bin/env node
'use strict';

/**
 * council-reminder.cjs — SessionStart hook
 *
 * Injects council spawn requirement into context at session start.
 * Uses additionalContext to make it part of the model's working memory,
 * not just a transient stderr message.
 *
 * v10.4 — S55: upgraded from reminder to context injection
 */

const fs = require('fs');
const path = require('path');

try {
  // Check if kickstart file exists (indicates active project)
  const kickstart = path.join(process.cwd(), 'NEXT-SESSION-KICKSTART-COORDINATOR.md');
  if (!fs.existsSync(kickstart)) process.exit(0);

  const result = {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: [
        "SESSION START PROTOCOL (non-optional):",
        "1. BEFORE any task work, spawn the Agent Council: run /council",
        "   - Harness Monitor runs in background for the entire session",
        "   - Quality Verifier spawns after each task group completes",
        "   - Research Scout spawns when you hit unknowns",
        "2. After EVERY agent completes: verify its output (build, tsc, screenshot)",
        "3. Every 5 file changes: pause and reflect (mid-session-reflect hook enforces this)",
        "4. Before session end: check if you improved the harness structurally",
        "",
        "The council extends your attention without splitting your judgment.",
        "Skipping the council means bugs the auditor would catch go undetected.",
        "S55 evidence: council found cwpwfe guard gap that existed for 20+ sprints."
      ].join("\n")
    }
  };
  process.stdout.write(JSON.stringify(result));
} catch {}

process.exit(0);
