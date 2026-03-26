#!/usr/bin/env node
'use strict';

/**
 * council-enforcer.cjs — PreToolUse hook (Agent|Bash)
 *
 * Blocks the first 3 tool uses until /council has been run.
 * After 3 blocks, switches to persistent warn (never allows bypass).
 * The flag file must contain a random token generated here — only
 * /council can read the token from the counter file and write it.
 *
 * v2.0 — token-secured flag, no manual bypass
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TMPDIR = require('os').tmpdir();
const flagFile = path.join(TMPDIR, 'harness-council-active');
const counterFile = path.join(TMPDIR, 'harness-council-check-count');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    // Guard: only enforce in Coordinator sessions
    const kickstart = path.join(
      process.env.CLAUDE_PROJECT_DIR || process.cwd(),
      'NEXT-SESSION-KICKSTART-COORDINATOR.md'
    );
    if (!fs.existsSync(kickstart)) process.exit(0);

    // Read or initialize counter + token
    // Reset if counter is older than 4 hours (stale session) — ensures each new
    // session gets the 3-block window, not just warn-only from a previous session.
    let count = 0;
    let token = '';
    try {
      const stat = fs.statSync(counterFile);
      const ageMs = Date.now() - stat.mtimeMs;
      const stale = ageMs > 4 * 60 * 60 * 1000; // 4 hours
      if (!stale) {
        const data = JSON.parse(fs.readFileSync(counterFile, 'utf8'));
        count = data.count || 0;
        token = data.token || '';
      }
      // If stale: count stays 0, token stays '' → fresh 3-block window
    } catch {}

    // Generate token on first invocation
    if (!token) {
      token = crypto.randomBytes(16).toString('hex');
    }

    // Whitelist: allow the /council flag-creation command through
    const data = JSON.parse(input);
    const cmd = data.tool_input?.command || '';
    if (/harness-council-check-count.*harness-council-active/.test(cmd)) {
      process.exit(0); // This IS the council setup command — let it through
    }

    // Check flag file — must exist AND contain the correct token
    if (fs.existsSync(flagFile)) {
      try {
        const flagContent = fs.readFileSync(flagFile, 'utf8').trim();
        if (flagContent === token) process.exit(0);
      } catch {}
      // Flag exists but wrong/missing token — delete it, fall through
      try { fs.unlinkSync(flagFile); } catch {}
    }

    // Increment and persist
    count++;
    fs.writeFileSync(counterFile, JSON.stringify({ count, token }));

    if (count > 3) {
      // Warn but don't block — persists every tool use
      const warn = JSON.stringify({
        decision: 'warn',
        reason: 'Council still not spawned after 3 tool uses. Run /council — this warning will persist on EVERY tool use until you do.',
      });
      process.stdout.write(warn);
      process.exit(0);
    }

    // BLOCK: council not spawned
    process.stderr.write(
      'BLOCKED: Council not spawned. Run /council before starting work.\n' +
      'This ensures a Quality Monitor watches your session.\n' +
      `(Attempt ${count}/3 — will warn on every tool use after 3 attempts)\n`
    );
    process.exit(2);
  } catch {
    process.exit(0);
  }
});
