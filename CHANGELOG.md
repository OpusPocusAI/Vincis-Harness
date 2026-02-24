# Changelog

All notable changes to Vinci's CC-Harness are documented in this file.

The harness version tracks structural changes to the coordination system — not application code. Each version was tested in live production sprints.

---

## [4.4] - 2026-02-24

**Refinements from Sprint 19 — first all-A sprint.**

### Added
- Visual checkpoint pattern for UI-heavy tasks — Coordinator includes "visual checkpoint" AC that catches visual issues early before they compound into multi-iteration feedback loops
- Navigation/routing domain in Context Intelligence doc-index
- rAF-for-iOS-keyboard pattern documented (requestAnimationFrame preserves iOS Safari gesture chain; setTimeout breaks it)

### Changed
- Fix Tracker updated: FIX-002 verified (10 consecutive), FIX-006 verified (6 consecutive), FIX-007 verified (4 consecutive)

---

## [4.3] - 2026-02-23

**7 fixes from Sprint 18 audit. Lite mode validated at scale (n=5).**

### Added
- `/worker-review` skill — on-demand self-review for Lite workers (preserves token savings by default)
- Self-grade calibration rubric with concrete A/B/C criteria and common inflation patterns
- Visual verification rule: UI tasks require dev server + browser check, not just build pass
- Plan Phase Summary section in COORDINATOR-LOG for execute-mode handoff discoverability

### Changed
- Worker-to-Auditor email flow: Workers write to SESSION-LOG Review Block only; Merge Coordinator consolidates unique findings into one auditor inbox message (eliminates N duplicate emails)
- Standard-to-Lite splitting heuristic: when file >2000 lines + >1 concern, split Standard worker into 2 Lite workers
- `/simplify` marked as `(OPTIONAL)` in WORKER-PLAN.md — Coordinator removes tag when mandatory

---

## [4.2] - 2026-02-22

**5 fixes from Sprint 17 — Lite mode first live test.**

### Fixed
- Worker activation priority: Coordinator activates workers BEFORE running post-setup tasks
- Commit-before-worktree: warning added to prevent sprint artifacts missing from worktrees
- Gate 0 self-fix: workers attempt `git worktree list` recovery before halting (was too aggressive)
- LITE exemptions: SESSION-PROMPT-LITE now has explicit "LITE Mode Rules" section
- Memory read tagging: REQUIRED vs RECOMMENDED reads in WORKER-PLAN.md

---

## [4.1] - 2026-02-22

**Lite mode architecture — two-mode system for workers.**

### Added
- **Lite mode**: Self-contained SESSION-PROMPT-LITE replaces full ceremony (no plan mode, no WORKER-ROLE.md read, slim SESSION-LOG). ~45-55% token savings
- Coordinator selects Standard or Lite per worker at plan time. Default: LITE
- SESSION-PROMPT-LITE.md template with inline key decisions and LITE Mode Rules
- Bilateral context reporting: both plan and execute phases report context/token usage

### Changed
- `docs/LIGHTWEIGHT-HARNESS.md` — full design document for the two-mode system

---

## [4.0] - 2026-02-22

**The most impactful harness change ever. Process compliance ~20% -> ~90%.**

### Added
- **Gate 0 (pre-flight)**: Numbered tasks in WORKER-PLAN.md that verify worktree, branch, and working directory before any code work
- **Gate 2 (post-flight)**: Numbered tasks for commit, SESSION-LOG, WORKER-REPORT, dev server cleanup
- SESSION-LOG as an explicit acceptance criterion (not a side effect)
- Cross-ownership edit documentation requirement in WORKER-PLAN.md

### Changed
- Process steps are now indistinguishable from code tasks — they're numbered items in the same list
- Workers execute Gate 0 and Gate 2 organically because they're just "the next task"

### Why It Worked
Previous versions put process steps in role docs or separate sections. After the plan->execute context clear, workers only see the numbered task list. Everything outside that list was invisible. v4 eliminated the gap by making process = tasks.

---

## [3.0] - 2026-02-22

**Branch compliance achieved (first ever: 3/3 workers on correct branches).**

### Added
- PRE-FLIGHT gate in WORKER-ROLE.md
- Worktree-based activation (worker opens terminal IN the worktree)
- Tier 2 SESSION-PROMPTs with embedded context (no external file reads needed)
- POSIX-compatible pre-commit hook fix

### Changed
- Standardized worktree paths: `../worktree-a`, `../worktree-b`, `../worktree-c`
- Worker activation format: "Open terminal IN worktree-x" (not "cd then paste")

---

## [2.0] - 2026-02-21

**Hooks, Health Dashboard, institutional safeguards.**

### Added
- Pre-commit hook for branch enforcement (prevents commits on main during sprints)
- Health Dashboard (`memory/harness-health.md`) — one row per sprint tracking 5 metrics
- Harness Changelog with impact tracking
- 2000-line hard cap per worker (reduced from 3000)

### Changed
- CONTRACT absorbed into COORDINATOR-LOG (was never gate-checked)
- CLAUDE.md diet: 462 -> ~160 lines
- Role doc trims for token efficiency

---

## [1.4] - 2026-02-13

**Institutional memory architecture.**

### Added
- `memory/` directory with topic-based files (payments, design, search, auth, etc.)
- `memory/user-decisions.md` — decision register (every user choice saved)
- `memory/MEMORY.md` — index file, auto-loaded on every session
- 3-layer memory: MEMORY.md (always loaded) -> topic files (on demand) -> archive

### Why
A user decision ("use Stripe not Mollie") was lost because it existed in code and docs but not in memory. A worker designed with the wrong payment provider. The decision register ensures this class of error never recurs.

---

## [1.3] - 2026-02-12

**Execution modes and soft ownership.**

### Added
- Three Coordinator execution modes: Direct, Delegation, Hybrid
- Soft file ownership: "primary responsibility, not forbidden to touch" with documentation requirement
- Plan-Mode Review pattern (observations from plan-mode agent survive context clear via relay)

---

## [1.1] - 2026-02-11

**Plan templates for all 4 roles.**

### Added
- `.claude/templates/COORDINATOR-PLAN.md`
- `.claude/templates/WORKER-PLAN.md`
- `.claude/templates/AUDITOR-PLAN.md`
- `.claude/templates/ASSISTANT-PLAN.md`
- Structured Review Block in SESSION-LOG
- Completion Self-Audit protocol

---

## [1.0] - 2026-02-10

**Initial harness — multi-terminal sprint system.**

### Added
- 4 roles: Coordinator, Worker, Auditor, Assistant
- Sprint lifecycle: plan -> delegate -> implement -> merge -> audit
- CLAUDE.md as master rules file (auto-loaded)
- Role docs in `.sprint/roles/`
- Inter-session inbox in `.sprint/inbox/`
- SESSION-PROMPT activation for workers
- SESSION-LOG accountability for workers
- Git worktree isolation for parallel development

### Known Issues (at launch)
- Branch compliance: 0% (all workers committed on main)
- Process compliance: ~20% (instructions in role docs ignored after context clear)
- No institutional memory (decisions lost between sessions)

---

*Each version was tested in live production sprints. Impact is measured after 2 sprints and recorded in the Health Dashboard.*
