#!/usr/bin/env node
'use strict';

/**
 * agent-scope-guard.cjs — PreToolUse hook (Agent tool)
 *
 * Enforces agent scoping rules learned in S54, reworked by Auditor:
 * - Exempts Explore/Plan agents by subagent_type (structural, not keyword)
 * - Warns on concern mixing (multiple distinct actions in one agent)
 * - Suggests splitting by concern area instead of hard file limits
 * - Checks for verification command in non-research agents
 *
 * Does NOT block (exit 0) — outputs guidance via stdout (additionalContext).
 * v10.3 — Auditor rework: scope by concern, not file count
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name || '';

    // Only check Agent tool
    if (toolName !== 'Agent') process.exit(0);

    const prompt = data.tool_input?.prompt || '';
    const subagentType = data.tool_input?.subagent_type || '';
    const warnings = [];

    // 1. STRUCTURAL EXEMPTION: Explore and Plan agents are read-only — never warn
    if (/^(Explore|Plan)$/i.test(subagentType)) process.exit(0);

    // 2. KEYWORD EXEMPTION: investigative/research prompts
    const researchPattern = /\b(read-only|READ-ONLY|Explore|research|scout|investigate|analyze|audit|check|find|search|review|assess|compare|evaluate|report|list|verify|scan|inspect|examine|measure|profile|benchmark|survey|catalogue|inventory)\b/i;
    if (researchPattern.test(prompt)) process.exit(0);

    // 3. CONCERN MIXING CHECK — multiple distinct actions in one agent
    const actionVerbs = [
      /\bfix\s+(ts|typescript)\s+errors?\b/i,
      /\bclean\s+(up\s+)?console\.log/i,
      /\b(add|insert)\s+(clear)?timeout/i,
      /\breplace\s+key=\{i\}/i,
      /\bremove\s+(dead|unused)\s+code/i,
      /\brefactor\b/i,
      /\bmigrate\b/i,
      /\b(add|update)\s+(import|type|interface)/i,
    ];
    const matchedConcerns = actionVerbs.filter(p => p.test(prompt));
    if (matchedConcerns.length > 1) {
      warnings.push(`⚠️ AGENT SCOPE: ${matchedConcerns.length} distinct concerns detected. S54 data: agents with 1 concern + 1 focus area outperform multi-concern agents. Split into ${matchedConcerns.length} focused agents.`);
    }

    // 4. FILE COUNT — advisory, not hard limit
    const filePatterns = prompt.match(/\b[\w/.-]+\.(ts|tsx|js|jsx|css)\b/g) || [];
    const uniqueFiles = [...new Set(filePatterns)];
    if (uniqueFiles.length > 15) {
      warnings.push(`⚠️ AGENT SCOPE: ${uniqueFiles.length} files referenced. S54 evidence: parallel agents of 3-10 files each (Pattern B/C) outperform single broad agents. Consider splitting by concern area.`);
    }

    // 5. VERIFICATION COMMAND CHECK — for non-research agents doing code changes
    const hasVerify = /tsc\s+--noEmit|vite\s+build|npm\s+run\s+build|npx\s+tsc/i.test(prompt);
    if (!hasVerify) {
      warnings.push('⚠️ AGENT SCOPE: No verification command in prompt. Add "verify with tsc --noEmit and vite build" at the end.');
    }

    if (warnings.length > 0) {
      process.stdout.write(`\n[Agent Scope Guard v10.3]\n${warnings.join('\n')}\n\nREMINDER: After this agent completes, verify results (build + visual test) before summarizing.\n`);
    }
  } catch {}
  process.exit(0);
});
