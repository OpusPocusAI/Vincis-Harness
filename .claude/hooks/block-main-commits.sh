#!/bin/bash
# Block git commits to main during active sprints
# Self-correcting: tells the worker exactly how to fix it
# Bypass for Coordinator (Hybrid mode): prefix command with SPRINT_COORDINATOR=1
#
# NOTE: Uses pure bash (no jq) — jq is not available on this Windows system

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | grep -oP '"command"\s*:\s*"\K[^"]*' | head -1)

# If we couldn't parse the command, let it through
if [ -z "$COMMAND" ]; then
  exit 0
fi

# Coordinator bypass — Hybrid mode needs to commit to main while worktrees exist
if echo "$COMMAND" | grep -q "SPRINT_COORDINATOR=1"; then
  exit 0
fi

# Only check git commit commands
if echo "$COMMAND" | grep -qE "git (commit|add.*&&.*git commit)"; then
  BRANCH=$(git branch --show-current 2>/dev/null)
  if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
    # Check if a sprint is active (worktree dirs exist)
    if ls ../worktree-* 1>/dev/null 2>&1; then
      echo "BLOCKED: You are on 'main' but a sprint is active." >&2
      echo "Your worktree is likely at ../worktree-a, ../worktree-b, or ../worktree-c" >&2
      echo "Run: cd ../worktree-{your-letter} to switch to the correct directory." >&2
      echo "If you ARE the Coordinator (Hybrid mode), prefix: SPRINT_COORDINATOR=1 git commit ..." >&2
      echo "Your work is NOT lost — files are still in your working directory." >&2
      exit 2
    fi
  fi
fi

exit 0
