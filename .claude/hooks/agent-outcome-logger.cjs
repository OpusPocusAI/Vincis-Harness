#!/usr/bin/env node
'use strict';

/**
 * agent-outcome-logger.cjs — PostToolUse hook (Agent matcher)
 *
 * Logs agent outcomes to memory/agent-outcomes.md.
 * Tracks task description, type, and success/empty outcome.
 * Caps at 100 data rows.
 */

const fs = require('fs');
const path = require('path');

const OUTCOMES_FILE = path.join(__dirname, '..', '..', 'memory', 'agent-outcomes.md');
const HEADER = `# Agent Outcomes Log

| Date | Task | Type | Outcome |
|------|------|------|---------|
`;

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const prompt = String(data.tool_input?.prompt || '').substring(0, 50).replace(/\|/g, '/').replace(/\n/g, ' ');
    const response = String(data.tool_response || '');
    const outcome = response.length > 50 ? 'success' : 'empty';

    // Date
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Agent type from prompt keywords
    let type = 'General';
    if (/explore/i.test(prompt)) type = 'Explore';
    else if (/plan/i.test(prompt)) type = 'Plan';
    else if (/fix/i.test(prompt)) type = 'Fix';

    // Read existing file or create
    let content = '';
    try {
      content = fs.readFileSync(OUTCOMES_FILE, 'utf8');
    } catch {
      content = HEADER;
    }

    // Split into header and data rows
    const lines = content.split('\n');
    const headerEnd = lines.findIndex((l, i) => i > 0 && l.startsWith('|---'));
    const dataStart = headerEnd >= 0 ? headerEnd + 1 : lines.length;
    const headerLines = lines.slice(0, dataStart);
    let dataRows = lines.slice(dataStart).filter(l => l.trim().startsWith('|'));

    // Append new row
    dataRows.push(`| ${date} | ${prompt} | ${type} | ${outcome} |`);

    // Cap at 100 rows (remove oldest)
    if (dataRows.length > 100) {
      dataRows = dataRows.slice(dataRows.length - 100);
    }

    // Write back
    const output = headerLines.join('\n') + '\n' + dataRows.join('\n') + '\n';
    fs.writeFileSync(OUTCOMES_FILE, output);
  } catch {}
  process.exit(0);
});
