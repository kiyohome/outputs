# smith Design Progress Log

> Resumption log. Full design specification lives in [`smith-design.md`](./smith-design.md).

## Original intent

First message (Japanese, preserved verbatim to protect against goal drift):

> plugin-smith
> aiya-jam
> の順に作成を進めたい。
> すべてaiyaのモノレポで開発、ただしこの2つはモノレポのパッケージ開発でも使いながら改善するので、モノレポの.claudeに配置します。
> イメージできますか？
> smith作って、smith使ってjamを作る

### Pivots since then

- **jam removed from smith's scope; Create mode dropped.** jam is built separately by scripts — smith does not generate it.
- **"Consultant" reframed to "craftsperson".** smith applies changes itself, so "consultant" (advise-only) was the wrong metaphor.

## Current phase

**GO** — design complete. Proceed to implementation per `smith-design.md`.

## Completed milestones

- Identity fixed (craftsperson, Evaluate → Propose → Apply).
- 10-step flow agreed (plain language, reviewed with user).
- Architecture form decided (1 command + 3 inspector agents + skill + 3 scripts).
- Independent review completed (Good / MoreThan).
- Multi-lens parallel, confidence scoring with threshold 80, Opus inspectors, script-based evaluator all adopted.
- Knowhow embedding plan confirmed (SKILL.md + `references/` split).
- Final integrated review returned HOLD; all 3 blockers and 6 residual MoreThan resolved in `smith-design.md` Interfaces, Exception flows, Design rationale, and Dependency ordering sections.

## Next tasks (priority order)

1. Implement smith at `agents-in-your-area/.claude/plugins/smith/` per `smith-design.md`.
2. Dogfood smith against aiya's own `.claude/` and iterate.

## Session context

- Proposal-based progression: always recommend, don't interview.
- `k` means approve; `進めて` means proceed autonomously for multiple steps.
- Desktop Claude Code is in use; markdown renders correctly.
- Flat structure preferred: minimize nested bullets, sparing bold, tables only when comparing.
- Plain-language rationale required (the user does not memorize knowhow citations).
- Knowhow source: `claude-plugins-knowhow/docs/` (concepts / components / patterns / case-studies / checklists).
- `outputs/` is the scratch area (叩き台); implementation and maintenance move to the aiya monorepo later.

## Document layout

```
outputs/
├── .claude/rules/                # Project rules
├── claude-plugins-knowhow/
│   ├── docs/                     # Knowhow source
│   │   └── {concepts,components,patterns,case-studies,checklists}.md
│   ├── README.md
│   ├── smith-design.md           # Design specification
│   └── progress.md               # This file
└── agents-in-your-area/
    └── .claude/plugins/smith/    # Implementation target
```

## How to resume

1. Read `.claude/rules/*.md` — especially `interaction.md`, `workflow.md`, `language.md`.
2. Read this file — locate current phase and next tasks.
3. Read `smith-design.md` for the full specification.
4. Continue from Next tasks.
