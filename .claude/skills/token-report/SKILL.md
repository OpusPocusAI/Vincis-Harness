---
name: token-report
description: Show token usage trends — today's sessions, 7-day history, rate limit status, burn rate projection
user_invocable: true
---

# /token-report — Token Usage Dashboard

Analyze the JSONL token log and present a usage summary.

## Data Source

The token log lives at `~/.claude/token-log.jsonl`. Each line is a JSON object with fields:
- `ts` (string): timestamp "YYYY-MM-DD HH:mm"
- `sid` (number, optional): session ID (Claude Code parent PID)
- `5h` (number): 5-hour rate limit % (-1 if unavailable)
- `7d` (number): 7-day rate limit % (-1 if unavailable)
- `cost` (number): session cumulative cost USD
- `model` (string): model display name
- `ctx` (number): context window usage %

## Steps

### 1. Read and Parse the JSONL

Run the following Node.js script to parse the log and output structured data:

```bash
node -e "
const fs = require('fs'), path = require('path'), os = require('os');
const LOG = path.join(os.homedir(), '.claude', 'token-log.jsonl');
if (!fs.existsSync(LOG)) { console.log('No token log found.'); process.exit(0); }
const lines = fs.readFileSync(LOG,'utf8').trim().split('\n').filter(Boolean).map(l=>{try{return JSON.parse(l)}catch{return null}}).filter(Boolean);

// Group by day
const byDay = {};
for (const e of lines) {
  const day = (e.ts||'').split(' ')[0];
  if (!day) continue;
  if (!byDay[day]) byDay[day] = [];
  byDay[day].push(e);
}

// Session detection within a day (monotonic cost tracking)
function detectSessions(entries) {
  const tracks = [];
  for (const e of entries) {
    const cost = e.cost || 0;
    let best = null, bestDiff = Infinity;
    for (const t of tracks) {
      const d = cost - (t[t.length-1].cost||0);
      if (d >= -0.05 && d < bestDiff) { bestDiff = d; best = t; }
    }
    if (!best || bestDiff > 3.0) tracks.push([e]);
    else best.push(e);
  }
  return tracks;
}

const today = new Date().toISOString().split('T')[0];
const days = Object.keys(byDay).sort().slice(-7);

console.log('=== TOKEN USAGE REPORT ===\n');

// Today's sessions
if (byDay[today]) {
  const sessions = detectSessions(byDay[today]);
  console.log('## Today (' + today + ') — ' + sessions.length + ' session(s)\n');
  console.log('| # | Time | Model | Cost | Peak Ctx | 5h Start→End | Entries |');
  console.log('|---|------|-------|------|----------|--------------|---------|');
  sessions.forEach((s,i) => {
    const f=s[0], l=s[s.length-1];
    const tStart=(f.ts||'').split(' ')[1]||'?';
    const tEnd=(l.ts||'').split(' ')[1]||'?';
    const cost=Math.max(0,(l.cost||0)-(f.cost||0));
    const peak=Math.max(...s.map(e=>e.ctx||0));
    const h5s=f['5h']>=0?f['5h']+'%':'?';
    const h5e=l['5h']>=0?l['5h']+'%':'?';
    console.log('| '+(i+1)+' | '+tStart+'-'+tEnd+' | '+(l.model||'?')+' | $'+cost.toFixed(2)+' | '+peak+'% | '+h5s+'→'+h5e+' | '+s.length+' |');
  });
  console.log();
}

// 7-day trend
console.log('## 7-Day Trend\n');
console.log('| Date | Sessions | Total Cost | Peak 5h% | Models |');
console.log('|------|----------|------------|----------|--------|');
for (const day of days) {
  const entries = byDay[day];
  const sessions = detectSessions(entries);
  let totalCost = 0;
  sessions.forEach(s => { totalCost += Math.max(0, (s[s.length-1].cost||0) - (s[0].cost||0)); });
  const peak5h = Math.max(...entries.map(e=>e['5h']>=0?e['5h']:0));
  const models = [...new Set(entries.map(e=>e.model||'?'))].join(', ');
  console.log('| '+day+' | '+sessions.length+' | $'+totalCost.toFixed(2)+' | '+peak5h+'% | '+models+' |');
}
console.log();

// Current status
const latest = lines[lines.length-1];
if (latest) {
  console.log('## Current Status\n');
  console.log('- Model: ' + (latest.model||'?'));
  console.log('- Context: ' + (latest.ctx||0) + '%');
  console.log('- 5h rate limit: ' + (latest['5h']>=0 ? latest['5h']+'%' : 'unavailable'));
  console.log('- 7d rate limit: ' + (latest['7d']>=0 ? latest['7d']+'%' : 'unavailable'));
  console.log('- Session cost: $' + (latest.cost||0).toFixed(2));
}

// Burn rate
if (byDay[today]) {
  const te = byDay[today];
  const with5h = te.filter(e=>e['5h']>=0);
  if (with5h.length >= 2) {
    const first5h = with5h[0], last5h = with5h[with5h.length-1];
    const t1 = new Date(first5h.ts.replace(' ','T')+':00');
    const t2 = new Date(last5h.ts.replace(' ','T')+':00');
    const hours = (t2-t1)/3600000;
    if (hours > 0.1) {
      const rate = (last5h['5h']-first5h['5h'])/hours;
      const remaining = rate > 0 ? ((100-last5h['5h'])/rate).toFixed(1) : '∞';
      console.log('\n## Burn Rate\n');
      console.log('- Rate: ' + rate.toFixed(1) + '% per hour');
      console.log('- Projected time to 100%: ~' + remaining + 'h');
    }
  }
}
"
```

### 2. Present the Report

Show the output from the script above directly to the user. Add observations:
- Flag any session where cost > $15 as expensive
- Flag burn rate > 20%/hour as aggressive (budget will run out fast)
- Note if 7d rate limit > 70% (weekly budget pressure)
- Recommend model selection if Opus sessions are > 3x Sonnet cost for similar work

### 3. Suggest Actions

Based on findings, suggest:
- If burn rate high: "Consider switching to Sonnet for mechanical tasks"
- If 7d approaching limit: "Pace sessions across remaining days"
- If one session is disproportionately expensive: "Check for research duplication or agent cost overrun"
