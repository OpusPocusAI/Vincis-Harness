#!/usr/bin/env node
'use strict';

/**
 * pattern-detector.cjs — PostToolUse hook (Bash|Write|Edit)
 *
 * Cognitive chain hook: tracks action categories in a temp state file.
 * Every 15 tool uses, checks if any category hit 3+ occurrences and
 * prompts the model to extract the pattern into a hook/skill/role.
 *
 * v1.0 — S57: cognitive chain hooks
 */

const fs = require('fs');
const path = require('path');

const stateFile = path.join(
  process.env.TMPDIR || process.env.TEMP || '/tmp',
  'harness-pattern-tracker.json'
);

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const command = data.tool_input?.command || '';
    const filePath = data.tool_input?.file_path || '';
    const toolName = data.tool_name || '';

    // Load or initialize state
    let state = { total: 0, categories: {} };
    try { state = JSON.parse(fs.readFileSync(stateFile, 'utf8')); } catch {}

    // Classify the action
    const category = classify(command, filePath, toolName);
    if (category) {
      state.categories[category] = (state.categories[category] || 0) + 1;
    }
    state.total = (state.total || 0) + 1;

    // Track consecutive same-type edits for mechanical work detection
    // Exclude git and diagnostic from mechanical work — these are workflow, not repetitive edits
    const mechanicalCategories = new Set(['edit-ui', 'edit-hook', 'edit-config']);
    if (!state.consecutive) state.consecutive = { category: '', count: 0 };
    if (category && mechanicalCategories.has(category) && category === state.consecutive.category) {
      state.consecutive.count++;
    } else if (category && mechanicalCategories.has(category)) {
      state.consecutive = { category, count: 1 };
    } else {
      // Non-mechanical action resets the counter
      state.consecutive = { category: '', count: 0 };
    }

    // Save state
    fs.writeFileSync(stateFile, JSON.stringify(state));

    // Every 15 actions: check for repeated patterns
    if (state.total % 15 === 0) {
      const repeated = Object.entries(state.categories)
        .filter(([, count]) => count >= 3)
        .sort(([, a], [, b]) => b - a);

      if (repeated.length > 0) {
        const lines = repeated.map(([cat, n]) => `  - ${cat}: ${n} times`);
        const prompt = [
          `PATTERN CHECK (${state.total} tool uses this session):`,
          ...lines,
          '',
          'Should any of these become a hook, skill, or agent role?',
          'If yes, implement NOW — not later, not as a TODO.',
        ].join('\n');

        const result = {
          hookSpecificOutput: {
            hookEventName: 'PostToolUse',
            additionalContext: prompt,
          },
        };
        process.stdout.write(JSON.stringify(result));
      }
    }

    // Post-commit reminder: committed ≠ done
    if (/\bgit\s+commit\b/.test(command)) {
      const reminder = {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: [
            'COMMITTED ≠ DONE. After every commit, check:',
            '1. Is the task list empty? Are there pending tasks?',
            '2. Did the user mention anything else that needs action?',
            '3. Are there findings from this session that need implementation?',
            '4. Is there more value you can deliver before stopping?',
            'A commit is a CHECKPOINT, not a finish line. Keep working.',
          ].join('\n'),
        },
      };
      process.stdout.write(JSON.stringify(reminder));
    }

    // Mechanical work escalation: warn after 4+ consecutive same-type edits
    if (state.consecutive && state.consecutive.count >= 4) {
      const warn = {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `⚠️ MECHANICAL WORK DETECTED: ${state.consecutive.count} consecutive ${state.consecutive.category} operations. Consider delegating to an agent — Coordinators orchestrate, agents execute.`,
        },
      };
      process.stdout.write(JSON.stringify(warn));
    }
  } catch {}
  process.exit(0);
});

function classify(cmd, file, tool) {
  if (/\b(curl|wget|ping|nslookup|dig)\b/.test(cmd)) return 'diagnostic';
  if (/\bgrep\b/.test(cmd)) return 'diagnostic';
  if (/\b(tsc|vite|next\s+build|npm\s+run\s+build)\b/.test(cmd)) return 'build-check';
  if (/\bgit\b/.test(cmd)) return 'git';
  if ((tool === 'Write' || tool === 'Edit') && /\.(tsx?|css|scss)$/.test(file)) return 'edit-ui';
  if ((tool === 'Write' || tool === 'Edit') && /\.cjs$/.test(file)) return 'edit-hook';
  if (/\bnpm\b/.test(cmd) || /\bnpx\b/.test(cmd)) return 'npm';
  return null;
}
