#!/usr/bin/env node
'use strict';

/**
 * plugin-health-check.cjs — SessionStart hook (no stdin)
 *
 * Checks critical plugin health at session start:
 * - claude-mem worker-service availability
 * - MCP server enablement (context7, supabase, playwright)
 */

const fs = require('fs');
const path = require('path');

try {
  const issues = [];

  // 1. Check claude-mem worker-service
  const homeDir = process.env.USERPROFILE || process.env.HOME || '';
  const memPluginBase = path.join(homeDir, '.claude', 'plugins', 'cache', 'thedotmack', 'claude-mem');
  if (fs.existsSync(memPluginBase)) {
    try {
      const versions = fs.readdirSync(memPluginBase).filter(d => {
        return fs.statSync(path.join(memPluginBase, d)).isDirectory();
      });
      let workerFound = false;
      for (const ver of versions) {
        const workerPath = path.join(memPluginBase, ver, 'scripts', 'worker-service.cjs');
        if (fs.existsSync(workerPath)) {
          try {
            require(workerPath);
            workerFound = true;
          } catch (e) {
            if (e.code === 'MODULE_NOT_FOUND') {
              issues.push('claude-mem worker-service: BROKEN (requires Bun runtime)');
            } else {
              issues.push(`claude-mem worker-service: ERROR (${e.message})`);
            }
          }
          break;
        }
      }
      if (!workerFound && issues.length === 0) {
        issues.push('claude-mem worker-service: not found in any version directory');
      }
    } catch (e) {
      issues.push(`claude-mem: failed to scan versions (${e.message})`);
    }
  }

  // 2. MCP servers are configured in user-level config (via `claude mcp add`),
  // not in project settings.json. Skip MCP checks — they can't be verified from here.

  // 3. Output only if issues found
  if (issues.length > 0) {
    const result = {
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: `PLUGIN HEALTH CHECK:\n${issues.map(i => '- ' + i).join('\n')}`,
      },
    };
    process.stdout.write(JSON.stringify(result));
  }
} catch {
  process.exit(0);
}
