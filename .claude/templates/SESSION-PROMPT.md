---
type: session-prompt
mode: "{LITE|STANDARD}"
sprint: {N}
worker: {X}
status: active
tags: ["session-prompt", "sprint-{N}", "worker-{X}"]
---
# SESSION-PROMPT — Worker {X} (Sprint {N})

> Branch: sprint{N}-worker-{x} | Port: {300X} | Worktree: ../worktree-{x}
> Mode: {LITE — implement tasks, write SESSION-LOG, commit, done | STANDARD — you have plan mode, design your own approach}
> Model: {Opus 4.6 | Sonnet 4.6} — run `/model {model}` before starting work.

## STEP 0: Verify (run FIRST)

```bash
/model {model}

EXPECTED="sprint{N}-worker-{x}"
ACTUAL=$(git branch --show-current)
if [ "$ACTUAL" != "$EXPECTED" ]; then
  echo "WRONG BRANCH: On '$ACTUAL', expected '$EXPECTED'"
  echo "DO NOT PROCEED. Run 'cd ../worktree-{x}' then verify."
  exit 1
fi

EXPECTED_PATH="{Coordinator fills: /absolute/path/to/worktree-x}"
ACTUAL_PATH=$(pwd)
if [ "$ACTUAL_PATH" != "$EXPECTED_PATH" ]; then
  echo "WRONG DIRECTORY: At '$ACTUAL_PATH', expected '$EXPECTED_PATH'"
  echo "HALT — navigate to $EXPECTED_PATH first."
  exit 1
else
  echo "Branch OK: $ACTUAL | Directory OK: $ACTUAL_PATH"
fi
```

<!-- LITE: Skip inbox scan, WORKER-ROLE.md, memory files — this prompt is self-contained. -->
<!-- LITE: Your ONLY inputs are this file + CLAUDE.md (auto-loaded). -->
<!-- STANDARD: After Step 0, read memory files in Context Files below + scan inbox. -->

## Your Mission

{Coordinator fills: 1-2 sentences — what "excellent" looks like for this domain. Not tasks — a vision. This should be the dominant element of this prompt.}

{STANDARD addition: "This is your real job. The starting points below are the floor. If you discover something that serves this mission but isn't listed, do it. The constraint is communication — explain every beyond-task action in your SESSION-LOG."}

{LITE addition: "Your listed tasks are the minimum. If you find an obvious bug (<5 lines) in a file you're editing, FIX IT and document it in your SESSION-LOG. Document-and-leave only for issues >5 lines, risky, or outside your files."}

## Starting Points

{Coordinator fills: 2-5 items. Frame as suggestions, not requirements. Max 3 ACs for LITE, 5 for STANDARD.}

1. {Starting point / acceptance criterion 1}
2. {Starting point / acceptance criterion 2}
3. {Starting point / acceptance criterion N}
N+1. SESSION-LOG committed (see skeleton below)

## Primary Ownership

{List of files this worker owns — one per line.}

## Prohibited Files (DO NOT EDIT)

{Coordinator fills: specific files this worker must not touch.}

> If you need to edit a prohibited file, STOP. Document why in SESSION-LOG Issues Found.

## Key Decisions (pre-loaded)

{LITE: bullet list | STANDARD: table with # / Decision / Source columns}

- {Decision 1 — extracted from relevant memory file by Coordinator}
- {Decision 2}

<!-- STANDARD ONLY — delete this block for LITE workers -->
## Context Files

- **REQUIRED**: {memory/topic.md — task domain, must read}
- **RECOMMENDED**: {memory/other.md — skip for refactoring tasks}
<!-- END STANDARD ONLY -->

## Implementation Tasks

{LITE: Coordinator fills specific tasks with file paths and line numbers.}
{STANDARD: "Your plan mode IS your implementation planning. Map the UX journey first. Design your approach, then execute."}

Task 1: {implementation step}
Task N: Build verification — `cd FE && npm run build` (0 errors)

## Fix Verification Evidence (MANDATORY for bug fixes)

For each bug you fix, document in SESSION-LOG:
- **Before**: What the bug looked like (behavior, not code)
- **Changed**: What you modified and why
- **After**: How you verified it works — "build passes" is NOT sufficient for UI bugs.
  Acceptable evidence: dev server test with specific user action, screenshot description,
  console output comparison, or explicit "cannot verify visually in headless session —
  flagged for user verification"

> If a task is a bug fix, the AC is not "code changed" — it's "behavior changed." Workers who report "fixed" without verification evidence get flagged in the retro.

## REFLECTION PAUSE (before cleanup)

{Coordinator fills: 1 reflection question for this domain.}

Predefined options:
- "Look at the files you edited. Is there anything broken you could fix in under 5 lines?"
- "Does what you built serve the Mission above? What's missing?"
- "What did you notice while working that you haven't mentioned yet?"

If your answer surfaces something fixable (<5 lines): fix it now. Otherwise: note it in SESSION-LOG.

## DONE CHECKLIST

- [ ] **Reflection Pause** (MANDATORY): Answer the reflection question → SESSION-LOG `## Reflection Pause`
- [ ] **Second Read** (MANDATORY): Re-open every modified file. "What did I miss?" → SESSION-LOG `## Second Read`
- [ ] Kill any dev servers (`npx kill-port 300{X}`)
- [ ] Visual verification: if UI changes, start dev server on port 300{X}, verify in browser. If skipped, write reason in SESSION-LOG `## Verified`.
- [ ] Token report: run `/context` → SESSION-LOG `## Token Usage` as "Context at session end: {%}"
- [ ] Write `.sprint/sprint-{N}/SESSION-LOG-{X}.md` using skeleton below
- [ ] `git add` all changed files + SESSION-LOG
- [ ] `git commit -m "Worker {X}: {one-line summary}"`
- [ ] Signal: **"Branch committed, ready for merge."**

## SESSION-LOG Skeleton

```markdown
# SESSION-LOG — Worker {X} (Sprint {N}) [{LITE|STANDARD}]

**Worker**: {X} — {brief task description}
**Branch**: sprint{N}-worker-{x}
**Date**: {YYYY-MM-DD}

---

## Completed
- {What was built — bullet list, include file paths}
- {Cross-ownership edits: "Also edited: path/file.ext — reason"}

## Verified
- Build: {pass/fail — `cd FE && npm run build`}
- Visual: {DONE (port 300X) | SKIPPED — {reason} | N/A}

## Issues & Deferred
- {Bugs discovered, scope cuts, future work — or "None"}

## Beyond-Scope Work
- {Bugs fixed beyond tasks — what, why, how many lines}
- {Things noticed but not fixed — what, why not}
- {Scope Reflection: what did you fix beyond listed tasks? What did you see broken but choose NOT to fix?}

## Review
- {Answer the Coordinator's reflection question. What did it surface?}
- {Re-opened every modified file. What did you miss? Be honest.}

## Token Usage
- **Context at session end**: {%}

## Fix Verification Evidence (if applicable)
{For each bug fixed: Before (behavior) → Changed (what/why) → After (verification method)}

## Review Block
- **What slowed me down**: {honest answer}
- **Bugs found**: {list or "None"}
- **Unexpected issues**: {anything this prompt didn't prepare you for}
- **One thing I'd change about this task**: {honest answer}
```
