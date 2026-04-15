# plugin-smith 設計ドキュメント作業記録

> claude-plugins-knowhow と skill-smith を素材に、「プラグインを作る・改善するためのメタプラグイン」plugin-smith の設計ドキュメントを作成する作業のログ。

## 作業スコープ

- `claude-plugins-knowhow/` 直下に `README.md` と `docs/` を整備
- 既存6ファイルを素材として再構成（リファクタ）
- 段階的ユーザー確認付きで進行

## 素材

### このリポジトリ内
- `claude-plugins-knowhow.md`（1106行、20章）公式プラグイン群の設計パターン集
- `cc-best-practices-report.md` 調査レポート
- `checklist-prompt.md` プロンプト品質チェックリスト
- `checklist-skills.md` スキル品質チェックリスト
- `checklist-hooks.md` フック品質チェックリスト
- `checklist-claude-md.md` CLAUDE.md 品質チェックリスト

### 外部
- skill-smith: https://github.com/lovaizu/aiya-dev/tree/main/.claude/skills/skill-smith
  - 構造: SKILL.md + references/{create,improve,evaluate,profile}-workflow.md + checklist.md + patterns.md + writing-guide.md + scripts/{validate,profile_stats}.sh
  - モード駆動 (Create/Improve/Evaluate/Profile)、references 外出し、スクリプトによる決定論的 validate/profile

## 確定事項

### 1. プラグイン名
- 仮: `plugin-smith`（skill-smith を踏襲）

### 2. ディレクトリ構成

```
claude-plugins-knowhow/
├── README.md
├── progress.md           # このファイル（作業記録）
└── docs/
    ├── concepts.md        # 基本概念・設計原則
    ├── components.md      # commands/agents/skills/hooks 設計
    ├── patterns.md        # 品質・状態管理・セキュリティ・応用
    ├── case-studies.md    # 公式プラグイン7本の分析（出元トレース用）
    └── checklists.md      # 品質自己チェック7カテゴリ
```

### 3. README.md 3セクション構成

```
# plugin-smith

## Overview
## Usage
## Architecture
```

### 4. 各ドキュメントの記載順原則

共通: **全体向け → 利用者向け → 開発者向け** のセクション順。
ただし個別の見出し名はドキュメントごとに最適化する。

### 5. 各 docs ファイルの見出し構成

#### `docs/concepts.md`
- What is a Plugin
- Plugin Taxonomy
- Core Design Patterns
- Design Principles
- TODO

対応素材: knowhow §1, §2, §9, §18

#### `docs/components.md`
- Commands
- Agents
- Skills
- Hooks
- TODO

対応素材: knowhow §3, §4, §6, §7

#### `docs/patterns.md`
- Quality Control
- State Management
- Security
- Advanced Patterns
- TODO

対応素材: knowhow §5, §8, §10, §19

#### `docs/case-studies.md`
- feature-dev
- code-review
- pr-review-toolkit
- hookify
- claude-md-management
- ralph-loop
- claude-code-setup
- TODO

対応素材: knowhow §11-17（全7本を残す、出元トレース用途）

#### `docs/checklists.md`
- How to Use
- Prompt
- Skill
- Hook
- CLAUDE.md
- Command（新規）
- Agent（新規）
- Plugin (overall)（新規）

対応素材: 既存 checklist 4本 + knowhow §20 + 新規3カテゴリ

### 6. plugin-smith のモード構成（最終）

**2モードに集約**（Create / Improve）。Evaluate は Improve の `--report-only` フラグとして吸収。

| モード | 入力 | 目的 |
|---|---|---|
| **Create** | 自然言語の要求 | 新規プラグイン生成 |
| **Improve** | パス（+ 任意で問題記述） | 既存プラグインの改善 |

#### Create の挙動（提案駆動）
1. 意図を受け取り、即座に構成提案（インタビュー最小化）
2. concepts.md の3設計型から分類し、components.md のパターンで具体案を構築
3. 2–3案を並列提示（knowhow §4.4 の並列投入パターン流用）
4. ユーザー承認（Proceed / Adjust / Reject）
5. スキャフォールド生成 → 自己バリデーション

#### Improve の挙動
| 引数 | 動作 |
|---|---|
| パスのみ | 全体スキャン → 優先度順に改善提案 → 承認 → 適用 |
| パス + 問題記述 | 問題箇所を深掘り → 根本原因の仮説 → パッチ → 承認 → 適用 |
| `--report-only` 付き | ミューテーションせずスコアカード出力 |

#### 共通原則（提案駆動モデル）
- **提案ファースト**: ユーザー質問は曖昧点の最小限のみ
- **plugin-smith 側がスキルを持つ前提**: ユーザーから情報を引き出すのではなく、plugin-smith が見立てを提示
- **承認ポイントは絞る**: 重要な分岐にのみ設置
- **デフォルト dry-run**: 書き込みは承認後

