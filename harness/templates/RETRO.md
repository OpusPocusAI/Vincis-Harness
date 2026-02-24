# Sprint {N} Retrospective

> Written by: Auditor | Date: {YYYY-MM-DD}
> Sprint dates: {start} to {end}
> Sprint goal: {copied from .sprint/sprint-{N}/CONTRACT.md}

---

## Contract Compliance

**Goal achieved?** {Yes / No / Partial — explain}

**Coordinator boundaries respected?** {Yes / No — if no, list violations}

**Merge order followed?** {Yes / No — if no, explain deviation and whether it was approved}

---

## What Worked

| Pattern | Evidence | Promote to CLAUDE.md? |
|---------|---------|----------------------|
| {e.g., "Sprint Board seeded before workers"} | {e.g., "Zero confusion about task ownership"} | {Yes / No — if Yes, draft the rule} |
| {pattern} | {evidence} | {Yes/No} |

---

## What Failed

| Failure | Root Cause | Recurrence Count | Fix |
|---------|-----------|-----------------|-----|
| {e.g., "Zombie dev servers on ports"} | {e.g., "Workers didn't follow cleanup checklist"} | {e.g., "2nd time (also Sprint 5)"} | {e.g., "Add port check to merge checklist — Coordinator runs before merge"} |
| {failure} | {root cause} | {count} | {fix} |

---

## Process Changes

Specific changes to make based on this sprint's lessons:

| Change | Target file | Type |
|--------|------------|------|
| {e.g., "Add port cleanup check to merge checklist"} | `CLAUDE.md` | Rule addition |
| {e.g., "Require (NEW) tag in file ownership map"} | `.claude/templates/SPRINT-CONTRACT.md` | Template update |
| {change} | {file} | {type} |

---

## Metrics

**Note**: For the first retrospective, set Sprint {N-1} column to "N/A (baseline)". Estimated values from MEMORY.md sprint learnings may be used.

| Metric | Sprint {N-1} | Sprint {N} | Trend |
|--------|-------------|------------|-------|
| Merge conflicts | {prev} | {current} | {up/down/same} |
| Zombie dev servers | {prev} | {current} | {up/down/same} |
| Build failures during merge | {prev} | {current} | {up/down/same} |
| Docs updates missed | {prev} | {current} | {up/down/same} |
| Coordinator scope violations | {prev} | {current} | {up/down/same} |
| Blockers unresolved at sprint end | {prev} | {current} | {up/down/same} |

---

## Core Principles Assessment
> Skip this section if Review System is DORMANT (check memory/sprint-process.md).
> Synthesize grades from Workers + Coordinator. Auditor provides cross-check and final grade.

| Principle | Worker Avg | Coordinator | Auditor Cross-Check | Final |
|-----------|-----------|-------------|--------------------:|-------|
| Productivity | {avg of worker grades} | {from COORDINATOR-LOG} | {Auditor's independent assessment} | {A/B/C} |
| Efficiency | {avg} | {grade} | {assessment} | {A/B/C} |
| Accuracy | {avg} | {grade} | {assessment} | {A/B/C} |
| Token Efficiency | {avg} | {grade} | {assessment} | {A/B/C} |

**Commentary**: {2-3 lines. Where do the grades diverge between roles? What does the divergence reveal? What's the one thing to improve for next sprint?}

**Trend** (fill from prior retro): {Are grades improving, stable, or declining? Which principle needs most attention?}

---

## Memory Maintenance

{Review all memory/ files. Apply retention rules from CLAUDE.md.}

| File | Current status | Action | Reason |
|------|---------------|--------|--------|
| `memory/{file}` | {Active/Archive} | {Keep/Archive/Propose delete} | {e.g., "All lessons captured in retro, coordination details no longer needed"} |

MEMORY.md line count: {N}/200

---

## Carry-Forward Items

{Anything that needs to be addressed in the next sprint or added to NEXT-SESSION-KICKSTART-COORDINATOR.md}

| Item | Priority | Destination |
|------|---------|------------|
| {e.g., "Bundle still over target"} | {High/Med/Low} | {e.g., "NEXT-SESSION-KICKSTART-COORDINATOR.md Priority 2"} |
| {item} | {priority} | {destination} |
