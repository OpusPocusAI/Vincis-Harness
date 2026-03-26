---
name: harness-sync
description: Pull latest harness updates from HarnessUpdate repo. Run at session start to stay in sync with Leo's harness improvements.
user_invocable: true
---

# /harness-sync — Pull Harness Updates

You are a collaborator syncing your harness with the latest version from the HarnessUpdate distribution repo.

## Pre-flight

1. Check if `harness-update` remote exists:
```bash
git remote -v | grep harness-update
```

If not found, add it:
```bash
git remote add harness-update https://github.com/OpusPocusAI/HarnessUpdate.git
```

2. Fetch latest:
```bash
git fetch harness-update
```

## Check for Updates

Compare local harness files with HarnessUpdate:

```bash
git diff HEAD harness-update/main -- .claude/hooks/ .claude/commands/ .claude/settings.json CLAUDE.md 2>/dev/null | head -50
```

If no diff output: report "Harness is up to date. No sync needed." and stop.

If there are changes: show a summary of what files changed and continue.

## Review Changes

Before applying, show the user what will change:

```bash
git diff --stat HEAD harness-update/main -- .claude/hooks/ .claude/commands/ .claude/settings.json CLAUDE.md
```

List each changed file with a one-line description of what changed.

## Apply Updates

Apply the harness files from HarnessUpdate:

```bash
git checkout harness-update/main -- .claude/hooks/ .claude/commands/ .claude/settings.json CLAUDE.md
```

### What is NOT synced (preserved as-is):
- `.claude/settings.local.json` — machine-specific permissions
- `.claude/skills/` — skills that are project-specific stay local
- `memory/` — project memory is NOT overwritten
- MCP server configurations
- Plugin installations
- `.env` files

## Version Check

Compare local and remote harness versions:

```bash
echo "Local:  $(cat HARNESS-VERSION 2>/dev/null || echo 'not found')"
echo "Remote: $(git show harness-update/main:HARNESS-VERSION 2>/dev/null || echo 'not found')"
```

If versions match: "Harness in sync."
If versions differ: apply updates (already done above), then update local HARNESS-VERSION:

```bash
git show harness-update/main:HARNESS-VERSION > HARNESS-VERSION
```

## Post-Sync Verification

1. Verify no syntax errors in settings.json:
```bash
node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8'));console.log('settings.json: valid')"
```

2. Check that key hooks exist:
```bash
ls .claude/hooks/council-enforcer.cjs .claude/hooks/council-spawn-validator.cjs .claude/hooks/dangerous-command-guard.cjs 2>/dev/null | wc -l
```
Expected: 3 files found.

3. Read the HarnessUpdate CHANGELOG for what changed:
```bash
git show harness-update/main:CHANGELOG.md | head -30
```

## Commit

```bash
git add .claude/hooks/ .claude/commands/ .claude/settings.json CLAUDE.md
git commit -m "Harness sync: updated from HarnessUpdate

Applied latest harness changes from Leo's distribution repo.
Run /harness-sync at session start to stay current."
```

Report: "Harness synced. {N} files updated. Review CHANGELOG above for details."

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `harness-update` remote not found | `git remote add harness-update https://github.com/OpusPocusAI/HarnessUpdate.git` |
| Merge conflict in settings.json | Take HarnessUpdate version, then re-add any custom local hooks |
| Hook not found after sync | Check `.claude/hooks/` — the sync only copies files that exist in HarnessUpdate |
| CLAUDE.md overwritten with Leo's version | Expected — CLAUDE.md is authoritative from HarnessUpdate. Project-specific additions go in role docs |
