# Worker Plan — Worker {X} (Sprint {N})

## ROLE DECLARATION (DO NOT REMOVE)
You are **Worker {X}**. Implement within your primary file ownership. Never push to remotes.

### Hard Constraints
- Primary ownership files listed below — edit freely
- May edit outside ownership if logically necessary — document every cross-edit in SESSION-LOG (docs/ edits count as cross-ownership if the doc is another worker's primary)
- Never push to deployment remotes (listed in CLAUDE.md) or `origin main`
- Must complete ALL numbered tasks below (Gate 0 through Gate 2) — skipping any is a violation

---

## Primary Ownership (from SESSION-PROMPT)
{files — may edit outside with documentation}

## Acceptance Criteria
1. {Measurable outcome}
2. {Measurable outcome}
3. {Measurable outcome}
N. SESSION-LOG-{X}.md committed with all 6 sections + Review Block

---

## GATE 0: PRE-FLIGHT (BLOCKING — complete before any implementation)

> These are mandatory numbered tasks. Do not skip to implementation.

**Task 0.1**: Verify branch — run `git branch --show-current`. Expected: `sprint{N}-worker-{x}`. If WRONG: run `git worktree list`. If your worktree exists (e.g., `../worktree-{x}`), navigate there and re-check. If worktree doesn't exist, create it: `git worktree add ../worktree-{x} -b sprint{N}-worker-{x} main`. Only **STOP and tell the user** if creation fails.

**Task 0.2**: Verify working directory — run `pwd`. Expected path should contain your worktree (e.g., `worktree-{x}`). If WRONG: check `git worktree list` for the correct path and navigate there. Only **STOP and tell the user** if the worktree cannot be found or created.

**Task 0.3**: Scan inbox — read `.sprint/inbox/workers.md`. Extract any messages addressed to you. (30 seconds max — glance, don't deep-read.)

**Task 0.4**: Read memory files listed in SESSION-PROMPT:
- **REQUIRED** (task domain — must read): {e.g., `memory/payments.md` for payment work}
- **RECOMMENDED** (skip for pure refactoring/decomposition tasks): {e.g., `memory/design.md` for non-UI tasks}

---

## IMPLEMENTATION TASKS

{Coordinator fills tasks 1 through N here — the actual code work}

**Task 1**: {implementation task}

**Task 2**: {implementation task}

**Task N**: Build verification — `{{BUILD_COMMAND}}` (0 errors required)

---

## GATE 2: POST-FLIGHT (BLOCKING — do not signal done until ALL completed)

> These are mandatory numbered tasks. You are NOT done until every task below is checked off.

**Task N+1**: Write SESSION-LOG — create `.sprint/sprint-{N}/SESSION-LOG-{X}.md` using the **exact skeleton below**. Then `git add` and `git commit` it IMMEDIATELY (crash protection).

```markdown
# SESSION-LOG-{X} — Worker {X} (Sprint {N})

**Worker**: {X} — {brief task description}
**Branch**: sprint{N}-worker-{x}
**Date**: {YYYY-MM-DD}

---

## Completed
{What was built/changed/decided. File names, function names, behavior changes.}

## Verified
{What was tested and how. Commands, screenshots, manual checks.}

## Issues Found
{Bugs, regressions, concerns. "None" if clean.}

## Lessons Learned
{Patterns, near-misses, surprises. This knowledge dies with your context window.}

## Cross-Ownership Edits
{Files edited outside primary ownership. "None" if you stayed within boundaries.}
{For each: File (Owner), Change, Reason, Merge risk LOW/MEDIUM/HIGH}

## Review Block
- **What slowed me down**: {one line}
- **Harness steps I skipped**: {which and why — or "none"}
- **Bugs encountered**: {BUG-ID or describe new, or "none"}
- **One thing I'd change**: {one concrete suggestion}
- **Process compliance**: {branch correct? committed? read prior decisions?}
- **Session efficiency**: {Was this session token-efficient? What approach caused unnecessary reads/writes? What would you do differently? Honest opinion.}

## Plan-Mode Observations
{Copy from this plan's Plan-Mode Review section. If plan-mode had no observations, write "None."}

## Core Principles Grade
> Skip this section if Review System is DORMANT (check memory/sprint-process.md).
> Grade your own session honestly. A = fully achieved, B = mostly achieved with friction, C = significantly compromised.

| Principle | Grade | Reason |
|-----------|-------|--------|
| Productivity | {A/B/C} | {One line: Did you ship more than expected, less, or about right?} |
| Efficiency | {A/B/C} | {One line: Did you repeat reads, re-explain things, or waste effort?} |
| Accuracy | {A/B/C} | {One line: Did you build on any wrong assumptions? Cross-check results?} |
| Token Efficiency | {A/B/C} | {One line: Could you have done this with fewer reads/writes? What was elegant, what was wasteful?} |
```

**Task N+1.5 (OPTIONAL)**: Run code simplification — use `/simplify` on your primary ownership files. Accept improvements that don't change behavior. Reject anything that adds complexity. *(Coordinator may remove the OPTIONAL tag to make this mandatory for specific workers.)*

**Task N+2**: Update docs — update relevant `docs/` files (ARCHITECTURE.md, CURRENT.md, PERFORMANCE.md). If no changes apply, note "No docs updates needed" in SESSION-LOG.
- If **Issues Found** in your SESSION-LOG has entries → also update `docs/BUGS.md` (add new bug or increment Occurrences for existing).

**Task N+3**: Write WORKER-REPORT — create `.sprint/sprint-{N}/WORKER-REPORT-{X}.md` using the **exact skeleton below**. Then `git add` and `git commit` it (alongside SESSION-LOG if not already committed).

```markdown
# Worker Report — Worker {X} (Sprint {N})

> Branch: sprint{N}-worker-{x} | Date: {YYYY-MM-DD}
> **From**: Worker {X} | **To**: Coordinator (merge) + Auditor (retro)

## Delivery Summary

| # | Acceptance Criterion | Status | Notes |
|---|---------------------|--------|-------|
| 1 | {criterion} | DONE/PARTIAL/MISSED | {one line} |

## Merge Notes (for Coordinator)

- **Cross-ownership edits**: {list or "None"}
- **Conflict risk**: LOW/MED/HIGH — {one line}
- **Build verified**: Yes — {command + result}
- **New dependencies added**: {list or "None"}

## Process Compliance (for Auditor)

- **Branch correct?** Yes/No
- **Read prior decisions?** Yes/No/Partial
- **Harness steps skipped**: {list or "none"}
- **SESSION-LOG committed?** Yes/No

## Observations (for Auditor)

{Harness feedback, process observations, improvement suggestions. 3-5 lines max.}
```

**Task N+4**: Kill dev servers — if you started any, verify port cleanup.

**Task N+5**: Commit all remaining work — `git add {your-files} && git commit -m "{message}"`

**Task N+6**: Signal done — "Branch committed, ready for Coordinator to merge."

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

---

## Pre-Exit Checklist (plan-mode agent verifies before approval)
- [ ] Role Declaration present?
- [ ] Primary Ownership from SESSION-PROMPT?
- [ ] Acceptance Criteria measurable? (last AC = SESSION-LOG committed)
- [ ] Gate 0 tasks filled with correct branch, worktree, memory files?
- [ ] Gate 2 tasks include SESSION-LOG skeleton with all 6 sections + Review Block?
- [ ] Plan-Mode Review section filled? (even if brief — "No observations" is acceptable)
