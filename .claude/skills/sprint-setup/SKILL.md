---
name: sprint-setup
description: Automates Phase 2 mechanical work — creates sprint directory, templates, worktrees, runs npm install, seeds SPRINT-BOARD, outputs activation prompts.
context: fork
agent: general-purpose
allowed-tools: Read, Bash, Write, Glob
argument-hint: "<sprint-number> <worker-count> [worker-labels]"
---

# Sprint Setup — Phase 2 Mechanical Automation

Automates the repetitive Phase 2 work so the Coordinator can focus on writing great SESSION-PROMPTs.

## Step 0: Parse Arguments

Arguments format: `<sprint-number> <worker-count> [worker-labels]`

Examples:
- `/sprint-setup 36 3` → Sprint 36, 3 workers (A, B, C)
- `/sprint-setup 36 2 a b` → Sprint 36, 2 workers with labels a, b

If no labels provided, use lowercase letters: a, b, c, d, e (up to worker count).

Set:
- `SPRINT_NUM` = sprint number
- `WORKER_COUNT` = number of workers
- `WORKER_LABELS` = array of worker labels (lowercase)

## Step 1: Create Sprint Directory

```bash
mkdir -p .sprint/sprint-${SPRINT_NUM}
```

Verify the directory was created.

## Step 2: Copy SPRINT-LOG Template

Copy `.claude/templates/SPRINT-LOG.md` to `.sprint/sprint-${SPRINT_NUM}/SPRINT-LOG.md`.

Replace `{N}` placeholders with the actual sprint number.

## Step 3: Create Worktrees

For each worker label:

```bash
# Clean up any existing worktree/branch with this name
git worktree remove "../worktree-${label}" --force 2>/dev/null
git branch -D sprint${SPRINT_NUM}-worker-${label} 2>/dev/null

# Create fresh worktree
git worktree add "../worktree-${label}" -b sprint${SPRINT_NUM}-worker-${label} main
```

**Port assignments**: A=3001, B=3002, C=3003, D=3004, E=3005.

## Step 4: Run npm install

For each worktree:

```bash
cd ../worktree-${label}/FE && npm install
```

If BE/ exists in scope, also run `cd ../worktree-${label}/BE && npm install`.

Report install results (success/failure) for each worktree.

## Step 5: Seed SPRINT-BOARD

Read `memory/SPRINT-BOARD.md`. Add a new sprint section at the top (after the frontmatter and header):

```markdown
## Sprint ${SPRINT_NUM} Tasks (ACTIVE)

| ID | Task | Owner | Status | Notes |
|----|------|-------|--------|-------|
| {next-id} | Create sprint artifacts + worktrees + SESSION-PROMPTs | Coordinator | DONE | {mode} mode, {count} workers |
```

Use the next available task ID (increment from the highest existing ID).

## Step 6: Output Activation Prompts

For each worker, output the activation prompt the user will paste:

**STANDARD workers**:
```
Open terminal in ../worktree-${label}. Read .sprint/roles/WORKER-ROLE.md, then read SESSION-PROMPT.
```

**LITE workers**:
```
Open terminal in ../worktree-${label}. Read SESSION-PROMPT then CLAUDE.md. Follow the instructions.
```

Also output:
- Worker port assignments table
- Worktree paths table
- Reminder: "Coordinator must write SESSION-PROMPTs before activating workers"

## Escape Hatch

Adapt these steps if your sprint has unusual requirements. This skill handles the mechanical work — the Coordinator still makes all judgment calls (mode selection, worker count, task assignment, SESSION-PROMPT content).

## Rules

- This skill runs in a forked context to protect the main conversation.
- Do NOT write SESSION-PROMPTs — that's the Coordinator's primary job.
- Do NOT decide mode (Direct/Delegation/Hybrid) — that's a Coordinator judgment call.
- If any step fails, report the failure and continue with remaining steps.
- Commit artifacts BEFORE creating worktrees (worktrees branch from main at creation time).
