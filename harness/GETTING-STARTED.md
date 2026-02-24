# Getting Started with Vinci's CC-Harness

> **For Claude Code**: If a user asks "how does this work?", "what is this harness?", or "explain the system" — read this file and walk them through it conversationally.

---

## What Is This?

Vinci's CC-Harness is a **multi-terminal coordination system** for Claude Code. Instead of using one Claude Code session for everything, you open multiple terminals — each with a specific role — and they coordinate through markdown files.

Think of it like a small development team:
- A **Coordinator** plans the work and delegates to workers
- **Workers** implement code in isolated git branches
- An **Auditor** reviews process quality and improves the system
- An **Assistant** handles deployments, builds, and operational tasks

They communicate through inbox files, share knowledge through memory files, and follow templates to stay consistent.

---

## The 4 Roles

### Coordinator
**Activates with**: `"You are the Coordinator. Read CLAUDE.md."`

The Coordinator is the project manager. It:
- Reads the project state and decides what to build next
- Writes SESSION-PROMPT files that tell workers exactly what to do
- Creates git worktrees for isolated parallel development
- Merges worker branches back to main after they're done
- Tracks progress and writes sprint logs

**Cannot**: Write feature code (in Delegation mode). The Coordinator plans and orchestrates — it doesn't implement.

### Worker
**Activates with**: `"Read .sprint/sprint-{N}/SESSION-PROMPT-{X}.md"`

Workers are the implementers. Each worker:
- Reads its SESSION-PROMPT (created by the Coordinator)
- Works in an isolated git worktree on its own branch
- Implements the assigned tasks within its file ownership
- Writes a SESSION-LOG documenting what was done
- Commits and signals completion

Workers come in two modes:
- **Standard**: Full plan->execute cycle with plan approval
- **Lite**: Self-contained prompt, no plan mode, ~45-55% fewer tokens

### Auditor
**Activates with**: `"You are the Auditor. Read CLAUDE.md and .sprint/roles/AUDITOR-ROLE.md."`

The Auditor inspects and improves:
- Reviews sprint artifacts for process compliance
- Writes retrospectives with grades on 4 core principles
- Identifies systemic issues and proposes fixes
- Updates templates, role docs, and memory based on learnings

**Cannot**: Write feature code. The Auditor edits only meta-system files (templates, role docs, memory, docs).

### Assistant
**Activates with**: `"You are the Assistant. Read CLAUDE.md and .sprint/roles/ASSISTANT-ROLE.md."`

The Assistant handles operations:
- Pushes code to deployment repos
- Runs builds and checks
- Answers project questions
- Installs tools and dependencies

---

## How Sessions Communicate

Claude Code sessions can't talk to each other directly. They coordinate through files:

| Mechanism | Location | Purpose |
|-----------|----------|---------|
| **Inbox** | `.sprint/inbox/` | Async messages between roles (UNREAD -> READ -> DONE) |
| **Kickstart files** | Root directory | Session handoff context (what happened, what to do next) |
| **Sprint artifacts** | `.sprint/sprint-{N}/` | SESSION-PROMPTs, SESSION-LOGs, contracts, reports |
| **Memory** | `memory/` | Persistent knowledge that survives across all sessions |
| **CLAUDE.md** | Root directory | Master rules, auto-loaded on every session start |

---

## The Plan -> Execute Cycle

Every role (except Assistant) follows this lifecycle:

1. **Plan mode**: Agent reads the codebase, thinks about the approach, writes a plan file
2. **User approves**: You review the plan and approve it
3. **Context clears**: The plan-mode context is discarded
4. **Execute mode**: A fresh context starts with ONLY the plan file + CLAUDE.md
5. **Agent works**: Follows the plan's task list step by step

This is critical because:
- **Execute mode has ZERO memory of planning.** If something isn't in the plan file, it doesn't exist.
- **Process steps must be numbered tasks.** Anything outside the numbered list gets lost.
- **Plans are the only input.** This prevents context blowout and ensures reproducibility.

---

## Terminal Naming Guide

When opening Claude Code terminals, name them clearly:

| Terminal Name | Role | When to Open |
|--------------|------|-------------|
| `Coordinator` | Plans sprints | At sprint start |
| `Worker A` | First worker | After Coordinator creates prompts |
| `Worker B` | Second worker | After Coordinator creates prompts |
| `Worker C` | Third worker (optional) | For larger sprints |
| `Auditor` | Process review | After sprint completes |
| `Assistant` | Operations | On-demand |

---

## Key Files to Know

| File | What It Is | Who Reads It |
|------|-----------|-------------|
| `CLAUDE.md` | Master rules — auto-loaded every session | Everyone |
| `.sprint/roles/{ROLE}-ROLE.md` | Detailed protocol for each role | The role it's named for |
| `.sprint/inbox/{role}.md` | Inbox messages for that role | The role it's named for |
| `.sprint/sprint-{N}/SESSION-PROMPT-{X}.md` | Worker task assignment | Worker X |
| `memory/MEMORY.md` | Knowledge index | Everyone (auto-loaded) |
| `memory/user-decisions.md` | Every user choice, saved | All roles (read + write) |
| `.claude/templates/{ROLE}-PLAN.md` | Plan template for each role | Plan-mode agents |

---

## Feature Tour

### Memory Architecture
- `memory/MEMORY.md` — loaded on every session, links to topic files
- `memory/{topic}.md` — detailed knowledge per domain (auth, payments, design, etc.)
- `memory/user-decisions.md` — decision register, ensures no user choice is ever lost
- Each topic file has a `## User Decisions` table for domain-specific choices

### Sprint Board
- `memory/SPRINT-BOARD.md` — current sprint task tracking
- Tasks with status (TODO, IN PROGRESS, DONE, BLOCKED)
- Bundle size and build metrics per sprint

### Skills
Custom skills available as `/skill-name` in Claude Code:
- `/sprint-status` — quick snapshot of sprint state
- `/sprint-gate` — pre-sprint validation (6 checks)
- `/sprint-verify` — verify a worker branch before merge
- `/sprint-merge` — execute a single branch merge
- `/sprint-audit` — post-sprint audit
- `/sprint-metrics` — collect quality gate data
- `/sprint-deploy` — deploy services
- `/ios-checklist` — iOS Safari rules for UI code (if applicable)

### Context Intelligence (Optional)
Advanced layer for larger codebases:
- `codebase-manifest.json` — dependency map (importedBy, dependencies, line counts)
- `doc-index.json` — maps task domains to documentation, code files, and rules
- Helps Coordinator write laser-targeted SESSION-PROMPTs

---

## "Ask Me About..." Topics

If you're a Claude Code session reading this file, you can explain any of these topics to the user:

- **"How do I start a sprint?"** — Explain the Coordinator activation + SESSION-PROMPT flow
- **"What are the roles?"** — Walk through all 4 roles with when/why to use each
- **"How does memory work?"** — Explain MEMORY.md index + topic files + decision register
- **"What's the inbox?"** — Explain async messaging between roles
- **"What's Lite mode?"** — Standard vs Lite workers, when to use which
- **"How do workers communicate?"** — They don't directly; inbox + SESSION-LOG + WORKER-REPORT
- **"What's the plan cycle?"** — Plan -> approve -> context clear -> execute
- **"How do I add a new skill?"** — Create `.claude/skills/{name}/SKILL.md` with frontmatter
- **"How does Context Intelligence work?"** — 3-layer system (manifest + doc-index + targeted prompts)
- **"What are the core principles?"** — Productivity > Efficiency > Accuracy > Token Efficiency
- **"How do I run an audit?"** — Activate the Auditor role after a sprint completes
