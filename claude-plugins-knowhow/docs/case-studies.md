# ケーススタディ

> 7 つの公式プラグインを掘り下げる。これらは `concepts.md`、`components.md`、`patterns.md` で抽出されたパターンの元となる経験的観察である。パターンが抽象的に感じられたら、ここに立ち返ること。

**TODO**:
- `plugin-dev`、`skill-creator`、`commit-commands`、`security-guidance` のケーススタディを追加する。これらは他で頻繁に参照されているが、ここにはまだ専用セクションがない。
- 各ケーススタディは、トレーサビリティのために `concepts.md` / `components.md` / `patterns.md` を指す「demonstrated patterns」リストで終えること。

## feature-dev

**役割**: 構造化された 7 フェーズのフィーチャー開発。

### レイアウト

```
feature-dev/
├── .claude-plugin/plugin.json
├── commands/feature-dev.md
├── agents/
│   ├── code-explorer.md        # Sonnet, yellow
│   ├── code-architect.md       # Sonnet, green
│   └── code-reviewer.md        # Sonnet, red
├── README.md
└── LICENSE
```

### 7 フェーズのワークフロー

| フェーズ | 目標 | アクション |
|---|---|---|
| 1. Discovery | 何を作るかを理解する | 要件を確認し、不明点をユーザーに問う。 |
| 2. Codebase Exploration | 既存コードを理解する | 2〜3 個の `code-explorer` エージェントを並列にディスパッチし、その後重要なファイルを自分で読む。 |
| 3. Clarifying Questions | 曖昧さを解消する | **CRITICAL: DO NOT SKIP.** エッジケース、後方互換性などについて質問する。 |
| 4. Architecture Design | 設計をドラフトする | 2〜3 個の `code-architect` エージェントを並列にディスパッチし、比較と推奨を添えて提示する。 |
| 5. Implementation | 構築する | **DO NOT START WITHOUT APPROVAL.** `TodoWrite` で進捗を追跡する。 |
| 6. Quality Review | レビュー | 3 個の `code-reviewer` エージェントを並列にディスパッチし、確信度 80 以上のみを報告する。 |
| 7. Summary | まとめ | 変更ファイル、決定事項、次のステップを列挙する。 |

### ユーザー承認ポイント

- フェーズ 3: 明確化質問への回答。
- フェーズ 4: 設計の選択。
- フェーズ 6: レビュー検出への対応(今すぐ修正 / 後で修正 / そのままリリース)。

### エージェント設計の注記

- **code-explorer**: ツールは `Glob, Grep, LS, Read, NotebookRead, WebFetch, TodoWrite, WebSearch, KillShell, BashOutput` に制限。出力には 5〜10 個の「必読」ファイルのリストを含めなければならない。
- **code-architect**: 曖昧な保留をせず、単一のアプローチにコミットする。ファイルパス、関数名、具体的なステップを含むブループリントを出力する。
- **code-reviewer**: 確信度 80 以上のみを報告し、Critical (90〜100) と Important (80〜89) に分ける。指摘がない場合は「meets standards」と簡潔に報告する。

## code-review

**役割**: PR コードレビューの自動化。

### パイプライン

```
1. Haiku: eligibility check (closed / draft / automated PR / already reviewed → abort)
2. Haiku: list CLAUDE.md file paths
3. Haiku: fetch PR summary
4. Sonnet × 5: parallel code review
   #1 CLAUDE.md compliance
   #2 Shallow bug scan of changed lines
   #3 Bugs inferred from git blame / history
   #4 Cross-reference with past PR comments
   #5 Consistency with in-file comments
5. Haiku × N: confidence score (0–100) per finding
6. Filter: drop anything below 80
7. Haiku: re-run eligibility check
8. gh pr comment: post result
```

### `gh` CLI の使用

GitHub 操作は web fetch ではなく `gh` を経由する:

```yaml
allowed-tools: Bash(gh issue view:*), Bash(gh search:*), Bash(gh pr comment:*),
               Bash(gh pr diff:*), Bash(gh pr view:*), Bash(gh pr list:*)
```

## pr-review-toolkit

**役割**: 選択的ディスパッチを伴う 6 つの専門レビューエージェント。

### 6 つのエージェント

| エージェント | モデル | 色 | 専門 |
|---|---|---|---|
| comment-analyzer | inherit | green | コメントの正確性、完全性、長期的な保守性。 |
| pr-test-analyzer | inherit | cyan | テストカバレッジの品質と欠落。 |
| silent-failure-hunter | inherit | yellow | サイレント障害と不適切なエラーハンドリング。 |
| type-design-analyzer | inherit | pink | 型設計と不変条件の表現力(1〜10 のスコアリング)。 |
| code-reviewer | opus | green | プロジェクトガイドラインへの準拠、バグ検出。 |
| code-simplifier | opus | — | コードの単純化と可読性。 |

