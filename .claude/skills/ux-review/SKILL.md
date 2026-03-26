---
name: ux-review
description: Playwright-driven UX evaluation — spacing, hierarchy, mobile, first-time user experience
user_invocable: true
argument-hint: "[route-path]"
---

# /ux-review — Visual UX Evaluation

You are evaluating the user experience of a specific route. Use Playwright MCP to navigate, screenshot, and analyze.

## Arguments

- `route-path` (optional): The route to review (e.g., `/explore`, `/plan/planner`). If not provided, review all routes that were modified in the current session.

## Steps

### 1. Start Dev Server (if not running)
```bash
curl -sf http://localhost:3000 > /dev/null 2>&1 || (cd FE && npm run dev &)
```
Wait for server to be ready.

### 2. Navigate and Screenshot

For the target route, take screenshots at TWO viewports:

**Desktop (1440x900)**:
- Use `mcp__playwright__browser_resize` to set viewport
- Navigate to `http://localhost:3000{route}`
- Take screenshot: `mcp__playwright__browser_take_screenshot`
- Take accessibility snapshot: `mcp__playwright__browser_snapshot`

**Mobile (390x844 — iPhone 14)**:
- Resize viewport
- Navigate and screenshot again

### 3. Evaluate Against Heuristics

For each viewport, analyze the accessibility snapshot and screenshot against these criteria:

| Criterion | What to Check | PASS/WARN/FAIL |
|-----------|--------------|----------------|
| **Spacing consistency** | Are padding/margins using design tokens (p-4, p-6, gap-4)? Any arbitrary values (p-3, p-7, gap-5)? | WARN if >2 arbitrary values |
| **Visual hierarchy** | Can a first-time user identify the PRIMARY ACTION within 3 seconds? Is there a clear visual flow? | FAIL if no clear primary action |
| **Information architecture** | Are critical inputs visible without scrolling? Is anything hidden that shouldn't be (e.g., language selection under "more options")? | WARN if critical info requires extra clicks |
| **Touch targets (mobile)** | All interactive elements ≥44x44px on mobile? Sufficient spacing between tap targets? | FAIL if <44px |
| **Loading states** | What does the user see before data loads? Spinner? Skeleton? Blank? | WARN if blank/no loading state |
| **Empty states** | What if there's no data? Is there a helpful message or just emptiness? | WARN if empty |
| **Error states** | What happens on API failure? Is there a user-friendly error? | WARN if no error handling visible |
| **First-time experience** | Would a new user understand what to do? Are there hints, onboarding, or clear affordances? | WARN if confusing |
| **Dark mode consistency** | Colors, contrast, readability in dark mode? | WARN if contrast issues |

### 4. Cross-Reference Design Tokens

Read `memory/design.md` for the project's design language. Check:
- Color palette adherence
- Typography consistency (Geist Sans for UI, monospace for data)
- Border radius consistency
- Shadow usage

### 5. Output Report

```markdown
## UX Review: {route}

### Desktop (1440px)
| Criterion | Status | Finding |
|-----------|--------|---------|
| Spacing   | PASS/WARN/FAIL | {detail} |
| ...       | ...    | ...     |

### Mobile (390px)
| Criterion | Status | Finding |
|-----------|--------|---------|
| ...       | ...    | ...     |

### Priority Fixes
1. {P0/P1/P2}: {description}

### Screenshots
- Desktop: {screenshot path}
- Mobile: {screenshot path}
```

### 6. Save Report

Save to `memory/research/ux-review-{route-slug}-{date}.md` with frontmatter:
```yaml
---
type: research
domain: design
status: active
ttl: 3-sprints
---
```
