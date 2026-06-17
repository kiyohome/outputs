# Design-to-Code Steering

## Purpose

デザインと要件をインプットに公開先に合わせたかたちでコーディングする。

## Task List (workflow order)

- [x] 1. Decide and set up work rules (this file + guidelines structure)
- [x] 2. Set up coding guidelines
- [ ] 3. Receive design input, clarify publish target, and draft a plan ← **next**
- [ ] 4. Get plan approved by user
- [ ] 5. Implement
- [ ] 6. Expert review + guideline compliance check → fix all findings
- [ ] 7. Deliver

> Steps 3–7 repeat for each design.

## Requirements

- HTML / CSS / スクリプトはガイドラインを整備し、メンテナンス性と可読性を高める
- デザインは複数回インプットされることを前提に、繰り返しコーディングできる作業ディレクトリ構成を維持する

## Rules

### Git
- 変更したらコミット・プッシュする（ユーザーはPRで確認する）

### Work flow
- まとまった作業単位ごとに作業ディレクトリを作成し、`steering.md` を配置する
- `steering.md` には要件・タスクリスト・決定事項など引き継ぎに必要な最小限の内容を記載する
- `steering.md` は実態と常に整合するよう更新し、いつでも中断・再開できる状態を保つ
- 作業目的とタスクリストをユーザーと合意してから作業を進める

### Input
- デザインは `input/` ディレクトリに受け取った状態のままコミットする
- zip は展開後に削除する
- input の内容は変更・加工しない（加工が必要な場合は別ディレクトリにコピーする）

### Review & quality gate
- 成果物はエキスパートレビュー必須、全指摘対応が必須
- エキスパートは成果物の技術領域に合わせて選定する（例: HTML/CSS/アクセシビリティの専門家）
- レビュー観点: ベストプラクティスへの準拠、品質・保守性
- ガイドライン遵守チェックも必須
- チェック・レビューはバイアスを排除するためサブエージェントで実施する

## Directory Layout

```
design-to-code/
├── steering.md          ← this file
├── guidelines/          ← coding guidelines (HTML, CSS, JS)
│   └── input/           ← reference materials for guidelines
└── <project-slug>/      ← per-design working directory
    ├── steering.md      ← per-project steering
    ├── input/           ← design files as received (do not modify)
    └── (output files)
```

## Session Context

- Branch: `worktree-design-coding`
- PR: https://github.com/lovaizu/outputs/pull/13
- LP template reference: `design-to-code/guidelines/input/lp-template/`
- Tasks 1–2 complete. Resume from Task 3 (receive design input).

## How to resume (Task 3)

1. Read this file.
2. Ask the user to provide the design input (images, PSD, or site files).
3. Clarify the publish target (LP / HP / other) and any requirements.
4. Create a per-project directory: `design-to-code/<project-slug>/`
5. Place received files in `design-to-code/<project-slug>/input/` as-is, commit immediately.
6. Draft a plan (steering.md for the project) and get user approval before implementing.

## Decisions

| Date | Decision |
|------|----------|
| 2026-05-05 | Use `steering.md` (not `progress.md`) as the handoff document |
| 2026-05-05 | `input/` stores received files as-is; zip deleted after extraction |
| 2026-05-05 | All deliverables require sub-agent expert review + guideline compliance check before delivery |
| 2026-05-05 | Guidelines cover HTML / CSS / JS (common) + lp.md (LP-specific); reviewed by 5 expert sub-agents, all findings resolved |
| 2026-05-05 | Reference materials for guidelines live under `guidelines/input/`, not at project level |
