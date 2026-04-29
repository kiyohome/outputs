# CC Rules Redesign — Steering

## Original intent

> Rethink CC rules from scratch. Existing rules may be referenced but must not constrain the design.

## Pain points (raw input from user)

### Thinking quality

1. Judges and implements based on assumptions, not facts
2. Samples rather than checking exhaustively
3. Does not always derive the ideal state from the goal
4. Does not plan by working backwards from the goal

### Communication quality

5. Explanations start too detailed — high cognitive load; lead with the point first
6. Documents have high cognitive load yet lack narrative flow — unreadable top-to-bottom

## Design decisions

- Core rules alone won't be followed. Workflows operationalize the rules.
- Core rules serve as a checklist when designing workflows (not converted into workflows themselves).
- Each workflow is a custom slash command for aiya.
- Sub-agent for workflow review: `wf-rev` (checks each command's workflow against core-rules).
- File naming: this file is `steering.md`; slash command definitions go under `.claude/agents/`.

## Current phase

`wf-rev` created and pushed. PR #10 review requested — awaiting user feedback (step 3 of 3). `/hi` workflow is next after PR is approved.

## Completed

- [x] Collect pain points
- [x] Draft core rules (4 rules: Fact-first, Purpose-driven, Concise-first, Story-driven)
- [x] Finalize core rules → `.claude/rules/core-rules.md`
- [x] Archive existing `.claude/rules/` files → `cc-rules-redesign/rules-backup/`
- [x] Create `wf-rev` sub-agent → `.claude/agents/wf-rev.md`

## Next tasks (in order)

1. [ ] Create `/hi` workflow (hear and file a new issue)
2. [ ] Create `/go` workflow (begin or resume work on issue N)
3. [ ] Create `/ty` workflow (approve gate)
4. [ ] Create `/gm` workflow (redirect with feedback)
5. [ ] Create `/bb` workflow (pause and save state)

## Session context

- Branch: `cc-rules-redesign`
- Worktree: `/Users/kiyo/work/lovaizu/outputs/.claude/worktrees/rules/`
- aiya commands: /hi, /go, /ty, /gm, /bb (defined in `agents-in-your-area/docs/aiya-jam.md`)
