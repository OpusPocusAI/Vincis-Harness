# Coordinator Plan — Sprint {N}

## ROLE DECLARATION (DO NOT REMOVE)
You are the **Coordinator**. Mode (below) determines: delegate, implement directly, or both. Mode is LOCKED after approval.

### Hard Constraints
- Delegation mode: do NOT edit .tsx, .ts, .css, or feature code
- Direct mode: implement within scope below
- Hybrid mode: implement ONLY small tasks listed under "Coordinator Direct Tasks"
- Content goes INTO SESSION-PROMPTs, never directly to workers

### Read Chain
1. `.sprint/roles/COORDINATOR-ROLE.md`
2. `docs/PRODUCT-VISION.md` — product vision
3. `docs/CURRENT.md` — expansion source
4. `NEXT-SESSION-KICKSTART-COORDINATOR.md`
5. `memory/user-decisions.md` — decision register
6. (Delegation/Hybrid) `memory/MEMORY.md` + `.sprint/inbox/coordinator.md`

---

## Execution Mode

- [ ] **Direct** — Coordinator implements on main. No workers.
- [ ] **Delegation** — Full sprint. Coordinator writes ZERO code.
- [ ] **Hybrid** — Workers handle big tasks, Coordinator handles small tasks on main.

**Justification**: {Why this mode?}

## Context Budget

| Role | Est. lines to read | Budget risk |
|------|-------------------|-------------|
| Coordinator | {~N} | {Low/Med/High} |
| Worker {X} | {~N} | {Low/Med/High} |

**Hard cap: 2000 source lines per worker.** If more needed, split.

---

## Session Goal
{One sentence. Measurable.}

### Expansion Check (MANDATORY)
- [ ] Read CURRENT.md Next Up
- [ ] Read Deferred Items in SPRINT-BOARD.md
- [ ] Identified 2+ additional items
- [ ] Presented expanded scope to user

### Product Vision
- **Which PRODUCT-VISION theme?** {Name it}
- **What experience is this sprint building?** {Not bug-level — experience-level}
- **Worker creative freedom**: Frame tasks broadly. Workers expand scope when they see value.

---

## Execution Checklist

| Step | Task | Blocks workers? |
|------|------|----------------|
| 1 | {e.g., "Create sprint directory + artifacts"} | {Yes/No} |
| 2 | {e.g., "Write SESSION-PROMPTs"} | Yes |
| 3 | {e.g., "Create worktrees + npm install"} | Yes |
| 4 | {e.g., "Activate workers"} | — |

## Workers (Delegation/Hybrid)

| Worker | Type | Focus | Est. Lines | Budget Risk |
|--------|------|-------|-----------|-------------|
| A | {Lite/Standard} | {focus} | {~N} | {risk} |

### Prompt Design Rules
- Lite: pre-plan steps, file paths, line numbers. Use unified `SESSION-PROMPT.md` template with mode=LITE.
- Standard: goals + constraints + ownership ONLY. Use `SESSION-PROMPT.md` with mode=STANDARD.
- Max 3 ACs (Lite), 5 ACs (Standard). Fewer = better. Frame as "Starting Points" not "Tasks".

## Merge Order (Delegation/Hybrid)
{Order + rationale. LOCKED after worker activation.}

## Merge Checklist
For each branch in merge order:
1. Worker committed? (`git log` shows commits)
2. SESSION-LOG exists with required sections
3. No unintended files (`git diff --stat main..branch`)
4. `git checkout main && git merge <branch>`
5. `cd FE && npm run build` — verify
6. Rebase remaining branches
7. Log results in COORDINATOR-LOG
8. Check SESSION-LOG cross-ownership edits for semantic correctness

---

## Session End Tasks (MANDATORY)
1. Token report: `/context` percentage
2. Create/update COORDINATOR-LOG
3. Completion Self-Audit: files modified vs plan
4. Context knowledge check: "What exists only in my context?"
5. Inter-role messages → `.sprint/inbox/{role}.md`
6. Update `NEXT-SESSION-KICKSTART-COORDINATOR.md`
7. (Delegation/Hybrid) Write MERGE-HANDOFF.md, commit, tell user to activate Merger

---

## Research Persistence (MANDATORY — before writing the plan)

> **Research is a permanent asset, not a one-time handoff.**
> Any investigation you performed (agent scans, DB queries, profiling, code audits) must be SAVED
> to `memory/research/` files BEFORE submitting this plan. These files serve:
> - This sprint's execute mode (immediate)
> - Future sprints touching the same domain (permanent)
> - Auditor retros evaluating investigation quality (accountability)
>
> **Before investigating**: Run `Glob memory/research/*.md` — research may already exist. Build on it.
> **How to save**: Write findings to `memory/research/{topic}-audit-S{N}.md` with frontmatter:
> ```yaml
> ---
> type: research
> domain: {frontend/backend/database/performance/etc}
> status: active
> created: {today}
> sprint: {N}
> ttl: until-replaced
> tags: ["research", "investigation", "{topic}"]
> ---
> ```
> Update `memory/MEMORY.md` to index the new file.
> Future sessions investigating the SAME topic should UPDATE the file, not create a new one.
> Mark findings with dates so staleness is visible.

**Research files saved this session**: {list files created/updated, or "None — no investigation needed"}

---

## Critical Gate — Before Submitting This Plan

1. Does this plan carry enough context to survive the plan→execute context clear?
2. **Did I persist my research?** If you investigated anything, it MUST be in `memory/research/`. Check: are your investigation findings saved to files, or only in your context?
3. What am I assuming about file paths or codebase state that I haven't verified with Grep/Read?
4. If a worker interprets this prompt differently than I intend, what breaks?
5. What would Leo challenge about this plan?

---

## Plan-Mode Context Checkpoint

- **Context used at plan start**: {run `/context` — paste actual %}
- **Context used at plan end**: {run `/context` — paste actual %}
- **Files read during planning**: {list all files read}
- **Essential vs unused**: {which files informed the plan vs wasted reads}

### Observations
{Harness patterns, risks, recommendations — or "None"}
