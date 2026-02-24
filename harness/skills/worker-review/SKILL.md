---
name: worker-review
description: On-demand self-review for Lite workers. Loads harness review criteria and produces a structured self-assessment. User-triggered only — preserves Lite token savings by default.
allowed-tools: Read, Grep, Glob
---

# Worker Review — On-Demand Self-Assessment

You are performing a structured self-review of your work session against the harness criteria.
This skill is designed for **Lite workers** who lack the loaded context to self-review accurately,
but Standard workers can use it too.

## Step 1: Load Review Context

Read these files to understand the grading criteria:

1. Read `.sprint/roles/WORKER-ROLE.md` — focus on `## SESSION-LOG Anatomy` and `## Review Block`
2. Read `memory/sprint-process.md` — focus on `## Harness Core Principles` and `## Grading Instructions`

## Step 2: Identify Your Session Artifacts

Use Glob to find your SESSION-LOG: `.sprint/sprint-*/SESSION-LOG-*.md` (pick the one matching
your worker letter and current sprint). Read it.

If you already have a SESSION-LOG in context, skip the file read — use what you have.

## Step 3: Self-Assessment

Evaluate your session against these criteria. Be honest — the Auditor cross-checks these.

### Process Compliance

| Check | Status | Detail |
|-------|--------|--------|
| Branch correct? (worked on sprint branch, not main) | PASS/FAIL | {evidence} |
| Gate 0 completed? (branch + pwd verified) | PASS/FAIL | {evidence} |
| Read prior decisions from memory files? | PASS/FAIL/N-A | {which files, or N-A for Lite} |
| All acceptance criteria delivered? | PASS/FAIL/PARTIAL | {list each AC with status} |
| SESSION-LOG committed before signaling done? | PASS/FAIL | {evidence} |
| Dev servers killed? | PASS/FAIL/N-A | {port check or N-A if never started} |
| Cross-ownership edits documented? | PASS/FAIL/N-A | {list or "None needed"} |

### Verification Quality

| Check | Status | Detail |
|-------|--------|--------|
| Build verified? (`{{BUILD_COMMAND}}` 0 errors) | PASS/FAIL | {evidence} |
| Visual verification? (dev server started, UI checked) | PASS/FAIL/N-A | {For UI/animation tasks: PASS requires dev server. For pure logic: N-A.} |
| Unverified claims? | YES/NO | {Any assertions not backed by evidence?} |

### Core Principles Grade

Use these calibrated definitions — not gut feeling:

| Grade | Definition |
|-------|-----------|
| **A** | Zero skipped tasks, zero unverified ACs, no false claims stated as fact. Evidence of excellence required — absence of failure is not enough. |
| **B** | All ACs delivered with minor process or verification gaps. One-line explanation required. |
| **C** | Significant gaps — skipped tasks, undelivered ACs, or built on incorrect assumptions. |

**Honesty rule**: If in doubt between two grades, pick the lower one. Self-grading all A's
should be rare — it means the session was near-perfect.

Grade each principle:

| Principle | Grade | Evidence |
|-----------|-------|----------|
| **Productivity** | {A/B/C} | {Did you ship more than expected, less, or about right?} |
| **Efficiency** | {A/B/C} | {Did you repeat reads, re-explain things, or waste effort?} |
| **Accuracy** | {A/B/C} | {Did you build on any wrong assumptions? Unverified claims?} |
| **Token Efficiency** | {A/B/C} | {Could you have done this with fewer reads/writes?} |

### Gaps & Recommendations

- **What I should have done differently**: {concrete action, not vague}
- **Bugs I may have missed**: {honest assessment — what wasn't tested?}
- **One harness improvement**: {specific suggestion for the Auditor}

## Step 4: Output Format

Present the full assessment as a single block that can be appended to or replace the
Review Block in your SESSION-LOG. Label it clearly:

```
## Worker Review (via /worker-review)
{all tables and fields from Step 3}
```

## Rules

- Be strict with yourself. Generous self-grading is the most common failure mode.
- "A" requires specific evidence of excellence. "I didn't break anything" is B, not A.
- If you skipped any numbered task from your plan, Accuracy cannot be A.
- If you have visual/animation ACs but never started a dev server, those ACs are unverified.
- Do NOT modify your SESSION-LOG automatically — present the review and let the user decide.
