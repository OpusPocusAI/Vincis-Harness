#!/usr/bin/env node
'use strict';

/**
 * typecheck-on-edit.js — PostToolUse hook (Write|Edit)
 *
 * Runs TypeScript check on edited .ts/.tsx files.
 * WARNING only (PostToolUse cannot block).
 * Filters pre-existing errors to avoid noise.
 *
 * v10.0
 */

const fs = require('fs');
const { execFileSync } = require('child_process');
const path = require('path');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = data.tool_input?.file_path || data.tool_input?.path || '';

    // Only check .ts and .tsx files
    if (!/\.(ts|tsx)$/.test(filePath)) process.exit(0);

    // Skip known noisy files (pre-existing errors)
    const basename = path.basename(filePath);
    const knownNoisy = ['App.tsx', 'TripPlannerModal.tsx'];
    if (knownNoisy.includes(basename)) process.exit(0);

    // Find the nearest tsconfig
    let dir = path.dirname(filePath);
    let tsconfig = null;
    for (let i = 0; i < 5; i++) {
      const candidate = path.join(dir, 'tsconfig.json');
      if (fs.existsSync(candidate)) { tsconfig = candidate; break; }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
    if (!tsconfig) process.exit(0);

    // Run tsc on the specific file's project
    const tsconfigDir = path.dirname(tsconfig);
    try {
      execFileSync('npx', ['tsc', '--noEmit', '--pretty', 'false'], {
        cwd: tsconfigDir,
        encoding: 'utf8',
        timeout: 30000,
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (e) {
      // tsc exits non-zero when errors exist
      const output = (e.stdout || '') + (e.stderr || '');
      // Filter to only errors in the edited file
      const relPath = path.relative(tsconfigDir, filePath).replace(/\\/g, '/');
      const relevantErrors = output.split('\n')
        .filter(line => line.includes(relPath) || line.includes(basename))
        .slice(0, 5);

      if (relevantErrors.length > 0) {
        const msg = JSON.stringify({
          decision: 'warn',
          reason: `TypeScript errors in ${basename}:\n${relevantErrors.join('\n')}\n\nFix these before continuing.`
        });
        process.stdout.write(msg);
      }
    }

    process.exit(0);
  } catch {
    process.exit(0);
  }
});
