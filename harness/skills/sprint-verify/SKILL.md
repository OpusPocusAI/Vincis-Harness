---
name: sprint-verify
description: Verify a worker branch is ready to merge. Checks SESSION-LOG completeness, file ownership violations, port cleanup, and build status. Use before merging any worker branch.
allowed-tools: Read, Grep, Glob, Bash
argument-hint: "<branch-name>"
---

# Sprint Verify — Worker Branch Merge Gate

You are performing a pre-merge verification for the Coordinator. Your job is to check that
a worker's branch meets all merge requirements before it enters main.

## Step 0: Get the branch name

The branch name MUST be provided via `$ARGUMENTS`. If no branch name is given, STOP and
report: "Usage: /sprint-verify <branch-name>. Example: /sprint-verify sprint6b-worker-a"

## Step 1: Verify the branch exists and has commits

Run: `git log main..$ARGUMENTS --oneline`

If this produces no output or errors, STOP and report that the branch doesn't exist or has
no commits beyond main.

## Step 2: Check what files changed

Run: `git diff --stat main..$ARGUMENTS`

Save this output — you'll need it for the ownership check in Step 4.

## Step 3: Verify SESSION-LOG.md

Check if a SESSION-LOG exists on the branch. First check `.sprint/sprint-{N}/SESSION-LOG-{X}.md`
(resolve N from the branch name pattern, e.g., `sprint6b-worker-a` → N=6b, X=A).
Fallback: `git show $ARGUMENTS:SESSION-LOG.md 2>/dev/null`

Run: `git show $ARGUMENTS:.sprint/sprint-{N}/SESSION-LOG-{X}.md 2>/dev/null || git show $ARGUMENTS:SESSION-LOG.md 2>/dev/null || echo "SESSION-LOG NOT FOUND"`

If SESSION-LOG.md is found, read its content and verify ALL 6 required sections + Review Block are present
and non-empty:

1. `## Completed` — what was built/changed
2. `## Verified` — what was tested and how
3. `## Issues Found` — bugs, regressions, or concerns (can say "None" but must be present)
4. `## Lessons Learned` — patterns, near-misses, surprising behaviors
5. `## Cross-Ownership Edits` — files edited outside primary ownership (can say "None")
6. `## Review Block` — structured self-assessment (6 fields)

For each section:
- PASS if the section header exists AND has content below it (not just the header)
- FAIL if the section is missing entirely
- WARN if the section exists but is empty or just says "N/A"

## Step 3.5: Check WORKER-REPORT

Check if a WORKER-REPORT exists on the branch. Resolve N and X from the branch name.

Run: `git show $ARGUMENTS:.sprint/sprint-{N}/WORKER-REPORT-{X}.md 2>/dev/null || echo "WORKER-REPORT NOT FOUND"`

- PASS if the file exists and has content
- WARN if not found (process violation but not a merge blocker)

## Step 4: Check file ownership

Scan `.sprint/sprint-*/CONTRACT.md` (pick highest number). Fallback: check `SPRINT-CONTRACT.md`
at repo root. Find the worker that matches the branch name
in the Workers table.

Then cross-reference the files changed (from Step 2) against the file ownership map:
- Files in this worker's ownership list: OK
- Files in the "Shared" list: OK (but flag as "shared file touched")
- Files in another worker's ownership list: FAIL — ownership violation
- Files not in any list: WARN — untracked file change (could be acceptable for config,
  package-lock, etc.)

## Step 5: Port cleanup

Check for active listeners on your project's port range. If any found, report them.

```bash
# Linux/macOS:
lsof -i :{{PORT_RANGE_START}}-{{PORT_RANGE_END}} 2>/dev/null || echo "All clear"

# Windows:
netstat -ano | findstr ":{{PORT_RANGE_START}}" | findstr "LISTENING" 2>nul || echo "All clear"
```

- PASS if no listeners found on the project's port range
- FAIL if any listener is found (include the PID and port in the report)

## Step 6: Build check

Run: `{{BUILD_COMMAND}}`

- PASS if build exits successfully (no error messages in output)
- FAIL if build errors are present
- Note: Check your project's CLAUDE.md for any known pre-existing errors to exclude.

## Step 7: Report Results

Output the report in this format:

```
## Branch Verification Report

**Branch**: {branch name}
**Commits**: {number of commits ahead of main}
**Files changed**: {number of files}
**Date**: {today's date}

### Commit Summary
{output from git log --oneline}

### Results

| # | Check | Result | Details |
|---|-------|--------|---------|
| 1 | Branch has commits | PASS/FAIL | {N} commits ahead of main |
| 2 | SESSION-LOG.md exists | PASS/FAIL | {found/not found} |
| 3 | SESSION-LOG — Completed | PASS/FAIL/WARN | {status} |
| 4 | SESSION-LOG — Verified | PASS/FAIL/WARN | {status} |
| 5 | SESSION-LOG — Issues Found | PASS/FAIL/WARN | {status} |
| 6 | SESSION-LOG — Lessons Learned | PASS/FAIL/WARN | {status} |
| 7 | SESSION-LOG — Cross-Ownership Edits | PASS/FAIL/WARN | {status} |
| 8 | SESSION-LOG — Review Block | PASS/FAIL/WARN | {status} |
| 9 | WORKER-REPORT exists | PASS/WARN | {found/not found} |
| 10 | File ownership | PASS/FAIL/WARN | {details of any violations or untracked changes} |
| 11 | Port cleanup | PASS/FAIL | {status} |
| 12 | Build | PASS/FAIL | {status} |

### Verdict: READY TO MERGE / NOT READY

{If NOT READY: list the specific items that must be fixed.
 If READY: provide the merge commands:}

git checkout main
git merge $ARGUMENTS
# Then verify build: {{BUILD_COMMAND}}
```

### Ownership Violations Detail
{If any ownership violations found, list each file with who owns it vs. who changed it}

### Warnings
{Any WARN items that aren't blockers but should be noted}

## Rules

- This skill checks the branch against the CURRENT state of main. If main has moved since
  the branch was created, the Coordinator should rebase first, then re-run this check.
- Do NOT modify any files or merge the branch. This is read-only verification.
- If SPRINT-CONTRACT.md doesn't exist, skip the ownership check and note it in the report.
- The build check runs against the CURRENT working tree, not the branch. If you need to
  check the branch's build, the Coordinator should merge to a temp branch first.
