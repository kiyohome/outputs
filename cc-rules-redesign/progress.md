# CC Rules Redesign

## Original intent

> CCのルールをゼロベースで考える。既存のルールは参考にするが引きづられない。

## Pain points (raw input from user)

### Thinking quality

1. 事実でなく推測で判断・実装する
2. サンプリングで済ませ全量を確認しない
3. 目的から常にあるべき姿を考えない
4. 目的から逆算して計画しない

### Communication quality

5. 説明が初めから詳細過ぎて認知負荷が高い、まずは簡潔にポイントを教えて欲しい
6. ドキュメントも認知負荷が高い割にストーリーになっていない、上から読んでも理解できない

## Design decisions

- Core rules alone won't be followed. Work procedures operationalize the rules.
- Core rules serve as a checklist when designing work procedures (not converted into procedures themselves).
- Each work procedure is a custom slash command for aiya.

## Current phase

Core rules finalized. Next: restructure rules directory, then create slash commands one by one.

## Completed

- [x] Collect pain points
- [x] Draft core rules (4 rules: Fact-first, Purpose-driven, Concise-first, Story-driven)
- [x] Finalize core rules → `cc-rules-redesign/core-rules.md`

## Next tasks (in order)

1. [ ] Move `cc-rules-redesign/core-rules.md` → `.claude/rules/core-rules.md`; delete existing `.claude/rules/` files
2. [ ] Create core-rules-check sub-agent (reusable checker for all command design)
3. [ ] Create `/hi` work procedure (hear and file a new issue)
4. [ ] Create `/go` work procedure (begin or resume work on issue N)
5. [ ] Create `/ty` work procedure (approve gate)
6. [ ] Create `/gm` work procedure (redirect with feedback)
7. [ ] Create `/bb` work procedure (pause and save state)

## Session context

- Branch: `cc-rules-redesign`
- Worktree: `/Users/kiyo/work/lovaizu/outputs/.claude/worktrees/rules/`
- aiya commands: /hi, /go, /ty, /gm, /bb (defined in agents-in-your-area/docs/aiya-jam.md)
