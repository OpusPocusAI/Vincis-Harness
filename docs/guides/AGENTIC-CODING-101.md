# Agentic Coding 101

**A beginner's guide to working with AI coding assistants — properly.**

You've discovered that AI can write code for you. You paste a prompt, it spits out code, you paste it into your project. It works (mostly). You're vibe coding.

This guide is about what happens next — when vibe coding hits a wall, and how a "harness" turns chaos into a system that actually scales.

---

## Part 1: The Wall

Every vibe coder hits the same problems around session 5-10:

### The Amnesia Problem
You spent 30 minutes explaining your project architecture to the AI. Next session? It has no idea. You explain it again. And again. Every. Single. Session.

**Why it happens:** AI assistants have no memory between sessions. Each conversation starts from absolute zero. Your carefully crafted context? Evaporated.

### The Yes-Man Problem
You ask the AI "is this a good approach?" It says "Yes, great idea!" You ask a different AI the same question. Also "great idea!" You later discover it was a terrible idea.

**Why it happens:** AI models are trained to be helpful and agreeable. They default to confirmation, not challenge. Without built-in skepticism, bad ideas sail through unchallenged.

### The Groundhog Day Problem
You correct the AI: "Don't use `var`, use `const`." It says "Got it!" Next session, it uses `var` again. You correct it again. Forever.

**Why it happens:** Corrections exist only in the conversation where they happened. No conversation? No correction. The AI has no mechanism to learn from past mistakes.

### The Mystery Budget Problem
You're on a usage-limited plan. How much did that last session cost? Which session ate half your weekly budget? You have no idea.

**Why it happens:** Most AI tools don't expose granular cost data. You're flying blind on spend.

### The Cascade Problem
The AI makes a wrong assumption early in a session. It builds 500 lines of code on that assumption. You notice the mistake 45 minutes later. All 500 lines need to be thrown away.

**Why it happens:** Nothing challenged the assumption. Nothing demanded evidence. The AI was confident, you were trusting, and the error compounded silently.

---

## Part 2: What Is a Harness?

A harness is **the system around your AI** that makes it reliable.

Think of it like training wheels, guardrails, and a copilot combined:

- **Memory files** so the AI remembers what you told it
- **Rules** so the AI follows your project's conventions
- **Hooks** that automatically block dangerous actions
- **Advisors** that challenge the AI's assumptions
- **Tracking** so you can see what's happening and what it costs

Without a harness, you're trusting the AI to be perfect. With a harness, you're building a system that catches imperfection.

**An analogy:** A pilot doesn't fly by memory. There's a pre-flight checklist, altitude alerts, a copilot who challenges decisions, and a black box that records everything. The plane could fly without all that — but you wouldn't want to be on it.

---

## Part 3: The Five Principles

These work regardless of which AI tool you use. Kimi 2.5, Claude, GPT, Cursor, Windsurf — the principles are the same.

### 1. Memory Beats Repetition

**The rule:** Every decision, correction, and piece of research gets saved to a file. If it only exists in the conversation, it's already lost.

**How to do it:**
- Create a `memory/` folder in your project
- Create a `memory/decisions.md` file
- Every time you make a decision ("use Blueprint for movement, not C++"), write it down
- Every time you correct the AI, write down the correction
- At the start of each session, tell the AI: "Read the files in `memory/` before doing anything"

**Example `memory/decisions.md`:**
```markdown
# Project Decisions

- 2026-03-20: Use Unreal Engine 5.4, not 5.3 — stability issues with 5.3 networking
- 2026-03-21: Movement system uses Blueprint, NOT C++ — team is more comfortable with visual scripting
- 2026-03-22: Multiplayer via Steam Online Subsystem, not Epic Online Services
- 2026-03-23: Don't use `Tick()` for inventory checks — use timers instead (performance)
```

Now every session starts with context. No more amnesia.

### 2. Guardrails Beat Trust

**The rule:** Don't trust the AI to remember rules. Enforce them.

If your AI tool supports hooks (automatic scripts that fire on events), use them. If it doesn't, create **checklists** that you run manually before committing code.

**Example checklist (for any tool):**
```markdown
## Before Committing Code
- [ ] No hardcoded API keys or passwords in the code
- [ ] No `print()` / `console.log()` debug statements left in
- [ ] File is under 500 lines (split if larger)
- [ ] Changes match what was actually requested (no scope creep)
- [ ] Build still compiles without errors
```

