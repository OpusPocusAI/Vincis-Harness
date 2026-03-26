---
description: Automated Auditor self-check — fix tracker, memory health, harness hygiene, metrics extraction
---
You are running the Auditor's automated self-check. This replaces the manual Harness Self-Check Protocol.

Spawn up to 3 Explore agents IN PARALLEL to do the following checks:

## Agent 1: Fix Tracker Audit
Read `memory/harness-health.md` section `[HH-FIX-TRACKER]`.
- Count UNTESTED fixes. Flag any UNTESTED for 3+ sprints (current sprint minus fix sprint >= 3) → recommend auto-retirement.
- Count total active fixes. If >10, force a retirement review — list the weakest candidates.
- Check each TESTED fix: has it been stable for 3+ sprints? → recommend PROVEN or RETIRED.
- Report: fix counts by status, retirement candidates, stale fixes.

## Agent 2: Memory & Harness Health
- Check all files in `memory/` — flag: files >200 lines, missing frontmatter, files not in MEMORY.md index.
- Check `memory/MEMORY.md` line count — flag if >100 lines.
- Check role doc sizes: `.sprint/roles/*.md` — flag any >500 lines (COORDINATOR-ROLE target: <500, AUDITOR-ROLE target: <250).
- Check `.claude/hooks/` — count hooks, verify each is registered in `.claude/settings.json`. Flag orphans.
- Check DOC-MAP anchors resolve to existing sections. Check MEMORY.md links point to existing files.
- Report: oversized files, orphan hooks, broken references.

## Agent 3: Sprint Artifact Scan
Read the latest sprint's SPRINT-LOG and any SESSION-LOGs.
- Extract: delivery count, build status, user corrections count, harness changes made.
- Check `[HARNESS]`-labeled commits since last Auditor session: `git log --all --grep="HARNESS" --oneline`.
- Check each: tactical (allowed) or structural (needs Auditor review)?
- For post-sprint audits: check the 6-point checklist (contract compliance, coordinator boundaries, user input preserved, fix tracker updated, harness change audit, harness size check).
- Report: sprint health summary, harness changes to review.

## After agents report:
Summarize findings. For each finding, classify:
- **CLEAN** — no issues
- **WARN** — advisory, note in kickstart
- **FIX** — must be addressed this session (apply TEL: investigate → fix → verify → reflect)

The Auditor applies judgment to agent findings. Agents extract data; the Auditor decides what it means.
