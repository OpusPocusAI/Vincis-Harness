#!/usr/bin/env node
'use strict';

/**
 * harness-evolution-score.cjs — Stop hook (type: command)
 *
 * Scores whether the harness improved this session.
 * Points: new hook +3, modified hook +1, new/modified skill +2, memory update +1.
 *
 * Exit: always 0 (advisory, not blocking)
 */

const { execFileSync } = require('child_process');

const timestamp = new Date().toISOString();

// Consume stdin (hooks receive JSON on stdin)
try { require('fs').readFileSync(0, 'utf8'); } catch {}

// Get all changed files (committed + uncommitted + untracked)
let changedFiles = [];
try {
  const diff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8', timeout: 5000 }).trim();
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8', timeout: 5000 }).trim();
  changedFiles = [...diff.split('\n'), ...untracked.split('\n')].filter(Boolean);
} catch {}

// Categorize changes
const hookFiles = changedFiles.filter(f => f.match(/\.claude\/hooks\/.*\.cjs$/));
const skillFiles = changedFiles.filter(f => f.match(/\.claude\/skills\//));
const memoryFiles = changedFiles.filter(f => f.match(/^memory\/.*\.md$/));

// Determine new vs modified hooks by checking if they exist in git
const newHooks = [];
const modifiedHooks = [];
for (const f of hookFiles) {
  try {
    execFileSync('git', ['cat-file', '-e', `HEAD:${f}`], { timeout: 5000, stdio: 'pipe' });
    modifiedHooks.push(f);
  } catch {
    newHooks.push(f);
  }
}

// Score
let score = 0;
const breakdown = [];

if (newHooks.length > 0) {
  const pts = newHooks.length * 3;
  score += pts;
  breakdown.push(`+${pts} — ${newHooks.length} new hook(s): ${newHooks.map(f => f.split('/').pop()).join(', ')}`);
}
if (modifiedHooks.length > 0) {
  const pts = modifiedHooks.length * 1;
  score += pts;
  breakdown.push(`+${pts} — ${modifiedHooks.length} modified hook(s): ${modifiedHooks.map(f => f.split('/').pop()).join(', ')}`);
}
if (skillFiles.length > 0) {
  const pts = skillFiles.length * 2;
  score += pts;
  breakdown.push(`+${pts} — ${skillFiles.length} skill change(s): ${skillFiles.map(f => f.split('/').pop()).join(', ')}`);
}
if (memoryFiles.length > 0) {
  const pts = memoryFiles.length * 1;
  score += pts;
  breakdown.push(`+${pts} — ${memoryFiles.length} memory update(s)`);
}

// Build output
const lines = [
  `[Harness Evolution Score — ${timestamp}]`,
  '',
  `SCORE: ${score} point${score !== 1 ? 's' : ''}`,
];

if (breakdown.length > 0) {
  lines.push('', ...breakdown);
} else {
  lines.push('', "The harness didn't get better this session. Can you name ONE structural improvement you made?");
}

process.stdout.write(lines.join('\n') + '\n');
process.exit(0);
