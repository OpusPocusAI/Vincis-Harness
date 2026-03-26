#!/usr/bin/env node
'use strict';

/**
 * correction-cascade.cjs — UserPromptSubmit hook
 *
 * Detects when the user sends a correction and injects the Correction Cascade
 * protocol: STOP → identify failure class → build structural fix → test → resume.
 *
 * "Never make the user repeat themselves. Every correction is a failure."
 * This hook makes that rule structural, not just philosophical.
 *
 * v10.5 — S55: one correction = one structural fix, enforced by hook
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const message = (data.message || data.content || '').toLowerCase();

    // Detect correction patterns
    const correctionPatterns = [
      /\bno[,.]?\s+(?:don'?t|not|stop|wrong)/,
      /\bthat'?s not/,
      /\bi (?:didn'?t|don'?t) (?:want|mean|ask)/,
      /\bwhy (?:did you|didn'?t you|aren'?t you)/,
      /\byou (?:should have|forgot|missed|skipped)/,
      /\bnot what i/,
      /\bstop doing/,
      /\byou keep/,
      /\bi already (?:said|told|asked|mentioned)/,
      /\bhow many times/,
      /\bagain[?!,]/,
    ];

    const isCorrection = correctionPatterns.some(p => p.test(message));

    if (isCorrection) {
      const result = {
        hookSpecificOutput: {
          hookEventName: "UserPromptSubmit",
          additionalContext: [
            '⚠️ CORRECTION DETECTED — Cascade Protocol activated:',
            '',
            'The user just corrected you. This is a FAILURE. Before responding:',
            '1. ACKNOWLEDGE the correction explicitly — no defensiveness',
            '2. IDENTIFY the CLASS of failure — what category does this belong to?',
            '   (missed context? surface-level execution? ignored harness rule? waited for prompt?)',
            '3. BUILD a structural fix that prevents THIS CLASS of failure forever:',
            '   Hook > Agent role > Skill > Memory note (in order of preference)',
            '4. TEST the fix before resuming',
            '5. THEN address the user\'s actual request',
            '',
            'Do NOT skip steps 2-4. Do NOT say "I\'ll fix this next session."',
            'The fix must ship in THIS turn.',
          ].join('\n')
        }
      };
      process.stdout.write(JSON.stringify(result));
    }
  } catch {}
  process.exit(0);
});
