# SESSION-PROMPT -- Worker {X} (Sprint {N})

> Path: `.sprint/sprint-{N}/SESSION-PROMPT-{X}.md`
> Branch: `sprint{N}-worker-{x}` | Port: {300X} | Worktree: `../worktree-{x}`
> Critical rules: see CLAUDE.md (auto-loaded).

---

## REQUIRED: Branch Verification (run this FIRST)

```bash
EXPECTED="sprint{N}-worker-{x}"
ACTUAL=$(git branch --show-current)
if [ "$ACTUAL" != "$EXPECTED" ]; then
  echo "WRONG BRANCH: On '$ACTUAL', expected '$EXPECTED'"
  echo "FIX: Run 'cd ../worktree-{x}' then verify with 'git branch'"
  echo "DO NOT PROCEED until this shows '$EXPECTED'"
else
  echo "Branch OK: $ACTUAL"
fi
```

**If branch is wrong**: `cd ../worktree-{x}`, then re-run the check.
**Fresh worktree**: `cd {{PROJECT_DIR}} && npm install && cd ..`

---

## Worker Type

- [ ] **Code** -- implements features, produces code commits
- [ ] **Conversation** -- design discussion with user, produces decision documents
- [ ] **Research** -- investigates a question, produces findings document

---

## Known Issues (Coordinator-verified)

{Issues the Coordinator has personally verified exist. Include file, line, and what's wrong.}

1. {Verified issue with evidence}

## Areas to Investigate (unverified)

{Flagged by analysis but NOT verified. These MAY be non-issues. Check before fixing.}

1. {Suspected issue — verify before spending time on it}

## Acceptance Criteria

1. {Measurable outcome 1}
2. {Measurable outcome 2}
3. {Measurable outcome 3}

---

## Primary Ownership

These are your primary files. You are responsible for delivering them. No other worker has primary ownership of them.

```
{path/to/file.tsx}
{path/to/new-file.tsx} (NEW)
```

You may edit other files if logically necessary (e.g., import chains, shared types). **Document every cross-ownership edit** in your SESSION-LOG `## Cross-Ownership Edits` section: File, Change, Reason, Merge risk.

---

## Prior User Decisions (MANDATORY — read ALL listed files before work)

| Topic | Memory File | Key Decision |
|-------|-------------|-------------|
| {e.g., "Payments"} | `memory/payments.md` | {Key decision summary} |

> The **Key Decision** column previews the most critical decision in that file.
> If your task touches this domain, you MUST read the full file.

---

## Context Files

1. `CLAUDE.md` (auto-loaded)
2. {Relevant docs/ file for your task}
3. {Any memory/ files listed above}

---

## Completion Protocol (3 steps + self-audit)

### Step 0: Completion Self-Audit
Compare what you did vs this SESSION-PROMPT's acceptance criteria:
- For each criterion: DONE / PARTIAL / MISSED
- Update `docs/BUGS.md` Active Bugs if you encountered any
- Check: "What knowledge exists only in my context that isn't saved anywhere?"

### Step 1: SESSION-LOG -> commit immediately
Write `.sprint/sprint-{N}/SESSION-LOG-{X}.md` with all 6 sections: Completed, Verified, Issues Found, Lessons Learned, Cross-Ownership Edits, Review Block.
```
## Review Block (ALL 6 fields required)
- **What slowed me down**: {one line}
- **Harness steps I skipped**: {which and why — or "none"}
- **Bugs encountered**: {BUG-ID or describe new, or "none"}
- **One thing I'd change**: {one concrete suggestion}
- **Process compliance**: {branch correct? committed? read prior decisions?}
- **Session efficiency**: {Was this session token-efficient? What would you do differently?}
```
Commit SESSION-LOG immediately.

### Step 2: Commit all remaining work
Kill dev servers first. Commit: `git add {files} && git commit -m "{message}"`

### Step 3: Signal done
"Branch committed, ready for Coordinator to merge."
