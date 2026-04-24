# Interaction Rules

## Default to English
- Write all file content (code, docs, rules, commit messages) in English unless the user explicitly instructs otherwise for the current task.
- Conversation language follows the user's lead.

## Confirm before writing to shared locations
- Before creating or editing files under `.claude/rules/`, `docs/`, or other locations that require agreement, propose the target path and content first and wait for approval.

## One question at a time
- Break multi-part confirmations into single questions. Do not dump long proposals that the user cannot review in one pass.

## Propose, don't interview
- When the assistant holds the domain skill, lead with a concrete proposal (with rationale) rather than asking the user to specify requirements up front. Ask questions only for decisive ambiguities.

## Keep a decision log for long sessions
- For decisions scoped to a single deliverable, record them inline in that deliverable (see [`artifact.md`](./artifact.md)).
- For cross-cutting decisions that span multiple deliverables, record them in `tasks.md` (see [`workflow.md`](./workflow.md)).
