# Sprint Contract — Sprint {N}

> Created by: Coordinator | Date: {YYYY-MM-DD}
> Auditor gate: [ ] Approved / [ ] Rejected (reason: ___)
> Coordinator boundaries: see COORDINATOR-ROLE.md. Quality gates: standard, measured by `/sprint-metrics`.

---

## Sprint Goal

{One sentence. Measurable outcome. Not "work on X" — instead "Ship X with Y working end-to-end."}

---

## Workers

| Worker | Type | Branch | Focus | Port | Worktree Dir |
|--------|------|--------|-------|------|-------------|
| Worker A | {Code / Conversation / Research} | `sprint{N}-worker-a` | {focus area} | {{PORT_RANGE_START}}+1 | `../worktree-a` |
| Worker B | {Code / Conversation / Research} | `sprint{N}-worker-b` | {focus area} | {{PORT_RANGE_START}}+2 | `../worktree-b` |
| Worker C | {Code / Conversation / Research} | `sprint{N}-worker-c` | {focus area} | {{PORT_RANGE_START}}+3 | `../worktree-c` |

### Context Budget Estimates

One worker = one verb. If estimated reading exceeds 3000 lines, split the scope.

| Worker | Lines to Read (est.) | Primary Verb | Budget Risk |
|--------|---------------------|--------------|-------------|
| Worker A | {e.g., ~800} | {e.g., "Fix"} | {Low / Med / High} |
| Worker B | {e.g., ~2500} | {e.g., "Test"} | {Low / Med / High} |
| Worker C | {e.g., ~1200} | {e.g., "Refactor"} | {Low / Med / High} |

---

## File Ownership Map

No overlap. Every new file tagged `(NEW)`. If a file isn't listed, nobody touches it.

### Worker A
```
{path/to/file.tsx}
{path/to/new-file.tsx} (NEW)
```

### Worker B
```
{path/to/file.tsx}
```

### Worker C
```
{path/to/file.tsx}
```

### Shared (Coordinator resolves conflicts)
```
{minimize this list}
```

---

## Merge Plan

| Order | Branch | Rationale |
|-------|--------|-----------|
| 1st | `sprint{N}-worker-{x}` | {Why first} |
| 2nd | `sprint{N}-worker-{y}` | {Why second} |
| 3rd | `sprint{N}-worker-{z}` | {Why last} |

Merge order is LOCKED once workers are activated.

---

## Cross-Worker Dependencies

| Dependency | From | To | Mitigation |
|-----------|------|-----|-----------|
| {e.g., "TypeDef for X"} | Worker A | Worker B | {e.g., "Worker A merges first"} |

If none: "None identified. Workers are fully independent."

---

## Prior User Decisions

| Topic | File | Key Decision | Relevant to |
|-------|------|-------------|-------------|
| {e.g., "Payments"} | `memory/payments.md` | {Key decision summary} | {Worker C} |

> **Key Decision** column: forces Coordinator to read the file before listing it, gives workers instant preview.

---

## Carried Blockers from Sprint {N-1}

| Blocker | Original Sprint | Impact | Mitigation |
|---------|----------------|--------|-----------|
| {or "None."} | | | |
