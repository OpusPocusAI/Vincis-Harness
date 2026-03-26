#!/usr/bin/env node
'use strict';

/**
 * prose-vs-hook-check.cjs — PostToolUse hook (Edit|Write)
 *
 * When editing role docs or CLAUDE.md, checks if the change adds
 * rule-like language that could be a hook instead of prose.
 * Reminds: "Could this be a hook?"
 *
 * v10.3 — Auditor: enforce the hierarchy (Hook > Protocol)
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = data.tool_input?.file_path || '';

    // Only check role docs and CLAUDE.md
    if (!/COORDINATOR-ROLE|AUDITOR-ROLE|WORKER-ROLE|MERGER-ROLE|CLAUDE\.md/.test(filePath)) {
      process.exit(0);
    }

    const newContent = data.tool_input?.new_string || data.tool_input?.content || '';

    // Check for rule-like patterns that might be better as hooks
    const rulePatterns = [
      /\bMUST\b.*\bbefore\b/i,
      /\bNEVER\b.*\bwithout\b/i,
      /\bALWAYS\b.*\bafter\b/i,
      /\bMANDATORY\b/i,
      /\bZERO-TOLERANCE\b/i,
      /\bBLOCKED\b.*\buntil\b/i,
    ];

    const matches = rulePatterns.filter(p => p.test(newContent));
    if (matches.length > 0) {
      process.stdout.write(
        `\n[Prose vs Hook Check]\n` +
        `You're adding ${matches.length} rule-like statement(s) to a role doc.\n` +
        `Before committing: could any of these be a HOOK instead of prose?\n` +
        `Hierarchy: Hook > Agent role > Skill > Protocol > Memory note.\n` +
        `Prose rules that can be automated SHOULD be automated.\n`
      );
    }
  } catch {}
  process.exit(0);
});