### 選択的ディスパッチ

常に 6 つすべてを実行するのではなく、変更内容に基づいてプラグインが選ぶ:

- テストファイル変更 → `pr-test-analyzer`。
- コメント / ドキュメント追加 → `comment-analyzer`。
- エラーハンドリング変更 → `silent-failure-hunter`。
- 型の追加または変更 → `type-design-analyzer`。
- 常に → `code-reviewer`。
- レビュー通過後 → 仕上げパスとして `code-simplifier`。

### 逐次 vs. 並列

デフォルトは逐次: 1 つ実行し、結果を確認してから次へ進む。ステップごとのフィードバックが不要な一括実行のために `all parallel` オプションが存在する。

## hookify

**役割**: 会話履歴からのフックルールの動的生成。

### レイアウト

```
hookify/
├── commands/
│   ├── hookify.md            # Create a rule (explicit with args, or mine from conversation).
│   ├── list.md               # List rules.
│   ├── configure.md          # Enable / disable rules.
│   └── help.md
├── agents/
│   └── conversation-analyzer.md
├── skills/
│   └── writing-rules/SKILL.md
├── hooks/hooks.json          # Handlers for every event.
└── examples/                  # Sample rules.
```

### ルールファイルのフォーマット

```markdown
---
name: warn-dangerous-rm
enabled: true
event: bash
pattern: rm\s+-rf
action: warn
---

⚠️ **Dangerous rm command detected**
Please verify the path is correct.
```

高度な条件:

```markdown
---
name: warn-env-edits
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.env$
  - field: new_text
    operator: contains
    pattern: API_KEY
---
```

### 即時反映

ルールファイルは実行時にフックによって動的にロードされる。編集は即座に反映され、Claude Code の再起動は不要。

## claude-md-management

**役割**: `CLAUDE.md` ファイルの継続的改善。

### `revise-claude-md` コマンド

セッション後の学習キャプチャ:

1. セッションを振り返り、欠落していたコンテキストを特定する。
2. それが `CLAUDE.md` に属するか `.claude.local.md` に属するかを決める。
3. 簡潔な 1 行としてドラフトする。
4. 差分を提示し、ユーザー承認後に適用する。

ドラフトから除外: 冗長な説明、自明な情報、その場限りの修正。

### `claude-md-improver` スキル: A〜F のグレーディング

| 基準 | 点数 | チェック内容 |
|---|---|---|
| Commands / workflows | 20 | Build / test / deploy コマンドが存在するか。 |
| Architectural clarity | 20 | 読み手がコードベースの構造を把握できるか。 |
| Non-obvious patterns | 15 | 落とし穴や癖が文書化されているか。 |
| Conciseness | 15 | 冗長な説明や自明な情報がないか。 |
| Freshness | 15 | 現在のコードベースを反映しているか。 |
| Actionability | 15 | 指示をそのままコピーして実行できるか。 |

## ralph-loop

**役割**: Stop フックによって駆動される自己参照的な反復開発ループ。

### メカニズム

```
User: /ralph-loop "Fix linting errors" --max-iterations 10 --completion-promise "FIXED"

1. setup-ralph-loop.sh creates .claude/.ralph-loop.local.md
2. Claude executes the task.
3. Claude attempts to stop.
4. The Stop hook fires.
5. The hook reads .local.md and increments the iteration counter.
6. Max iterations not reached and promise not emitted → re-inject the prompt.
7. Claude "sees" its previous work through files.
8. Repeat.
9. When <promise>FIXED</promise> is output, or max iterations is reached, exit.
```

### 適しているケース

- 明確な成功基準を持つタスク。
- イテレーションと洗練の恩恵を受けるタスク。
- グリーンフィールドプロジェクト。

### 適さないケース

- 人間の判断や設計上の意思決定を要するタスク。
- 一回限りの操作。
- 成功基準が不明確なタスク。

## claude-code-setup

**役割**: 環境最適化の提案。

### カテゴリ

| カテゴリ | 適した用途 |
|---|---|
| Hooks | 自動フォーマット、lint、保護されたファイルの編集ブロック。 |
| Subagents | コードレビュー、セキュリティ監査、API ドキュメント。 |
| Skills | 頻出ワークフロー、テンプレート適用。 |
| Plugins | 関連スキルのバンドル、チームの標準化。 |
| MCP Servers | 外部サービス連携(DB、API、ブラウザ)。 |

### 推奨フレームワーク

コードベースのシグナル(package.json、フレームワーク、テスト構成など)を解析し、カテゴリごとにインパクトの高い推奨を 1〜2 件提示する。プラグインは何もインストールせず、提案のみを行う。
