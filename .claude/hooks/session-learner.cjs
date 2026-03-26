#!/usr/bin/env node
'use strict';

/**
 * session-learner.cjs — Stop hook (type: command)
 *
 * At session end, extracts learnings from the session for future sessions.
 * Summarizes file changes by type, new hooks, and memory updates.
 *
 * Exit: always 0 (advisory, not blocking)
 */

const { execFileSync } = require('child_process');

const timestamp = new Date().toISOString();

// Consume stdin (hooks receive JSON on stdin)
let stdin = '';
try { stdin = require('fs').readFileSync(0, 'utf8'); } catch {}

// Get diff stat for the session (compare working tree + staged against HEAD)
let changedFiles = [];
try {
  const diff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8', timeout: 5000 }).trim();
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8', timeout: 5000 }).trim();
  changedFiles = [...diff.split('\n'), ...untracked.split('\n')].filter(Boolean);
} catch {}

// Count by extension
const extCounts = {};
for (const f of changedFiles) {
  const ext = f.includes('.') ? '.' + f.split('.').pop() : '(no ext)';
  extCounts[ext] = (extCounts[ext] || 0) + 1;
}
const typeBreakdown = Object.entries(extCounts).map(([k, v]) => `${v} ${k}`).join(', ');

// Check for new hooks
const newHooks = changedFiles.filter(f => f.match(/\.claude\/hooks\/.*\.cjs$/));

// Check for memory updates
const memoryUpdates = changedFiles.filter(f => f.match(/^memory\/.*\.md$/));

// Harness evolved?
const harnessEvolved = newHooks.length > 0 || changedFiles.some(f => f.includes('.claude/settings.json') || f.includes('.claude/skills/'));

// Build output
const lines = [
  `[Session Learner — ${timestamp}]`,
  '',
  'SESSION LEARNINGS:',
  `- Files changed: ${changedFiles.length} (${typeBreakdown || 'none'})`,
  `- New hooks created: ${newHooks.length}${newHooks.length > 0 ? ' (' + newHooks.map(f => f.split('/').pop()).join(', ') + ')' : ''}`,
  `- Memory files updated: ${memoryUpdates.length}`,
  `- Harness evolved: ${harnessEvolved ? 'YES' : 'NO'}`,
  '',
  'BEFORE ENDING: Run /learn to extract reusable patterns. If you created hooks, update memory/harness/harness-health.md.',
];

process.stdout.write(lines.join('\n') + '\n');
process.exit(0);
