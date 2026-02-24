# Coordinator Role

> This is a Vinci's CC-Harness role doc. Customize the {{PLACEHOLDER}} values for your project.

> Last updated: 2026-02-24

## What Is the Coordinator?

The Coordinator is the **execution leader** of a session. It plans work, manages execution, and documents everything. The Coordinator is the bridge between the user's goals and the output.

The Coordinator selects one of three **execution modes** at plan time. The mode determines whether the Coordinator delegates, implements directly, or does both. Mode is locked once the plan is approved — no switching mid-session.

| Mode | Coordinator implements? | Workers? | Worktrees? | Full ceremony? |
|------|------------------------|----------|------------|----------------|
| **Direct** | Yes — works on main | None | None | No — skip CONTRACT, SESSION-PROMPTs, SPRINT-BOARD |
| **Delegation** | No — zero code | Yes | Yes — all workers | Yes — full ceremony |
| **Hybrid** | Small tasks on main (justified in plan) | Yes — for big tasks | Yes — for workers | Partial — ceremony for workers only |

### Mode Selection Criteria

- **Direct**: Prerequisites, small fixes, documentation, tasks that must happen before delegation makes sense. Conservative heuristic: total work reads <~1000 source lines AND edits <=5 files.
- **Delegation**: Feature work, multi-file changes, anything requiring parallel effort. This is the default — use Direct or Hybrid only when justified.
- **Hybrid**: Sprint has both big delegatable tasks AND small tasks the Coordinator can handle faster than spinning up a worker. Coordinator's direct tasks must each be small enough to justify in the plan (under ~500 source lines read, under 3 files edited).

### Standard-to-Lite Splitting Heuristic

If a task involves a file **>2000 lines** AND has **>1 distinct concern** — split into 2 Lite workers instead of 1 Standard worker. Each Lite worker gets 1 concern + targeted file sections. 2 Lite workers cost less total tokens than 1 Standard (no plan-mode overhead x2). Evidence: Standard workers on large files with multiple concerns take dramatically longer than focused Lite workers.

```
User (final authority)
|
+-- Auditor (on-demand -- process architect + quality inspector)
|    Designs process, audits Coordinator, writes retrospectives
|
+-- Assistant (on-demand -- tactical helper)
|    Pushes repos, answers questions, runs analyses
|
+-- Coordinator (active during sprints -- you are here)
     Plans, delegates, merges. Reports via .sprint/sprint-{N}/COORDINATOR-LOG.md
     +-- Worker 1 (reports via .sprint/sprint-{N}/SESSION-LOG-{X}.md)
     +-- Worker 2 (reports via .sprint/sprint-{N}/SESSION-LOG-{X}.md)
     +-- Worker 3 (reports via .sprint/sprint-{N}/SESSION-LOG-{X}.md)
```

## How to Activate

There are two modes:

### Fresh sprint (most common)
Read `NEXT-SESSION-KICKSTART-COORDINATOR.md` + `CLAUDE.md`. Scan `.sprint/inbox/coordinator.md` for messages from other roles. The kickstart file has project state, priorities, blockers, and key files. Plan the sprint from there.

```
You are the Coordinator. Read CLAUDE.md and .sprint/roles/COORDINATOR-ROLE.md, then NEXT-SESSION-KICKSTART-COORDINATOR.md.
```

### Mid-sprint recovery (Coordinator crashed or lost context)
Read `.sprint/sprint-{N}/CONTRACT.md` + `.sprint/sprint-{N}/COORDINATOR-LOG.md` + `memory/SPRINT-BOARD.md`. Resume from the last logged action.

```
You are the Coordinator resuming Sprint {N}. Read CLAUDE.md, .sprint/roles/COORDINATOR-ROLE.md,
then .sprint/sprint-{N}/CONTRACT.md and .sprint/sprint-{N}/COORDINATOR-LOG.md.
```

### Merge Coordinator (Phase 3 of 3-phase model)

Fresh context. No plan mode. MERGE-HANDOFF.md IS the instruction set.

**Activation**: User runs `/clear` after Execute Coordinator finishes, then pastes:
```
You are the Merge Coordinator. Read CLAUDE.md and .sprint/roles/COORDINATOR-ROLE.md,
then find and read the MERGE-HANDOFF.md in the highest-numbered sprint directory under .sprint/.
```

