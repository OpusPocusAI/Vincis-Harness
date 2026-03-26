#!/usr/bin/env node
'use strict';

/**
 * verify-new-hooks.cjs — PostToolUse hook (Write|Edit)
 *
 * When a hook file is written to .claude/hooks/, automatically tests it.
 * Catches: ESM/CJS issues, /dev/stdin on Windows, syntax errors.
 *
 * v10.0
 */

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = data.tool_input?.file_path || data.tool_input?.path || '';

    // Only check files in .claude/hooks/
    if (!filePath.includes('.claude/hooks/') && !filePath.includes('.claude\\hooks\\')) {
      process.exit(0);
    }
    if (!/\.(js|cjs)$/.test(filePath)) process.exit(0);

    const basename = path.basename(filePath);
    const warnings = [];

    // Check 1: .js in "type": "module" project?
    if (filePath.endsWith('.js')) {
      let dir = path.dirname(filePath);
      for (let i = 0; i < 10; i++) {
        const pkgPath = path.join(dir, 'package.json');
        if (fs.existsSync(pkgPath)) {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
          if (pkg.type === 'module') {
            warnings.push('CRITICAL: ' + basename + ' is .js but project has "type": "module". Rename to .cjs.');
          }
          break;
        }
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
      }
    }

    // Check 2: /dev/stdin usage (fails on Windows)
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('/dev/stdin')) {
      warnings.push('CRITICAL: ' + basename + ' uses /dev/stdin — fails on Windows. Use process.stdin.on pattern.');
    }

    // Check 3: Syntax check
    try {
      execFileSync('node', ['-c', filePath], { encoding: 'utf8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (e) {
      warnings.push('SYNTAX ERROR: ' + (e.stderr || '').split('\n')[0]);
    }

    // Check 4: Smoke test with empty JSON
    try {
      execFileSync('node', [filePath], {
        input: '{}',
        encoding: 'utf8',
        timeout: 10000,
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (e) {
      const stderr = (e.stderr || '').trim();
      if (stderr && !stderr.includes('[Context]') && !stderr.includes('[Hook]')) {
        warnings.push('RUNTIME ERROR with empty input: ' + stderr.split('\n')[0]);
      }
    }

    if (warnings.length > 0) {
      const out = JSON.stringify({
        decision: 'warn',
        reason: 'Hook verification for ' + basename + ':\n' + warnings.join('\n') + '\n\nFix before committing.'
      });
      process.stdout.write(out);
    }

    process.exit(0);
  } catch {
    process.exit(0);
  }
});
