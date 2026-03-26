#!/usr/bin/env node
'use strict';

/**
 * unified-edit-check.cjs — PostToolUse hook (Write|Edit)
 *
 * Consolidated check that replaces 3 separate hooks:
 *   - found-not-fixed.cjs (TODO/FIXME/HACK detection)
 *   - no-any-guard.cjs (TypeScript `any` detection)
 *   - ios-ui-guard.cjs (iOS Safari anti-pattern detection)
 *
 * Produces ONE combined message instead of 3 separate warnings.
 * v10.6 — S56: Hook consolidation per user directive.
 */

const fs = require('fs');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = data.tool_input?.file_path || data.tool_input?.path || data.tool_response?.filePath || '';
    const newString = data.tool_input?.new_string || data.tool_input?.content || '';

    // Only check code files
    if (!/\.(ts|tsx|css|js|jsx)$/.test(filePath)) process.exit(0);

    const findings = [];

    // ━━━ CHECK 1: TODO/FIXME/HACK markers ━━━
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const markers = [];
      lines.forEach((line, i) => {
        const match = line.match(/\b(TODO|FIXME|HACK)\b/i);
        if (match) markers.push(`L${i + 1}: ${match[1]}`);
      });
      if (markers.length > 0) {
        findings.push(`Found ${markers.length} TODO/FIXME/HACK: ${markers.slice(0, 3).join(', ')}${markers.length > 3 ? '...' : ''}`);
      }
    } catch { /* file read error — skip */ }

    // ━━━ CHECK 2: TypeScript `any` type ━━━
    if (/\.(ts|tsx)$/.test(filePath) && !filePath.includes('.d.ts') && newString) {
      const anyPatterns = [
        /:\s*any\b/, /\bas\s+any\b/, /<any>/, /\bany\[\]/,
        /\bany\s*\|/, /\|\s*any\b/, /Record<[^,]+,\s*any>/,
      ];
      if (anyPatterns.some(p => p.test(newString))) {
        findings.push('Introduced `any` type — replace with proper type (unknown, interface, generic)');
      }
    }

    // ━━━ CHECK 3: iOS Safari anti-patterns (UI files only) ━━━
    if (/\.tsx$/.test(filePath) && (filePath.includes('/components/') || filePath.includes('/screens/') || filePath.includes('/pages/')) && newString) {
      const iosIssues = [];
      if (/100vh\b/.test(newString) && !/100dvh/.test(newString)) iosIssues.push('100vh → use 100dvh');
      if (/h-screen\b/.test(newString)) iosIssues.push('h-screen → use h-dvh');
      if (/100vw\b/.test(newString)) iosIssues.push('100vw → use 100%');
      if (/position:\s*fixed/.test(newString) && !newString.includes('safe-area')) iosIssues.push('fixed position needs safe-area-inset');
      if (iosIssues.length > 0) {
        findings.push(`iOS Safari: ${iosIssues.join('; ')}`);
      }
    }

    // ━━━ OUTPUT combined message ━━━
    if (findings.length > 0) {
      const result = {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `[Edit Check] ${findings.join(' | ')}`
        }
      };
      process.stdout.write(JSON.stringify(result));
    }

    process.exit(0);
  } catch {
    process.exit(0);
  }
});
