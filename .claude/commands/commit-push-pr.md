---
description: Commit, push, and create PR
---
Review what changed:
$(git status)
$(git diff --stat)

1. Stage all changes
2. Write a conventional commit message (feat/fix/refactor/docs/chore)
3. Push to current branch
4. If on a feature branch, create a PR via GitHub MCP
5. Then run: update the relevant docs/ files based on what changed (this is mandatory per CLAUDE.md workflow rules)
