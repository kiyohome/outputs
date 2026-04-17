# smith Design Progress Log

> Decision log and resumption guide for designing smith — a craftsperson (職人) tool that evaluates and improves Claude Code setups.

## Original intent

First message (verbatim, Japanese):

> plugin-smith
> aiya-jam
> の順に作成を進めたい。
> すべてaiyaのモノレポで開発、ただしこの2つはモノレポのパッケージ開発でも使いながら改善するので、モノレポの.claudeに配置します。
> イメージできますか？
> smith作って、smith使ってjamを作る

### Pivots

- **jam removed from smith's scope; Create mode dropped.**
  > jamはsmith無くても作れる気がしてきました。そもそもスクリプトベースなので。
  > smithで予定していたノウハウをチェックできればよい？... cc機能活用のコンサル？みたいになればよい？評価して改善提案、改善する、みたいなイメージ。

- **"コンサル" → "職人":** Apply を自分でやるのでコンサルではなく craft 職人が正しい。

## Identity (fixed)

- smith = **craftsperson (職人)** for Claude Code setups — applies changes itself, not an advisor
- Three-phase loop: **Evaluate → Propose → Apply** (one pipeline)
- Two layers: **Feature** (entry, user-visible capability) → **Component** (inspection unit: Prompt / Command / Agent / Skill / Hook / CLAUDE.md / Plugin)
- Scope: inside `.claude/` of aiya monorepo (plugins AND project-level)
- Out of scope: MCP / statusline / output-style
- Dogfooded on the aiya monorepo itself

## Current phase

γ (knowhow embedding) — 4 sub-decisions proposed, final expert review pending.

## Completed

### Flow (β, 10 steps)

1. 対象を決める (specified or hearing, max 2 rounds)
2. 構成ファイルを洗い出す
3. 点検 (whole + per-file; OK / NG / 対象外 + comment)
4. 改善案 (NG only; proposal + rationale + expected effect)
5. 期待効果でランク (expected effect only)
6. 採用を決めてもらう (all / subset / reject-all)
7. プレビュー (diff + final confirm)
8. 適用 (dependency order, pre-image check, halt-on-failure, no auto-rollback)
9. 再点検 (touched files; reconcile predicted vs actual; loop to 4, max 3)
10. 記録 (`.claude/.smith.local.md`)

### Implementation form (α)

Hybrid plugin (Archetype C) at `agents-in-your-area/.claude/plugins/smith/`.

| Part | Model | Role |
|---|---|---|
| `/smith` command | inherit | Orchestrator (10-step scripted prompt) |
| 3 inspector agents | Opus | conventions / patterns / architecture (parallel) |
| smith-knowhow skill | — | SKILL.md + references/ per component type |
| `scripts/smith-autocheck.sh` | — | `[auto]` pre-pass |
| `scripts/smith-evaluate.sh` | — | merge + confidence + threshold 80 + rank + reconcile (replaces evaluator agent) |
| `scripts/smith-state.sh` | — | `.smith.local.md` front-matter I/O |

### Key design choices

- **Inspector = Opus**: smith's output is production-affecting (writes files in aiya's `.claude/`); precedent = pr-review-toolkit's code-reviewer.
- **Inspector inline drafts improvement + patch content**: same-material collapse; `/smith` becomes pure orchestrator → justifies `inherit`.
- **3 lenses in parallel**: conventions + patterns + architecture. Convergence across lenses → confidence signal.
- **Scoring / rank / reconcile scripted**: deterministic after numeric expected-effect and tag-based merge; evaluator agent eliminated.
- **Confidence threshold 80**: drops noise before ranking (precedent: code-review, feature-dev).
- **OK gets no improvement proposals; NG only**.
- **Priority = expected effect alone** (severity internalized, effort ignored).
- **No auto-rollback**: halt-on-failure, user reverts via git.
- **3-iteration cap** on verify loop.

## Open in γ (pending final confirmation)

1. `SKILL.md` holds: role / taxonomy / common false-positive list / index / load heuristic.
2. `references/` holds: per-component checklists (prompt / command / agent / skill / hook / claude-md / plugin) + relevant patterns excerpts.
3. Common false-positive list lives in `SKILL.md` (inspectors get it via skill, not `/smith`).
4. `[auto]` pre-pass scope = only items tagged `[auto]` in checklists.md (kebab-case names, front-matter required fields, forbidden absolute paths, `${CLAUDE_PLUGIN_ROOT}` usage, line-count limits).

## Next tasks (priority order)

1. Close γ (confirm the 4 sub-decisions above).
2. Final expert review of the integrated design (α + β + γ).
3. Implement smith at `agents-in-your-area/.claude/plugins/smith/`.
4. Dogfood smith against aiya's own `.claude/` and iterate.

## Session context

- Proposal-based progression: always recommend, don't interview (`.claude/rules/interaction.md`, `workflow.md`).
- `k` = approve; `進めて` = proceed autonomously for multiple steps.
- Desktop Claude Code; plain-language rationale required (the user does not memorize knowhow citations).
- Flat structure preferred: minimize nested bullets, sparing bold, tables only when comparing.
- Knowhow source: `claude-plugins-knowhow/docs/` (concepts / components / patterns / case-studies / checklists).
- outputs/ is the 叩き台 (scratch area); not maintained once implementation moves to aiya monorepo.

## Document layout

```
outputs/
├── .claude/rules/                 # Project rules
├── claude-plugins-knowhow/        # Knowhow source
│   ├── docs/{concepts,components,patterns,case-studies,checklists}.md
│   ├── README.md
│   └── progress.md                # <-- this file
└── agents-in-your-area/           # aiya monorepo
    └── .claude/plugins/smith/     # smith implementation target
```

## How to resume

1. Read `.claude/rules/*.md` at `outputs/.claude/rules/` — especially `interaction.md`, `workflow.md`, `language.md`, `design-process.md`.
2. Read this file — focus on Identity, Completed, Open in γ, Session context.
3. Continue from Next tasks.