**If your tool supports hooks (like Claude Code):**
The harness includes 39 hooks that do this automatically. `dangerous-command-guard` blocks destructive commands. `quality-gate` runs type checks. `decision-capture-guard` auto-saves your decisions. You don't need to remember the checklist — the system enforces it.

### 3. Skepticism Beats Agreement

**The rule:** Build in something that challenges the AI. Don't let it just say "good idea!" to everything.

**How to do it (any tool):**
- After the AI proposes a solution, open a **second conversation** and ask: "Here's what another AI proposed. What's wrong with it? Be critical."
- Give the second conversation a skeptical persona: "You are a code reviewer. Your job is to find problems. Don't say anything is good unless you can prove it."
- This is the **Advisory Council** concept — dedicated skeptics that challenge the main worker.

**In Claude Code:** The `/council` command spawns three background agents:
- **Evidence Auditor** — "What evidence proves this works? Show me."
- **Behavior Watchdog** — "You said you're done, but task 3 is still pending."
- **Code Reviewer** — "This function has a null pointer bug on line 47."

**In Kimi 2.5 or other tools:** Open a second chat window. Paste the AI's output. Ask it to be brutal. This works surprisingly well.

### 4. Evidence Beats Intuition

**The rule:** "It should work" is not acceptable. "Here's proof it works" is.

Before accepting any AI output:
- **Does it compile?** Run the build.
- **Does it do what was asked?** Test it manually.
- **Does it break anything else?** Run existing tests.

If the AI says "I fixed the bug," your response should be: "Show me. What was the error? What did you change? Prove the fix works."

This is especially important with AI coding because the model sounds confident even when it's wrong. Confidence is not evidence.

### 5. Structure Beats Talent

**The rule:** A mediocre AI with good structure outperforms a brilliant AI with no structure.

Structure means:
- **A consistent project layout** the AI can navigate
- **Clear rules** in a file the AI reads every session (like `CLAUDE.md` or a system prompt)
- **Templates** for recurring tasks (so nothing gets skipped)
- **A decision log** (so nothing gets forgotten)
- **A feedback loop** (corrections become permanent rules)

You don't need the most powerful model. You need the most structured environment.

---

## Part 4: Setting Up Your First Harness

### Step 1: Create the memory folder

```
your-game-project/
├── memory/
│   ├── INDEX.md          # List of all memory files + what they cover
│   ├── decisions.md      # Every project decision
│   ├── architecture.md   # How the project is structured
│   └── corrections.md    # Things the AI got wrong and the fix
```

### Step 2: Write your rules file

Create a file in your project root that the AI reads every session. Name it whatever your tool expects:
- Claude Code: `CLAUDE.md`
- Cursor: `.cursorrules`
- Kimi / GPT: paste into system prompt
- Any tool: just tell it "read `PROJECT-RULES.md` first"

**What to put in it:**
```markdown
# Project Rules

## Architecture
- Unreal Engine 5.4 project
- Multiplayer game using Steam Online Subsystem
- Blueprint-primary, C++ only for performance-critical systems

## Conventions
- Blueprint names: BP_{Category}_{Name} (e.g., BP_Character_PlayerPawn)
- C++ classes: prefix with A (Actors), U (Objects), F (Structs)
- No Tick() for non-essential logic — use Timers
- Max 1 RPC per frame per actor

## Memory
- Read `memory/decisions.md` before starting any task
- When I make a decision, save it to `memory/decisions.md`
- When I correct you, save the correction to `memory/corrections.md`

## Before Writing Code
- State your approach BEFORE writing code
- I will approve or redirect
- Never assume — ask if unsure
```

### Step 3: Start every session the same way

Paste this at the start of every session:

> "Read the project rules file and all files in `memory/`. Summarize what you know about this project before we start."

This forces the AI to load context before acting. It takes 30 seconds and saves hours.

### Step 4: End every session with a save

Before closing a session:

> "What decisions did we make this session? What did I correct? Save them to the appropriate memory files."

This is the feedback loop. Each session leaves the project smarter than it found it.

---

## Part 5: Tools of the Trade

### Memory Tools

