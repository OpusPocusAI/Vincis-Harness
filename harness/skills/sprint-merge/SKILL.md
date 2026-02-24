---
name: sprint-merge
description: Execute a single worker branch merge. Reads WORKER-REPORT, verifies branch, merges to main, builds, rebases remaining branches, extracts knowledge. Run once per worker in merge order. Used by Merge Coordinator.
allowed-tools: Read, Grep, Glob, Bash
argument-hint: "<branch-name> [--auto]"
---

# Sprint Merge — Per-Branch Merge Execution

You are executing a single worker branch merge for the Merge Coordinator. Run this once per worker
in the merge order declared in MERGE-HANDOFF.md.

## Step 0: Parse Arguments

The branch name MUST be provided via `$ARGUMENTS`. Optional `--auto` flag skips the pause in Step 4.

If no branch name is given, STOP and report:
"Usage: /sprint-merge <branch-name> [--auto]. Example: /sprint-merge sprint16-worker-a"

Parse the sprint number (N) and worker letter (X) from the branch name pattern `sprint{N}-worker-{x}`.

## Step 1: Read WORKER-REPORT

Read `.sprint/sprint-{N}/WORKER-REPORT-{X}.md` (where X is uppercased worker letter).

If not found, WARN but continue — report was not written (process violation).

Extract from the report:
- **AC compliance**: Delivery Summary table
- **Cross-ownership edits**: from Merge Notes
- **Conflict risk**: LOW/MED/HIGH
- **Build verified by worker?**: Yes/No

## Step 2: Read SESSION-LOG (selective)

Read `.sprint/sprint-{N}/SESSION-LOG-{X}.md`. Extract ONLY:
- `## Cross-Ownership Edits` — needed for conflict anticipation
- `## Review Block` — needed for knowledge extraction
- `## Lessons Learned` — needed for knowledge extraction
- `## Issues Found` — needed for risk assessment

Do NOT read the full SESSION-LOG. Only these 4 sections.

## Step 3: Pre-Merge Verification

Run these checks (similar to /sprint-verify but streamlined):

### 3a: Branch has commits
```bash
git log main..$ARGUMENTS --oneline
```
If empty: FAIL — no commits on branch.

### 3b: Diff stat
```bash
git diff --stat main..$ARGUMENTS
```
Save for ownership cross-reference.

### 3c: SESSION-LOG completeness
Verify all 6 sections exist and are non-empty:
1. `## Completed`
2. `## Verified`
3. `## Issues Found`
4. `## Lessons Learned`
5. `## Cross-Ownership Edits`
6. `## Review Block`

Plus: `## Plan-Mode Observations`

### 3d: Ownership cross-reference
If MERGE-HANDOFF.md File Ownership Map is available, cross-reference the diff stat against
the worker's declared files. Flag any files outside ownership.

### 3e: Port cleanup
Check for active listeners on your project's port range. If any found, flag them.

## Step 4: Verification Summary + Pause

Output a summary table:

```
## Pre-Merge Summary: $ARGUMENTS

| Check | Result | Details |
|-------|--------|---------|
| Commits | PASS/FAIL | {N} commits ahead of main |
| WORKER-REPORT | PASS/WARN | {found/not found} |
| SESSION-LOG sections | PASS/WARN | {N}/7 sections present |
| Cross-ownership | PASS/WARN | {details} |
| Conflict risk | LOW/MED/HIGH | {from WORKER-REPORT or assessed} |
| Ports | PASS/FAIL | {status} |
| Worker build verified? | Yes/No/Unknown | {from WORKER-REPORT} |
```

**If `--auto` flag is NOT set**: Output "Proceed with merge? (The Coordinator should confirm.)"
and STOP here. The Coordinator will re-run with `--auto` or proceed manually.

**If `--auto` flag IS set**: Continue to Step 5 automatically.

## Step 5: Execute Merge

```bash
git checkout main
git merge $ARGUMENTS
```

If merge conflicts:
- Output the conflict files
- Output "CONFLICT DETECTED. Do NOT force-resolve. Check File Ownership Map in MERGE-HANDOFF.md.
  Read both relevant SESSION-LOGs. Resolve by functionality needed."
- STOP — Coordinator resolves manually.

## Step 6: Build Verification

Run: `{{BUILD_COMMAND}}`

- PASS if build exits successfully
- FAIL if new errors appear

Check your project's CLAUDE.md for any known pre-existing errors to exclude.

If FAIL: Output "Build failed after merge. Consider `git merge --abort` if this is the first merge,
or investigate the failure."

## Step 7: Rebase Remaining Branches

Read MERGE-HANDOFF.md merge order. For each branch AFTER the current one that is still pending:

```bash
git checkout <next-branch>
git rebase main
```

If rebase conflicts: Output the conflict, STOP. Coordinator resolves.

Return to main: `git checkout main`

## Step 8: Extract Knowledge

From the SESSION-LOG sections read in Step 2, output a formatted summary:

```
## Knowledge Extracted: Worker {X}

### Lessons Learned
{bullet points from SESSION-LOG}

### Review Block Highlights
- Slowed by: {from Review Block}
- Skipped: {from Review Block}
- Bugs: {from Review Block}
- Would change: {from Review Block}

### Issues Found
{from SESSION-LOG, or "None"}
```

## Step 9: Output Merge Result Row

Output a paste-ready row for the COORDINATOR-LOG Merge Results table:

```
| {X} | sprint{N}-worker-{x} | MERGED | {files changed} files, +{lines}/-{lines} | {conflicts: none/resolved} | Build: PASS/FAIL |
```

## Rules

- This skill MODIFIES the repository (merge, rebase). It is NOT read-only.
- Run once per worker, in the declared merge order from MERGE-HANDOFF.md.
- If any step FAILs, STOP and report. Do not continue to the next step.
- The `--auto` flag is intended for experienced users who trust the verification. Default behavior
  is to pause after verification for Coordinator review.
