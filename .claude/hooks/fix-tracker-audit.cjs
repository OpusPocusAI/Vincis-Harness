#!/usr/bin/env node
'use strict';

/**
 * fix-tracker-audit.cjs — SessionStart hook
 *
 * Reads harness-health.md fix tracker on every session start.
 * Flags UNTESTED fixes past 3-sprint decay threshold.
 * Counts active fixes and warns if >10.
 *
 * Outputs to stdout (additionalContext) so the session starts
 * with fix tracker awareness — prevents the S54 failure where
 * FIX-040 sat UNTESTED for 19 sprints unnoticed.
 *
 * v10.3 — Auditor: structural enforcement
 */

const fs = require('fs');
const path = require('path');

try {
  const hhPath = path.join(process.cwd(), 'memory', 'harness-health.md');
  if (!fs.existsSync(hhPath)) process.exit(0);

  const content = fs.readFileSync(hhPath, 'utf8');

  // Find the fix tracker section
  const trackerMatch = content.match(/\[HH-FIX-TRACKER\][\s\S]*?(?=\n## \[|$)/);
  if (!trackerMatch) process.exit(0);

  const tracker = trackerMatch[0];

  // Extract current sprint number from the dashboard
  const sprintMatch = content.match(/\| S(\d+) \|/);
  // Derive current sprint: from harness-health.md first, fallback to git log
  let currentSprint = sprintMatch ? parseInt(sprintMatch[1]) : null;
  if (!currentSprint) {
    try {
      const { execFileSync } = require('child_process');
      const log = execFileSync('git', ['log', '--oneline', '-20'], { encoding: 'utf8', timeout: 5000 });
      const sprintRefs = log.match(/S(\d+)/g);
      if (sprintRefs) {
        currentSprint = Math.max(...sprintRefs.map(s => parseInt(s.slice(1))));
      }
    } catch {}
  }
  if (!currentSprint) currentSprint = 60; // last resort — update periodically

  // Find active (non-struck-through) UNTESTED fixes
  const fixLines = tracker.match(/^\| FIX-\d+.*$/gm) || [];
  const activeLines = fixLines.filter(l => !l.startsWith('| ~~'));

  const untested = [];
  const stale = [];

  for (const line of activeLines) {
    const fixId = (line.match(/FIX-(\d+)/) || [])[1];
    if (!fixId) continue;

    if (/UNTESTED/.test(line)) {
      untested.push(`FIX-${fixId}`);

      // Check sprint age
      const sprintRef = line.match(/S(\d+)/);
      if (sprintRef) {
        const fixSprint = parseInt(sprintRef[1]);
        const age = currentSprint - fixSprint;
        if (age >= 3) {
          stale.push({ id: `FIX-${fixId}`, age, sprint: `S${fixSprint}` });
        }
      }
    }
  }

  const findings = [];

  if (stale.length > 0) {
    findings.push(`🔴 STALE FIXES (past 3-sprint decay):`);
    for (const s of stale) {
      findings.push(`   ${s.id}: UNTESTED since ${s.sprint} (${s.age} sprints ago) → AUTO-RETIRE`);
    }
  }

  if (activeLines.length > 10) {
    findings.push(`⚠️ Fix tracker has ${activeLines.length} active fixes (max 10). Force retirement review.`);
  }

  if (untested.length > 0 && stale.length === 0) {
    findings.push(`ℹ️ ${untested.length} UNTESTED fixes: ${untested.join(', ')}`);
  }

  if (findings.length > 0) {
    process.stdout.write(`\n[Fix Tracker Audit]\n${findings.join('\n')}\n\n`);
  }
} catch {}

process.exit(0);
