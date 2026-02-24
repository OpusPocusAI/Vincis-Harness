---
name: sprint-status
description: Show current sprint state at a glance — active tasks, blockers, worker progress, branch status. Use at the start of any session or when you need quick context.
allowed-tools: Read, Bash, Glob, Grep
---

# Sprint Status — Quick Situational Awareness

You are providing a quick snapshot of the current sprint state. This helps any role
(Auditor, Coordinator, Assistant, Worker) get oriented without reading multiple files.

## Step 1: Git State

Run these commands to understand the current branch situation:

1. `git branch -a | grep -i sprint` — show active sprint branches
2. `git log --oneline -10` — recent commits
3. `git status --short` — uncommitted changes

## Step 2: Sprint Artifacts

Check which sprint artifacts exist and read them:

1. Use Glob to scan `.sprint/sprint-*/CONTRACT.md` (pick highest number).
   Fallback: `SPRINT-CONTRACT.md` in the repo root.
   - If found: extract sprint goal, worker list, merge order
   - If not found: note "No active sprint contract"

2. Use Glob to scan `.sprint/sprint-*/COORDINATOR-LOG.md` (pick highest number).
   Fallback: `COORDINATOR-LOG.md` in the repo root.
   - If found: extract last timeline entry (most recent action)
   - If not found: note "No coordinator log"

3. Read `memory/SPRINT-BOARD.md` if it exists
   - Extract: task counts (done/in-progress/blocked), active blockers

## Step 3: Active Branches & Worker Progress

For each sprint branch found in Step 1:
- `git log main..{branch} --oneline` — count commits ahead of main
- Note if the branch has been merged already

## Step 4: Output the Status

Format the output as:

```
## Sprint Status

**Sprint**: {sprint number/name from contract, or "No active sprint"}
**Goal**: {sprint goal, or "N/A"}
**Date**: {today}

### Workers
| Worker | Branch | Commits ahead | Status |
|--------|--------|---------------|--------|
| {name} | {branch} | {N} | {active/merged/no commits} |

### Task Summary
{From SPRINT-BOARD.md if available}
- Done: {N}
- In progress: {N}
- Blocked: {N}

### Blockers
{List active blockers from SPRINT-BOARD.md, or "None"}

### Recent Activity
{Last 5 commits from git log}

### Uncommitted Changes
{From git status, or "Working tree clean"}
```

## Rules

- This is a READ-ONLY snapshot. Do not modify any files.
- Keep the output concise — this is meant to be glanced at, not studied.
- If no sprint is active, say so clearly and suggest what to do next (e.g., "Check
  NEXT-SESSION-KICKSTART-COORDINATOR.md for planned work").
