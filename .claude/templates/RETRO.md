---
type: retro
sprint: {N}
date: {YYYY-MM-DD}
status: active
harness-version: "{version}"
goal-met: {true|false|partial}
workers-delivered: "{X/Y}"
tier: {Clean|Normal|Incident}
fixes-applied: []
fixes-retired: []
decisions: []
related: ["harness-health"]
tags: ["retro", "sprint-{N}"]
---
# Sprint {N} Retrospective

> Auditor | Date: {YYYY-MM-DD} | Goal: {from SPRINT-LOG}
> Tier: {Clean | Normal | Incident} — see AUDITOR-ROLE.md "Tiered Retro Format"

<!-- TIER GUIDE:
  Clean:    100% delivery, 0 conflicts, 0 incidents, 0 new fixes → ~50 lines
  Normal:   Minor issues (stale paths, template non-compliance) → ~100 lines
  Incident: Branch violation, build fail, conflict, data loss → 200+ lines
-->

## Contract Compliance
- **Goal achieved?** {Yes / No / Partial — explain}
- **Coordinator boundaries?** {Yes / No}
- **Merge order followed?** {Yes / No}

## Grades (variable dimensions only — skip STABLE metrics)

| Principle | Assessment | Final |
|-----------|-----------|-------|
| Efficiency | {assessment} | {A/B/C} |
| Accuracy | {assessment} | {A/B/C} |
| Token Efficiency | {assessment} | {A/B/C} |
| Depth | {assessment} | {A/B/C} |

<!-- Stable metrics (not graded unless regression detected):
  Productivity: A since S30. Merge conflicts: 0 since S30. Build failures: 0 since S30.
  Re-add to table ONLY if a regression occurs. -->

<!-- ============ CLEAN TIER: STOP HERE ============ -->
<!-- For Clean sprints: add 1-paragraph summary + carry-forwards below, then done. -->

## Summary
{1 paragraph: what happened, what was delivered, any notable observations}

## Carry-Forward Items

| Item | Priority | Destination |
|------|---------|------------|
| {item} | {High/Med/Low} | {file} |

<!-- ============ NORMAL TIER: ADD THESE ============ -->

## What Worked

| Pattern | Evidence |
|---------|---------|
| {pattern} | {evidence} |

## What Failed

| Failure | Root Cause | Fix |
|---------|-----------|-----|
| {failure} | {root cause} | {fix} |

## Fix Tracker Updates

| Fix | Change | Evidence |
|-----|--------|----------|
| {fix} | {status change} | {evidence} |

<!-- ============ INCIDENT TIER: ADD THESE ============ -->

## Incident Analysis
{Full root cause analysis, fix design, self-challenge narrative}

## Process Changes

| Change | Target file | Type |
|--------|------------|------|
| {change} | {file} | {type} |

## Metrics (non-stable only)

| Metric | Sprint {N-1} | Sprint {N} | Trend |
|--------|-------------|------------|-------|
| {metric} | {prev} | {current} | {trend} |
