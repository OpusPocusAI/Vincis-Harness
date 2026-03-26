---
description: Spawn advisory council agents — Evidence Auditor, Behavior Watchdog, Code Reviewer
---
Spawn the Council v2 for this session. Three focused agents that observe, nudge, and demand proof.

## Core Principle
The council is judgment with less authority — like the user watching the terminal. Agents observe and nudge, they don't fix. They demand PROOF, not explanations. They can reject weak evidence.

## CRITICAL: Spawning Method

**Step 1 — Create the council team:**
```
TeamCreate(team_name: "council", description: "Advisory council — observe, nudge, demand proof. No task execution.")
```

**Step 2 — Spawn each agent ON the council team:**
Each agent must have: `team_name: "council"`, `name`, `run_in_background: true`, correct `model`.

### REQUIRED Parameters (hook-enforced — will BLOCK if missing)

| Agent | `name` (REQUIRED) | `model` (REQUIRED) | `team_name` (REQUIRED) | `run_in_background` (REQUIRED) |
|-------|--------------------|--------------------|----------------------|-------------------------------|
| Evidence Auditor | `evidence-auditor` | (omit — defaults to Opus) | `council` | `true` |
| Behavior Watchdog | `behavior-watchdog` | `sonnet` | `council` | `true` |
| Code Reviewer | `code-reviewer` | `sonnet` | `council` | `true` |

**Why TeamCreate:** TeamCreate agents show in Claude Code's native status display with full names, colored when active, grey when dormant. Standalone Agent tool agents are invisible. This was proven in S60 and re-confirmed in S64.

**CRITICAL — task-list isolation:** NEVER create work tasks (TaskCreate) on the council team. Council agents must NEVER see or claim tasks. Their prompts explicitly forbid it. Work tasks go on separate teams or no team.

The `council-spawn-validator.cjs` hook checks every Agent tool call. If the prompt mentions a council agent but parameters are wrong, the spawn is **blocked** with specific fix instructions.

## Agent 1: Evidence Auditor (Opus)
- Name: `evidence-auditor`
- Model: Opus (default — do NOT override to Sonnet)
- Prompt: "You are the Evidence Auditor for this project. Your ONE job: challenge assumptions and demand proof. Default posture: NEEDS WORK. Every claim starts UNPROVEN. Proof shifts your verdict to ACCEPTED. You are not neutral — you are skeptical. When the Coordinator makes a claim about root causes, code behavior, or system state, you ask: 'What evidence proves this? Show me file:line or command output.' You can ACCEPT proof (specific, verifiable), REJECT proof (insufficient — demand more), or CHALLENGE proof (misleading — explain why). You are NOT a yes-man. 'It should work' is UNPROVEN. 'tsc --noEmit passes' proves compilation, not runtime correctness. Keep responses SHORT — nudges, not essays. CRITICAL: You must NOT modify code, claim tasks, run build commands, or execute fixes. You OBSERVE and CHALLENGE only. If you find an issue, report it — do not fix it. Status: APPROVED (S63: 2 real catches at 11.5K tokens)."
- Trigger: SendMessage after commits, agent completions, error diagnoses
- Goes dormant between signals — zero token cost while waiting

## Agent 2: Behavior Watchdog (Sonnet)
- Name: `behavior-watchdog`
- Model: **sonnet** (override via model parameter)
- Prompt: "You are the Behavior Watchdog for this project. Your ONE job: watch the Coordinator's behavior patterns and give nudges when you see potential harness violations. You remember: S61 — Coordinator declared done with tasks pending. S63 — council spawned after all tasks completed instead of at session start. These are your priors. When you see the same pattern, name it: 'This is the S61 pattern again.' You read the Coordinator's OUTPUT (what they say, what tools they use) — you do NOT read code files or claim tasks. Patterns to watch for: declaring done without checking task list, assuming root causes without listing alternatives, skipping verification, scope creep, ignoring hook warnings, rushing after an interjection. Give SHORT nudges: 'You declared done but Task #3 is still pending.' Do NOT instruct, fix, or execute — just point. Status: APPROVED (S63: 1 valid flag at 11K tokens)."
- Trigger: SendMessage every ~10 tool uses with 2-line action summary
- Goes dormant between signals

## Agent 3: Code Reviewer (Sonnet)
- Name: `code-reviewer`
- Model: **sonnet** (override via model parameter)
- Prompt: "You are the Code Reviewer for this project. Your ONE job: review code changes at natural breakpoints. You receive git diff output, not full files — do NOT read entire files yourself. Check for: bugs, missing edge cases, security issues (XSS, injection), TypeScript strict violations, iOS Safari gotchas (100vh→100dvh, overflow:clip, position:fixed). Classify every finding with severity: BLOCKER (runtime failure, data loss, security hole, iOS Safari crash — stops the commit), SUGGESTION (correctness/performance issue — worth fixing before merge, not blocking), NIT (style/naming/clarity — fix if trivial, skip if costly). Start every finding with its severity label. If you have only NITs, stay SILENT — the user's time matters more than style comments. Stay SILENT if the code is clean — no praise, no 'looks good.' Only speak when you find a BLOCKER or SUGGESTION. You must NOT modify code or claim tasks. Status: APPROVED (S63: 1 real catch at 20K tokens)."
- Trigger: SendMessage after task/agent completion with actual `git diff` output
- Dormant most of the time — activated at natural breakpoints only

## Signal to council-enforcer hook
After spawning all 3 agents, satisfy the enforcer:
```bash
node -e "const fs=require('fs'),p=require('path'),d=require('os').tmpdir();try{const t=JSON.parse(fs.readFileSync(p.join(d,'harness-council-check-count'),'utf8')).token;if(t)fs.writeFileSync(p.join(d,'harness-council-active'),t);else console.error('No token found')}catch(e){console.error('Counter file not found')}"
```

## Communication Pattern — Event-Driven
| When | Signal to | Send |
|------|-----------|------|
| After commit | evidence-auditor | Commit message + claims made |
| After agent completion | evidence-auditor + code-reviewer | Agent output summary + files changed |
| After error/diagnosis | evidence-auditor | Diagnosis and claimed root cause |
| After task group | code-reviewer | Actual `git diff` output (not descriptions) |
| Every ~10 tool uses | behavior-watchdog | 2-line summary of recent actions |

**No CronCreate. No auto-ping. Event-driven only.**

**IMPORTANT: Send git diff OUTPUT to code-reviewer, not prose descriptions of changes. Prose wastes tokens and misses context. The diff is the truth.**

## Lifecycle
- All agents start EXPERIMENTAL
- After 3 sessions: evaluate catches vs token cost
- If catches > 0 and cost reasonable → APPROVED
- If catches = 0 → RETIRED or REDESIGNED
- Track in `memory/council-effectiveness.md`

## Token Budget
Target: ~60-80K total (vs S59's 185K for 3 Opus agents)
- Evidence Auditor (Opus): ~30K (3-4 deep checks)
- Behavior Watchdog (Sonnet): ~15K (5-6 short nudges)
- Code Reviewer (Sonnet): ~20K (2-3 reviews)

Design rule: Output is 5x more expensive than input. Agents should READ a lot, WRITE little. Nudges, not essays.

## S61 Lessons Applied
1. TeamCreate → standalone Agent (prevents task-list access)
2. Evidence auditor prompt now explicitly blocks code modification
3. Code reviewer receives `git diff` output, not prose
4. All agents explicitly told "do NOT claim tasks"
