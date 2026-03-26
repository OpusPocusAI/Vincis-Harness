#!/usr/bin/env node
'use strict';

/**
 * dangerous-command-guard.js — PreToolUse hook (Bash)
 *
 * Converts the Dangerous Commands Register into executable enforcement.
 * BLOCKS dangerous commands (exit 2). WARNS on risky ones (exit 0 with message).
 *
 * v10.0 — replaces the text-only register in CLAUDE.md
 */

const fs = require('fs');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const command = (data.tool_input?.command || '').trim();
    if (!command) process.exit(0);

    // === BLOCK (exit 2) — these are catastrophic ===

    // Kill ALL node processes (destroys Claude Code sessions)
    if (/taskkill\s+\/\/F\s+\/\/IM\s+node\.exe/i.test(command)) {
      output('block', 'BLOCKED: "taskkill //F //IM node.exe" kills ALL Node processes including Claude Code.\nUse: taskkill //F //PID <specific_pid>');
    }

    // rm -rf at repo root
    if (/rm\s+-rf\s+[\/\.]?\s*$/.test(command) || /rm\s+-rf\s+\/\s/.test(command)) {
      output('block', 'BLOCKED: "rm -rf" at root level deletes entire project.\nTarget specific directories instead.');
    }

    // git clean -fdx at repo root (removes node_modules, .env, everything untracked)
    if (/git\s+clean\s+-fdx\s*$/.test(command) && !command.includes('--')) {
      output('block', 'BLOCKED: "git clean -fdx" at repo root removes ALL untracked files including node_modules and .env.\nTarget specific directories: git clean -fdx -- FE/');
    }

    // === WARN (exit 0 with message) — these are risky ===

    // git reset --hard without prior stash
    if (/git\s+reset\s+--hard/.test(command)) {
      output('warn', 'WARNING: "git reset --hard" destroys uncommitted work.\nConsider: git stash first, or use git reset --soft.');
    }

    // git worktree remove --force
    if (/git\s+worktree\s+remove\s+--force/.test(command)) {
      output('warn', 'WARNING: "git worktree remove --force" may destroy uncommitted worker work.\nVerify commits first: git log main..<branch>');
    }

    // git push --force to main
    if (/git\s+push\s+.*--force.*\s+(origin\s+)?main/.test(command) || /git\s+push\s+.*main.*--force/.test(command)) {
      output('warn', 'WARNING: Force-pushing to main can overwrite upstream history.\nThis is almost never what you want.');
    }

    process.exit(0);
  } catch {
    process.exit(0);
  }
});

function output(decision, reason) {
  if (decision === 'block') {
    process.stderr.write(reason + '\n');
    process.exit(2);
  } else {
    const msg = JSON.stringify({ decision: 'warn', reason });
    process.stdout.write(msg);
  }
}
