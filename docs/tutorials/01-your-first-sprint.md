# Tutorial: Your First Sprint

> This tutorial walks you through running a complete sprint with Vinci's CC-Harness. By the end, you'll have used the Coordinator and Worker roles to plan, implement, and merge a piece of work.

---

## Prerequisites

Before starting, make sure:

1. **Claude Code** is installed and working (`claude` command in terminal)
2. **The harness** is installed in your project (you have `CLAUDE.md`, `.sprint/`, `.claude/`, `memory/` directories)
3. **Git** is initialized in your project
4. Your project has at least a basic `CLAUDE.md` with your project's architecture section filled in

---

## Step 1: Open the Coordinator Terminal

Open a terminal in your project directory and start Claude Code:

```bash
claude
```

Name this terminal **"Coordinator"** (in your terminal app's tab settings).

Paste this activation prompt:

```
You are the Coordinator. Read CLAUDE.md and .sprint/roles/COORDINATOR-ROLE.md.
```

### What happens:
- Claude Code reads `CLAUDE.md` (auto-loaded) and the Coordinator role doc
- It enters **plan mode** — reading your codebase, checking docs, understanding the current state
- It will write a **COORDINATOR-PLAN.md** file with the sprint plan

### What you do:
- Tell the Coordinator what you want to build. For example:
  - *"I want to add a user profile page and fix the login bug"*
  - *"Refactor the auth module and add rate limiting"*
- The Coordinator will ask clarifying questions, then write a plan
- **Review the plan carefully** — this is your chance to adjust scope
- Approve the plan when you're satisfied

> **Tip**: For your first sprint, keep it small. 1-2 workers, 1-2 tasks each. You can scale up later.

---

## Step 2: Coordinator Creates Worker Prompts

After you approve the plan, the context clears and execute mode begins.

The Coordinator will:

1. **Create the sprint directory**: `.sprint/sprint-1/`
2. **Create git worktrees** for each worker:
   ```
   ../worktree-a (branch: sprint1-worker-a)
   ../worktree-b (branch: sprint1-worker-b)
   ```
3. **Write SESSION-PROMPT files**:
   - `.sprint/sprint-1/SESSION-PROMPT-A.md` — Worker A's task assignment
   - `.sprint/sprint-1/SESSION-PROMPT-B.md` — Worker B's task assignment
4. **Provide activation prompts** — exact text to paste into worker terminals

### What you'll see:

The Coordinator will output something like:

```
Sprint 1 ready. 2 workers:

Worker A (Standard): Add user profile page
  Worktree: ../worktree-a
  Branch: sprint1-worker-a
  Activate: Open a new terminal IN ../worktree-a and paste:
  "Read .sprint/sprint-1/SESSION-PROMPT-A.md"

Worker B (Lite): Fix login bug
  Worktree: ../worktree-b
  Branch: sprint1-worker-b
  Activate: Open a new terminal IN ../worktree-b and paste:
  "Read .sprint/sprint-1/SESSION-PROMPT-B.md"
```

---

## Step 3: Activate Workers

### Worker A

Open a **new terminal** (not the Coordinator terminal). Navigate to the worktree:

```bash
cd ../worktree-a
claude
```

Name this terminal **"Worker A"**.

Paste the activation prompt:

```
Read .sprint/sprint-1/SESSION-PROMPT-A.md
```

### What happens:
- Worker A reads its SESSION-PROMPT (task description, file ownership, acceptance criteria)
- If Standard mode: enters plan mode, writes a WORKER-PLAN, asks for your approval
- If Lite mode: starts working immediately (no plan phase)
- Implements the assigned tasks
- Writes a SESSION-LOG documenting what was done
- Commits to its branch

### Worker B

Open another terminal, navigate to the other worktree:

```bash
cd ../worktree-b
claude
```

Name this terminal **"Worker B"**. Paste its activation prompt:

```
Read .sprint/sprint-1/SESSION-PROMPT-B.md
```

### What you do during worker execution:
- **Monitor progress** — workers will update you as they work
- **Answer questions** — workers may ask for clarification
- **Approve plans** — Standard workers need plan approval
- You can switch between terminals freely

> **Important**: Workers work in isolation. They can't see each other's changes. This is by design — it prevents conflicts during implementation.

---

## Step 4: Workers Complete

When a worker finishes, it will:

1. **Commit all changes** to its branch
2. **Write a SESSION-LOG** (`.sprint/sprint-1/SESSION-LOG-{X}.md`)
3. **Kill any dev servers** it started
4. **Signal completion**: "Branch committed, ready for merge"

### What to check before moving on:
- Worker says "Branch committed" (not just "I'm done")
- No dev servers left running (check with `lsof -i :3001` or equivalent)
- SESSION-LOG exists in the sprint directory

---

## Step 5: Merge (Back in Coordinator Terminal)

Go back to your **Coordinator terminal**. If the Coordinator session ended, start a new one:

```bash
claude
```

For the merge phase, use this activation:

```
You are the Merge Coordinator. Read CLAUDE.md and .sprint/roles/COORDINATOR-ROLE.md, then find and read the MERGE-HANDOFF.md in the highest-numbered sprint directory under .sprint/.
```

### The merge process:

The Merge Coordinator will:

1. **Read each worker's report** (SESSION-LOG, WORKER-REPORT)
2. **Merge Worker A's branch** to main
3. **Run the build** — verify it passes
4. **Rebase Worker B's branch** onto the new main
5. **Merge Worker B's branch** to main
6. **Run the build again** — verify everything works together
7. **Clean up worktrees**
8. **Update documentation** (docs/CURRENT.md, etc.)

### What can go wrong:
- **Merge conflicts**: The Coordinator will attempt to resolve them. If it can't, it'll ask you.
- **Build failure after merge**: The Coordinator will investigate and fix, or ask you to intervene.
- **Missing SESSION-LOG**: Worker didn't follow completion protocol. Note for future sprints.

---

## Step 6: Sprint Complete

After successful merge, your sprint is done. The Coordinator will:

1. Update `docs/CURRENT.md` with what was delivered
2. Write a COORDINATOR-LOG summarizing the sprint
3. Optionally leave inbox messages for the Auditor

### Optional: Run an Audit

If you want to improve your process, open a new terminal:

```bash
claude
```

Paste:

```
You are the Auditor. Read CLAUDE.md and .sprint/roles/AUDITOR-ROLE.md.
```

The Auditor will:
- Read all sprint artifacts (logs, reports, inbox messages)
- Write a retrospective with grades on the 4 core principles
- Identify what worked and what needs improvement
- Update templates and role docs based on learnings

---

## The Inbox System

Between sprints (or during), roles can leave messages for each other:

| File | Who reads it |
|------|-------------|
| `.sprint/inbox/coordinator.md` | The Coordinator |
| `.sprint/inbox/auditor.md` | The Auditor |
| `.sprint/inbox/workers.md` | All workers (shared) |

Messages have a lifecycle:
```
UNREAD → READ → DONE → delete
```

Every message must have `**From**: Role` and `**To**: Role` headers.

### Example inbox message:

```markdown
### [UNREAD] Auth module needs refactoring — MEDIUM
**From**: Worker A | **To**: Coordinator | **Date**: 2026-03-01

Found that auth.ts has circular imports with user.ts. Not blocking my current task
but should be addressed in the next sprint. Details in SESSION-LOG-A.md.
```

---

## What to Expect

### First sprint
- Things will feel slow — that's normal. The Coordinator is learning your codebase.
- Workers might ask obvious questions. They have no prior context.
- The plan->execute cycle adds overhead. It pays off from sprint 2 onward.
- Focus on getting the flow right, not maximum output.

### By sprint 3
- The Coordinator knows your architecture and conventions
- Memory files capture decisions and patterns
- Workers reference prior sprint learnings
- The overhead drops significantly

### By sprint 5+
- The harness starts self-improving (Auditor identifies patterns)
- Lite mode becomes viable for straightforward tasks
- Sprint velocity stabilizes and becomes predictable

---

## Troubleshooting

### "Worker says it can't find the SESSION-PROMPT"
The worker terminal must be opened IN the worktree directory, not the main project. Check: `pwd` should show `../worktree-a`, not your project root.

### "Workers are editing the same file"
The Coordinator should assign primary file ownership. If conflicts happen, the Merge Coordinator resolves them. For future sprints, make ownership explicit in SESSION-PROMPTs.

### "Build fails after merge"
Usually a missing import or conflicting change. The Merge Coordinator will attempt to fix it. If it can't, you may need to intervene manually.

### "Context getting too large"
Use `/clear` between unrelated tasks. Consider Lite mode for straightforward workers. The harness is designed to work within context limits — if you're hitting them, your sprint scope is too large.

### "Worker committed on main instead of its branch"
This is a harness gap if it happens. Check that worktrees were created correctly (`git worktree list`). The pre-flight Gate 0 in WORKER-PLAN.md should catch this for Standard workers.

### "I forgot what the user decided"
Check `memory/user-decisions.md` — every decision should be there. If it's not, that's a process gap to fix. Add it now and note the gap for the Auditor.

---

## Next Steps

- **Scale up**: Try 3 workers in your next sprint
- **Add Lite workers**: For simple, well-defined tasks
- **Run an audit**: The Auditor finds improvements you won't notice
- **Customize skills**: Add project-specific `/skill-name` commands
- **Set up Context Intelligence**: For larger codebases (100+ files)

See the [README](../../README.md) for the full feature list and documentation links.
