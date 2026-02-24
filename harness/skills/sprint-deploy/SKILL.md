---
name: sprint-deploy
description: Deploy services via git subtree push. Detects which services changed, shows the exact commands, and asks for user confirmation before pushing. Use after merging to main.
allowed-tools: Read, Bash
argument-hint: "[--service1] [--service2] [--all]"
---

# Sprint Deploy — Subtree Deployment Helper

You are helping deploy services after code has been merged to main. This skill detects
which services have changes and runs the correct `git subtree push` commands — with
explicit user confirmation before every push.

**CRITICAL**: NEVER push without user confirmation. This is a production gate.

## Prerequisites

This skill requires your CLAUDE.md to define a deployment table with:
- Service names and their directory prefixes
- Git remote names for each service
- Deployment platforms (e.g., Vercel, Railway, Fly.io)

Example CLAUDE.md deployment section:
```
| Service | Prefix | Remote | Platform |
|---------|--------|--------|----------|
| Frontend | FE/ | fe-deploy | Vercel |
| Backend | BE/ | be-deploy | Railway |
```

## Step 0: Parse Arguments

Check `$ARGUMENTS` for flags matching your service names. If no arguments provided,
auto-detect which services changed (default).

## Step 1: Detect Changes

If auto-detecting, check which services have changes since the last deploy:

For each service defined in CLAUDE.md:
```bash
git diff HEAD~10 --stat -- {{SERVICE_DIR}}/
```

If specific flags were given, skip detection for non-flagged services.

## Step 2: Verify Prerequisites

Before deploying, check:
1. `git status --short` — ensure working tree is clean (no uncommitted changes)
2. `git branch --show-current` — ensure we're on `main`
3. Build check: `{{BUILD_COMMAND}}` — ensure build passes

If any check fails, STOP and report the issue. Do NOT deploy with a dirty working tree
or failing build.

## Step 3: Show Deployment Plan

Output what will be deployed:

```
## Deployment Plan

**Branch**: main
**Working tree**: clean
**Build**: passing

### Services to Deploy

| Service | Changed? | Remote | Command |
|---------|----------|--------|---------|
| {service_name} ({dir}/) | {Yes/No — N files changed} | {remote} | `git subtree push --prefix={dir} {remote} main` |

**Services with no changes will be skipped.**
```

## Step 4: STOP AND ASK FOR CONFIRMATION

**This is mandatory. Do NOT proceed without explicit user approval.**

Ask the user: "Ready to deploy the services listed above? Please confirm with 'yes' for
each service, or tell me which ones to skip."

Wait for the user's response before proceeding.

## Step 5: Execute Deployment

For each confirmed service, run the subtree push one at a time:

```bash
git subtree push --prefix={{SERVICE_DIR}} {{DEPLOY_REMOTE}} main
```

If this fails with "Updates were rejected" (diverged history), inform the user and offer:
```bash
git subtree split --prefix={{SERVICE_DIR}} -b deploy-temp
git push {{DEPLOY_REMOTE}} deploy-temp:main --force
git branch -D deploy-temp
```
**Force push also requires explicit user confirmation.**

After each push, report success or failure.

## Step 6: Post-Deploy Summary

```
## Deployment Results

| Service | Status | Notes |
|---------|--------|-------|
| {service} | {Pushed/Skipped/Failed} | {Platform will auto-deploy / error details} |

**Next steps**: Check your deployment dashboards for each service.
```

## Rules

- NEVER auto-push. Always ask for user confirmation. This is the #1 rule.
- NEVER run `git push {remote} main` — this pushes the full monorepo.
  ALWAYS use `git subtree push --prefix=FOLDER remote main`.
- If the working tree isn't clean, refuse to deploy.
- If not on main branch, refuse to deploy.
- If build fails, refuse to deploy (but services without build steps can still deploy).
- Report each push individually — if one fails, the others can still proceed.
