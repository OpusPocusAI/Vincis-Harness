---
name: sprint-audit
description: Post-sprint audit. Collects evidence from SPRINT-CONTRACT, COORDINATOR-LOG, SESSION-LOGs, and SPRINT-BOARD. Generates a pre-filled retro draft. Use after all merges are complete.
context: fork
agent: general-purpose
allowed-tools: Read, Grep, Glob, Bash, Write
argument-hint: "<sprint-number>"
---

# Sprint Audit — Post-Sprint Evidence Collection & Retro Draft

You are performing a post-sprint audit as the Auditor. Your job is to collect evidence from
all sprint artifacts, run the 9 post-sprint audit checks, and generate a retro draft.

## Step 0: Get the sprint number

The sprint number MUST be provided via `$ARGUMENTS`. If not given, STOP and report:
"Usage: /sprint-audit <sprint-number>. Example: /sprint-audit 6b"

Set `SPRINT_NUM` to the provided value (e.g., "6b").

## Step 1: Collect Evidence

Read ALL of the following files. If any file is missing, note it as "NOT FOUND" — that's
itself an audit finding.

### Required artifacts

1. **CONTRACT.md** — Read from `.sprint/sprint-{SPRINT_NUM}/CONTRACT.md`
2. **COORDINATOR-LOG.md** — Read from `.sprint/sprint-{SPRINT_NUM}/COORDINATOR-LOG.md`
3. **memory/SPRINT-BOARD.md** — Read from memory directory

### SESSION-LOGs

Find SESSION-LOGs by checking:
- `.sprint/sprint-{SPRINT_NUM}/SESSION-LOG-*.md` (check this location first)
- `SESSION-LOG.md` in repo root (legacy fallback)
- Run `git log --oneline -20` to see recent commits — look for merge commits
- Run `git branch -a | grep sprint` to find sprint branches
- For each sprint branch found, try: `git show {branch}:.sprint/sprint-{SPRINT_NUM}/SESSION-LOG-{X}.md 2>/dev/null` then fallback to `git show {branch}:SESSION-LOG.md 2>/dev/null`

Collect all SESSION-LOGs found and note which worker each belongs to.

### Recent git history

Run: `git log --oneline -25` to understand the merge sequence and timing.

## Step 2: Run the 9 Post-Sprint Audit Checks

### Check 1: Contract compliance — Did the sprint achieve its stated goal?

- Read the sprint goal from SPRINT-CONTRACT.md
- Read the Coordinator's Timeline and Merge Results from COORDINATOR-LOG.md
- PASS if the goal was achieved (evidence in merge results and git log)
- PARTIAL if some deliverables were completed but not all
- FAIL if the goal was not achieved

### Check 2: Coordinator boundaries — Did the Coordinator write feature code?

- Check `git log --oneline` for commits by the Coordinator
- Cross-reference with COORDINATOR-LOG.md timeline
- PASS if Coordinator only did coordination (branch management, merges, docs, verification)
- FAIL if Coordinator authored feature code commits
- Note: pre-flight (build, branch cleanup) and post-merge work is allowed

### Check 3: SESSION-LOGs received — Every worker submitted one before merge?

- For each worker listed in SPRINT-CONTRACT.md, verify a SESSION-LOG was found
- PASS if all workers have SESSION-LOGs
- FAIL if any worker is missing a SESSION-LOG

### Check 4: Merge order followed — Matches SPRINT-CONTRACT specification?

- Read the merge order from SPRINT-CONTRACT.md
- Read the merge timeline from COORDINATOR-LOG.md
- Cross-reference with `git log --oneline` to verify actual merge sequence
- PASS if the actual order matches the contract
- DEVIATION if the order changed — check COORDINATOR-LOG.md for documented justification
- FAIL if the order changed with no documentation

### Check 5: Quality gates met — Bundle size, port cleanup, build success measured?

- Read the Quality Gate Results from COORDINATOR-LOG.md
- PASS if all gates have actual values recorded and meet their targets
- FAIL if any gate is missing measurements or has template placeholders
- FAIL if any gate failed and wasn't documented

### Check 6: Documentation updated — COORDINATOR-LOG checklist all checked?

- Read the Documentation Update Checklist from COORDINATOR-LOG.md
- PASS if all relevant items are checked (either "updated" or "not needed")
- FAIL if any items are "missed" or unchecked
- FAIL if the checklist section is missing

### Check 7: User input preserved — Distillation created if user gave detailed answers?

- Read the User Input Preservation section from COORDINATOR-LOG.md
- If "No" — PASS (nothing to preserve)
- If "Yes" — verify the distillation file and archive file paths exist
- FAIL if user input was collected but no distillation/archive was created

### Check 8: Worker knowledge captured — All 6 SESSION-LOG sections present?

- For each SESSION-LOG found, verify all 6 sections:
  Completed, Verified, Issues Found, Lessons Learned, Suggestions, Time Sinks
