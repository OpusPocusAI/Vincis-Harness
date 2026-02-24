![Version](https://img.shields.io/badge/version-4.4-blue)
![License](https://img.shields.io/badge/license-Custom%20(Free%20Use)-green)
![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-blueviolet)
![Sprints](https://img.shields.io/badge/sprints-19%2B-orange)

# Vinci's CC-Harness

Multi-terminal sprint system for Claude Code. Each terminal gets a role — Coordinator, Worker, Auditor, or Assistant — and they coordinate through markdown files. No plugins, no servers, no shared context windows.

<p align="center">

![4 Roles](https://img.shields.io/badge/4_ROLES-7B42BC?style=for-the-badge)
![Persistent Memory](https://img.shields.io/badge/PERSISTENT_MEMORY-2ea44f?style=for-the-badge)
![Git Worktrees](https://img.shields.io/badge/GIT_WORKTREES-0969da?style=for-the-badge)
![Plan Execute](https://img.shields.io/badge/PLAN_%E2%86%92_EXECUTE-CF5C00?style=for-the-badge)
![Lite Mode](https://img.shields.io/badge/LITE_MODE-B8860B?style=for-the-badge)
![File Inbox](https://img.shields.io/badge/FILE_INBOX-007A7A?style=for-the-badge)

</p>

<table>
<tr>
<td align="center">
<img src="docs/assets/terminal-layout.png" alt="Terminal layout: Coordinator, Workers A-E, Auditor, Assistant" />
<br />
<em>My setup</em>
</td>
<td>

**Coordinator** at the top. **Workers A through E** — each on their own branch. **Auditor** and **Assistant** on standby. Every terminal is a separate Claude Code session. They don't share context windows — they share files.

</td>
</tr>
</table>

---

## How It Works

The sprint loop:

1. Open a terminal. *"You are the Coordinator. Read CLAUDE.md."*
2. Coordinator plans the sprint — what gets built, who builds it, what order.
3. Coordinator writes a SESSION-PROMPT per worker. Scope, context, rules, acceptance criteria — everything the worker needs is in that one file.
4. Open more terminals. One per worker. *"Read SESSION-PROMPT-A.md."*
5. Workers implement in isolated git worktrees. One worker, one branch, no conflicts.
6. Workers commit, write a report, done.
7. Coordinator merges branches back to main — one at a time.
8. Auditor reviews the sprint, writes a retro. Findings feed back into the harness.

Everything flows through files in `.sprint/` and `memory/`.

```
                     COORDINATOR
                 plans · delegates · merges
                          |
         +-------+-------+-------+-------+
         |       |       |       |       |
      WORKER   WORKER  WORKER  WORKER  WORKER
        A        B       C       D       E
      branch   branch  branch  branch  branch
         |       |       |       |       |
         +-------+-------+-------+-------+
                          |
                       AUDITOR
                   reviews · retros

                      ASSISTANT
                   deploys · answers
```

| Role | Does what | How many |
|------|----------|----------|
| **Coordinator** | Plans sprint, writes worker prompts, merges branches, tracks progress | 1 |
| **Worker** | Implements code in an isolated git worktree. One task, one branch. | 1–5 |
| **Auditor** | Reviews quality, writes retros, improves the harness | 1 (optional) |
| **Assistant** | Deploys, pushes, runs builds, answers questions | 1 (on-demand) |

---

## Quick Start

### 1. Install

```bash
git clone https://github.com/OpusPocusAI/Vincis-Harness.git
cp -r Vincis-Harness/harness/* your-project/
```

### 2. Configure

Edit `CLAUDE.md` in your project root — services, ports, deploy commands, code conventions. Claude Code reads this file on every session start.

### 3. Run a sprint

```bash
# Terminal 1 — Coordinator
claude
# "You are the Coordinator. Read CLAUDE.md."

# Terminal 2 — Worker A
claude
# "Read .sprint/sprint-1/SESSION-PROMPT-A.md"

# Terminal 3 — Worker B (optional)
claude
# "Read .sprint/sprint-1/SESSION-PROMPT-B.md"
```

Full walkthrough → [Your First Sprint](docs/tutorials/01-your-first-sprint.md)

---

## What makes it work

**Memory** — `memory/` files persist across sessions. Topic-based: payments, design, auth, whatever your project needs. A decision register (`user-decisions.md`) tracks every user choice — so the next sprint doesn't repeat a conversation about which payment provider to use.

**Inbox** — Roles message each other through `.sprint/inbox/`. UNREAD → READ → DONE → delete. Not real-time, but it works. Coordinator leaves instructions, workers flag blockers, Auditor drops review notes.

**Plan → Execute** — Every role: plan mode → write plan → user approves → context clears → execute mode. Execute starts with zero memory of the planning conversation — the plan file is the only input. That's how you survive long sprints without context blowout.

**Lite mode** — Standard workers go through full ceremony: role doc, plan mode, templates. Lite workers get a self-contained prompt with everything inline. ~45–55% token savings. Coordinator picks Standard or Lite per worker based on task complexity.

**Git worktrees** — Each worker gets its own worktree and branch. `../worktree-a`, `../worktree-b`, etc. No merge conflicts during the sprint. Coordinator merges one at a time afterward.

**Templates** — Plan templates, session prompts, session logs, worker reports, coordinator logs. Every artifact has structure so nothing critical gets skipped in the plan → execute handoff.

> Context Intelligence is available as an optional layer — maps codebase dependencies to help the Coordinator write more targeted prompts. See docs for details.

---

## What's Included

```
your-project/
├── CLAUDE.md                       # Master rules (auto-loaded every session)
├── GETTING-STARTED.md              # Guide that Claude reads on first setup
├── .sprint/
│   ├── roles/
│   │   ├── COORDINATOR-ROLE.md     # Coordinator protocol
│   │   ├── WORKER-ROLE.md          # Worker protocol
│   │   ├── AUDITOR-ROLE.md         # Auditor protocol
│   │   └── ASSISTANT-ROLE.md       # Assistant protocol
│   ├── inbox/                      # Inter-role messaging
│   ├── context/                    # Context Intelligence (optional)
│   └── sprint-1/                   # Sprint artifacts (per sprint)
├── .claude/
│   ├── templates/                  # Plan and artifact templates
│   └── skills/                     # Custom skills
└── memory/
    ├── MEMORY.md                   # Memory index (auto-loaded)
    ├── sprint-process.md           # Sprint learnings
    ├── user-decisions.md           # Decision register
    └── {topic}.md                  # Your project's topic files
```

---

## Documentation

| Topic | File |
|-------|------|
| Your first sprint (step-by-step) | [`docs/tutorials/01-your-first-sprint.md`](docs/tutorials/01-your-first-sprint.md) |
| Getting started (Claude reads this) | [`harness/GETTING-STARTED.md`](harness/GETTING-STARTED.md) |
| Full changelog (v1 → v4.4) | [`CHANGELOG.md`](CHANGELOG.md) |

---

## Background

I'm a vibe coder. Self-taught, no CS degree, can't write syntax from scratch. I understand the basics and use Claude Code for everything else. This harness is what happens when you push that approach through 19 production sprints on a real product — [CityWijse](https://www.citywijse.com), an Amsterdam experiences platform competing with GetYourGuide and Tripadvisor. Built entirely this way.

The first sprint was chaos. All workers committed on main. Process compliance sat at ~20%. Context blew out every other session. A worker once picked the wrong payment provider because a user decision from 3 sessions ago wasn't saved anywhere.

Each version fixed something. v1 added roles and the inbox. v2 added memory and branch hooks. v3 got workers into worktrees — first time all workers landed on their correct branch. v4 made process steps part of the numbered task list, which got compliance from ~20% to ~90%. v4.1 added Lite mode for token savings.

Not perfect. Complex merges still need manual intervention, and the Auditor is more useful on bigger sprints than small ones. But the core loop — plan, delegate, implement, merge — is stable and repeatable. If you understand what you want to build and can read what Claude writes back, you can run this.

---

## Things to know

- **Plans go through SESSION-PROMPTs.** Don't paste a plan directly into a worker terminal. The Coordinator writes SESSION-PROMPTs — that's the only valid activation path.
- **One worker, one task.** If a worker would need to read more than ~2000 lines of source, split it into two workers.
- **Workers must commit.** Uncommitted work dies with the terminal.
- **Save decisions to files.** Any user decision ("use Stripe not Mollie") goes in `memory/user-decisions.md`. If it only exists in the conversation, it's already lost.

---

## FAQ

**Do I need multiple Claude Code subscriptions?**
No. Multiple terminals from the same installation. Each terminal = separate context window.

**How many workers should I run?**
Start with 1–2. Tested with up to 5. More workers = more merge complexity — only add them when tasks are genuinely parallel.

**Can I skip the sprint ceremonies?**
Yes. Coordinator + Worker work for any structured task. Full ceremony (contract, board, audit) is optional.

**Does this work with Cursor or Windsurf?**
No. Built for Claude Code — the roles, skills, and plan-execute cycle depend on how Claude Code handles `CLAUDE.md` and context windows.

---

## Contributing

Contributions welcome.

1. Open an issue describing the change
2. Follow the existing markdown structure
3. Test with at least one sprint cycle

---

## License

Free to use, modify, and learn from. Can't be sold, sublicensed, or claimed as someone else's work. See [LICENSE](LICENSE) for full terms.

---

Built by [OpusPocusAI](https://github.com/OpusPocusAI).
