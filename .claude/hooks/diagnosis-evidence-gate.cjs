#!/usr/bin/env node
'use strict';

/**
 * diagnosis-evidence-gate.cjs — PostToolUse hook (Bash)
 *
 * Cognitive chain hook: after a command returns error-like output, injects
 * an evidence interpretation prompt. Forces the model to distinguish what
 * is PROVEN vs what is ASSUMED before stating root cause.
 *
 * v1.0 — S57: cognitive chain hooks
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const command = data.tool_input?.command || '';
    const stdout = data.tool_response?.stdout || data.tool_response?.output || '';
    const stderr = data.tool_response?.stderr || '';
    const combined = stdout + '\n' + stderr;

    // Skip commands that are EXPECTED to find/show errors
    const skipPatterns = [
      /\bgrep\b/i, /\bnpm\s+audit\b/i, /\bjest\b/i, /\bvitest\b/i,
      /\bmocha\b/i, /\best\b.*--check/i, /\blint/i, /\bpylint\b/i,
    ];
    if (skipPatterns.some(p => p.test(command))) process.exit(0);

    // Detect error evidence in output
    const errorSignals = [
      /HTTP\/?\s*[45]\d{2}/i,
      /\b(ECONNREFUSED|ETIMEDOUT|ENOTFOUND)\b/,
      /\berror\b.*:/i,
      /\bfailed\b/i,
      /\bFATAL\b/,
      /\bpanic\b/i,
      /\bsegfault\b/i,
      /\bPermission denied\b/i,
      /exit\s+code\s+[1-9]/i,
      /\bstatus\s*:\s*[45]\d{2}\b/i,
      /\bnot found\b/i,
      /\bcommand not found\b/,
    ];

    const hasError = errorSignals.some(p => p.test(combined));
    if (!hasError) process.exit(0);

    const prompt = [
      'EVIDENCE CAPTURED — interpret before concluding:',
      '- What does this output PROVE? (be specific)',
      '- What does it NOT prove?',
      '- What else would you need to check?',
      'Do NOT state root cause without citing this evidence.',
    ].join('\n');

    const result = {
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: prompt,
      },
    };
    process.stdout.write(JSON.stringify(result));
  } catch {}
  process.exit(0);
});
