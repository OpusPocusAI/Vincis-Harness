#!/usr/bin/env node
'use strict';

/**
 * discord-reporter.cjs — Stop hook
 *
 * Posts a session summary to a Discord webhook on session end.
 * Requires DISCORD_WEBHOOK_URL env var or ~/.claude/discord-config.json.
 * Exits silently if no webhook URL is configured.
 *
 * v1.0 — S64
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const { execFileSync } = require('child_process');

// --- Config ---
const CONFIG_FILE = path.join(os.homedir(), '.claude', 'discord-config.json');
const LOG_FILE = path.join(os.homedir(), '.claude', 'token-log.jsonl');
const TIMEOUT_MS = 5000;

function getWebhookUrl() {
  if (process.env.DISCORD_WEBHOOK_URL) return process.env.DISCORD_WEBHOOK_URL;
  try {
    const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    return cfg.webhook_url || null;
  } catch { return null; }
}

function getGitInfo(cwd) {
  const info = { branch: 'unknown', filesChanged: 0, commits: 0 };
  try {
    info.branch = execFileSync('git', ['-C', cwd, 'branch', '--show-current'], { encoding: 'utf8', timeout: 3000 }).trim();
  } catch {}
  try {
    const diff = execFileSync('git', ['-C', cwd, 'diff', '--name-only'], { encoding: 'utf8', timeout: 3000 });
    info.filesChanged = diff.trim().split('\n').filter(Boolean).length;
  } catch {}
  try {
    // Count commits made today
    const today = new Date().toISOString().split('T')[0];
    const log = execFileSync('git', ['-C', cwd, 'log', '--oneline', `--since=${today}`], { encoding: 'utf8', timeout: 3000 });
    info.commits = log.trim().split('\n').filter(Boolean).length;
  } catch {}
  return info;
}

function getSessionData() {
  const data = { model: 'unknown', cost: 0, ctx: 0, fiveH: '?', sevenD: '?', duration: '?', entries: 0 };
  try {
    if (!fs.existsSync(LOG_FILE)) return data;
    const lines = fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n').filter(Boolean);
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = lines
      .map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(e => e && e.ts && e.ts.startsWith(today));

    if (todayEntries.length === 0) return data;

    // Find the most recent session (highest cost at end)
    const last = todayEntries[todayEntries.length - 1];
    data.model = last.model || 'unknown';
    data.ctx = last.ctx || 0;
    data.fiveH = last['5h'] >= 0 ? `${last['5h']}%` : 'n/a';
    data.sevenD = last['7d'] >= 0 ? `${last['7d']}%` : 'n/a';
    data.entries = todayEntries.length;

    // Session cost: find the last monotonic cost run
    let sessionStart = todayEntries.length - 1;
    for (let i = todayEntries.length - 2; i >= 0; i--) {
      if ((todayEntries[i].cost || 0) <= (todayEntries[i + 1].cost || 0)) {
        sessionStart = i;
      } else break;
    }
    const first = todayEntries[sessionStart];
    data.cost = Math.max(0, (last.cost || 0) - (first.cost || 0));

    // Duration
    const tStart = first.ts.split(' ')[1];
    const tEnd = last.ts.split(' ')[1];
    if (tStart && tEnd) {
      const [h1, m1] = tStart.split(':').map(Number);
      const [h2, m2] = tEnd.split(':').map(Number);
      const mins = (h2 * 60 + m2) - (h1 * 60 + m1);
      if (mins > 0) {
        data.duration = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
      }
    }
  } catch {}
  return data;
}

function postToDiscord(url, payload) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const body = JSON.stringify(payload);
    const req = https.request({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: TIMEOUT_MS,
    }, res => {
      res.on('data', () => {});
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

async function main() {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) process.exit(0); // No URL configured — silent exit

  const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const git = getGitInfo(cwd);
  const session = getSessionData();
  const projectName = path.basename(cwd);

  // Color: green <$5, yellow <$15, red >=15
  const color = session.cost < 5 ? 0x2ECC71 : session.cost < 15 ? 0xF39C12 : 0xE74C3C;

  const embed = {
    title: `Session Complete — ${projectName}`,
    color,
    fields: [
      { name: 'Model', value: session.model, inline: true },
      { name: 'Cost', value: `$${session.cost.toFixed(2)}`, inline: true },
      { name: 'Duration', value: session.duration, inline: true },
      { name: 'Context', value: `${session.ctx}%`, inline: true },
      { name: 'Rate Limits', value: `5h: ${session.fiveH} | 7d: ${session.sevenD}`, inline: true },
      { name: 'Branch', value: git.branch, inline: true },
      { name: 'Files Changed', value: `${git.filesChanged}`, inline: true },
      { name: 'Commits Today', value: `${git.commits}`, inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: 'Claude Code Session Reporter' },
  };

  try {
    await postToDiscord(webhookUrl, { embeds: [embed] });
  } catch {
    // Never block session end
  }
}

main().then(() => process.exit(0)).catch(() => process.exit(0));