- Check if COORDINATOR-LOG.md has a Worker Knowledge Summary
- PASS if all workers have complete SESSION-LOGs AND Coordinator summarized lessons
- PARTIAL if SESSION-LOGs are complete but Coordinator didn't summarize
- FAIL if any SESSION-LOG is missing sections

### Check 9: Lessons captured — New patterns or mistakes added to memory?

- Read `memory/MEMORY.md` — check for recent entries mentioning this sprint
- Read CLAUDE.md Mistakes Log — check for new entries
- PASS if lessons from SESSION-LOGs were fed back into memory
- WARN if there are lessons in SESSION-LOGs that aren't in memory yet

## Step 3: Extract Worker Insights

For each SESSION-LOG, extract:
- **Key lessons** from "Lessons Learned" section
- **Suggestions** from "Suggestions" section
- **Time sinks** from "Time Sinks" section

These feed directly into the retro draft.

## Step 4: Generate Retro Draft

Write the retro draft to: `memory/sprint{SPRINT_NUM}-retro-DRAFT.md`

Use the RETRO.md template structure:

```markdown
# Sprint {SPRINT_NUM} Retrospective — DRAFT

> Written by: Auditor (auto-generated) | Date: {today's date}
> Sprint goal: {copied from SPRINT-CONTRACT.md}
> **STATUS: DRAFT — Auditor must review and finalize before committing as the official retro**

---

## Contract Compliance

**Goal achieved?** {Yes / No / Partial — evidence from Check 1}

**Coordinator boundaries respected?** {Yes / No — evidence from Check 2}

**Merge order followed?** {Yes / No / Deviation — evidence from Check 4}

---

## What Worked

| Pattern | Evidence | Promote to CLAUDE.md? |
|---------|---------|----------------------|
{Extract positive patterns from SESSION-LOGs, COORDINATOR-LOG, and audit results}

---

## What Failed

| Failure | Root Cause | Recurrence Count | Fix |
|---------|-----------|-----------------|-----|
{Extract failures from audit check FAILs and SESSION-LOG issues}

---

## Process Changes

| Change | Target file | Type |
|--------|------------|------|
{Propose specific changes based on failures found}

---

## Metrics

| Metric | Sprint {N-1} | Sprint {SPRINT_NUM} | Trend |
|--------|-------------|------------|-------|
| Merge conflicts | {check previous retro or "N/A"} | {from COORDINATOR-LOG} | {trend} |
| Zombie dev servers | {previous} | {from port check results} | {trend} |
| Build failures during merge | {previous} | {from COORDINATOR-LOG} | {trend} |
| Docs updates missed | {previous} | {from Check 6} | {trend} |
| Coordinator scope violations | {previous} | {from Check 2} | {trend} |
| Blockers unresolved at sprint end | {previous} | {from SPRINT-BOARD} | {trend} |

---

## Memory Maintenance

{List all memory/ files with status recommendation}

| File | Current status | Action | Reason |
|------|---------------|--------|--------|
{Scan memory/ directory and evaluate each file}

MEMORY.md line count: {count}/200

---

## Carry-Forward Items

| Item | Priority | Destination |
|------|---------|------------|
{Unresolved blockers, incomplete tasks, identified tech debt}
```

## Step 5: Report

After writing the draft, output a summary:

```
## Sprint Audit Complete

### Audit Results

| # | Check | Result |
|---|-------|--------|
| 1 | Contract compliance | {result} |
| 2 | Coordinator boundaries | {result} |
| 3 | SESSION-LOGs received | {result} |
| 4 | Merge order followed | {result} |
| 5 | Quality gates met | {result} |
| 6 | Documentation updated | {result} |
| 7 | User input preserved | {result} |
| 8 | Worker knowledge captured | {result} |
| 9 | Lessons captured | {result} |

**Artifacts found**: {count} of {expected}
**SESSION-LOGs**: {count found} / {count expected}

### Retro Draft

Written to: `memory/sprint{SPRINT_NUM}-retro-DRAFT.md`

The Auditor should review this draft, add personal observations, adjust the "What
Worked" and "What Failed" sections with judgment (not just mechanical checks), and
save as the final `memory/sprint{SPRINT_NUM}-retro.md`.
```

## Rules

- This skill runs in a forked context to protect the main conversation. It reads many files.
- Do NOT modify any sprint artifacts (contract, coordinator log, session logs). Read only.
- The retro DRAFT is clearly marked as a draft. The Auditor must review before finalizing.
- If a previous retro exists (for trend comparison), read it: `memory/sprint{N-1}-retro.md`
- Be thorough. Missing evidence is itself evidence — document what couldn't be found.
- For the Metrics table, try reading the previous sprint's retro to fill the comparison column.
  If no previous retro exists, use "N/A (baseline)" for all Sprint N-1 values.
