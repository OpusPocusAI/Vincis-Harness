#!/usr/bin/env node
'use strict';

/**
 * stop-reflection.cjs — Stop hook (type: command)
 *
 * Fires on every Claude response completion.
 * Performs AUTOMATED checks, not just questions.
 * Outputs actionable findings via stdout (additionalContext).
 *
 * v10.2 — S54: automated enforcement, not documentation
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const timestamp = new Date().toISOString();
const findings = [];

// 1. CHECK: Uncommitted changes (should have committed incrementally)
try {
  const diff = execFileSync('git', ['diff', '--name-only'], { encoding: 'utf8', timeout: 5000 }).trim();
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {encoding: 'utf8', timeout: 5000 }).trim();
  const changed = [...diff.split('\n'), ...untracked.split('\n')].filter(Boolean);
  if (changed.length > 0) {
    findings.push(`⚠️ ${changed.length} uncommitted files. Commit before ending.`);
  }
  if (changed.length > 30) {
    findings.push(`🔴 ${changed.length} files is a mega-commit. Split into smaller commits.`);
  }
} catch {}

// 2. CHECK: Build passes
try {
  const feFiles = [];
  try {
    const diff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8', timeout: 5000 }).trim();
    feFiles.push(...diff.split('\n').filter(f => f.startsWith('FE/')));
  } catch {}
  if (feFiles.length > 0) {
    try {
      execFileSync('npx', ['vite', 'build'], {
        cwd: path.join(process.cwd(), 'FE'),
        encoding: 'utf8',
        timeout: 30000,
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch {
      findings.push('🔴 FE BUILD FAILS. Fix before ending session.');
    }
  }
} catch {}

// 3. CHECK: Dev server ports still running (forgot to cleanup)
try {
  const netstat = execFileSync('netstat', ['-ano'], { encoding: 'utf8', timeout: 5000 });
  const devPorts = [3000, 3001, 3002, 3003, 3004, 3005];
  const activePorts = devPorts.filter(p => netstat.includes(`:${p}`));
  if (activePorts.length > 0) {
    findings.push(`⚠️ Dev server still running on port(s): ${activePorts.join(', ')}. Kill with npx kill-port.`);
  }
} catch {}

// 4. SELF-GOVERNANCE: Check if this session added documentation without hooks
try {
  const diff = execFileSync('git', ['diff', '--name-only', 'HEAD~5', 'HEAD'], { encoding: 'utf8', timeout: 5000 }).trim();
  const mdFiles = diff.split('\n').filter(f => f.endsWith('.md') && !f.includes('SPRINT-LOG'));
  const hookFiles = diff.split('\n').filter(f => f.includes('hooks/') && f.endsWith('.cjs'));
  if (mdFiles.length > 5 && hookFiles.length === 0) {
    findings.push('⚠️ SELF-GOVERNANCE: Multiple .md files changed but no hooks added. Are you documenting instead of implementing?');
  }
} catch {}

// 5. HARNESS EVOLUTION: Did this session improve the harness structurally?
try {
  const diff = execFileSync('git', ['diff', '--name-only', 'HEAD~10', 'HEAD'], { encoding: 'utf8', timeout: 5000 }).trim();
  const files = diff.split('\n').filter(Boolean);
  const harnessFiles = files.filter(f =>
    f.includes('.claude/hooks/') ||
    f.includes('.claude/settings.json') ||
    f.includes('.sprint/roles/') ||
    f.includes('.claude/skills/')
  );
  if (files.length > 10 && harnessFiles.length === 0) {
    findings.push('⚠️ HARNESS EVOLUTION: 10+ files changed but zero harness improvements. The harness must get better every session.');
  }
} catch {}

// Output findings
if (findings.length > 0) {
  const output = `\n[Stop Hook — ${timestamp}]\n${findings.join('\n')}\n\nDo NOT end the session until all ⚠️ and 🔴 items are resolved.\n`;
  process.stdout.write(output);
  process.stderr.write(output);
} else {
  process.stdout.write(`\n[Stop Hook — ${timestamp}] ✅ All checks pass. Session can end cleanly.\n`);
}

// Write proof
const proofFile = path.join(process.env.TMPDIR || process.env.TEMP || '/tmp', 'stop-reflection-proof.txt');
try { fs.appendFileSync(proofFile, `[STOP] ${timestamp} | findings: ${findings.length}\n`); } catch {}

process.exit(0);
