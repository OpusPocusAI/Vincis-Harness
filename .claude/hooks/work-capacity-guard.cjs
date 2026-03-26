#!/usr/bin/env node
'use strict';

/**
 * work-capacity-guard.cjs — Stop hook (type: command)
 *
 * Prevents the Coordinator from stopping when there's still work capacity.
 * Checks: pending backlog items, uncommitted tasks, context usage.
 *
 * v10.5 — S56: Structural fix for "stopping at 20% context" violation.
 *
 * Exit codes:
 *   0 = allow stop (context is high or all work done)
 *   2 = block stop (output reason via stdout)
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const findings = [];

// 1. CHECK: Pending backlog items (dynamic — find most recent backlog file)
try {
  const docsDir = path.join(repoRoot, 'docs');
  if (fs.existsSync(docsDir)) {
    const backlogFiles = fs.readdirSync(docsDir).filter(f => /backlog/i.test(f) && f.endsWith('.md'));
    for (const bf of backlogFiles) {
      const content = fs.readFileSync(path.join(docsDir, bf), 'utf8');
      const unchecked = (content.match(/^- \[ \]/gm) || []).length;
      if (unchecked > 5) {
        findings.push(`📋 ${unchecked} unchecked backlog items remain in ${bf}`);
      }
    }
  }
} catch {}

// 2. CHECK: Uncommitted changes
try {
  const { execFileSync } = require('child_process');
  const diff = execFileSync('git', ['diff', '--name-only'], { encoding: 'utf8', timeout: 5000 }).trim();
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8', timeout: 5000 }).trim();
  const changed = [...diff.split('\n'), ...untracked.split('\n')].filter(Boolean);
  if (changed.length > 0) {
    findings.push(`⚠️ ${changed.length} uncommitted files — commit before stopping`);
  }
} catch {}

// 3. CHECK: Sprint directory exists (dynamic — find latest sprint number)
try {
  const sprintBase = path.join(repoRoot, '.sprint');
  if (fs.existsSync(sprintBase)) {
    const sprintDirs = fs.readdirSync(sprintBase).filter(d => /^sprint-\d+$/.test(d)).sort();
    // Only warn if .sprint/ exists but has no sprint directories at all
    if (sprintDirs.length === 0) {
      findings.push(`📝 No sprint directory found — session work not logged`);
    }
  }
} catch {}

// 4. CHECK: KICKSTART updated
try {
  const kickstart = path.join(repoRoot, 'NEXT-SESSION-KICKSTART-COORDINATOR.md');
  if (fs.existsSync(kickstart)) {
    const content = fs.readFileSync(kickstart, 'utf8');
    // Check if it was updated today
    const today = new Date().toISOString().split('T')[0];
    if (!content.includes(today)) {
      findings.push(`📄 KICKSTART not updated today (${today}) — update before stopping`);
    }
  }
} catch {}

// Output findings
if (findings.length > 0) {
  const message = [
    '[Work Capacity Guard]',
    `Found ${findings.length} reason(s) NOT to stop:`,
    '',
    ...findings,
    '',
    'Continue working or address these items before ending the session.',
    'The Coordinator role doc says: "NEVER ask should we wrap up? — if work exists, DO IT."',
  ].join('\n');

  process.stdout.write(message);
  // Don't block (exit 0) — this is advisory, not blocking
  // The stop-reflection and quality-gate hooks handle hard blocks
  process.exit(0);
} else {
  process.exit(0);
}
