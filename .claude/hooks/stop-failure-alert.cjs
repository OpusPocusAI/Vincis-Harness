#!/usr/bin/env node
'use strict';

/**
 * stop-failure-alert.cjs — StopFailure hook
 *
 * Fires when a turn ends due to API error (rate limit, auth failure).
 * Provides actionable guidance instead of silent failure.
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const error = data.error || data.stop_reason || 'unknown';
    const errorStr = typeof error === 'string' ? error : JSON.stringify(error);

    let advice = 'Check your connection and try again.';
    if (errorStr.includes('rate') || errorStr.includes('429')) {
      advice = 'Rate limit hit. Wait 1-2 minutes before retrying. Consider using /effort low for lighter requests.';
    } else if (errorStr.includes('auth') || errorStr.includes('401') || errorStr.includes('403')) {
      advice = 'Authentication error. Run: claude auth login';
    } else if (errorStr.includes('timeout') || errorStr.includes('504')) {
      advice = 'Request timed out. Try a shorter prompt or /effort low.';
    }

    const result = {
      hookSpecificOutput: {
        hookEventName: 'StopFailure',
        additionalContext: `API ERROR — Turn stopped: ${errorStr}\nAdvice: ${advice}\nNote: Your work is NOT lost. Unsaved changes are still in the working tree.`,
      },
    };
    process.stdout.write(JSON.stringify(result));
  } catch {}
  process.exit(0);
});
