---
name: sprint-metrics
description: Collect quality gate metrics — bundle size, build status, port listeners, TypeScript errors. Use during or after merges to fill quality gate tables.
allowed-tools: Bash, Read
---

# Sprint Metrics — Quality Gate Collector

You are collecting quality gate metrics for the Coordinator to fill into `.sprint/sprint-{N}/COORDINATOR-LOG.md`.
This saves ~5-8 minutes of manual metric collection per merge.

## Step 1: Build & Bundle

Run: `{{BUILD_COMMAND}}`

From the output, extract:
- **Build result**: success or failure (and error count if failed)
- **Total bundle size**: the size in KB shown in the build output
- **Gzip size**: the compressed size shown in the build output
- **Largest chunks**: list the top 3 largest chunks by size

Note: Check your project's CLAUDE.md for any known pre-existing errors that should be
excluded from the error count.

## Step 2: Port Listeners

Check for active listeners on your project's port range:

```bash
# Linux/macOS:
lsof -i :{{PORT_RANGE_START}}-{{PORT_RANGE_END}} 2>/dev/null || echo "All clear"

# Windows:
netstat -ano | findstr ":{{PORT_RANGE_START}}" | findstr "LISTENING" 2>nul || echo "All clear"
```

Extract:
- **Port listener count**: number of active listeners
- **Details**: which ports and PIDs, if any

## Step 3: Dev Server Check

Check for zombie dev server processes:

```bash
# Linux/macOS:
pgrep -la node 2>/dev/null || echo "No node processes found"

# Windows:
tasklist | findstr -i "node" 2>nul || echo "No node processes found"
```

Extract:
- **Node processes**: count of running node processes
- **Note**: if any are running, they might be zombie dev servers from workers

## Step 4: Output the Metrics Table

Format the output matching COORDINATOR-LOG.md quality gate format:

```
## Quality Gate Metrics — Collected {today's date}

| Gate | Target | Actual | Pass? |
|------|--------|--------|-------|
| Bundle size | < {N} KB | {actual} KB (gzip: {actual} KB) | {Yes/No} |
| Build | 0 errors | {actual} errors | {Yes/No} |
| Port cleanup | 0 listeners | {actual} listeners | {Yes/No} |
| Dev servers killed | 0 node processes | {actual} processes | {Yes/No} |

### Bundle Breakdown (top 3 chunks)
| Chunk | Size |
|-------|------|
| {name} | {size} |

### Notes
{Any warnings — zombie processes, failed build, large bundle, etc.}
```

**Paste-ready**: The table above can be copied directly into COORDINATOR-LOG.md.

## Rules

- The bundle target depends on the sprint — scan `.sprint/sprint-*/CONTRACT.md` (highest
  number) to get the target. If no contract exists, check CLAUDE.md for a bundle target.
- Do NOT modify any files. This is a data collection skill.
- If the build fails, still report the other metrics — don't stop at the first failure.