| Tool | What It Does | Cost |
|------|-------------|------|
| **Plain markdown files** | Simple, works everywhere, AI reads them natively | Free |
| **Obsidian** | Visual markdown editor with linking, graph view, search | Free |
| **Notion** | Richer formatting, databases, but AI can't read it directly | Free tier |

**Recommendation for beginners:** Start with plain markdown files in a `memory/` folder. They work with every AI tool and require zero setup. If you later want visual navigation, open the `memory/` folder in Obsidian — it reads plain markdown natively.

### AI Coding Tools

| Tool | Strengths | Harness Support |
|------|-----------|-----------------|
| **Claude Code** | Full hook system, background agents, plan mode | Full — all 39 hooks + council + skills |
| **Kimi 2.5** | Strong code generation, large context | Memory files + rules file + manual checklists |
| **Cursor / Windsurf** | IDE integration, inline completions | `.cursorrules` file + memory folder |
| **GPT (ChatGPT / API)** | Widely available, plugins | Custom Instructions + memory folder |

### Extending Your Setup: MCP Servers

MCP (Model Context Protocol) servers are plugins that give your AI tool extra capabilities:

| MCP Server | What It Does |
|-----------|-------------|
| **Playwright** | AI can control a web browser — take screenshots, click buttons, test UIs |
| **Supabase** | AI can query your database, run migrations, check data |
| **Context7** | AI can look up documentation for any library in real-time |
| **GitHub** | AI can create PRs, read issues, manage repos |

These are Claude Code features specifically, but the concept applies everywhere: **give the AI access to the tools it needs** so it doesn't have to guess.

### Version Control

**Non-negotiable:** Use Git. Every project. Every time. Reasons:
- The AI WILL break things. Git lets you undo.
- Branches let you experiment without risk.
- Commit messages are free documentation.
- If you don't use Git, one bad AI session can destroy your project.

---

## Part 6: The Advisory Council Pattern

This is the most powerful concept in the harness, and it works with any tool.

**The idea:** Don't let one AI conversation be judge, jury, and executioner. Split the work:

| Role | What It Does | How To Set It Up |
|------|-------------|-----------------|
| **Worker** | Writes the code | Your main AI conversation |
| **Skeptic** | Challenges the code | A second conversation with "find problems" instructions |
| **Reviewer** | Checks for bugs | A third conversation that reviews diffs |

**In practice with Kimi 2.5:**
1. **Chat 1 (Worker):** "Implement the inventory system using Blueprints"
2. The worker produces code
3. **Chat 2 (Skeptic):** "Here's an inventory system implementation. You are a senior UE5 developer. What's wrong with it? What edge cases does it miss? What would break in multiplayer?"
4. The skeptic finds 3 issues
5. **Back to Chat 1:** "Fix these 3 issues: [paste skeptic's findings]"

This catches bugs that a single conversation would miss because the worker is too deep in its own assumptions.

---

## Part 7: Growing Your Harness

Start simple. Add complexity only when you feel the pain.

**Week 1:** Memory files + rules file. That's it.

**Week 2-3:** Add a decision log and corrections file. Start saving things.

**Week 4+:** Try the advisory council pattern on a complex feature. See if it catches things.

**When ready:** If you're using Claude Code, install the full harness (39 hooks, council, skills). If you're using another tool, adapt the checklists and patterns.

The harness grows with you. Every session that saves a correction makes the next session better. Every decision logged is one you'll never repeat. After 10 sessions, your AI knows your project. After 50 sessions, it's a team member.

---

## Quick Reference Card

```
START OF SESSION:
  "Read project rules and memory files. Summarize what you know."

WHEN MAKING A DECISION:
  Save it: "Add to memory/decisions.md: [decision]"

WHEN AI MAKES A MISTAKE:
  Save it: "Add to memory/corrections.md: [what was wrong and the fix]"

BEFORE ACCEPTING CODE:
  Ask: "Does this compile? Show me evidence."
  Consider: Open a second chat to review the output.

END OF SESSION:
  "What decisions and corrections happened this session? Save them."

GOLDEN RULE:
  If it's not in a file, it doesn't exist.
```

---

*This guide is part of [Vinci's Harness](https://github.com/OpusPocusAI/Vincis-Harness) — a framework for working with AI coding assistants.*
