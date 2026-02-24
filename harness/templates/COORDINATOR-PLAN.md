# Coordinator Plan — Sprint {N}

## ROLE DECLARATION (DO NOT REMOVE)
You are the **Coordinator**. Your execution mode (below) determines whether you delegate, implement directly, or both.

### Hard Constraints
- Mode is LOCKED once this plan is approved — no switching mid-session
- In Delegation mode: do NOT edit .tsx, .ts, .css, or any feature/infrastructure code
- In Direct mode: implement within the scope specified below
- In Hybrid mode: implement ONLY the small tasks listed under "Coordinator Direct Tasks"
- Plans bypass the harness — content goes INTO SESSION-PROMPTs, never directly to workers

### Read Chain (execute in order)
1. `.sprint/roles/COORDINATOR-ROLE.md`
2. `docs/CURRENT.md` — **MANDATORY** for expansion
3. `NEXT-SESSION-KICKSTART-COORDINATOR.md`
4. `memory/user-decisions.md` — **MANDATORY** decision register (all modes, ~200 tokens)
5. (Delegation/Hybrid only) `memory/MEMORY.md`
6. (Delegation/Hybrid only) `.sprint/inbox/coordinator.md`

---

## Execution Mode

> Select ONE. Justify the choice. Mode is locked after user approval.

- [ ] **Direct** — Coordinator implements on main. No workers.
- [ ] **Delegation** — Full sprint ceremony. Coordinator writes ZERO code.
- [ ] **Hybrid** — Workers handle big tasks, Coordinator handles small tasks on main.

**Mode justification**: {Why this mode? Why not the others?}

---

## Context Budget Estimate

| Role | Est. source lines to read | Est. files to edit | 1.5x buffer | Budget risk |
|------|--------------------------|-------------------|-------------|-------------|
| Coordinator | {~N} | {~N} | {~N * 1.5} | {Low/Med/High} |
| Worker A (if any) | {~N} | {~N} | {~N * 1.5} | {Low/Med/High} |
| Worker B (if any) | {~N} | {~N} | {~N * 1.5} | {Low/Med/High} |

**Hard cap: 2000 source lines per worker.** If a worker needs more, split into 2 workers.

**Context budget formula**:
```
Estimated context = (lines_to_read x 0.5 tokens/line) + template_overhead (2000 tokens) + code_writing (1000-3000 tokens)
Target: < 50% of context window
If estimated > 50%: MUST SPLIT into multiple workers
```

**Budget risk thresholds**:
- Low: <1500 lines to read
- Medium: 1500-2000 lines to read — justify why not splitting
- **HIGH: >2000 lines — MUST SPLIT. No exceptions.**

---

## Session Goal
{One sentence. Measurable outcome.}

## Scope
### User's Request
{What the user asked for}

### Expansion Check (MANDATORY — all modes)
- [ ] Read CURRENT.md Next Up
- [ ] **Read Deferred Items Ledger** in memory/SPRINT-BOARD.md
- [ ] Identified 2+ additional items from backlog
- [ ] Addressed all STALE deferred items (include or drop with justification)
- [ ] Presented expanded scope to user

---

## Direct Mode Tasks (if Direct or Hybrid)

| # | Task | Files to edit | Est. lines to read |
|---|------|--------------|-------------------|
| 1 | {task} | {files} | {~N} |

## Workers (if Delegation or Hybrid)

| Worker | Type | Focus | Primary Verb | Est. Lines | Budget Risk |
|--------|------|-------|-------------|-----------|-------------|
| A | {type} | {focus} | {verb} | {~N} | {risk} |

## Primary Ownership (if Delegation or Hybrid)
{Worker -> files. Primary ownership — workers may edit outside with documentation in SESSION-LOG Cross-Ownership Edits.}

## Merge Order (if Delegation or Hybrid)
{Order + rationale}

---

## Merge Checklist (Delegation/Hybrid — embedded for execute-mode token efficiency)

For each branch, in declared merge order:
1. Worker committed? (`git log` shows new commits)
2. SESSION-LOG exists with all 6 sections (Completed, Verified, Issues Found, Lessons Learned, Cross-Ownership Edits, Review Block)
3. No unintended files changed (`git diff --stat main..branch`)
4. `git checkout main && git merge <branch>`
5. `{{BUILD_COMMAND}}` — verify build
6. Run `/sprint-metrics`
7. Rebase remaining branches
8. Log results in COORDINATOR-LOG
9. Check each SESSION-LOG's `## Plan-Mode Observations` — relay significant items to `.sprint/inbox/auditor.md`

---

## Session End Tasks (MANDATORY — all modes)
> Execute-mode MUST complete these after all implementation tasks.

1. Create/update `.sprint/sprint-{N}/COORDINATOR-LOG.md` (Direct: create; Delegation/Hybrid: update)
2. Run Completion Self-Audit: list files modified, compare vs plan, note gaps
3. Session Efficiency Review in COORDINATOR-LOG Session Insights
4. Context knowledge check: "What exists only in my context?"
5. Inter-role messages: check if Auditor/Assistant need to know anything → edit `.sprint/inbox/{role}.md`
6. Relay Plan-Mode Review to `.sprint/inbox/auditor.md` (if section was filled)
7. Update `NEXT-SESSION-KICKSTART-COORDINATOR.md`
8. (Delegation/Hybrid only) Write `.sprint/sprint-{N}/MERGE-HANDOFF.md` (from template in `.claude/templates/MERGE-HANDOFF.md`)
9. (Delegation/Hybrid only) Commit MERGE-HANDOFF.md
10. (Delegation/Hybrid only) Tell user: "Run `/clear`, then paste: `You are the Merge Coordinator. Read CLAUDE.md and .sprint/roles/COORDINATOR-ROLE.md, then find and read the MERGE-HANDOFF.md in the highest-numbered sprint directory under .sprint/.`"

---

## Plan-Mode Review
> Plan-mode has a unique cross-role view that dies when context clears.
> Fill this section with observations about the harness, cross-role patterns,
> and strategic insights. Execute-mode will relay these to the Auditor inbox.

### Context & Token Usage (plan-mode self-assessment)
- **Files read during planning**: {list every file read in this plan-mode session}
- **Files that were essential**: {which files actually informed the plan}
- **Files loaded but unused**: {which files from the read chain added no value — candidates for removal}
- **Estimated context at plan completion**: {low/medium/high — rough sense of how full the window is}
- **Read chain efficiency recommendation**: {what could be skipped or lazy-loaded for this type of task?}

### Harness Observations
{What's working? What's broken? What patterns did you notice across roles/sprints?}

### Risks & Warnings
{Context leak risks, line pressure, stale items, compliance gaps}

### Recommendations
{Specific actionable suggestions for the Auditor or future sessions}

> When this plan contains a Plan-Mode Review section, relay its contents to
> `.sprint/inbox/auditor.md` as part of the session-end protocol.

---

## Pre-Exit Checklist
- [ ] Role Declaration present?
- [ ] Execution mode selected and justified?
- [ ] Context budget estimate filled with 1.5x buffer?
- [ ] CURRENT.md consulted for expansion?
- [ ] Deferred Items Ledger reviewed?
- [ ] (Delegation/Hybrid) Workers scoped at 50-60% budget each?
- [ ] (Delegation/Hybrid) Merge order has rationale?
- [ ] (Direct/Hybrid) Direct tasks justified as small enough?
- [ ] Plan-Mode Review section filled? (even if brief — "No observations" is acceptable)
