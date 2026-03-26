---
description: Research a tool, competitor, or technology topic. Produces a structured brief and updates the tech radar.
---

# Scout — Tool & Competitor Research

You are running a research scout for the Your Project harness. Your job is to investigate a topic and produce a structured brief.

## Input

The user provides a topic: a tool name, competitor, technology, or open question.

## Process

1. **WebSearch** the topic — get current information (latest version, pricing, features, adoption)
2. **WebFetch** the top 2-3 results for deeper detail (official docs, GitHub README, comparison articles)
3. **Assess relevance** to our stack: TypeScript, React 18, NestJS, Supabase, Vite, Railway, Vercel
4. **Produce the structured brief** (see template below)
5. **Save** the brief to `memory/research/{topic-slug}.md` with YAML frontmatter:
   ```yaml
   ---
   type: research
   domain: tooling
   status: active
   created: {today}
   source: /scout
   tags: ["research", "tooling", "{category}"]
   ---
   ```
6. **Update `memory/tech-radar.md`** — add or move the tool in the appropriate quadrant
7. **Log** a dated entry in `memory/scouting-log.md` (append at top, under the `---` separator)

## Brief Template — Tool

```markdown
# {Tool Name} — Scout Brief

## Overview
- **What**: {one sentence}
- **Version**: {latest}
- **License**: {license type}
- **Stars/Adoption**: {GitHub stars, npm downloads, or user count}
- **Stack fit**: {Yes/Partial/No} — {why}

## Pros
- {bullet list}

## Cons
- {bullet list}

## Effort to Adopt
- **Install**: {minutes/hours/days}
- **Learn**: {curve assessment}
- **Maintain**: {ongoing cost}

## Impact Assessment
- **What it replaces/improves**: {current gap or tool}
- **Risk if we don't adopt**: {what we're missing}
- **Recommendation**: INSTALL / EVALUATE / RESEARCH / HOLD

## Sources
- {URLs consulted}
```

## Brief Template — Competitor

```markdown
# {Competitor Name} — Competitor Brief

## Overview
- **What**: {one sentence}
- **Market position**: {how they compare to Your Project}
- **Target audience**: {who they serve}

## Feature Comparison
| Feature | {Competitor} | Your Project | Gap |
|---------|-------------|-----------|-----|
| {feature} | {their approach} | {our approach} | {what we're missing} |

## What They Do Better
- {bullet list of things we should learn from}

## What We Do Better
- {bullet list of our advantages}

## Actionable Takeaways
- {specific things to implement or research further}

## Sources
- {URLs consulted}
```

## Rules

- Be honest about limitations — don't oversell tools
- Include pricing information when available
- Note any licensing concerns (Source Available vs Open Source)
- If a tool was previously evaluated and rejected, note why and what changed
- Keep briefs concise — 1-2 pages max
