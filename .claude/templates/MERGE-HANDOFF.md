# Merge Handoff — Sprint {N}

> **Merger: Read `.sprint/roles/MERGER-ROLE.md` before proceeding. Do NOT read COORDINATOR-ROLE.md.**

> Written by: Execute Coordinator | Date: {YYYY-MM-DD}
> The Merger reads MERGER-ROLE.md first (permanent HOW), then this file (sprint-specific WHAT).
> This file contains sprint-specific data + anything the Coordinator wants to stress THIS sprint.

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

## Known Risks & Stress Points

{Cross-ownership edits, shared file conflicts, dependency ordering, anything the Coordinator wants the Merger to pay extra attention to THIS sprint — or "None identified."}

## Per-Worker Files (read DURING that worker's merge, not upfront)

| Worker | Report | SESSION-LOG |
|--------|--------|-------------|
| {X} | .sprint/sprint-{N}/WORKER-REPORT-{X}.md | .sprint/sprint-{N}/SESSION-LOG-{X}.md |

## Quality Gates

| Gate | Target |
|------|--------|
| Bundle size | < {N} KB |
| Build | 0 new errors |
| Ports | 0 listeners on 3000-3009 |

## COORDINATOR-LOG Location

.sprint/sprint-{N}/COORDINATOR-LOG.md — Execute Coordinator filled Timeline + Deviations.
Merger fills: Merge Results, Quality Gates, Worker Knowledge Summary.
Coordinator fills post-merge: Session Insights, Documentation Update Checklist, Token Usage.
