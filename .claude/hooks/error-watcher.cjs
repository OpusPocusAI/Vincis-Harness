#!/usr/bin/env node
'use strict';

/**
 * error-watcher.cjs — PostToolUse hook (Bash)
 *
 * Monitors Bash command output for errors and injects fix guidance.
 * Acts as a background error watcher — catches problems the model
 * might scroll past.
 *
 * v10.5 — S55: terminal error → immediate awareness
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const output = data.tool_response?.stdout || data.tool_response?.output || '';
    const stderr = data.tool_response?.stderr || '';
    const command = data.tool_input?.command || '';
    const combined = output + '\n' + stderr;

    // Skip commands that are EXPECTED to have error-like output
    if (command.includes('grep') || command.includes('audit') || command.includes('--check')) {
      process.exit(0);
    }

    const errorPatterns = [
      { pattern: /error TS\d+/i, type: 'TypeScript error' },
      { pattern: /ENOSPC|ENOMEM/i, type: 'System resource error' },
      { pattern: /CORS.*blocked/i, type: 'CORS error' },
      { pattern: /Cannot find module/i, type: 'Missing module' },
      { pattern: /SyntaxError:/i, type: 'Syntax error' },
      { pattern: /ERR_MODULE_NOT_FOUND/i, type: 'Module not found' },
      { pattern: /FATAL ERROR/i, type: 'Fatal error' },
      { pattern: /Segmentation fault/i, type: 'Crash' },
      { pattern: /npm ERR!/i, type: 'npm error' },
    ];

    const found = errorPatterns.filter(({ pattern }) => pattern.test(combined));

    if (found.length > 0) {
      const types = found.map(f => f.type).join(', ');
      const result = {
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: `⚠️ ERROR DETECTED in command output: ${types}\nDo not scroll past this. Investigate and fix before continuing.`
        }
      };
      process.stdout.write(JSON.stringify(result));
    }
  } catch {}
  process.exit(0);
});
