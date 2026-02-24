# SESSION-PROMPT — Worker {X} (Sprint {N}) [LITE]

> Branch: sprint{N}-worker-{x} | Port: {300X} | Worktree: ../worktree-{x}
> Mode: LITE — implement tasks, write slim SESSION-LOG, commit, signal done.

## LITE Mode Rules
- **Skip**: inbox scan, WORKER-ROLE.md, memory files — this prompt is self-contained
- **Skip**: docs/ updates and WORKER-REPORT — Coordinator handles post-sprint
- **Skip**: writing to auditor.md — observations go in SESSION-LOG Review Block only. Coordinator consolidates.
- **Amend commits OK** if adding SESSION-LOG to an existing commit
- Your ONLY inputs are this file + CLAUDE.md (auto-loaded)

## STEP 0: Verify (run FIRST)

```bash
# Run these 2 commands BEFORE doing anything else:
git branch --show-current
# Expected: sprint{N}-worker-{x}
# If wrong: run `git worktree list`, find your worktree, navigate there. Only STOP if worktree can't be found/created.

pwd
# Expected: path ending in /worktree-{x}
# If wrong: check `git worktree list` for correct path. Only STOP if worktree missing.
```

## Task

{1-3 sentence description of what to build. Be specific — this is the worker's ONLY context.}

## Key Decisions (pre-loaded — no external reads needed)

- {Decision 1 — extracted from relevant memory file by Coordinator}
- {Decision 2}
- {Decision 3}
- {Add 1-2 more if relevant. Max 5.}

## Acceptance Criteria

1. {Criterion 1}
2. {Criterion 2}
3. {Criterion N}
4. SESSION-LOG committed (see skeleton below)

## Primary Ownership

{List of files this worker owns. Format: `path/to/file.ext` one per line.}

## Implementation Tasks

Task 1: {First implementation step}
Task 2: {Second implementation step}
Task N: Build verification — `{{BUILD_COMMAND}}` (0 errors, 0 warnings about owned files)

## DONE CHECKLIST (do ALL before signaling done)

- [ ] Kill any dev servers (`npx kill-port {PORT}` or Ctrl+C)
- [ ] Write `.sprint/sprint-{N}/SESSION-LOG-{X}.md` using skeleton below
- [ ] `git add` all changed files + SESSION-LOG
- [ ] `git commit -m "Worker {X}: {one-line summary}"`
- [ ] Signal: **"Branch committed, ready for merge."**

## SESSION-LOG Skeleton

```markdown
# SESSION-LOG — Worker {X} (Sprint {N}) [LITE]

## Completed
- {What was built — bullet list}
- {Include cross-ownership edits inline: "Also edited: path/file.ext — reason"}

## Verified
- {How you tested: build pass, manual check, etc.}

## Issues Found
- {Bugs discovered, or "None"}

## Review Block
- **What slowed me down**: {honest answer}
- **Bugs found**: {list or "None"}
- **One thing I'd change about this task**: {honest answer}

> If user requests a review, run `/worker-review` for a structured self-assessment.
```
