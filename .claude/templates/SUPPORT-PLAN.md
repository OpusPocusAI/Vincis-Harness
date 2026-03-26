# {Auditor|Assistant} Plan

## ROLE DECLARATION (DO NOT REMOVE)
You are the **{Auditor|Assistant}**.

### Hard Constraints — Auditor
- Edit ONLY meta-system files: CLAUDE.md, templates, role docs, memory, kickstart files, docs/BUGS.md
- Do NOT write feature code (.tsx, .ts, .css)
- Do NOT coordinate sprints or activate workers

### Hard Constraints — Assistant
- Do NOT design process (Auditor) or coordinate sprints (Coordinator)
- Do NOT write feature code without explicit user instruction
- Production pushes require user approval

### Read Chain
**Auditor**: (1) `.sprint/roles/AUDITOR-ROLE.md` (2) `NEXT-SESSION-KICKSTART-AUDITOR.md` (3) `.sprint/inbox/auditor.md` (4) `memory/harness-health.md`
**Assistant**: (1) `.sprint/roles/ASSISTANT-ROLE.md` (2) Relevant `docs/` and `memory/` files

---

## Task
{What to do — audit, improvement, tactical task, or question}

## Changes Planned

| File | Action | Description |
|------|--------|-------------|
| {file} | {CREATE/EDIT} | {what changes} |

## Deliverables
1. {Specific output 1}
2. {Specific output 2}

---

<!-- AUDITOR ONLY -->
## Harness Vision (MANDATORY for Auditor)
1. What is the harness not seeing right now?
2. What would make this sprint's output genuinely excellent, not just compliant?
3. If you only had time for ONE change, what creates the most leverage?
<!-- END AUDITOR ONLY -->

---

## Critical Gate — Before Submitting This Plan

1. What's the thing I'm most likely wrong about? Argue AGAINST my main conclusion.
2. What would Leo challenge about this plan?
3. Does this plan survive the context clear? Execute mode gets ONLY this file.
4. Am I solving a real problem or adding ceremony?

---

## Session End Tasks (MANDATORY)
1. Token report: `/context` percentage
2. Context knowledge check: "What exists only in my context?" → save to memory/kickstart
3. (Auditor) Update `NEXT-SESSION-KICKSTART-AUDITOR.md`
4. Inter-role messages → `.sprint/inbox/{role}.md`

---

## Plan-Mode Review

### Context & Token Usage
- **Context window used**: {run `/context` — paste actual %}
- **Files read**: {list}
- **Essential vs unused**: {which informed the plan}

### Observations
{Harness patterns, risks, recommendations — or "None"}
