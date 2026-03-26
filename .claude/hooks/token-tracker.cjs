#!/usr/bin/env node
'use strict';

/**
 * token-tracker.cjs — Stop hook
 *
 * Reads the JSONL token log written by the statusline script and
 * produces a per-session summary. Appends one row per session to
 * memory/harness/token-log.md.
 *
 * Session detection: monotonic cost tracking. Within a session, cost only
 * increases. Concurrent sessions are separated by matching entries to
 * cost tracks. A cost gap > $3 starts a new track.
 *
 * v2.0 — S64 (multi-session support)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_FILE = path.join(os.homedir(), '.claude', 'token-log.jsonl');
const SUMMARY_FILE = path.join(
  process.env.CLAUDE_PROJECT_DIR || process.cwd(),
  'memory', 'harness', 'token-log.md'
);

try {
  if (!fs.existsSync(LOG_FILE)) process.exit(0);

  const lines = fs.readFileSync(LOG_FILE, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => { try { return JSON.parse(line); } catch { return null; } })
    .filter(Boolean);

  if (lines.length === 0) process.exit(0);

  const today = new Date().toISOString().split('T')[0];
  const todayEntries = lines.filter(e => e.ts && e.ts.startsWith(today));
  if (todayEntries.length === 0) process.exit(0);

  // --- Session grouping via monotonic cost tracking ---
  // Within a session, cost only increases. When entries from multiple
  // concurrent sessions interleave, we separate them by matching each
  // entry to the cost track where it fits (cost >= track's last cost
  // and closest to it). A cost gap > $3 starts a new track.
  function groupSessions(entries) {
    const tracks = [];
    for (const e of entries) {
      const cost = e.cost || 0;
      let bestTrack = null;
      let bestDiff = Infinity;
      for (const t of tracks) {
        const lastCost = t[t.length - 1].cost || 0;
        const diff = cost - lastCost;
        if (diff >= -0.05 && diff < bestDiff) {
          bestDiff = diff;
          bestTrack = t;
        }
      }
      if (!bestTrack || bestDiff > 3.0) {
        tracks.push([e]);
      } else {
        bestTrack.push(e);
      }
    }
    return tracks;
  }

  const sessions = groupSessions(todayEntries);

  // Ensure summary file exists with header
  if (!fs.existsSync(SUMMARY_FILE)) {
    const dir = path.dirname(SUMMARY_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SUMMARY_FILE, `---
type: harness
status: active
updated: ${today}
---
# Token Usage Log

| Date | Time | Model | 5h% | 7d% | Delta 5h | Peak Ctx% | Cost | Sessions |
|------|------|-------|-----|-----|----------|-----------|------|----------|
`);
  }

  // Only log the LAST session (the one that's ending now)
  // Sort sessions by latest timestamp to find the most recent
  const sortedSessions = sessions
    .filter(s => s.length > 0)
    .sort((a, b) => {
      const aLast = a[a.length - 1].ts || '';
      const bLast = b[b.length - 1].ts || '';
      return bLast.localeCompare(aLast);
    });

  if (sortedSessions.length === 0) process.exit(0);

  const session = sortedSessions[0];
  const first = session[0];
  const last = session[session.length - 1];
  const timeRange = `${(first.ts || '').split(' ')[1] || '?'}-${(last.ts || '').split(' ')[1] || '?'}`;

  // Dedup: skip if this exact time range already logged today
  const existing = fs.readFileSync(SUMMARY_FILE, 'utf8');
  if (existing.includes(`| ${today} | ${timeRange} |`)) process.exit(0);

  const model = last.model || 'unknown';
  const peakCtx = Math.max(...session.map(e => e.ctx || 0));
  const fiveH = last['5h'] >= 0 ? last['5h'] : '?';
  const sevenD = last['7d'] >= 0 ? last['7d'] : '?';
  const deltaCost = Math.max(0, (last.cost || 0) - (first.cost || 0));
  const delta5h = (last['5h'] >= 0 && first['5h'] >= 0)
    ? (last['5h'] - first['5h']) : '?';

  const costStr = deltaCost > 0.01 ? `$${deltaCost.toFixed(2)}` : '-';
  const delta5hStr = typeof delta5h === 'number' ? `+${delta5h}%` : '?';

  const row = `| ${today} | ${timeRange} | ${model} | ${fiveH}% | ${sevenD}% | ${delta5hStr} | ${peakCtx}% | ${costStr} | ${sessions.length} |\n`;
  fs.appendFileSync(SUMMARY_FILE, row);

  // Output summary for session end display
  const totalSessions = sessions.length;
  const lastSession = sessions[sessions.length - 1];
  const lastEntry = lastSession[lastSession.length - 1];
  const msg = `Token tracker: ${totalSessions} session(s) today. Latest: ${lastEntry.model || 'unknown'}, ctx ${lastEntry.ctx || 0}%, 5h ${lastEntry['5h'] >= 0 ? lastEntry['5h'] + '%' : 'n/a'}`;
  process.stdout.write(msg);

} catch {
  // Never block session end
}
process.exit(0);
