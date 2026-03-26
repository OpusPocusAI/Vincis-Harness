# Worker Plan — Worker {X} (Sprint {N})

## ROLE DECLARATION (DO NOT REMOVE)
You are **Worker {X}**. Implement within your primary file ownership. Never push to remotes.

### Hard Constraints
- Primary ownership files listed below — edit freely
- May edit outside ownership if logically necessary — document every cross-edit in SESSION-LOG
- **Scope expansion encouraged**: Think beyond your prompt. Fix what you find (<5 lines). Explain WHY in SESSION-LOG.
- Never push to deployment remotes or `origin main`
- Must complete ALL numbered tasks (Gate 0 through Gate 2) — skipping any is a violation

### Planning Guidance (Standard Workers)
Your plan mode IS your implementation planning. Read assigned files, design your approach, write numbered tasks with verification steps.

---

## Primary Ownership (from SESSION-PROMPT)
{files — may edit outside with documentation}

## Minimum Deliverables (the floor — not the ceiling)
1. {Measurable outcome}
2. {Measurable outcome}
N. SESSION-LOG committed with all sections

---

## GATE 0: PRE-FLIGHT (BLOCKING — complete before any implementation)

**Task 0.1**: Verify branch — run `git branch --show-current`. Expected: `sprint{N}-worker-{x}`. **If output is `main`: WARNING — do NOT proceed.** Find your worktree via `git worktree list`, navigate there. Create if needed: `git worktree add ../worktree-{x} -b sprint{N}-worker-{x} main`.

**Task 0.2**: Verify directory — run `pwd`. Expected: your worktree path. If wrong: navigate to correct worktree.

**Task 0.3**: Scan inbox — read `.sprint/inbox/workers.md`. Extract messages for you. (30 seconds max.)

**Task 0.4**: Read memory files from SESSION-PROMPT (REQUIRED ones only).

---

## ROOT CAUSE INVESTIGATION (for bug/performance tasks — skip for feature tasks)

**Task I.1**: Investigate root cause BEFORE deciding on a solution. Document in SESSION-LOG `## Root Cause Investigation`:
- What is the symptom? What did YOU observe?
- What are 2+ possible causes?
- What did you measure/check?
- Which hypothesis does your evidence support?

> **NOTE**: If the SESSION-PROMPT suggests approaches below, they are STARTING POINTS. Your investigation may reveal a different root cause that needs a different solution.

## APPROACHES TO CONSIDER (NOT prescriptive — Coordinator fills for bug/perf tasks)

{For bug/performance tasks, Coordinator lists 2-3 approaches:}
- Approach A: ... — Pros/Cons
- Approach B: ... — Pros/Cons
- Approach C: ... — Pros/Cons

{For feature tasks, delete this section and go straight to Implementation Tasks.}

---

## IMPLEMENTATION TASKS

{Coordinator fills tasks 1 through N — the actual code work}

**Task 1**: {implementation task}

**Task N**: Build verification — `npm run build` (0 errors required)

---

## GATE 2: POST-FLIGHT (BLOCKING — do not signal done until ALL completed)

**Task G2.1**: **Reflection Pause** — Answer the Coordinator's reflection question from SESSION-PROMPT. Write in SESSION-LOG `## Reflection Pause`. If it surfaces a fix <5 lines: fix now.

> **Be brutally honest. Reflect critically — do not confirm your own work, actively find reasons why it might not be good enough.** Your reflection MUST name at least one specific finding. "Everything looks good" is NOT acceptable. Did you test what you created? Did you take shortcuts? Did you commit without verifying? **CRITICAL: Finding a problem without fixing it is the same as not finding it.** If your reflection surfaces anything actionable — fix it RIGHT NOW before moving to the next gate. Do not document it for later. Do not note it in Issues Found. Fix it.

**Task G2.2**: **Second Read** — Re-open every modified file. For each: "What did I miss?" Write in SESSION-LOG `## Second Read`. Fix anything <5 lines.

**Task G2.3**: **Visual verification** — If UI changes: use Playwright MCP to start dev server on port 300{X}, take screenshots, and verify visual changes in browser → SESSION-LOG `## Verified`. Non-visual: write "N/A". **"Visual verification skipped" is not acceptable** — Playwright is standard tooling.

**Task G2.4**: **Domain Health Check** — Scan every edited file for: dead imports, `min-h-screen` (→ `min-h-dvh`), known decision violations, bugs <5 lines. Fix and record in SESSION-LOG `## Beyond-Scope Fixes`.

**Task G2.5**: **Token check** — Run `/context` → SESSION-LOG `## Token Usage` as "Context at session end: {%}".

**Task G2.6**: **Write SESSION-LOG** — Create `.sprint/sprint-{N}/SESSION-LOG-{X}.md` using the skeleton from your SESSION-PROMPT. `git add` and `git commit` immediately.

**Task G2.7**: **Final commit** — `git add` remaining work, `git commit -m "Worker {X}: {summary}"`. Kill dev servers.

**Task G2.8**: **Signal done** — "Branch committed, ready for merge."

---

## Critical Gate — Before Submitting This Plan

1. Does this plan carry enough context to survive the plan→execute context clear?
2. What am I assuming about file paths or codebase state that I haven't verified?
3. Does what I'm building actually serve the Mission, or just check the ACs?

---

## Plan-Mode Context Checkpoint

- **Context used at plan start**: {run `/context` — paste actual %}
- **Context used at plan end**: {run `/context` — paste actual %}
- **Files read during planning**: {list all files read}
- **Files essential vs unused**: {which added value, which didn't}

### Observations
{Harness, cross-role patterns, strategic insights — or "None"}
