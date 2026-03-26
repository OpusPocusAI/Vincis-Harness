---
name: architecture-check
description: Architecture health check — bundle size, large files, dead code, dependency freshness
user_invocable: true
---

# /architecture-check — Architecture Health

You are running an architecture health check on the codebase.

## Steps

### 1. Bundle Size

```bash
cd FE && npm run build 2>&1 | tail -20
```

Extract total bundle size. Compare against 500KB target. Report delta from target.

### 2. Large File Detection

Find all source files > 500 lines:

```bash
find FE/src BE/src Origin/NewBE/src -name '*.ts' -o -name '*.tsx' | xargs wc -l | sort -rn | head -20
```

Flag files > 500 lines with the specific concern (component too large, needs decomposition, etc.).

### 3. Dead Export Detection

For the top 10 largest files, check each exported function/component:
- Use Grep to find all `export` declarations in the file
- For each export, Grep the entire codebase for imports of that name
- If zero imports found: flag as potentially dead code

### 4. Dependency Freshness

```bash
cd FE && npx npm-check-updates 2>/dev/null | head -30
cd BE && npx npm-check-updates 2>/dev/null | head -30
```

Flag major version updates available. Note security-relevant updates.

### 5. Circular Import Detection

For each service directory (FE/src, BE/src, Origin/NewBE/src):
- Trace import chains from entry points
- Flag any file that imports (directly or transitively) its own exports

### 6. TypeScript Health

```bash
cd FE && npx tsc --noEmit 2>&1 | grep "error TS" | wc -l
cd BE && npx tsc --noEmit 2>&1 | grep "error TS" | wc -l
```

Report error counts. Compare against known baselines (FE: ~17, BE: ~0).

### 7. Output Report

```markdown
## Architecture Health Report — {date}

### Summary
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| FE Bundle | X KB | <500 KB | PASS/WARN/FAIL |
| Files >500 lines | X | 0 | PASS/WARN |
| Dead exports | X | 0 | WARN |
| Major updates available | X | 0 | INFO |
| TypeScript errors (FE) | X | ~17 baseline | PASS/WARN |
| TypeScript errors (BE) | X | 0 | PASS/WARN |

### Large Files (>500 lines)
| File | Lines | Suggestion |
|------|-------|-----------|

### Dead Exports
| File | Export | Suggestion |
|------|--------|-----------|

### Dependency Updates Available
| Package | Current | Latest | Type |
|---------|---------|--------|------|

### Recommendations
1. {action item}
```

### 8. Save Report

Save to `memory/research/architecture-check-{date}.md`.
