---
name: sprint-gate
description: Pre-sprint gate check. Validates SPRINT-CONTRACT.md against the 6-item audit protocol from AUDITOR-ROLE.md. Use after Coordinator creates the contract, before workers activate.
allowed-tools: Read, Grep, Glob
argument-hint: "[contract-file-path]"
---

# Sprint Gate — Pre-Sprint Validation

You are performing a pre-sprint gate check as the Auditor. Your job is to validate the
SPRINT-CONTRACT.md against the 6 mandatory checks before workers are activated.

## Step 1: Locate the contract

If `$ARGUMENTS` is provided, read that file path. Otherwise, scan `.sprint/sprint-*/CONTRACT.md`
using Glob (pick highest number). Fallback: check `SPRINT-CONTRACT.md` at repo root.

If no contract file is found, STOP and report: "No `.sprint/sprint-{N}/CONTRACT.md` found.
The Coordinator must create one before the gate check can run."

## Step 2: Run the 6 Pre-Sprint Gate Checks

Read the contract and evaluate each check. Be strict — partial compliance is a FAIL.

### Check 1: Sprint goal is specific

- PASS if the goal is one sentence with a measurable outcome
- FAIL if the goal is vague like "work on X" or "continue Y" or "improve Z"
- FAIL if there's no goal at all or the template placeholder `{...}` is still there

### Check 2: File ownership map includes NEW files and has no overlaps

- PASS if every new file is tagged `(NEW)` and no file appears under multiple workers
- FAIL if any new file is missing the `(NEW)` tag
- FAIL if any file appears in more than one worker's ownership list
- FAIL if the "Shared" section is large (>3 files) without justification
- FAIL if template placeholders `{path/to/file}` are still present

### Check 3: Merge order has rationale

- PASS if each entry in the merge order table includes a "Rationale" that explains WHY
  this worker merges in this position (e.g., "zero shared files", "others depend on these types")
- FAIL if the rationale column is empty or just says "N/A" or repeats the worker name
- FAIL if template placeholders are still present

### Check 4: Quality gates have actual numbers

- PASS if the bundle size target has a specific KB number (not `{N}`)
- PASS if all gate rows have concrete targets
- FAIL if any gate still has template placeholders like `< {N} KB`
- FAIL if the quality gates section is missing entirely

### Check 5: Cross-worker dependencies identified with mitigation

- PASS if dependencies are listed with a mitigation strategy, OR the section explicitly says
  "None identified. Workers are fully independent."
- FAIL if the section is empty or still has template placeholders
- FAIL if dependencies are listed but have no mitigation

### Check 6: Prior user decisions referenced

- PASS if the table lists relevant memory files with specific file paths, and notes which
  workers need to read them
- PASS if the section explicitly says "No prior user decisions apply to this sprint."
- FAIL if the section is empty or has template placeholders
- FAIL if relevant memory files exist (check `memory/` for topic files matching the sprint's
  focus area) but aren't listed

For Check 6, use Glob to scan `memory/*.md` and verify that relevant topic files are
referenced in the contract.

## Step 3: Report Results

Output the report in this format:

```
## Sprint Gate Report

**Contract**: {file path}
**Sprint Goal**: {quoted goal from contract}
**Date**: {today's date}

### Results

| # | Check | Result | Details |
|---|-------|--------|---------|
| 1 | Sprint goal is specific | PASS/FAIL | {specific issue or "Clear, measurable goal"} |
| 2 | File ownership — NEW tags, no overlaps | PASS/FAIL | {specific issue or "All files tagged, no overlaps"} |
| 3 | Merge order has rationale | PASS/FAIL | {specific issue or "Each position justified"} |
| 4 | Quality gates have numbers | PASS/FAIL | {specific issue or "All gates have concrete targets"} |
| 5 | Cross-worker dependencies | PASS/FAIL | {specific issue or "Dependencies documented with mitigation"} |
| 6 | Prior user decisions referenced | PASS/FAIL | {specific issue or "Relevant archives listed"} |

### Verdict: APPROVED / REJECTED

{If REJECTED: list the specific items that must be fixed before re-running the gate.
 If APPROVED: "Contract is ready. Workers can be activated."}
```

## Rules

- Be strict. A rubber-stamp approval defeats the purpose.
- If something looks suspicious (e.g., a very short ownership list for a complex task), flag it
  even if it technically passes the checks.
- Do NOT modify the contract. Report issues and let the Coordinator fix them.
- After reporting, suggest running `/sprint-gate` again after fixes are applied.
