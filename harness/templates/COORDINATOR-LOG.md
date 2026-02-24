# Coordinator Log — Sprint {N}

> Path: `.sprint/sprint-{N}/COORDINATOR-LOG.md`
> Coordinator: {session ID or description} | Started: {YYYY-MM-DD HH:MM}

---

## Timeline

Record every significant action with timestamp. This is the Auditor's primary evidence.

| Time | Action | Notes |
|------|--------|-------|
| {HH:MM} | Sprint contract committed | `.sprint/sprint-{N}/CONTRACT.md` added to repo |
| {HH:MM} | Worktrees created | Branches: {list}, Dirs: {list} |
| {HH:MM} | SESSION-PROMPTs written | Files: {list} |
| {HH:MM} | Workers activated | User pasted activation prompts |
| {HH:MM} | {action} | {notes} |

---

## Deviations from Contract

Any change from SPRINT-CONTRACT.md must be logged here with justification.

| What changed | Why | User approved? |
|-------------|-----|----------------|
| {e.g., "Merge order swapped B and C"} | {e.g., "Worker B had a blocker, C finished first"} | {Yes/No} |

If no deviations: "None. Sprint followed contract exactly."

---

## Merge Results

| Branch | SESSION-LOG (6 sections)? | Rebase needed? | Conflicts? | Unintended files? (git diff --stat) | Build after merge? | Port cleanup verified? | Notes |
|--------|--------------------------|---------------|-----------|-------------------------------------|-------------------|----------------------|-------|
| `sprint{N}-worker-{x}` | [ ] Yes | [ ] N/A (first) | {None / list} | [ ] Clean | [ ] Pass | [ ] Clear | {notes} |
| `sprint{N}-worker-{y}` | [ ] Yes | [ ] Done | {None / list} | [ ] Clean | [ ] Pass | [ ] Clear | {notes} |
| `sprint{N}-worker-{z}` | [ ] Yes | [ ] Done | {None / list} | [ ] Clean | [ ] Pass | [ ] Clear | {notes} |

### Worker Knowledge Summary
{Coordinator reads each worker's Lessons Learned + Suggestions sections and summarizes the key insights here. This is what the Auditor uses to feed back into MEMORY.md and CLAUDE.md.}

| Worker | Key lessons | Suggestions acted on? |
|--------|-----------|----------------------|
| Worker {x} | {summary of their Lessons Learned} | {Yes — did X / No — deferred / N/A} |
| Worker {y} | {summary} | {status} |
| Worker {z} | {summary} | {status} |

### Conflict Resolutions
{For each conflict: which file, what each worker did, which version kept, why, any functionality lost}

If no conflicts: "Clean merges across all branches."

---

## Quality Gate Results

| Gate | Target | Actual | Pass? |
|------|--------|--------|-------|
| Bundle size | < {N} KB | {actual} KB | [ ] |
| Build | 0 errors | {actual} errors | [ ] |
| Port cleanup | 0 listeners | {actual} listeners | [ ] |
| Dev servers killed | All confirmed | {status} | [ ] |
| Docs updated | All relevant | See checklist below | [ ] |

---

## User Input Preservation

Were detailed user answers collected during this sprint?

- [ ] **No** — skip this section
- [ ] **Yes** — distillation created:
  - Distilled file: `{path to USER-DECISIONS file}`
  - Archive file: `memory/{topic}-conversation-sprint{N}.md`
  - Raw verbatim NOT in plans/SESSION-PROMPTs: [ ] Verified

---

## Session Insights

Before ending this session, capture knowledge that exists only in your context:

- **Decisions made** (not in contract): {e.g., "Decided to merge C before B because..."}
- **Surprises discovered**: {e.g., "Worker A's approach revealed that X component has a hidden dependency on Y"}
- **Rejected alternatives**: {e.g., "Considered splitting task X into two workers but didn't because..."}
- **User intent observed**: {e.g., "User cares more about X than Y — prioritize accordingly next sprint"}

If nothing new: "No additional insights beyond what's in the timeline and merge results."

---

## Core Principles Grade
> Skip this section if Review System is DORMANT (check memory/sprint-process.md).
> Grade the sprint holistically. A = fully achieved, B = mostly achieved with friction, C = significantly compromised.

| Principle | Grade | Reason |
|-----------|-------|--------|
| Productivity | {A/B/C} | {One line: Did this sprint produce more shipped work than the last? Was ceremony justified?} |
| Efficiency | {A/B/C} | {One line: Did the user have to repeat themselves? Did workers re-discover known information?} |
| Accuracy | {A/B/C} | {One line: Did we build on any mistakes? Were cross-checks effective?} |
| Token Efficiency | {A/B/C} | {One line: Was the execution mode right? Could we have achieved the same with fewer workers/reads?} |

---

## Documentation Update Checklist

Check each file you updated after this sprint's changes:

- [ ] `docs/ARCHITECTURE.md` — {updated / not needed / missed}
- [ ] `docs/BUGS.md` — {updated / not needed / missed}
- [ ] `docs/PERFORMANCE.md` — {updated / not needed / missed}
- [ ] `docs/CURRENT.md` — {updated / not needed / missed}
- [ ] `memory/MEMORY.md` — {updated / not needed / missed}
- [ ] `NEXT-SESSION-KICKSTART-COORDINATOR.md` — {updated / not needed / missed}
- [ ] {Add project-specific docs here}

---

## Issues Discovered

{Any bugs, regressions, or concerns found during merges or verification}

| Issue | Severity | Action taken |
|-------|---------|-------------|
| {description} | {Low/Med/High} | {e.g., "Added to BUGS.md", "Fixed during merge", "Carried to next sprint"} |

If no issues: "No new issues discovered."
