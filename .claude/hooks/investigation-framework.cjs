#!/usr/bin/env node
'use strict';

/**
 * investigation-framework.cjs — PreToolUse hook (Bash)
 *
 * Cognitive chain hook: when a diagnostic command is detected, injects the
 * investigation protocol so the model structures its thinking before
 * interpreting results. Shapes reasoning, doesn't block.
 *
 * v1.0 — S57: cognitive chain hooks
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const command = (data.tool_input?.command || '').trim();
    if (!command) process.exit(0);

    // Diagnostic command patterns
    const diagnosticPatterns = [
      /\bcurl\b/,
      /\bgrep\b.*(-i\s+)?(error|fail|warn|crash|exception)/i,
      /\btsc\b.*--noEmit/,
      /\bnpm\s+audit\b/,
      /\bgit\s+log\b.*--.*grep/,
      /\brailway\s+logs\b/,
      /\bvercel\s+logs\b/,
      /\bdocker\s+logs\b/,
      /\bnetstat\b/,
      /\blsof\b.*-i/,
      /\bping\b/,
      /\bnslookup\b/,
      /\bdig\b\s/,
      /\bwget\b.*--spider/,
      /\bnpx\s+tsc\b/,
      /\bnode\b.*--inspect/,
    ];

    const isDiagnostic = diagnosticPatterns.some(p => p.test(command));
    if (!isDiagnostic) process.exit(0);

    const protocol = [
      'INVESTIGATION PROTOCOL ACTIVE:',
      '1. What do you KNOW right now? (cite file:line or curl output)',
      '2. What DON\'T you know?',
      '3. What would CONFIRM or DENY your hypothesis?',
      '4. Label any guess as "UNVERIFIED HYPOTHESIS" — never state as fact',
    ].join('\n');

    const out = JSON.stringify({ decision: 'warn', reason: protocol });
    process.stdout.write(out);
    process.exit(0);
  } catch {
    process.exit(0);
  }
});
