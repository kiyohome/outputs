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
- File naming: this file is `steering.md`; slash command definitions go under `.claude/skills/`.
- Scope agreement upfront (before autonomous execution) belongs in the `/go` workflow, not core rules.

## Current phase

PR #10 open — core rules complete, command creation not yet started.

Core rules grew from 4 to 8 rules during rule refinement:
- Rules 1–5: original (Fact-first, Purpose-driven, Concise-first, Story-driven, User-frame)
- Rule 6: Expert-first (design gate: consult expert before committing to approach)
- Rule 7: Ship-ready (delivery gate: self-test → external review → iterate)
- Rule 8: Staged execution (validate one unit before batch; enumerate before advancing)

PR #10 is complete when all five commands are created and wf-rev approved.

## Completed

- [x] Collect pain points
- [x] Draft core rules → `.claude/rules/core-rules.md`
- [x] Archive existing `.claude/rules/` files → `cc-rules-redesign/rules-backup/`
- [x] Create `wf-rev` skill → `.claude/skills/wf-rev/`
- [x] Extend core rules to cover all identified pain points (8 rules total)

## Next tasks (in order)

1. [ ] User reviews PR #10 and provides feedback
2. [ ] Address PR feedback
3. [ ] Create `/hi` workflow → wf-rev → address findings → user review → address feedback
4. [ ] Create `/go` workflow → wf-rev → address findings → user review → address feedback
5. [ ] Create `/ty` workflow → wf-rev → address findings → user review → address feedback
6. [ ] Create `/gm` workflow → wf-rev → address findings → user review → address feedback
7. [ ] Create `/bb` workflow → wf-rev → address findings → user review → address feedback

## Session context

- Branch: `cc-rules-redesign`
- Worktree: `/Users/kiyo/work/lovaizu/outputs/.claude/worktrees/rules/`
- aiya commands: /hi, /go, /ty, /gm, /bb (defined in `agents-in-your-area/docs/aiya-jam.md`)
