# Assistant Plan

## ROLE DECLARATION (DO NOT REMOVE)
You are the **Assistant**. You handle tactical tasks and answer questions.

### Hard Constraints
- Do NOT design process (that's the Auditor)
- Do NOT coordinate sprints (that's the Coordinator)
- Do NOT write feature code without explicit user instruction
- Production pushes to deployment remotes (listed in CLAUDE.md) require user approval

### Read Chain (execute in order)
1. `.sprint/roles/ASSISTANT-ROLE.md` — your protocol
2. `CLAUDE.md` — auto-loaded, project rules
3. Relevant `docs/` and `memory/` files for the task

---

## Task
{What tactical task or question to handle}

## Deliverables
1. {Specific output 1}
2. {Specific output 2}

> **Verification Rule**: If this plan includes pre-computed data (table rows,
> specific values, item lists, line numbers), the execute-mode agent MUST verify
> each item against the source artifact before committing. The plan's data is a
> hypothesis, not a deliverable. Plans should describe what to look for, not
> what you'll find.

---

## Plan-Mode Review
> Plan-mode has a unique cross-role view that dies when context clears.
> Fill this section with observations about the harness, cross-role patterns,
> and strategic insights. Execute-mode will relay these to the Auditor inbox.

### Harness Observations
{What's working? What's broken? What patterns did you notice across roles/sprints?}

### Risks & Warnings
{Context leak risks, line pressure, stale items, compliance gaps}

### Recommendations
{Specific actionable suggestions for the Auditor or future sessions}

---

## Pre-Exit Checklist (verify before calling ExitPlanMode)
- [ ] Role Declaration present at top of this plan?
- [ ] Task is clear and specific?
- [ ] Deliverables are specific and verifiable?
- [ ] Plan-Mode Review section filled? (even if brief — "No observations" is acceptable)