### 7. 判断ポイントの決定記録

| 論点 | 決定 | 根拠 |
|---|---|---|
| 作業ディレクトリ | `claude-plugins-knowhow/` を拡張 | プラグインを作るための設計ドキュメントとして |
| README 配置 | リポジトリ（ディレクトリ）直下 | 入口の明確化 |
| docs ファイル数 | 5本 | 網羅性確認済み |
| case-studies の扱い | 全7本掲載 | 出元トレース用途 |
| モード数 | 2（Create / Improve） | 診断エンジン共通、UX 簡素化 |
| Evaluate の扱い | Improve の `--report-only` として吸収 | 同上 |
| Improve の dry-run | デフォルト ON | 安全側 |
| 問題記述付き Improve | 専用モードではなく引数で吸収 | モード増殖回避 |
| 中断・再開 | TODO（初版ステートレス） | 最小実装優先 |

## 既存ファイルの処遇（最終マッピング）

| 既存ファイル | 行き先 | 削除予定 |
|---|---|---|
| `claude-plugins-knowhow.md` §1, §2, §9, §18 | `docs/concepts.md` | 全章移設後に削除 |
| `claude-plugins-knowhow.md` §3, §4, §6, §7 | `docs/components.md` | 同上 |
| `claude-plugins-knowhow.md` §5, §8, §10, §19 | `docs/patterns.md` | 同上 |
| `claude-plugins-knowhow.md` §11-17 | `docs/case-studies.md` | 同上 |
| `claude-plugins-knowhow.md` §20 | `docs/checklists.md` に統合 | 同上 |
| `checklist-prompt.md` | `docs/checklists.md` > Prompt | 移設後に削除 |
| `checklist-skills.md` | `docs/checklists.md` > Skill | 同上 |
| `checklist-hooks.md` | `docs/checklists.md` > Hook | 同上 |
| `checklist-claude-md.md` | `docs/checklists.md` > CLAUDE.md | 同上 |
| `cc-best-practices-report.md` | `README.md` > Overview に吸収 | 吸収後に削除 |

## 未決 TODO

- [ ] Architecture 図（mermaid or テキスト）
- [ ] 中断・再開の状態管理設計
- [ ] `docs/checklists.md` の新規3カテゴリ（Command / Agent / Plugin 全体）の詳細化
- [ ] Improve の問題記述モード時の深掘りアルゴリズム
- [ ] スコアカード出力フォーマット
- [ ] 指摘者/評価者の分離を Improve にどう実装するか
- [ ] プラグイン名の最終確定（`plugin-smith` 以外の候補検討）
- [ ] `docs/checklists.md` 執筆時に knowhow §20 と既存 checklist 4本の重複を突き合わせて排除

## 整合性の懸念と対応

| 懸念 | 対応方針 |
|---|---|
| `checklists.md` で knowhow §20 と既存4本が重複する可能性 | 新規3カテゴリ作成時に突き合わせて排除 |
| README.Usage の提案駆動方針と case-studies の feature-dev インタビュー型が矛盾 | case-studies は歴史的観測として残す。plugin-smith 自体の方針は README で別途記述 |
| プラグイン名 `plugin-smith` が仮確定 | README 冒頭と全 docs で統一。確定変更時は grep で一括置換 |

## 進行状況

- [x] ステップ 1-a: ディレクトリ構成の確定
- [x] ステップ 1-b: 各ドキュメントの見出しフォーマット確定
- [x] ステップ 1-c: README 各セクションの内容方針確定（Usage 提案駆動モデル）
- [x] ステップ 2: 既存インプットのマッピング + 整合性レビュー
- [x] ステップ 3: 実ファイル作成（リファクタ実行）
- [x] ステップ 3-後: 既存6ファイルの削除

## 再開時の読み順
1. `.claude/rules/*.md` を全件読む（特に interaction.md の Default to English）
2. 本ファイルの「確定事項」と「未決 TODO」を確認
3. 下記「次のアクション」から続行

## 作業環境
- ブランチ: `claude/busy-mccarthy-JFl8r`
- PR: https://github.com/kiyohome/outputs/pull/2
- 作業ディレクトリ: `claude-plugins-knowhow/`

## 次のアクション
- Step 3 の進め方が未決。ユーザーに以下を確認してから着手:
  - (A) 各 docs ファイルを1つ書き終えるごとに提示 → 承認 → 次へ
  - (B) 全ファイル作成 → 一括確認
  - (C) まず `docs/concepts.md` だけ書いて感触を掴む
- 決まったら `docs/concepts.md` から着手（knowhow.md §1, §2, §9, §18 を素材）
