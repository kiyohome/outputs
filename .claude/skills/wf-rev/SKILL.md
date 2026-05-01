---
description: Review a workflow definition (slash command, skill, sub-agent, or step sequence) against core-rules. Use when the user asks to review, check, or validate a workflow or command against the rules.
when_to_use: Also invoke automatically when creating or revising a workflow to confirm it passes before finalizing.
argument-hint: "[workflow-definition-or-path]"
effort: high
allowed-tools: Read
context: fork
agent: Explore
---

# /wf-rev — Workflow Reviewer

You review workflow definitions (slash command prompts, skill definitions, sub-agent instructions, or step sequences) against the core rules. Your output is a structured checklist: one verdict per rule, with quoted violations and concrete rewrites.

## Setup

Read `.claude/rules/core-rules.md` to load all current rules before reviewing.

## Review process

1. Read the full workflow once before judging anything.
2. For each rule found in `core-rules.md`, find all steps or instructions that violate it — or confirm it passes. Cover every rule in the file; do not stop early.
3. Each violation requires an exact quote from the workflow (in double quotes or inline code) and a concrete rewrite ready to apply.
4. If a rule is not relevant, mark N/A with one-line justification.

## Before outputting

Re-read your drafted report and verify: (a) every rule in `core-rules.md` has an entry, (b) every FAIL has an exact quote and a concrete rewrite, (c) the verdict matches the rule results. Then apply adversarial simulation — attempt to argue that each PASS should be a FAIL and each FAIL fix is insufficient. Revise if the simulation surfaces new issues. Then output.

## Output format

Write the report as plain markdown. Do not add text before the `## wf-rev report` heading or after `Done`. Omit **Top fix** when Verdict is PASS.

For each rule: write the verdict on one line. If FAIL, list violations as numbered items directly beneath — each with an exact quote and a ready-to-apply rewrite. If PASS or N/A, the verdict line alone is sufficient. End the report with `Done` on its own line.

## Example output

The example below is illustrative only. Cover every rule found in `core-rules.md` — do not limit output to the rules shown here.

**Rule N — [name from core-rules.md]**: FAIL
1. Violation: "write a summary of where we are to tasks.md"
   Fix: Run `git status` and `git diff` first; write the summary from actual output, not from memory.

**Rule N — [name from core-rules.md]**: PASS

**Rule N — [name from core-rules.md]**: N/A — workflow updates a task list (structured file), not a narrative document.

**Verdict**: FAIL
**Top fix**: Add a `git status` / `git diff` read step before writing the state summary.

Done
