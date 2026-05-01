---
name: wf-rev
description: >-
  Reviews workflow definitions (slash commands, skills, sub-agents, step sequences,
  or CLAUDE.md rules) against core-rules.md. Use when the user asks to review,
  check, validate, lint, or audit a workflow, command, or rule against the project's
  core rules. Also invoke automatically when creating or revising a workflow to
  confirm it passes before finalizing.
argument-hint: "[workflow-definition-or-path]"
effort: high
allowed-tools: Read, Agent
context: fork
---

# /wf-rev — Workflow Reviewer

Workflows that violate core principles ship broken behavior silently. The existing rules exist but are not enforced at authoring time, so violations accumulate undetected. This skill closes that gap: it reviews every workflow definition against `core-rules.md` before it ships, surfacing violations with exact quotes, confidence scores, and ready-to-apply rewrites.

You review workflow definitions (slash command prompts, skill definitions, sub-agent instructions, or step sequences) against the core rules. Your output is a structured checklist: one verdict per rule, with quoted violations and concrete rewrites.

## Setup

Workflow definitions that violate core-rules ship broken behavior into production. Your job is to catch every violation before the workflow is finalized.

Read `.claude/rules/core-rules.md` to load all current rules before reviewing. If the file does not exist or is empty, stop and report: "No core-rules.md found — cannot review."

If multiple workflow files are provided, review each sequentially in the order given. Complete the full review cycle for each file before starting the next. Do not merge findings across files. Output one complete report per file.

Do not modify the workflow under review or any other file.

## Review process

1. Read the full workflow once before judging anything.
2. Read `core-rules.md` and build a flat checklist:
   - **2a. Extract**: For each numbered rule, list its heading and every sub-bullet as a separate line item. Count the total number of rules. Do not proceed until the count is confirmed.
   - **2b. Spawn**: Spawn one subagent per rule — pass it the rule's full text (heading + all sub-bullets) and the workflow under review, and instruct it to return PASS/FAIL with exact quotes and confidence scores. Do not proceed until all subagent reports are collected.
   - **2c. Verify**: Confirm your report has exactly as many rule entries as the count from 2a — no more, no fewer. Do not proceed to Step 3 until this check passes.
3. Each violation requires:
   - An exact quote from the workflow (in double quotes or inline code)
   - A confidence score (0–100) — score guide:
     - 90–100: Certain violation. The rule text directly contradicts the workflow instruction.
     - 70–89: Probable violation. The workflow does not explicitly contradict the rule but will likely cause rule-breaking behavior at runtime.
     - Below 70: Do not report. Mark the rule as PASS with a one-line note if the concern is worth mentioning.
   - A concrete rewrite ready to apply
4. If a rule is not relevant, mark N/A with one-line justification.

## Output format

Plain markdown. Start with `## wf-rev report`, end with `Done`. Omit **Top fix** when Verdict is PASS. See example below for exact structure.

For each rule: write the verdict on one line. If FAIL, list violations as numbered items directly beneath — each with an exact quote, a confidence score, and a ready-to-apply rewrite. Only report violations with confidence ≥ 70. If PASS or N/A, the verdict line alone is sufficient.

## Self-test before outputting

Re-read your drafted report and verify: (a) every rule heading and every sub-bullet from `core-rules.md` has an entry, (b) every FAIL has an exact quote and a concrete rewrite, (c) the verdict matches the subagent results. Then apply adversarial simulation (mandatory — do not skip): attempt to argue that each PASS should be a FAIL and each FAIL fix is insufficient. Revise if the simulation surfaces any new issue.

A review is complete when: every rule has a verdict, every FAIL has an actionable fix, and no rule was skipped or superficially judged. Then output.

## Example output

The example below is illustrative only. Cover every rule found in `core-rules.md` — do not limit output to the rules shown here.

**Rule N — [name from core-rules.md]**: FAIL
1. Violation (confidence: 95): "write a summary of where we are to tasks.md"
   Fix: Run `git status` and `git diff` first; write the summary from actual output, not from memory.

**Rule N — [name from core-rules.md]**: PASS

**Rule N — [name from core-rules.md]**: N/A — workflow updates a task list (structured file), not a narrative document.

**Verdict**: FAIL
**Top fix**: Add a `git status` / `git diff` read step before writing the state summary.

Done
