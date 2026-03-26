#!/usr/bin/env node
'use strict';

/**
 * post-compact-context-saver.cjs — PostCompact hook
 *
 * When context gets compacted, critical info can be lost.
 * This hook fires after compaction and reminds Claude to
 * re-read the plan file and check task status.
 */

const result = {
  hookSpecificOutput: {
    hookEventName: 'PostCompact',
    additionalContext: [
      'CONTEXT COMPACTED — critical reminders:',
      '1. Re-read your plan file if one exists (check ~/.claude/plans/)',
      '2. Run TaskList to check pending tasks',
      '3. Check memory/MEMORY.md for project state',
      '4. Do NOT repeat work already completed — check git log --oneline -5',
      'Compaction clears conversation context but tasks, plans, and memory persist.',
    ].join('\n'),
  },
};

process.stdout.write(JSON.stringify(result));
process.exit(0);