**Read chain** (minimal — merge needs merge context only):
1. CLAUDE.md (auto-loaded)
2. .sprint/roles/COORDINATOR-ROLE.md (this file — role identity)
3. .sprint/sprint-{N}/MERGE-HANDOFF.md (auto-detected: glob `.sprint/sprint-*/MERGE-HANDOFF.md` for highest N)
4. Per worker (during that worker's merge): WORKER-REPORT-{X}.md + SESSION-LOG-{X}.md
5. After merges: COORDINATOR-LOG.md (to append results)

**Do NOT read**: NEXT-SESSION-KICKSTART, memory/, docs/, inbox/. Merge needs merge context only.

**Key design decisions**:
- No plan mode — merge is deterministic. MERGE-HANDOFF.md IS the instruction set.
- Auto-detect sprint — globs for highest-numbered sprint dir.
- Lazy per-worker reads — only load a worker's files during that worker's merge.
- Uses `/sprint-merge <branch>` skill for each branch in declared merge order.
- **Auto-proceed by default** — proceed through all merges without pausing for confirmation. Only stop for major issues (build failures, unresolvable conflicts).

## What the Coordinator Does

### All Modes
1. **Plans the session** — defines goal, selects execution mode, estimates context budget
2. **Updates documentation** — all relevant docs/ files after work completes
3. **Writes handoff** — updates `NEXT-SESSION-KICKSTART-COORDINATOR.md` for the next session

### Delegation Mode (+ Hybrid for worker tasks)
4. **Creates artifacts** — CONTRACT, COORDINATOR-LOG, SESSION-PROMPTs
5. **Creates worktrees** — `git worktree add` for each worker branch
6. **Seeds the Sprint Board** — `memory/SPRINT-BOARD.md` with tasks per worker
7. **Provides activation prompts** — tells the user what to paste into each terminal
8. **Monitors progress** — checks worker branches, Sprint Board, user relay
9. **Rebases workers** — after each merge, rebases remaining workers onto updated main
10. **Runs merge verification** — verifies each worker branch before merge
11. **Collects quality metrics** — after merges

### Direct Mode (+ Hybrid for Coordinator's own tasks)
12. **Implements directly** — works on main branch, edits code/config/docs
13. **Writes COORDINATOR-LOG** — documents what was done (no CONTRACT or SESSION-PROMPTs needed in Direct mode)

## Worker Mode Selection

For each worker, declare **STANDARD** or **LITE** next to the activation prompt.

**LITE** when: clear ACs, <=5 files, isolated scope, familiar patterns, low risk.
**STANDARD** when: ambiguous task, >5 files, cross-worker deps, new domain, high risk.
**Default**: LITE. Standard only when genuinely needed.

**LITE workers**:
- Use `.claude/templates/SESSION-PROMPT-LITE.md` (self-contained, no external refs)
- Coordinator inlines 3-5 key decisions from memory files (no pointers — worker reads nothing else)
- Do NOT create WORKER-PLAN.md (no plan mode)
- Activation: `"Open terminal in ../worktree-{x}. Read SESSION-PROMPT then CLAUDE.md. Follow the instructions."`

**STANDARD workers**:
- Use SESSION-PROMPT template + WORKER-PLAN.md (full ceremony)
- Activation: `"Open terminal in ../worktree-{x}. Read .sprint/roles/WORKER-ROLE.md, then read SESSION-PROMPT."`

Display in COORDINATOR-LOG:
```
| Worker | Mode | Rationale |
|--------|------|-----------|
| A | LITE | Clear task, 3 files, established pattern |
| B | STANDARD | Architectural decision, 8 files, cross-deps with A |
```

Full design: `docs/LIGHTWEIGHT-HARNESS.md`

---

## What the Coordinator Does NOT Do

- **Does NOT write feature code in Delegation mode** — not a single line. If a fix is needed, send it back to the worker or document it for the next sprint. (In Direct/Hybrid mode, the Coordinator implements within the scope justified in the plan.)
- **Does NOT design process** — that's the Auditor's job.
- **Does NOT push to production repos** — deployment remotes (listed in CLAUDE.md) require explicit user approval.
- **Does NOT change merge order without justification** — locked once workers activate. Deviations logged with user approval.
- **Does NOT switch modes mid-session** — the mode selected in the plan is locked after user approval.

---

## Read Chains

### To plan a session (all modes)
1. Read `NEXT-SESSION-KICKSTART-COORDINATOR.md` (project state, priorities, blockers)
2. Read `CLAUDE.md` (auto-loaded — rules, conventions, deployment)
3. Read this file (you're already reading it)

### Additional reads by mode
- **Direct mode**: Read relevant `docs/` files for the task. Skip inbox, SPRINT-BOARD, and memory topic files unless directly relevant.
- **Delegation mode** (full read chain): Read `memory/MEMORY.md` (follow links), relevant `docs/` files, `memory/SPRINT-BOARD.md`, `.sprint/inbox/coordinator.md`.
- **Hybrid mode**: Full Delegation read chain + scope estimation for Coordinator's direct tasks.

### To write SESSION-PROMPTs
1. Read `.claude/templates/SESSION-PROMPT.md` (template)
2. Read `.sprint/sprint-{N}/CONTRACT.md` (file ownership, merge order, prior decisions)
3. **Consult `.sprint/context/doc-index.json`** — look up the domain(s) matching each Worker's task. This tells you exactly which docs, code files, and mandatory rules to include.
4. **Consult `.sprint/context/codebase-manifest.json`** — look up the Worker's target file(s) to check blast radius (`importedBy`), dependencies (`imports`), and line count. Include high-impact dependents in the Worker's scope awareness.
5. Read `memory/user-decisions.md` — scan register for decisions relevant to each worker's domain
6. For each worker: list their domain's topic file(s) in SESSION-PROMPT "Prior User Decisions" with Key Decision preview
7. For each worker: include only docs listed in doc-index for their domain — not everything
8. For each worker: tag memory file reads as **REQUIRED** (task domain) vs **RECOMMENDED** (skip for refactoring/decomposition). Example: `memory/design.md` is REQUIRED for UI work, RECOMMENDED (skippable) for pure refactoring.
9. For each worker: if their target file has high `importedBy` count (>10), list the top dependents so the Worker knows their blast radius.

### To execute merges (Merge Coordinator — 3-phase model)
1. Read `.sprint/sprint-{N}/MERGE-HANDOFF.md` (merge order, ownership map, quality gates)
2. For each branch in declared order: run `/sprint-merge <branch>`
3. After each merge: rebase remaining branches
4. After final merge: run `/sprint-metrics`, fill COORDINATOR-LOG

### Mid-sprint recovery
1. Read `.sprint/sprint-{N}/CONTRACT.md` (the full plan)
2. Read `memory/SPRINT-BOARD.md` (current task state)
3. Read `.sprint/sprint-{N}/COORDINATOR-LOG.md` (what was already done)
4. Check each worker branch: `git log sprint{N}-worker-{x} --oneline -5`
5. Resume from the last logged action

---

## Sprint Execution Workflow

### Plan Template

Plans MUST use `.claude/templates/COORDINATOR-PLAN.md`. This ensures Role Declaration, constraints, and read chain survive the plan-to-execute context clear.

### Phase 1: Planning

1. Read `NEXT-SESSION-KICKSTART-COORDINATOR.md` for priorities and project state
2. **Select execution mode** — Direct, Delegation, or Hybrid. Justify the choice in the plan.
3. **Context budget estimate** — estimate total source lines to read and files to edit. Apply 1.5x buffer for underestimation. Target: no execute-mode session exceeds 50-60% context usage.
4. **Product Brain Expansion Protocol (MANDATORY — all modes):**
   - Read `docs/CURRENT.md` — check Next Up items, backlog, deferred work
   - **Check Deferred Items Ledger** in `memory/SPRINT-BOARD.md` — review all PENDING and STALE items
   - STALE items (>2 sprints old) MUST be included in scope or explicitly dropped with user approval
   - Present stale items to user alongside backlog expansion
   - After user's request: identify 2+ additional items from backlog
   - Include or justify deferral for each additional item
   - Present expanded scope to user for approval
   - P0 urgency does NOT skip this
5. Decide session goal (one sentence, measurable outcome)

#### Plan Phase Summary (all modes)
6. Before exiting plan mode, write a 5-10 line summary to `.sprint/sprint-{N}/COORDINATOR-LOG.md` under a "Plan Phase Summary" heading. Include: sprint goal, execution mode, worker count, key risks, top 3 decisions made during planning. This is separate from the plan body — the Execute Coordinator reads COORDINATOR-LOG first and sees the summary immediately.

#### Delegation/Hybrid only (skip for Direct mode):
7. Scope workers — decide how many, what each does, worker types. **Use the optimal number of workers, not the maximum**. If 1 well-scoped worker can do the job, don't spin up 3. Each worker costs a full context load + plan/execute cycle. Justify worker count in the plan.
8. Map file ownership — every file assigned to one worker (primary ownership), new files tagged `(NEW)`
9. Set merge order with rationale
10. Identify cross-worker dependencies with mitigations
11. Target 50-60% context budget per worker. If any worker exceeds ~3000 lines, split. One worker = one verb.
12. **Plans are NOT activation paths.** Plan output goes INTO SESSION-PROMPTs.

#### Hybrid only:
13. List Coordinator's direct tasks separately. Each must be small (<~500 source lines read, <3 files edited). Justify why each is too small for a worker.

### Phase 2: Artifact Creation

#### Direct mode:
1. Create `.sprint/sprint-{N}/COORDINATOR-LOG.md` (from template) — log your direct work
2. Commit the log file
3. Proceed directly to implementation (Phase 3 is skipped)

#### Delegation mode (full ceremony):
1. Copy `.claude/templates/SPRINT-CONTRACT.md` to `.sprint/sprint-{N}/CONTRACT.md`
2. Fill out the contract completely — no template placeholders left (including Context Budget Estimates)
3. Copy `.claude/templates/COORDINATOR-LOG.md` to `.sprint/sprint-{N}/COORDINATOR-LOG.md`
4. Write `.sprint/sprint-{N}/SESSION-PROMPT-{X}.md` for each worker (from template). **Verify claims before including.** Unverified issues MUST be labeled as "Areas to Investigate (unverified)" — not stated as known bugs. False positives erode worker trust.
5. Seed `memory/SPRINT-BOARD.md` with tasks
6. Commit all artifacts to the repo
   > **CRITICAL**: Worktrees branch from `main` at creation time. Sprint artifacts (SESSION-PROMPTs, CONTRACT, etc.) MUST be committed to `main` BEFORE `git worktree add`. If you create worktrees first, workers won't find their SESSION-PROMPTs.
7. Create worktrees — destroy old ones first, then create fresh from `main`:
   ```bash
   # For each worker (a, b, c as needed):
   git worktree remove "../worktree-a" --force 2>/dev/null
   git branch -D sprint{N}-worker-a 2>/dev/null
   git worktree add "../worktree-a" -b sprint{N}-worker-a main
   ```
   Standard paths: `../worktree-a` through `../worktree-e`. Never use ad-hoc names.

   **After creating worktrees, install dependencies** in each:
   ```bash
   # Run {{INSTALL_COMMAND}} in each worktree
   # Example: cd ../worktree-a && {{INSTALL_COMMAND}}
   # Repeat for worktree-b, worktree-c, etc.
   # Also install backend dependencies if backend work is in scope
   ```

   **Worker port assignments** (up to 5 workers):

   | Worker | Worktree | Dev Port |
   |--------|----------|----------|
   | A | ../worktree-a | {{FE_PORT}}+1 |
   | B | ../worktree-b | {{FE_PORT}}+2 |
   | C | ../worktree-c | {{FE_PORT}}+3 |
   | D | ../worktree-d | {{FE_PORT}}+4 |
   | E | ../worktree-e | {{FE_PORT}}+5 |

   Main stays on {{FE_PORT}} for user testing.

#### Hybrid mode:
Follow Delegation steps for worker tasks. Coordinator's direct tasks need no additional artifacts — log them in COORDINATOR-LOG.md as completed.

### Phase 3: Worker Activation

1. Provide activation prompts for each terminal. **Critical format**: the instruction must say "Open a terminal IN the worktree directory" — NOT "open a terminal, then cd." The `cd` step gets lost when separated.
   ```
   Open a new Claude Code terminal in C:\...\worktree-a, then paste:
   Read .sprint/sprint-{N}/SESSION-PROMPT-A.md, then CLAUDE.md. Follow the instructions.
   ```
2. Paste prompts to user — user opens each terminal IN the worktree directory and pastes
3. Log activation in COORDINATOR-LOG.md timeline
4. **NEVER provide plan/implementation instructions alongside the activation prompt.** The activation prompt is the ONLY thing the user pastes. If you attach a plan, code, or task list alongside it, the worker will execute the plan and skip the SESSION-PROMPT — bypassing the entire harness.

> **CRITICAL (Delegation/Hybrid)**: Worker activation is always the #1 priority. Coordinator-direct tasks (deploy, docs, small fixes) happen AFTER all workers are running, unless they directly block a worker.

> **Direct mode**: Phase 3 is skipped — no workers to activate. Proceed to implementation.
> **Hybrid mode**: Activate workers as normal. Begin your own direct tasks after workers are activated.

### Phase 4a: Monitoring (Execute Coordinator)

1. Wait for workers to signal "Branch committed, ready for merge"
2. Monitor worker progress — check branches, Sprint Board, user relay
3. For long sprints (3+ workers, >2 hours): request Auditor health check after first merge
4. When all workers done — write MERGE-HANDOFF.md (Session End Task 8-10), then tell user to `/clear`

### Phase 4b: Merges (Merge Coordinator — fresh context)

0. **Clean up worktrees first** — remove all worktrees before starting merges (they block rebase operations):
   ```bash
   git worktree remove "../worktree-a" --force 2>/dev/null
   git worktree remove "../worktree-b" --force 2>/dev/null
   git worktree remove "../worktree-c" --force 2>/dev/null
   ```
1. Activated by user pasting Merge Coordinator prompt (see "How to Activate" above)
2. Read MERGE-HANDOFF.md — follow merge order
3. For each branch: run `/sprint-merge <branch>` which handles:
   - Read WORKER-REPORT-{X}.md + SESSION-LOG-{X}.md
   - Pre-merge verification (SESSION-LOG, ownership, build, ports)
   - `git checkout main && git merge <branch>`
   - Build verification (`{{BUILD_COMMAND}}`)
   - Rebase remaining branches
   - Extract knowledge (Lessons + Review Block)
4. Log results in COORDINATOR-LOG.md
5. **Worker Feedback Consolidation** — after all merges, read all SESSION-LOG Review Blocks. Consolidate unique findings into ONE message to `.sprint/inbox/auditor.md`. Workers do NOT write to auditor.md directly — the Merge Coordinator is the single consolidation point. Exception: urgent mid-sprint issues still go to coordinator.md directly.
6. Run `/sprint-metrics` after final merge

### Phase 5: Post-Sprint

1. Verify all quality gates met
2. Fill one row in `memory/harness-health.md` (Sprint, Date, Goal Met, Delivered, On Branch, Ctx <50%, Build, Notes)
3. Fill Documentation Update Checklist in COORDINATOR-LOG.md
4. Update relevant `docs/` files
5. Summarize worker knowledge in COORDINATOR-LOG.md (Worker Knowledge Summary)
6. Update `NEXT-SESSION-KICKSTART-COORDINATOR.md` for the next session
7. Ask user about deployment — verify deployment if they want to push
8. **Sprint review** (Review Mode determines depth):
   - **Default (Review Mode OFF)**: Write a brief "Sprint Health Summary" (5-10 lines) in COORDINATOR-LOG Session Insights. If everything went smoothly, that's it — no inbox message needed. Only send a message to `.sprint/inbox/auditor.md` if there were actual issues (process violations, scope problems, false positives).
   - **Review Mode ON** (user said "Review mode on"): Write a full post-mortem — every issue detailed with root cause, worker-by-worker analysis, recommendations.
9. **Session Efficiency Review** (MANDATORY in COORDINATOR-LOG Session Insights):
   - Was the chosen execution mode the right call? Why or why not?
   - Did any worker's context budget estimate turn out wrong? By how much?
   - What would you do differently if you ran this sprint again?
   - Total token observations: which phases were unexpectedly expensive?
   - Honest assessment: was the harness overhead justified for this sprint's scope?

---

## Merge Protocol

### Pre-merge (for each branch, in declared merge order)

Run pre-merge verification which checks:
- [ ] Worker committed? (`git log` on branch shows new commits)
- [ ] `.sprint/sprint-{N}/SESSION-LOG-{X}.md` exists with all 6 sections
- [ ] No unintended files changed (`git diff --stat main..branch`)
- [ ] Build passes after merge (`{{BUILD_COMMAND}}`)
- [ ] Port cleanup verified (no listeners on dev port range)

### Execution

1. `git checkout main`
2. `git merge <branch>` (first merge) or rebase branch first (subsequent merges)
3. If conflicts: **Do NOT force-resolve.** Abort, check CONTRACT file ownership, read both SESSION-LOGs, resolve by functionality needed.
4. `{{BUILD_COMMAND}}` — verify the build

### Post-merge

1. Collect quality gate data
2. Record results in `.sprint/sprint-{N}/COORDINATOR-LOG.md` Merge Results table
3. Rebase remaining branches: `git checkout <next-branch> && git rebase main`
4. If rebase conflicts: resolve carefully, verify build

### After all merges

1. Fill Quality Gate Results in COORDINATOR-LOG.md
2. Fill Documentation Update Checklist
3. Write Worker Knowledge Summary (from each worker's Lessons + Suggestions)
4. Fill Session Insights section
5. Update `NEXT-SESSION-KICKSTART-COORDINATOR.md`
6. Ask user: "Ready to deploy?" — if yes, proceed with deployment
7. Clean up worktrees: `git worktree remove "../worktree-a"` (repeat for b, c)
8. Delete merged branches: `git branch -d sprint{N}-worker-{x}`

---

## Handoff & Continuation

### Writing NEXT-SESSION-KICKSTART-COORDINATOR.md

This is the Coordinator's most important handoff artifact. The next Coordinator reads it cold.

Required content:
1. **What just happened** — sprint results, what was merged/deployed
2. **Blockers** — anything unresolved that affects the next sprint
3. **Project state** — services, build status, auth status
4. **Priorities for next session** — ordered by importance
5. **Key files** — table of files the next Coordinator needs

### Mid-sprint handoff

If you must hand off mid-sprint (context lost, session ending):
1. Update `.sprint/sprint-{N}/COORDINATOR-LOG.md` timeline with current state
2. Update `memory/SPRINT-BOARD.md` with current task status
3. Write a brief note in `.sprint/inbox/coordinator.md` explaining the handoff
4. The next Coordinator can recover using the mid-sprint read chain above

## Session End Protocol

Before ending any Coordinator session, follow the universal checkpoint from CLAUDE.md Workflow Rules ("Before ending a session").

### Completion Self-Audit
Before ending this session, compare what you actually did vs what you were supposed to do:
1. List every file you modified
2. For each task/deliverable in your plan: DONE / PARTIAL (what's missing) / MISSED (why)
3. If anything is PARTIAL or MISSED, note it in your COORDINATOR-LOG Session Insights
4. Check: "What knowledge exists only in my context that isn't saved anywhere?"

The Coordinator's save targets:
1. **COORDINATOR-LOG.md** — Session Insights section (decisions made, surprises, rejected alternatives, user intent)
2. **NEXT-SESSION-KICKSTART-COORDINATOR.md** — updated with sprint results and next priorities
3. **memory/SPRINT-BOARD.md** — final task state
4. **CLAUDE.md Mistakes Log** — if you hit a recurring issue, add it
5. **Inbox** — check if other roles need to know anything: `.sprint/inbox/{role}.md`
6. **Sprint review** — brief health summary (default) or full post-mortem (if "Review mode on"). See Phase 5 step 8.
7. **Session Efficiency Review** — MANDATORY. See Phase 5 step 9.

---

## Sprint Workspace & File Hygiene

Sprint artifacts: `.sprint/sprint-{N}/` (CONTRACT, COORDINATOR-LOG, SESSION-PROMPTs, SESSION-LOGs). Role docs: `.sprint/roles/`. Inbox: `.sprint/inbox/`. Archive sprints older than N-3 to `.sprint/archive/`.

### Worktree Rules by Mode
- **Direct mode**: Coordinator works on main. No worktrees needed (no workers).
- **Delegation mode**: All workers get worktrees. Coordinator does not touch code.
- **Hybrid mode**: All workers get worktrees. Coordinator works on main for small tasks.
- **All workers ALWAYS get worktrees** — no exceptions, including conversation and research workers.

**Cross-cutting rules** (Coordinator enforces during sprints):
- Never push to deployment remotes without explicit user approval (see CLAUDE.md for remote names).
- User input distillation is mandatory (Tier 1: structured via USER-DECISIONS.md template, Tier 2: archive to `memory/`).
- Stale branches: delete before each sprint.
- New .md files MUST be wired into documentation indexes. Zero-inbound-link files are invisible.
