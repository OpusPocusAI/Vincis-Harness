#!/usr/bin/env node
'use strict';

/**
 * research-capture-guard.cjs — PostToolUse hook (Agent)
 *
 * Warns when research agents complete without saving findings to memory/research/.
 * Converts prose rule "Research must be saved to memory/research/" to enforcement.
 *
 * v1.0 — S59
 */

const fs = require('fs');
const path = require('path');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const prompt = data.tool_input?.prompt || '';

    // Only check agents with research-related prompts
    const isResearch = /research|investigate|audit|analyze|survey|compare|evaluate/i.test(prompt);
    if (!isResearch) {
      process.exit(0);
      return;
    }

    // Check if the agent actually completed (substantial response) vs just spawned
    const response = data.tool_response || '';
    const isSpawnOnly = response.length < 200 || /initializing|launched|spawned/i.test(response);
    if (isSpawnOnly) {
      // Agent just spawned — too early to warn. Wait for completion.
      process.exit(0);
      return;
    }

    // Check if the completed agent mentions saving to memory
    const savedToMemory = /memory\/research|saved to memory|written to memory/i.test(response);

    if (!savedToMemory) {
      const result = {
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: "⚠️ RESEARCH CAPTURE: A research agent completed but findings may not have been saved to memory/research/. Research that only exists in context is LOST when the session ends. Save findings to memory/research/ NOW."
        }
      };
      process.stdout.write(JSON.stringify(result));
    }
  } catch {}
  process.exit(0);
});
