![Version](https://img.shields.io/badge/version-4.4-blue)
![License](https://img.shields.io/badge/license-Custom%20(Free%20Use)-green)
![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-blueviolet)
![Sprints](https://img.shields.io/badge/battle--tested-19%2B%20sprints-orange)

# Vinci's CC-Harness

**Turn Claude Code into a coordinated multi-agent development team.**

Vinci's CC-Harness is a free-to-use framework that gives Claude Code structured roles, persistent memory, inter-session messaging, and sprint lifecycle management. Open multiple terminals, assign roles, and watch them coordinate through markdown files — no custom infrastructure needed.

> *"Like having a development team that never forgets, never miscommunicates, and improves its own process every sprint."*

---

## How It Works

```
You open terminals.    You assign roles.    They coordinate through files.
      |                      |                        |
      v                      v                        v
  Terminal 1            "You are the              CLAUDE.md (rules)
  Terminal 2             Coordinator."             .sprint/inbox/ (messages)
  Terminal 3            "Read SESSION-             memory/ (knowledge)
  Terminal 4             PROMPT-A.md"              .sprint/sprint-N/ (artifacts)
```

### The Role System

```
                    +-----------------+
                    |   COORDINATOR   |
                    |  Plans sprints  |
                    |  Writes prompts |
                    |  Merges work    |
                    +--------+--------+
                             |
              +--------------+--------------+
              |              |              |
     +--------v---+  +------v-----+  +-----v------+
     |  WORKER A  |  |  WORKER B  |  |  WORKER C  |
     |  Feature X |  |  Feature Y |  |  Bug fixes |
     |  Branch A  |  |  Branch B  |  |  Branch C  |
     +------------+  +------------+  +------------+
              |              |              |
              +--------------+--------------+
                             |
                    +--------v--------+
                    |    AUDITOR      |
                    | Inspects quality|
                    | Improves process|
                    +-----------------+

     +----------------+
     |   ASSISTANT    |
     | Deploys, pushes|
     | Answers queries|
     +----------------+
```

| Role | What It Does | When to Use |
|------|-------------|-------------|
| **Coordinator** | Plans sprints, writes worker prompts, merges branches, tracks progress | Every sprint — this is the orchestrator |
| **Worker** | Implements code changes in isolated git worktrees | 1-5 per sprint, each on a separate branch |
| **Auditor** | Inspects process quality, writes retrospectives, improves the harness | After sprints, or when process needs attention |
| **Assistant** | Pushes to repos, runs builds, answers questions, handles deployments | On-demand for operational tasks |

---

## Results

This harness was developed over 19 production sprints on a real product. Here's what it achieved:

| Metric | Before Harness | After 19 Sprints |
|--------|---------------|-----------------|
| Branch compliance | 0% (all workers on main) | **100%** (5 consecutive sprints) |
| Process compliance | ~20% (instructions ignored) | **~90%** (4 consecutive sprints) |
| Worker delivery rate | ~60% (partial deliveries) | **100%** (3 consecutive sprints) |
| Context blowout incidents | Regular | **Zero** (4 consecutive sprints) |
| Sprint grade (4 principles) | Mixed B/C | **All A/A-** (first achieved Sprint 19) |

### The 4 Core Principles

Every sprint is graded on these principles (ordered by priority):

1. **Productivity** — More output in less time
2. **Efficiency** — No repeating yourself; the system remembers
3. **Accuracy** — Cross-checking between AIs approaches 100% correctness
4. **Token Efficiency** — Among accurate approaches, choose the most elegant

---

## Quick Start

### 1. Install

```bash
# Clone the harness repo
git clone https://github.com/OpusPocusAI/Vincis-Harness.git

# Copy harness files into your project
cp -r Vincis-Harness/harness/* your-project/
```

> **Coming soon**: `npx vincis-harness init` — interactive setup with project-specific configuration.

### 2. Configure

Edit `CLAUDE.md` in your project root with your project's details:
- Service architecture (ports, entry points, start commands)
- Deployment commands
- Code conventions
- Key directories

The harness reads `CLAUDE.md` automatically on every Claude Code session start.

### 3. Run Your First Sprint

```bash
# Terminal 1: Open Claude Code
claude

# Paste: "You are the Coordinator. Read CLAUDE.md."
# The Coordinator will plan a sprint and create worker prompts.

# Terminal 2: Open another Claude Code session
claude

# Paste: "Read .sprint/sprint-1/SESSION-PROMPT-A.md"
# Worker A starts implementing.

# Terminal 3 (optional): Another worker
claude
# Paste: "Read .sprint/sprint-1/SESSION-PROMPT-B.md"
```

See [Your First Sprint Tutorial](docs/tutorials/01-your-first-sprint.md) for a detailed walkthrough.

---

## Features

### Roles & Terminals
Four specialized roles with defined boundaries. Each runs in its own Claude Code terminal. Role docs define exactly what each role can and cannot do.

### Sprint Lifecycle
Plan → Execute → Merge → Audit. The Coordinator plans work, creates worker prompts, workers implement in git worktrees, the Coordinator merges, the Auditor reviews. Every step has templates and checklists.

### Persistent Memory
Knowledge survives across sessions via `memory/` files. Topic-based organization (payments, design, search, auth). Decision register ensures no user choice is ever lost. Memory index auto-loaded on every session start.

### Inter-Session Inbox
Roles communicate through `.sprint/inbox/` files. Status flow: UNREAD -> READ -> DONE -> delete. Messages have From/To headers. Async coordination without shared context windows.

### Plan -> Execute Cycle
Every role follows: plan mode -> plan file -> user approves -> context clears -> execute mode. Execute mode has ZERO prior context — the plan file is the only input. This prevents context blowout and ensures reproducibility.

### Lite Mode
Two-mode system for workers: **Standard** (full ceremony, plan mode) and **Lite** (self-contained prompt, no plan mode, ~45-55% token savings). Coordinator selects per worker based on task complexity.

### Context Intelligence
Optional layer that maps your codebase dependencies and documentation domains. Helps the Coordinator write targeted worker prompts with exact file references, reducing worker exploration time by 40-60%.

### Self-Improving Process
Fix Tracker monitors harness improvements across sprints. Health Dashboard tracks metrics. Retrospectives feed learnings back into templates and role docs. The harness literally improves itself.

---

## What's Included

```
your-project/
├── CLAUDE.md                       # Master rules (auto-loaded every session)
├── GETTING-STARTED.md              # Self-explaining guide for Claude Code
├── .sprint/
│   ├── roles/
│   │   ├── COORDINATOR-ROLE.md     # Full Coordinator protocol
│   │   ├── WORKER-ROLE.md          # Full Worker protocol
│   │   ├── AUDITOR-ROLE.md         # Full Auditor protocol
│   │   └── ASSISTANT-ROLE.md       # Full Assistant protocol
│   ├── inbox/
│   │   ├── coordinator.md          # Coordinator's inbox
│   │   ├── auditor.md              # Auditor's inbox
│   │   └── workers.md              # Shared worker inbox
│   ├── context/                    # Context Intelligence (optional)
│   └── sprint-1/                   # Sprint artifacts (created per sprint)
├── .claude/
│   ├── templates/                  # 12 plan/artifact templates
│   └── skills/                     # 8 custom skills
└── memory/
    ├── MEMORY.md                   # Memory index (auto-loaded)
    ├── sprint-process.md           # Sprint learnings & patterns
    ├── user-decisions.md           # Decision register
    └── {topic}.md                  # Topic-specific memory files
```

---

## Documentation

| Topic | File |
|-------|------|
| Your first sprint (step-by-step) | [`docs/tutorials/01-your-first-sprint.md`](docs/tutorials/01-your-first-sprint.md) |
| Self-explaining guide (Claude reads this) | [`harness/GETTING-STARTED.md`](harness/GETTING-STARTED.md) |
| Full changelog (v1 through v4.4) | [`CHANGELOG.md`](CHANGELOG.md) |
| GitHub repo setup content | [`github-setup.md`](github-setup.md) |
| Concepts: Roles | `docs/concepts/` *(coming soon)* |
| Concepts: Memory Architecture | `docs/concepts/` *(coming soon)* |
| Reference: Template Schema | `docs/reference/` *(coming soon)* |
| Reference: Skill Authoring | `docs/reference/` *(coming soon)* |

---

## Principles

This harness is opinionated. It was built on hard-won lessons:

- **Plans bypass the harness.** Never paste a plan directly into a worker terminal. Plans feed into SESSION-PROMPTs — that's the only activation path.
- **One worker = one verb.** If a worker must read >2000 source lines, split the scope.
- **Workers must commit.** Uncommitted work dies with the terminal.
- **Decisions must be saved.** No user choice may exist only in conversation context.
- **Process steps must be numbered tasks.** Anything outside the numbered task list gets lost in the plan->execute context clear.
- **Measure, fix, validate.** Every harness change is tracked, measured after 2 sprints, and either verified or rolled back.

---

## FAQ

**Q: Do I need multiple Claude Code subscriptions?**
A: No. You open multiple Claude Code terminals (sessions) from the same installation. Each terminal is a separate context window.

**Q: Does this work with Claude Code Teams/Enterprise?**
A: Yes. The harness is pure markdown — it works with any Claude Code setup.

**Q: How many workers should I use?**
A: Start with 1-2. The harness has been tested with up to 5. Use the optimal count, not the maximum — justify in your plan.

**Q: Can I use this without sprints?**
A: Yes. The Coordinator and Worker roles work for any structured task. The sprint ceremony (Contract, Board, Audit) is optional but recommended.

**Q: What if I only want the memory system?**
A: You can use `memory/MEMORY.md` and topic files standalone. The memory architecture doesn't depend on the role system.

---

## Contributing

Contributions welcome. Please:
1. Open an issue describing the change
2. Follow the existing markdown structure
3. Test with at least one sprint cycle before submitting

---

## License

Free to use, modify, and learn from. Cannot be sold, sublicensed, or claimed as someone else's work. See [LICENSE](LICENSE) for full terms.

---

*Built by [OpusPocusAI](https://github.com/OpusPocusAI) — battle-tested over 19 production sprints.*
