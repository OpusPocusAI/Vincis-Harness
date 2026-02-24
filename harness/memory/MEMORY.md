# Memory Index

Auto-loaded into system prompt. Keep under 50 lines. Details live in topic files.

## Critical Rules

- **Deployment**: [Add your deployment rules here — e.g., subtree push commands, never push full monorepo]
- **Payments**: [Add payment provider decisions here — e.g., Stripe vs alternatives]
- **User Decisions**: Every user choice MUST be saved to `memory/user-decisions.md` AND the relevant topic file. Decisions that exist only in conversation context WILL be lost.
- **Mobile/iOS**: [Add mobile-specific rules here — e.g., safe area insets, dvh vs vh]

## Topic Files

| Topic | File | Key Content |
|-------|------|-------------|
| _Example_ | `memory/example-topic.md` | _User decisions, patterns, gotchas_ |
| Sprint Process | `memory/sprint-process.md` | Core principles, grading, plan cycle |
| Harness Health | `memory/harness-health.md` | Sprint health dashboard, changelog |

## Key Docs

| Working on... | Read this file |
|---|---|
| _Example: UI components_ | `docs/VISUALS.md` |
| Getting started | `GETTING-STARTED.md` |
| Current sprint board | `memory/SPRINT-BOARD.md` |
| User decisions register | `memory/user-decisions.md` |

## Kickstart Files

| Role | File |
|------|------|
| Coordinator | `kickstart/NEXT-SESSION-KICKSTART-COORDINATOR.md` |
| Auditor | `kickstart/NEXT-SESSION-KICKSTART-AUDITOR.md` |

## Active Sprint State

- **Current Sprint**: —
- **Phase**: —
- **Workers Active**: —
- **Blockers**: —

## Key Structure

```
memory/          # Persistent knowledge (topic files, decisions, health)
sprint/          # Sprint artifacts (role inboxes, sprint-N/ folders)
kickstart/       # Session handoff files (filled by Auditor/Coordinator)
roles/           # Role protocol docs
templates/       # Plan templates per role
```

Memory is repo-tracked, not in private `.claude/` dirs. The index (this file) auto-loads; topic files load on demand.
