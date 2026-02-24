# Sprint Process

Harness sprint methodology, grading criteria, and process learnings.

## User Decisions

| # | Decision | Date |
|---|----------|------|
| | | |

## Harness Core Principles

The harness optimizes for four principles, in priority order:

### 1. Productivity
Maximize useful output per sprint. Every sprint should ship tangible value — features, fixes, or meaningful refactors. Busy-work and process overhead that doesn't translate to deliverables is waste. Measure by: tasks completed, features shipped, bugs fixed.

### 2. Efficiency
Minimize time and turns to reach the goal. Plans should be tight, scopes should be small, and workers should finish in one pass. A sprint that delivers 3 clean features beats one that delivers 5 messy ones requiring rework. Measure by: turns per task, rework rate, merge conflicts.

### 3. Accuracy
Ship correct, tested, production-ready code. Every worker output must build, pass lint, and match the specification. "Works on my machine" is not accuracy — visual verification against real devices matters. Measure by: build pass rate, bug escape rate, spec compliance.

### 4. Token Efficiency
Minimize token consumption for equivalent output. Read only what you need, plan concisely, avoid re-reading files unnecessarily. Context windows are finite and expensive. But never sacrifice accuracy or productivity for token savings. Measure by: total tokens per sprint, tokens per completed task.

## Grading Instructions

Each sprint receives a letter grade per principle:

| Grade | Criteria |
|-------|----------|
| **A** | Excellent. Met or exceeded targets. No significant issues. |
| **B** | Good. Minor gaps but fundamentally sound. One or two small misses. |
| **C** | Needs improvement. Meaningful gaps that impacted the sprint outcome. |

Grading is done by the Auditor at sprint end. A sprint with all A's is exceptional. B's are normal for healthy sprints. Any C triggers a process review and a fix entry in the Fix Tracker below.

## Plan Cycle Architecture

Every role follows the same cycle:

1. **Plan mode** — Role reads context, produces a plan file using its template from `templates/`.
2. **User approves** — Plan is reviewed and approved (or revised).
3. **Context clears** — The conversation resets. Everything in chat context is gone.
4. **Execute mode** — Role re-reads ONLY the plan file. The plan is the sole input.

**Implication**: Anything not written in the plan file does not exist in execute mode. Process steps, gate checks, and verification instructions MUST be numbered tasks in the plan, not separate references or external docs.

### Plan File Rules

- Every plan MUST use the role's template from `templates/` (COORDINATOR-PLAN, WORKER-PLAN, AUDITOR-PLAN, ASSISTANT-PLAN).
- Plans without a Role Declaration header produce role-boundary violations.
- Worker plans MUST include Gate 0 (environment check) and Gate 2 (verification) as numbered tasks, not as process notes.
- The plan file is the contract between plan-mode and execute-mode. Ambiguity in the plan = ambiguity in execution.

## Coordinator Execution Modes

| Mode | When to Use | Coordinator Does |
|------|-------------|------------------|
| **Direct** | Small scope, 1-2 files, no parallelism needed | Implements on main branch directly |
| **Delegation** | 2+ independent tasks, benefits from parallel workers | Plans + delegates ONLY, zero code edits |
| **Hybrid** | Mix of quick fixes + larger parallel tasks | Some direct edits + some delegation |

Mode is declared in the Coordinator plan and locked after user approval. Switching modes mid-sprint is a process violation.

## Worker Lifecycle

1. **Activation** — Coordinator writes a SESSION-PROMPT with task scope, files to touch, and acceptance criteria.
2. **Gate 0** — Worker verifies environment (worktree, branch, dependencies). Self-fixes if possible; STOPs only if creation fails.
3. **Execution** — Worker implements the task. One worker = one verb. If reading >2000 lines, scope is too broad.
4. **Gate 2** — Worker verifies: build passes, visual check (for UI tasks), spec compliance.
5. **Commit + Done** — Worker commits all changes and declares done. Uncommitted work is invisible to Coordinator.
6. **Kill dev servers** — Worker MUST kill any running dev servers before declaring done.

## Session End Protocol

Every role, every session:

1. Ask: "What knowledge exists only in my context right now that is not saved anywhere?"
2. Check: decisions, discoveries, user intent. Save to the relevant artifact.
3. Ask: "Messages to leave for other roles?" If yes, edit the recipient's inbox file.
4. Run Completion Self-Audit: list what you did, compare vs plan, note gaps.
5. Update relevant docs files (ARCHITECTURE, VISUALS, BUGS, PERFORMANCE, CURRENT, etc.).

## Fix Tracker

Track process fixes identified during audits. Format: Sprint, Issue, Fix Applied, Status.

| Sprint | Issue | Fix Applied | Status |
|--------|-------|-------------|--------|
| | | | |

_Example: S15 | Workers skipped visual verification | Added Gate 2 visual check to WORKER-PLAN template | Resolved S16_

## Sprint Learnings Archive

Accumulated lessons from past sprints. Move here from active sprint retros after the learning is codified.

| Sprint | Learning | Action Taken |
|--------|----------|--------------|
| | | |

_Example: S12 | Too many simultaneous changes cause merge conflicts | Enforce max 1 feature per worker per sprint_
