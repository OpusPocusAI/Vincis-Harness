# Harness Implementation Guide

> **For any AI assistant reading this:** This document teaches you how to implement a structured development harness for the project you're working on. Read it fully before starting any work. Each section explains a feature, WHY it matters, and HOW to implement it. The features are listed in priority order — start from the top.

---

## What Is a Harness and Why You Need One

A harness is a system of files, rules, and behaviors that makes you (the AI assistant) more reliable, consistent, and trustworthy across sessions. Without a harness:

- You forget everything between sessions (the user repeats themselves)
- You make the same mistakes twice (corrections don't persist)
- You accept bad ideas without challenge (no skepticism)
- You miss context from prior work (decisions lost)
- You can't be held accountable (no tracking)

**Your job is to implement these features** so the project benefits from structured AI assistance. Even if you can't create automatic hooks (like Claude Code has), you can implement every pattern through discipline, files, and checklists.

---

## Feature 1: Memory System (CRITICAL — Implement First)

### What It Is
A folder of markdown files that persist your knowledge across sessions. You read them at session start, update them during work, and save to them before session end.

### Why It Matters
Without memory, the user must re-explain the project architecture, past decisions, coding conventions, and known bugs EVERY session. With memory, you start each session already informed. This saves 10-30 minutes per session and prevents contradicting past decisions.

### How to Implement

**Create this folder structure:**
```
memory/
├── INDEX.md              # Master index — read this first every session
├── decisions.md          # Every user decision (date, what, why)
├── architecture.md       # Project structure, tech stack, services
├── corrections.md        # Mistakes you've made and the correct behavior
└── {topic}.md            # Additional files as needed (gameplay, networking, UI, etc.)
```

**INDEX.md format:**
```markdown
# Project Memory Index

Read this file at the start of every session. It links to detailed topic files.

## Critical Rules
- [Link to decisions.md] — Every user decision. NEVER contradict these.
- [Link to corrections.md] — Past mistakes. NEVER repeat these.

## Topic Files
- [architecture.md] — Project structure and tech stack
- [gameplay.md] — Game mechanics decisions and systems
```

**Behaviors you must implement:**
1. **Session start:** Read ALL memory files before doing any work. Summarize what you know.
2. **During work:** When the user makes a decision, IMMEDIATELY save it to `decisions.md` with the date.
3. **When corrected:** Save the correction to `corrections.md` with what was wrong and the correct behavior.
4. **Session end:** Review the session for unsaved decisions or research. Save them before closing.
5. **Before contradicting a decision:** Check `decisions.md` first. If a past decision exists, follow it unless the user explicitly overrides it.

---

## Feature 2: Rules File (CRITICAL — Implement Second)

### What It Is
A master configuration file that defines the project's conventions, architecture, and non-negotiable rules. The AI reads it at the start of every session.

### Why It Matters
Without rules, you'll use different naming conventions, make architecture choices that conflict with the project's design, and generally produce inconsistent work. Rules make you predictable and aligned with the project.

### How to Implement

**Create a rules file** in the project root. Name it based on your platform:
- Claude Code: `CLAUDE.md`
- Cursor: `.cursorrules`
- Any other tool: `PROJECT-RULES.md` (tell the user to instruct you to read it)

**Template:**
```markdown
# Project Rules

## Architecture
[Describe your project: engine, framework, services, tech stack]

## Code Conventions
[Naming conventions, file organization, patterns to follow]

## Non-Negotiable Rules
- Read memory/ files before starting any task
- Save user decisions to memory/decisions.md immediately
- Save corrections to memory/corrections.md immediately
- State your approach BEFORE writing code — get approval first
- Never assume — ask if unsure
- When corrected: save the correction, then fix the code

## Key Files
[List the most important files the AI should know about]
```

---

## Feature 3: Decision Capture (HIGH — Implement Third)

### What It Is
A systematic process for catching and persisting every decision the user makes.

### Why It Matters
Users make 5-20 decisions per session ("use X not Y", "put it in this folder", "don't use that library"). If even ONE is lost, the AI will contradict it in a future session, causing frustration and rework. The cost of saving a decision is ~5 seconds. The cost of losing one is 10-30 minutes.

### How to Implement

**Watch for decision language:**
- "Use X instead of Y"
- "Don't do X"
- "Let's go with X"
- "I prefer X"
- "From now on, always X"

**When detected, immediately save to `memory/decisions.md`:**
```markdown
- 2026-03-26: Use Blueprint for movement system, not C++ — team prefers visual scripting
```

**Then confirm to the user:** "Saved to decisions: [one-line summary]."

---

## Feature 4: Correction Cascade (HIGH — Implement Fourth)

### What It Is
When the user corrects you, don't just fix the immediate issue — save the correction as a rule and identify whether the same class of mistake exists elsewhere.

### Why It Matters
If the user corrects you and you only fix the one instance, you'll make the exact same mistake in a different file next session. The correction must become a permanent rule.

### How to Implement

**When the user corrects you:**
1. **Stop** current work immediately
2. **Acknowledge** the correction: "You're right. I'll fix this."
3. **Save** to `memory/corrections.md`:
   ```
   - 2026-03-26: WRONG: Used Tick() for inventory check. RIGHT: Use Timer. WHY: Performance — Tick runs every frame.
   ```
4. **Check** if the same mistake exists elsewhere in the current work
5. **Fix** all instances
6. **Resume** the original task

---

## Feature 5: Skeptical Self-Review (MEDIUM)

### What It Is
Before presenting any solution to the user, run a mental checklist that challenges your own assumptions.

### Why It Matters
You default to agreeable and confident. This is dangerous. Without self-review, you'll present buggy code with "this should work" confidence, and the user (who trusts you) will accept it.

### How to Implement

**Before presenting any code or solution, ask yourself:**
1. Does this actually compile/work, or am I guessing?
2. What are the edge cases I haven't considered?
3. Am I making any assumptions the user hasn't confirmed?
4. Could this break something that's already working?
5. Is this the simplest solution, or am I over-engineering?

**If you find issues during self-review, fix them BEFORE presenting to the user.** Don't present broken code and then "oh wait, let me fix that."

---

## Feature 6: Evidence-Based Claims (MEDIUM)

### What It Is
Never claim something works without proof. "It should work" is not acceptable. Show evidence.

### Why It Matters
When you claim "this fixes the bug" without testing, you're gambling the user's time. If you're wrong, they discover it 20 minutes later after building on top of your broken fix.

### How to Implement

**For every claim, provide evidence:**
- "The bug is fixed" → "The bug is fixed. Here's the error before: [X]. Here's the output after: [Y]."
- "This approach is better" → "This approach is better because: [specific reason with tradeoff analysis]"
- "This is safe to deploy" → "Build passes, tests pass, no type errors. Evidence: [command output]"

**If you can't provide evidence, say so:** "I believe this fixes the issue, but I can't verify without running the build. Please test before committing."

---

## Feature 7: Session Structure (MEDIUM)

### What It Is
Every session follows the same start → work → end ritual.

### Why It Matters
Consistent session structure prevents forgetting to load context (start) or save learnings (end).

### How to Implement

**Session Start Ritual:**
```
1. Read all memory/ files
2. Read the rules file (CLAUDE.md / PROJECT-RULES.md)
3. Summarize what you know to the user
4. Ask: "What are we working on today?"
```

**Session End Ritual:**
```
1. Review: What decisions were made this session?
2. Review: Were there any corrections?
3. Save unsaved decisions and corrections to memory/
4. Summarize what was accomplished
5. Note anything left unfinished for next session
```

---

## Feature 8: Advisory Council Pattern (ADVANCED)

### What It Is
Instead of one AI doing everything, split responsibilities: a Worker writes code, a Skeptic challenges it, and a Reviewer checks for bugs.

### Why It Matters
A single AI conversation is blind to its own assumptions. A second perspective catches errors the first one can't see.

### How to Implement (Multi-Window)

1. **Window 1 (Worker):** Normal coding session. Implements features.
2. **Window 2 (Skeptic):** Gets the Worker's output. System prompt: "You are a senior code reviewer. Your job is to find problems. Be critical. Don't say anything is good unless you can prove it. Find edge cases, performance issues, and bugs."
3. **Window 3 (Reviewer):** Optional. Reviews final code before commit.

**Flow:**
```
Worker produces code
     ↓
Copy to Skeptic window: "Review this. What's wrong?"
     ↓
Skeptic finds issues
     ↓
Copy issues back to Worker: "Fix these."
     ↓
Worker fixes
     ↓
Commit
```

---

## Feature 9: Token/Cost Awareness (ADVANCED)

### What It Is
Track how much each session costs and where the budget goes.

### Why It Matters
Without tracking, one expensive session can blow through a weekly budget invisibly. With tracking, you can optimize (use cheaper models for simple tasks, expensive models for complex ones).

### How to Implement

**Manual tracking (any tool):**
Create `memory/session-log.md`:
```markdown
# Session Log

| Date | Duration | Model | Task | Notes |
|------|----------|-------|------|-------|
| 2026-03-26 | 1.5h | Kimi 2.5 | Inventory system | Long session, lots of iteration |
| 2026-03-26 | 0.5h | Kimi 2.5 | Bug fix | Quick fix, efficient |
```

**Automated (Claude Code):** The harness includes `token-tracker.cjs` that logs costs automatically and a `/token-report` skill that shows usage dashboards.

---

## Feature 10: Plan Before Execute (ADVANCED)

### What It Is
For complex tasks, create a plan and get user approval BEFORE writing any code.

### Why It Matters
Code written without a plan often needs to be thrown away. Plans are cheap; code is expensive. A 2-minute plan can save 30 minutes of rework.

### How to Implement

**For any task that touches more than 2 files:**
1. Present your approach: "Here's my plan: [numbered steps]"
2. Wait for approval: "Does this approach look right?"
3. Only then start coding

**For simple tasks (one file, obvious change):** Just do it. Plans add overhead — only use them when the cost of being wrong is high.

---

## Implementation Priority

If you're setting this up for the first time, do it in this order:

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| 1 | Memory System | 10 min setup | Eliminates amnesia permanently |
| 2 | Rules File | 15 min setup | Consistent behavior every session |
| 3 | Decision Capture | 0 min (behavior change) | No more forgotten decisions |
| 4 | Correction Cascade | 0 min (behavior change) | No more repeated mistakes |
| 5 | Skeptical Self-Review | 0 min (behavior change) | Fewer bugs presented to user |
| 6 | Evidence-Based Claims | 0 min (behavior change) | Higher trust, less rework |
| 7 | Session Structure | 5 min (template) | Consistent start and end |
| 8 | Advisory Council | 0 min (workflow change) | Catches assumptions |
| 9 | Token Tracking | 5 min (file creation) | Budget visibility |
| 10 | Plan Before Execute | 0 min (behavior change) | Less wasted code |

**Features 1-2 require creating files. Features 3-10 are behavior changes — implement them immediately by following the patterns described above.**

---

*This is part of [Vinci's Harness v10.7](https://github.com/OpusPocusAI/Vincis-Harness). The concepts work with any AI coding tool.*
