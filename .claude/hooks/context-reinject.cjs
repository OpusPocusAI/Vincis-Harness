#!/usr/bin/env node
'use strict';

/**
 * context-reinject.cjs — SessionStart hook
 *
 * Injects persistent context that survives the entire session:
 * 1. Git state (branch, commits, modified files)
 * 2. Autonomous work protocol (self-prompting)
 * 3. Product goals (from kickstart)
 *
 * v10.5 — S55: upgraded from state-only to mission-injection
 * The model doesn't just know WHERE it is — it knows WHAT to do autonomously.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  const context = [];

  // ── GIT STATE ──
  try {
    const branch = execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8', timeout: 5000 }).trim();
    const log = execFileSync('git', ['log', '--oneline', '-3'], { encoding: 'utf8', timeout: 5000 }).trim();
    context.push(`Git: ${branch} | ${log.split('\n').join(' | ')}`);
  } catch {}

  try {
    const diff = execFileSync('git', ['diff', '--name-only'], { encoding: 'utf8', timeout: 5000 }).trim();
    const files = diff.split('\n').filter(Boolean);
    if (files.length > 0) {
      context.push(`${files.length} uncommitted files — commit before new work`);
    }
  } catch {}

  // ── PRODUCT GOALS (from kickstart "Must Fix" section) ──
  try {
    const kickstart = path.join(process.cwd(), 'NEXT-SESSION-KICKSTART-COORDINATOR.md');
    if (fs.existsSync(kickstart)) {
      const content = fs.readFileSync(kickstart, 'utf8');
      const mustFixMatch = content.match(/### Must Fix\n([\s\S]*?)(?=\n###|\n##|$)/);
      if (mustFixMatch) {
        const items = mustFixMatch[1].trim().split('\n').filter(l => l.startsWith('1.') || l.startsWith('2.') || l.startsWith('3.') || l.startsWith('4.'));
        if (items.length > 0) {
          context.push(`PRODUCT PRIORITIES:\n${items.join('\n')}`);
        }
      }
    }
  } catch {}

  // ── Reset session counters ──
  const tmpDir = process.env.TMPDIR || process.env.TEMP || '/tmp';
  try { fs.unlinkSync(path.join(tmpDir, 'session-edit-count')); } catch {}
  try { fs.unlinkSync(path.join(tmpDir, 'quality-gate-count')); } catch {}

  // ── AUTONOMOUS WORK PROTOCOL ──
  const protocol = [
    '',
    'AUTONOMOUS WORK PROTOCOL (persists entire session):',
    '',
    'You are not a tool waiting for commands. You are a system that self-directs.',
    '',
    'BEFORE starting any task — Deep Investigation:',
    '  1. What is the REAL problem? (not the stated symptom)',
    '  2. What are 3 levels deeper than the obvious?',
    '  3. What would you discover if you traced the entire system?',
    '  4. What would the user find if THEY investigated this?',
    '',
    'AFTER completing any task — Scouting:',
    '  1. What did this work REVEAL that needs attention?',
    '  2. What adjacent systems are affected?',
    '  3. What would a fresh pair of eyes see?',
    '  4. Create the next task yourself — do not wait to be asked.',
    '',
    'WHEN the user corrects you — Correction Cascade:',
    '  1. STOP current work immediately',
    '  2. Identify the CLASS of failure (not just this instance)',
    '  3. Build a structural fix (hook > agent role > skill > rule)',
    '  4. Test the fix',
    '  5. THEN resume the original task',
    '  This must happen within the SAME turn — not "next session."',
    '',
    'SYSTEM OWNERSHIP (from Cursor pattern):',
    '  You own the end-to-end health of every system you touch.',
    '  Not just the task — the system. Check for side effects,',
    '  verify adjacent components, ensure nothing you touched regressed.',
    '',
    'EVIDENCE REQUIREMENT (from Devin pattern):',
    '  Every code-related assertion must cite file:line.',
    '  "I think this works" is not evidence. "FE/src/App.tsx:567 calls',
    '  requestAIResponse() which returns from /api/respond" IS evidence.',
    '',
    'RE-INVESTIGATION RULE (from Cursor pattern):',
    '  If you read a partial file and act on it, you WILL miss context.',
    '  When reading >200 line files: read the FULL relevant section,',
    '  not just the first 50 lines. Trace imports, check callers.',
    '',
    'The harness gets better every session. If you cannot name a structural',
    'improvement you made proactively (not because the user asked): you failed.',
  ];

  context.push(protocol.join('\n'));

  const result = {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: context.join('\n\n')
    }
  };
  process.stdout.write(JSON.stringify(result));
} catch {
  // Never fail — context injection is best-effort
}

process.exit(0);
