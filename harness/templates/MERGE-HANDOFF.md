# Merge Handoff — Sprint {N}

> Written by: Execute Coordinator | Date: {YYYY-MM-DD}
> Read this file FIRST when activating the Merge Coordinator.

## Sprint Summary

| Field | Value |
|-------|-------|
| Sprint | {N} |
| Workers | {count} |
| Mode | Delegation / Hybrid |
| Bundle target | {N} KB |

## Merge Order (LOCKED)

| # | Branch | Worker | Focus | Rationale | Status |
|---|--------|--------|-------|-----------|--------|
| 1 | sprint{N}-worker-{x} | {X} | {verb} | {why merge first} | done/pending |
| 2 | sprint{N}-worker-{y} | {Y} | {verb} | {why second} | done/pending |

## File Ownership Map

### Worker {X}
{files — one per line}

### Worker {Y}
{files}

### Shared
{files or "None"}

## Known Risks

{Cross-ownership edits, shared file conflicts, dependency ordering — or "None identified."}

## Per-Worker Files (read DURING that worker's merge, not upfront)

| Worker | Report | SESSION-LOG |
|--------|--------|-------------|
| {X} | .sprint/sprint-{N}/WORKER-REPORT-{X}.md | .sprint/sprint-{N}/SESSION-LOG-{X}.md |

## Quality Gates

| Gate | Target |
|------|--------|
| Bundle size | < {N} KB |
| Build | 0 new errors |
| Ports | 0 listeners on {{PORT_RANGE_START}}-{{PORT_RANGE_END}} |

## COORDINATOR-LOG Location

.sprint/sprint-{N}/COORDINATOR-LOG.md — Execute Coordinator filled Timeline + Deviations.
Merge Coordinator fills: Merge Results, Quality Gates, Worker Knowledge Summary, Session Insights, Documentation Update Checklist.

## Post-Merge Checklist

1. Fill Merge Results table in COORDINATOR-LOG
2. Run /sprint-metrics → fill Quality Gate Results
3. Fill Worker Knowledge Summary (from SESSION-LOGs Lessons + Review Block)
4. Fill Documentation Update Checklist in COORDINATOR-LOG
5. Update relevant docs/ files
6. Update NEXT-SESSION-KICKSTART-COORDINATOR.md
7. Fill one row in memory/harness-health.md
8. Relay Plan-Mode Review to .sprint/inbox/auditor.md (if workers had observations)
9. Ask user: "Ready to deploy?" → /sprint-deploy
10. Clean up worktrees + delete merged branches
