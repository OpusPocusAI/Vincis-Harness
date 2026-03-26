---
description: Extract reusable patterns from the current session into memory files. Run at session end to compound knowledge.
---

# Learn — Session Knowledge Extraction

You are extracting reusable knowledge from what was done in this session. The goal is to turn one-time discoveries into permanent harness knowledge that helps future sessions.

## Process

### Step 0: Process Self-Evolve Proposals (v10.0)

Check if the self-evolve Stop hook left proposals from a previous session:

```bash
cat .claude/self-evolve-output.json 2>/dev/null
```

If the file exists and contains proposals:
1. Show each proposal to the user:
   - **Corrections**: rules that would prevent a user correction from happening again → target: CLAUDE.md or role docs
   - **Friction**: tool/hook improvements that would reduce friction → target: settings.json or new hook/skill
   - **Knowledge**: codebase facts to persist → target: memory files
2. User confirms each one (Y/n)
3. Apply confirmed proposals to their target files
4. Delete `.claude/self-evolve-output.json` after processing

If the file doesn't exist, skip to Step 1.

---

1. **Review what happened this session.** Read the SPRINT-LOG, SESSION-LOG, or conversation to understand what was built, investigated, or decided.

2. **Identify patterns worth preserving.** Look for:
   - **Code patterns** — a technique that worked and should be reused (e.g., rAF-for-iOS, Embla setup, dvh layout)
   - **Investigation findings** — root cause analysis that reveals how a system actually works
   - **Decision rationale** — WHY something was chosen, not just WHAT (future sessions need the why)
   - **Failure patterns** — what went wrong and the structural fix (not just "be more careful")
   - **Tool discoveries** — new capabilities, gotchas, or configurations for tools we use

3. **For each pattern, decide WHERE it belongs:**
   - React/FE patterns → `memory/react-patterns.md`
   - Sprint process insights → `memory/sprint-process.md`
   - Tool/infra knowledge → `memory/tech-radar.md` or relevant topic file
   - User decisions → `memory/user-decisions.md` + relevant topic file
   - New domain → create `memory/{topic}.md` with proper frontmatter

4. **Draft the additions.** For each pattern:
   - Write a concise description (2-5 lines)
   - Include the context: which sprint, which file, what the evidence was
   - Mark as `(learned S{N})` so future readers know the source
   - Include a code snippet ONLY if the pattern is non-obvious

5. **Present to user for confirmation.** Show:
   ```
   ## Patterns Found

   ### 1. {Pattern Name}
   **Where**: {memory file}
   **What**: {2-3 lines}
   **Evidence**: {which sprint/file}

   ### 2. {Pattern Name}
   ...

   Shall I save these? (Y/n per pattern)
   ```

6. **Save confirmed patterns** to the appropriate memory files.

7. **Update `memory/MEMORY.md`** if a new topic file was created.

## Rules

- **Intentional, not automatic.** The user confirms each pattern before saving. No silent writes.
- **No duplicates.** Check if the pattern already exists in the target file before adding.
- **Concise.** Each pattern should be 2-5 lines. If it needs more, it's a doc, not a memory.
- **Evidence-based.** Every pattern links to the sprint/file where it was discovered.
- **Skip the obvious.** Don't save "TypeScript strict mode" or "use dvh not vh" — those are in CLAUDE.md already.
- **Focus on the surprising.** The best patterns are things that were NOT obvious before the session.
