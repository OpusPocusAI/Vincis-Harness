![Version](https://img.shields.io/badge/version-10.7-blue)
![License](https://img.shields.io/badge/license-Custom%20(Free%20Use)-green)
![Model Agnostic](https://img.shields.io/badge/model-agnostic-blueviolet)
![Hooks](https://img.shields.io/badge/hooks-39-orange)

# Vinci's Harness

**A framework for working with AI coding assistants — any model, any project.**

Whether you use Claude Code, Kimi 2.5, Cursor, GPT, or anything else, this harness gives your AI assistant memory, guardrails, and structure so it doesn't forget what you told it, repeat mistakes, or go off the rails.

<p align="center">

![Memory System](https://img.shields.io/badge/MEMORY_SYSTEM-2ea44f?style=for-the-badge)
![39 Hooks](https://img.shields.io/badge/39_GUARDRAILS-7B42BC?style=for-the-badge)
![Advisory Council](https://img.shields.io/badge/ADVISORY_COUNCIL-CF5C00?style=for-the-badge)
![Token Tracking](https://img.shields.io/badge/TOKEN_TRACKING-0969da?style=for-the-badge)
![Skills](https://img.shields.io/badge/6_SKILLS-B8860B?style=for-the-badge)

</p>

> **New to AI coding?** Start with [Agentic Coding 101](docs/guides/AGENTIC-CODING-101.md) — it explains what a harness is, why you need one, and the philosophy behind working with AI effectively. No prior experience required.

---

## The Problem This Solves

When you use an AI assistant to write code, you'll hit these problems within the first few sessions:

- **It forgets everything.** Every new session starts from zero. Decisions you made yesterday? Gone. That bug you fixed? It'll reintroduce it.
- **It makes the same mistakes.** Without feedback loops, the AI has no way to learn from corrections. You'll repeat yourself constantly.
- **It says "looks good" when it's not.** AI assistants are agreeable by default. Without skepticism built into the system, bad code slides through.
- **You can't track what it costs.** Sessions burn through tokens with no visibility into where the budget goes.
- **It goes off the rails.** One wrong assumption cascades into hours of wasted work because nothing caught it early.

The harness fixes all of this with three layers:

| Layer | What It Does | How |
|-------|-------------|-----|
| **Memory** | AI remembers decisions, research, and context across sessions | `memory/` folder with indexed topic files |
| **Guardrails** | AI can't skip steps, ignore errors, or make dangerous changes | 39 hooks that fire automatically on specific events |
| **Advisory Council** | Background agents that challenge assumptions and catch mistakes | 3 specialized agents that observe and nudge |

---

## What's Inside (v10.7)

```
your-project/
├── .claude/
│   ├── hooks/               # 39 guardrail scripts (auto-fire on events)
│   │   ├── dangerous-command-guard.cjs    # Blocks rm -rf, force push, etc.
│   │   ├── correction-cascade.cjs         # Turns corrections into permanent fixes
│   │   ├── diagnosis-evidence-gate.cjs    # Demands proof before root cause claims
│   │   ├── token-tracker.cjs              # Tracks session costs
│   │   ├── discord-reporter.cjs           # Posts session summary to Discord
│   │   └── ... (34 more)
│   ├── commands/             # 7 slash commands
│   │   ├── council.md        # /council — spawn advisory agents
│   │   ├── dream.md          # /dream — consolidate memory
│   │   └── ... (5 more)
│   ├── skills/               # 6 reusable workflows
│   │   ├── token-report/     # /token-report — usage dashboard
│   │   ├── security-audit/   # /security-audit — vulnerability scan
│   │   └── ... (4 more)
│   ├── templates/            # Plan and artifact templates
│   └── settings.json         # Hook orchestration config
├── .sprint/
│   ├── roles/                # Role protocols (Coordinator, Worker, Auditor, Assistant)
│   └── inbox/                # Async messaging between roles
├── memory/
│   ├── MEMORY.md             # Index file (auto-loaded every session)
│   ├── user-decisions.md     # Every decision you've made, saved forever
│   └── {topic}.md            # Your project's knowledge files
└── CLAUDE.md                 # Master rules (customize for your project)
```

---

## Quick Start

### 1. Clone and copy

```bash
git clone https://github.com/OpusPocusAI/Vincis-Harness.git
cp -r Vincis-Harness/.claude/ your-project/.claude/
cp -r Vincis-Harness/.sprint/ your-project/.sprint/
cp -r Vincis-Harness/harness/memory/ your-project/memory/
```

### 2. Customize CLAUDE.md

Copy the template CLAUDE.md to your project root and fill in:
- Your project's architecture (services, ports, tech stack)
- Your deployment process
- Your code conventions
- Your key files

### 3. Start a session

```bash
# Open your AI coding tool in the project directory
claude  # or kimi, cursor, etc.

# The AI reads CLAUDE.md automatically and knows your project's rules
```

### 4. Set up memory

As you work, the harness automatically captures:
- **Decisions** you make ("use PostgreSQL not MongoDB")
- **Research** the AI does (API comparisons, architecture options)
- **Corrections** you give ("don't use var, use const")

These persist in `memory/` and are available in every future session.

---

## The Three Layers Explained

### Layer 1: Memory System

Your AI forgets everything between sessions. Memory files fix this.

```
memory/
├── MEMORY.md              # Index — loaded every session, links to topic files
├── user-decisions.md      # "Use Stripe not PayPal" — saved forever
├── sprint-process.md      # How your team works, learnings from past sprints
└── {your-topics}.md       # Whatever your project needs
```

**How it works:**
- `MEMORY.md` is auto-loaded into every session's context
- Topic files contain detailed knowledge per domain
- Decision register ensures no user choice is ever lost
- Hooks automatically capture decisions and research into the right files

**Example:** You tell the AI "use Blueprint for the movement system, not C++." The `decision-capture-guard` hook catches this and saves it to `memory/user-decisions.md`. Next session, the AI knows — without you repeating it.

### Layer 2: Guardrails (39 Hooks)

Hooks are scripts that fire automatically when the AI does something. They can block, warn, or capture information.

| Category | What They Do | Examples |
|----------|-------------|---------|
| **Safety** | Block dangerous operations | `dangerous-command-guard` blocks `rm -rf`, force push, `DROP TABLE` |
| **Quality** | Enforce code standards | `quality-gate` runs type checks, `typecheck-on-edit` validates after every file change |
| **Process** | Prevent skipped steps | `council-enforcer` blocks work until advisory council is spawned |
| **Evidence** | Demand proof over guesses | `diagnosis-evidence-gate` requires evidence before claiming a root cause |
| **Capture** | Auto-save important info | `decision-capture-guard` saves user decisions, `research-capture-guard` saves findings |
| **Token** | Track spending | `token-tracker` logs costs per session, `complexity-estimator` advises which model to use |
| **Context** | Survive long sessions | `post-compact-context-saver` preserves state when context compresses |

**You don't need to configure these.** They're registered in `settings.json` and fire automatically. The AI doesn't even know they're there — it just can't do the bad things anymore.

### Layer 3: Advisory Council

Three background agents that watch the main AI and challenge it:

| Agent | Role | When It Speaks |
|-------|------|---------------|
| **Evidence Auditor** | Challenges assumptions, demands proof | When the AI claims something without evidence |
| **Behavior Watchdog** | Catches process violations | When the AI skips steps or declares done too early |
| **Code Reviewer** | Reviews code changes for bugs | At natural breakpoints (commits, task completions) |

The council is optional but powerful. It catches mistakes the main AI can't see because it's too deep in the work.

**Activate with:** `/council` (in Claude Code) or spawn equivalent background agents in your tool.

---

## Adapting for Your Tool

This harness was born in Claude Code but the **philosophy is universal**. Here's how concepts map to other tools:

| Harness Concept | Claude Code | Kimi 2.5 | Cursor / Windsurf | GPT |
|----------------|-------------|----------|-------------------|-----|
| **Memory files** | `memory/` folder, auto-loaded | Keep `memory/` folder, reference in system prompt | Same — reference in `.cursorrules` | Paste key decisions into system message |
| **CLAUDE.md rules** | Auto-loaded every session | Copy rules into system prompt or project config | Use `.cursorrules` file | Paste into "Custom Instructions" |
| **Hooks** | `.cjs` scripts fire automatically | Manual discipline (no hook system) — use checklists | Some support via extensions | Manual discipline |
| **Council** | Background agents via `/council` | Open separate chat windows with advisor prompts | Multiple Cursor windows | Separate GPT conversations |
| **Skills** | `/skill-name` slash commands | Copy skill content as prompts when needed | Command palette or snippets | Paste skill prompts manually |

**Key insight:** Even without automatic hooks, you can follow the same principles manually. The philosophy matters more than the automation.

---

## Philosophy

> Read [Agentic Coding 101](docs/guides/AGENTIC-CODING-101.md) for the full version.

The harness is built on five principles:

1. **Memory beats repetition.** Save every decision, every correction, every piece of research. Your AI should never make you repeat yourself.

2. **Guardrails beat trust.** Don't trust the AI to remember rules. Enforce them automatically. A hook that blocks `rm -rf` is worth more than a rule that says "be careful."

3. **Skepticism beats agreement.** The AI defaults to "good idea!" — that's dangerous. Build in agents or processes that challenge assumptions and demand proof.

4. **Evidence beats intuition.** "It should work" is not evidence. "The tests pass" is evidence. "The build succeeds" is evidence. Demand proof at every step.

5. **Structure beats talent.** A mediocre AI with good structure outperforms a brilliant AI with no structure. The harness IS the structure.

---

## What's New in v10.7

- **Token monitoring v2** — sessions tracked via monotonic cost analysis, per-session cost breakdown
- **Discord integration** — session summaries posted to your Discord channel automatically
- **Model-adaptive statusbar** — accuracy estimates adjust based on model (different curves for different context window sizes)
- **Burn rate projection** — "~2.5h of budget left" displayed in real-time
- `/token-report` skill — instant usage dashboard
- **Portability overhaul** — all 39 hooks genericized, zero project-specific references

---

## Documentation

| Topic | File |
|-------|------|
| **Start here (beginners)** | [`docs/guides/AGENTIC-CODING-101.md`](docs/guides/AGENTIC-CODING-101.md) |
| Getting started (AI reads this) | [`harness/GETTING-STARTED.md`](harness/GETTING-STARTED.md) |
| Your first sprint (step-by-step) | [`docs/tutorials/01-your-first-sprint.md`](docs/tutorials/01-your-first-sprint.md) |
| Full changelog | [`CHANGELOG.md`](CHANGELOG.md) |
| Discord setup | `.claude/hooks/discord-reporter.cjs` (see inline docs) |

---

## Background

Built by a vibe coder through 64+ production sprints on [CityWijse](https://www.citywijse.com), an Amsterdam travel platform. No CS degree — just AI and persistence.

The first sprint was chaos: 20% process compliance, context blowouts, forgotten decisions, workers on wrong branches. Each version fixed something. v1 added roles. v2 added memory. v4 got compliance to 90%. v8 shifted to coordinator-first. v10 added the council system, 39 hooks, and token tracking.

Now it's yours. The hooks, the memory system, the council — it all works regardless of which AI you use. If you can prompt an AI and read what it writes back, you can run this.

---

## License

Free to use, modify, and learn from. Can't be sold, sublicensed, or claimed as someone else's work. See [LICENSE](LICENSE) for full terms.

---

Built by [OpusPocusAI](https://github.com/OpusPocusAI).
