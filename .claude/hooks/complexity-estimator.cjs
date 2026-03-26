#!/usr/bin/env node
'use strict';

/**
 * complexity-estimator.cjs — UserPromptSubmit hook
 *
 * Estimates task complexity from the user's prompt and advises on
 * model selection. Pure regex — zero LLM calls, zero token cost.
 *
 * HIGH → emits advisory: "Consider Opus for this task"
 * MEDIUM/LOW → silent (no output, no noise)
 *
 * Pattern source: adapted from ruflo pre-task estimation concept.
 * v1.0 — S64
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const prompt = (data.prompt || '').toLowerCase();

    // Skip very short prompts (commands, quick questions)
    if (prompt.length < 30) process.exit(0);

    let score = 0;

    // HIGH complexity signals
    const highKeywords = [
      /\barchitect/i,
      /\brefactor\s+(entire|all|across)/i,
      /\bsecurity\s+audit/i,
      /\broot\s+cause/i,
      /\bacross\s+all\s+(service|system)/i,
      /\bdesign\s+system/i,
      /\bmigrat(e|ion)\s+(to|from|entire)/i,
      /\brace\s+condition/i,
      /\bdistributed\s+state/i,
      /\bnovel\s+constraint/i,
    ];

    for (const kw of highKeywords) {
      if (kw.test(prompt)) score += 3;
    }

    // Multi-system scope: mentions 2+ services
    const services = ['\\bfe\\b', '\\bbe\\b', '\\bnewbe\\b', '\\bpartnerwijse\\b', '\\bfrontend\\b', '\\bbackend\\b'];
    const serviceMatches = services.filter(s => new RegExp(s, 'i').test(prompt));
    if (serviceMatches.length >= 2) score += 3;

    // File count: many distinct files referenced
    const filePatterns = prompt.match(/[\w/.-]+\.(ts|tsx|js|jsx|css|md)\b/g) || [];
    const uniqueFiles = [...new Set(filePatterns)];
    if (uniqueFiles.length >= 8) score += 2;
    if (uniqueFiles.length >= 15) score += 2;

    // Uncertainty signals
    const uncertaintyKeywords = [
      /\binvestigat/i,
      /\bi\s+don'?t\s+know\s+why/i,
      /\bwhat\s+is\s+(causing|wrong)/i,
      /\bdebug\s+(the|this|a)\s+(entire|whole)/i,
    ];
    for (const kw of uncertaintyKeywords) {
      if (kw.test(prompt)) score += 2;
    }

    // Only emit for HIGH complexity (score >= 5)
    if (score >= 5) {
      const output = JSON.stringify({
        decision: 'warn',
        reason: `COMPLEXITY: HIGH (score ${score}) — Consider Opus for this task. Signals: ${serviceMatches.length >= 2 ? 'multi-system scope, ' : ''}${uniqueFiles.length >= 8 ? uniqueFiles.length + ' files referenced, ' : ''}architecture/investigation keywords detected.`,
      });
      process.stdout.write(output);
    }
  } catch {}
  process.exit(0);
});
