# Claude Code 公式プラグイン ノウハウ集

> 2026年3月時点の `anthropics/claude-plugins-official` リポジトリの全プラグイン（LSP系を除く）を精読し、設計パターン・原則・仕組みを網羅的に整理したもの。

---

## 1. プラグイン一覧と構成

### 1.1 全プラグインのコンポーネント構成

| プラグイン | commands | agents | skills | hooks | 主な役割 |
|---|---|---|---|---|---|
| feature-dev | 1 | 3 | 0 | 0 | 7フェーズの構造化フィーチャー開発 |
| code-review | 1 | 0 | 0 | 0 | PRの自動コードレビュー |
| pr-review-toolkit | 1 | 6 | 0 | 0 | 6つの専門レビューエージェント |
| commit-commands | 3 | 0 | 0 | 0 | Git操作の自動化 |
| ralph-loop | 3 | 0 | 0 | 1 | 自己参照的な反復開発ループ |
| hookify | 4 | 1 | 1 | 1 | 動的フックルール生成 |
| security-guidance | 0 | 0 | 0 | 1 | セキュリティパターン検出 |
| code-simplifier | 0 | 1 | 0 | 0 | 自律的コード改善 |
| claude-code-setup | 0 | 0 | 1 | 0 | Claude Code環境の最適化提案 |
| claude-md-management | 1 | 0 | 1 | 0 | CLAUDE.mdの品質管理 |
| skill-creator | 0 | 0 | 1 | 0 | スキルの作成・評価・最適化 |
| plugin-dev | 1 | 3 | 7 | 0 | プラグイン開発ツールキット |
| explanatory-output-style | 0 | 0 | 0 | 1 | 教育的インサイトの出力スタイル |
| learning-output-style | 0 | 0 | 0 | 1 | 対話型学習の出力スタイル |
| playground | 0 | 0 | 1 | 0 | HTMLプレイグラウンド生成 |
| frontend-design | 0 | 0 | 1 | 0 | フロントエンドデザイン |
| agent-sdk-dev | 1 | 2 | 0 | 0 | Agent SDKアプリ開発 |

### 1.2 プラグインのディレクトリ構造（標準）

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # メタデータ（nameのみ必須）
├── commands/                 # スラッシュコマンド（.md）
├── agents/                   # サブエージェント定義（.md）
├── skills/                   # スキル（サブディレクトリ/SKILL.md）
│   └── skill-name/
│       ├── SKILL.md
│       ├── references/       # 詳細ドキュメント
│       ├── examples/         # 動作例
│       └── scripts/          # ユーティリティ
├── hooks/
│   └── hooks.json            # フック定義
├── hooks-handlers/           # フックスクリプト
├── .mcp.json                 # MCPサーバー定義
├── scripts/                  # 共有ユーティリティ
├── README.md
└── LICENSE
```

---

## 2. 設計パターン

### 2.1 三層分離パターン

プラグインの設計は **手順・知識・実行** の三層に分離される。

| 層 | 担当 | 格納場所 | 役割 |
|---|---|---|---|
| 手順 | コマンド | `commands/*.md` | 何をどの順でやるか。フェーズ定義、分岐、ユーザー確認 |
| 知識 | スキル | `skills/*/SKILL.md` | どうやるか。ドメイン知識をオンデマンドでロード |
| 実行 | エージェント | `agents/*.md` | 手を動かす。独立コンテキストで作業して結果を返す |

最も綺麗に実装されているのは **plugin-dev**：

```
create-plugin コマンド（手順：8フェーズのワークフロー）
  Phase 2 → Skillツールで plugin-structure をロード（知識）
  Phase 5 → Skillツールで hook-development をロード（知識）
           → agent-creator エージェントを起動（実行）
  Phase 6 → plugin-validator エージェントを起動（実行）
```

### 2.2 三つの設計型

#### パターンA: コマンド＋エージェント型（ワークフロー系）

- 代表: feature-dev、code-review、pr-review-toolkit
- コマンドが手順を持ち、エージェントがワーカー
- スキルは不使用
- ユーザーが明示的にコマンドで起動

#### パターンB: スキル単体型（知識提供系）

- 代表: claude-code-setup、frontend-design、playground
- コマンドもエージェントもなし
- CCが自動的にトリガーする知識ベース
- descriptionのマッチングで自動ロード

#### パターンC: ハイブリッド型（ツールキット系）

- 代表: plugin-dev、hookify、claude-md-management
- コマンド＋エージェント＋スキルを組み合わせ
- スキルはフェーズに必要な知識をオンデマンドロードするリファレンス

### 2.3 SKILL.md の三つの役割

| 役割 | 動作 | 例 |
|---|---|---|
| 自動トリガーの知識注入 | descriptionマッチで自動ロード | frontend-design、playground |
| オンデマンドのリファレンス | コマンド/エージェントがSkillツールで明示的にロード | plugin-devの7スキル |
| 長大な手順書 | SKILL.md自体がワークフロー全体を定義 | skill-creator（例外的） |

### 2.4 Progressive Disclosure（段階的開示）

スキルの三層ローディングシステム：

| 層 | ロードタイミング | サイズ目安 |
|---|---|---|
| メタデータ（name + description） | 常にコンテキスト内 | 〜100語 |
| SKILL.md 本文 | スキルトリガー時 | 1,500〜2,000語（最大5,000語） |
| references/ examples/ scripts/ | 必要時にCCが判断してロード | 無制限 |

**コンテキスト肥大化への構造的回答**。feature-devは1コマンドに全部書くからコンテキストが膨張するが、plugin-devはスキルに分離しているから各フェーズでは必要な知識だけがロードされる。

---

## 3. コマンド設計パターン

### 3.1 コマンドはCCへの指示書

コマンドは **人間向けの説明ではなく、CCへの指示** として書く。

```markdown
<!-- ✅ 正しい（CCへの指示） -->
Review this code for security vulnerabilities including:
- SQL injection
- XSS attacks

<!-- ❌ 間違い（人間への説明） -->
This command will review your code for security issues.
```

### 3.2 allowed-tools による権限絞り込み

コマンドのフロントマターで使用可能なツールを制限：

```yaml
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
---
```

CCが「ついでにファイルも直しておきます」のような逸脱をそもそもできなくする。commit-commandsがgit操作だけに、code-reviewがgh CLI操作だけに絞っている。

### 3.3 「1メッセージ完結」パターン

```markdown
You have the capability to call multiple tools in a single response. 
You MUST do all of the above in a single message. 
Do not use any other tools or do anything else. 
Do not send any other text or messages besides these tool calls.
```

commit-commandsの /commit と /commit-push-pr で使用。CCは親切に説明を足しがちなので、「ツールコール以外のテキストを出すな」と明示的に封じて確実に1ターンで完了させる。

### 3.4 `!`command`` によるインライン実行

コマンドのマークダウン内でバッククォート付きで書くと、コマンド実行時に結果がプロンプトに埋め込まれる：

```markdown
## Context
- Current git status: !`git status`
- Current git diff: !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`
```

commit-commandsが使用。動的コンテキスト構築の仕組み。

### 3.5 引数展開

```markdown
---
argument-hint: [pr-number] [priority] [assignee]
---

Review PR #$1 with priority $2. Assign to $3.
```

- `$ARGUMENTS` — 全引数を1文字列で
- `$1`, `$2`, `$3` — positionalな個別引数
- `@$1` — ファイル参照（CCがファイルを読む）
- `@${CLAUDE_PLUGIN_ROOT}/templates/report.md` — プラグイン内リソース参照

### 3.6 フェーズ制御パターン

feature-devとplugin-devで使用。コマンドの中に複数フェーズを定義し、各フェーズに：

- **Goal**: そのフェーズの目的
- **Actions**: 具体的な手順（サブエージェント投入含む）
- **ユーザー確認ポイント**: 明示的な承認待ち

```markdown
## Phase 3: Clarifying Questions
**Goal**: Fill in gaps and resolve all ambiguities
**CRITICAL**: This is one of the most important phases. DO NOT SKIP.

## Phase 5: Implementation
**DO NOT START WITHOUT USER APPROVAL**
```

「DON'T SKIP」「DO NOT START WITHOUT APPROVAL」のような強い制約でCCのフェーズ飛ばしを防止。

---

## 4. エージェント設計パターン

### 4.1 エージェントのフロントマター

```markdown
---
name: code-reviewer
description: Use this agent when... <example>...</example>
model: sonnet
color: red
tools: ["Read", "Grep", "Glob"]
---

You are an expert code reviewer...
```

| フィールド | 必須 | 説明 |
|---|---|---|
| name | Yes | kebab-case、3-50文字 |
| description | Yes | トリガー条件 + `<example>` ブロック2-4個 |
| model | Yes | inherit / sonnet / opus / haiku |
| color | Yes | blue / cyan / green / yellow / magenta / red |
| tools | No | 制限する場合のみ。省略で全ツールアクセス |

### 4.2 `<example>` ブロックによるトリガー定義

```markdown
description: Use this agent when... Examples:

<example>
Context: User has just created a PR with new functionality.
user: "I've created the PR. Can you check if the tests are thorough?"
assistant: "I'll use the pr-test-analyzer agent to review the test coverage."
<commentary>
Since Daisy is asking about test thoroughness in a PR, use the Task tool to launch the agent.
</commentary>
</example>
```

- 「明示的な要求」と「プロアクティブな発動」の両方を含める
- assistantの応答で **具体的にどのエージェントを使うか** を示す
- commentaryで **なぜこのエージェントが適切か** を説明

### 4.3 モデル階層の使い分け

code-reviewの4層構成：

```
Haiku → 前処理（適格性チェック、ファイル一覧、サマリー）
Sonnet → 本レビュー（5体並列、判断が必要な箇所）
Haiku → スコアリング（各指摘の信頼度評価）
Haiku → 再適格性チェック（PR状態の再確認）
```

高コストなSonnetは「本当に判断が必要な箇所」だけに投入し、前後の定型処理はHaikuに任せるコスト最適化。

pr-review-toolkitでは：
- code-reviewer、code-simplifier → **Opus**（判断の深さが必要）
- 他4体 → **inherit**（標準的な分析）

### 4.4 並列投入パターン

feature-devでのサブエージェント投入：

| フェーズ | エージェント | 体数 | 観点の分け方 |
|---|---|---|---|
| Phase 2 | code-explorer | 2-3体 | 類似機能 / アーキテクチャ / UX |
| Phase 4 | code-architect | 2-3体 | 最小変更 / クリーン設計 / プラグマティック |
| Phase 6 | code-reviewer | 3体 | 簡潔さ・DRY / バグ・正しさ / 規約・抽象化 |

code-reviewでの5体並列：

| エージェント# | 観点 |
|---|---|
| #1 | CLAUDE.md準拠チェック |
| #2 | 浅いバグスキャン（変更箇所のみ） |
| #3 | git blame/履歴からのバグ検出 |
| #4 | 過去PRのコメントとの照合 |
| #5 | コード内コメントとの整合性 |

### 4.5 指摘者と評価者の分離

code-reviewの最も重要な設計原則。Sonnetが指摘を出し、**別のHaikuエージェント**がスコアリングする。同一エージェントが指摘と評価を兼ねると、自分の指摘を肯定するバイアスが入る。分離することでこのバイアスを構造的に排除。

### 4.6 色による識別

| プラグイン | 色の割り当て |
|---|---|
| feature-dev | explorer=yellow, architect=green, reviewer=red |
| pr-review-toolkit | 6体に別々の色 |
| hookify | analyzer=yellow |
| plugin-dev | creator=magenta, validator=yellow, reviewer=cyan |

tmux上で複数セッションを並行させる環境で「今どのエージェントが動いているか」が一目で分かる。

### 4.7 専門エージェントの設計例

**silent-failure-hunter**（pr-review-toolkit）:
- 「サイレントな失敗にゼロトレランス」というペルソナ
- 空catchブロック、ログのみで継続、デフォルト値への暗黙フォールバックを検出
- 各指摘にCRITICAL/HIGH/MEDIUMの重大度 + 隠される可能性のあるエラー型一覧

**type-design-analyzer**（pr-review-toolkit）:
- 型のカプセル化/不変条件の表現力/有用性/強制力を各10点で定量評価
- 「不正な状態を表現不可能にする」設計原則
- アンチパターン（貧血ドメインモデル、可変な内部状態の公開など）の明示的列挙

**code-simplifier**（Opusモデル）:
- 変更されたコードだけを対象に自動簡潔化
- 「簡潔さ」と「読みやすさ」のバランスを重視
- ネストした三項演算子を禁止し、switch/if-elseを推奨

---

## 5. 品質制御パターン

### 5.1 信頼度スコアによるフィルタリング

0〜100のスコアを定義し、閾値以上のみ報告：

| スコア | 意味 |
|---|---|
| 0 | 偽陽性。軽く精査すれば分かる。既存の問題。 |
| 25 | やや確信。本物かもしれないが検証できていない。スタイル的でCLAUDE.mdに明記なし。 |
| 50 | 中程度の確信。本物だが重箱の隅。PR全体に対して重要でない。 |
| 75 | 高い確信。ダブルチェック済み。実際に影響する。既存アプローチが不十分。 |
| 100 | 絶対確実。頻繁に発生する。エビデンスが直接裏付ける。 |

**閾値: 80以上のみ報告**。feature-devのcode-reviewer、code-reviewの両方で共通。

### 5.2 偽陽性の明示的列挙

code-reviewのコマンドに「これは偽陽性である」リストが含まれる：

- 既存の問題（変更前から存在）
- linter/typechecker/CIが拾うもの
- 厳密なスタイル上のnitpick
- CLAUDE.mdで言及されているがコード内でlint ignore済み
- 意図的な機能変更
- 変更していない行の問題
- 一般的なコード品質の問題（CLAUDE.mdで明示されていない限り）

「何を報告しないか」を明示することで精度を上げる。

### 5.3 二重適格性チェック

code-reviewはレビュー開始前と結果コメント直前に同じ適格性チェックを実行：

```
Phase 1: Haikuで適格性チェック（閉じてないか、ドラフトか、自動PRか、既にレビュー済みか）
Phase 2-5: レビュー実行
Phase 6: Haikuで再適格性チェック（レビュー中にPR状態が変わった可能性への防御）
Phase 7: gh pr comment でコメント投稿
```

### 5.4 レビュー結果の出力フォーマット

code-reviewが規定するフォーマット：

```markdown
### Code review

Found 3 issues:

1. <brief description> (CLAUDE.md says "<...>")
<link to file with full sha1 + line range>

2. <brief description> (bug due to <file and code snippet>)
<link to file with full sha1 + line range>
```

- 簡潔さ（brief）
- 絵文字なし
- コード・ファイル・URLへのリンクと引用必須
- full git sha必須（短縮sha不可、bashコマンド展開不可）
- 行範囲は前後1行のコンテキスト含む（L4-L7のように）

---

## 6. スキル設計パターン

### 6.1 フロントマターの書き方

```yaml
---
name: skill-name
description: This skill should be used when the user asks to "specific phrase 1", 
  "specific phrase 2", "specific phrase 3". Include exact phrases users would say.
version: 0.1.0
---
```

- **第三人称**: 「This skill should be used when...」（メタレイヤー向け）
- **具体的なトリガーフレーズ**: ユーザーが実際に言う言葉を引用符付きで列挙
- **押し気味に書く**: CCはスキルを「使わなさすぎる」傾向があるため、明示的に言わないケースまでカバー

### 6.2 本文の書き方

- **命令法/不定詞**: 「To create a hook, define...」（実行レイヤー向け）
- **第二人称は禁止**: 「You should...」は使わない
- **1,500〜2,000語に収める**: 超える場合はreferences/に分離
- **references/への明示的な参照**: CCが追加情報の存在を知れるように

```markdown
## Additional Resources

### Reference Files
- **`references/patterns.md`** — Common hook patterns (8+ proven patterns)
- **`references/advanced.md`** — Advanced use cases and techniques

### Utility Scripts
- **`scripts/validate-hook-schema.sh`** — Validate hooks.json structure
```

### 6.3 description最適化の手法（skill-creator）

1. 20個のテストクエリを作成（should-trigger 10個 + should-not-trigger 10個）
2. should-not-triggerは「近いけど違う」ケースを重視（明らかに無関係なものは無意味）
3. 60% train / 40% test に分割
4. 各クエリを3回実行して信頼性のあるトリガー率を取得
5. extended thinkingでdescription改善案を生成
6. train/testの両方で評価し、testスコアで選択（過学習回避）
7. 最大5イテレーション

テストクエリの品質基準：
- 具体的で詳細（ファイルパス、個人的文脈、会社名、URLを含む）
- 長さにバラツキ（短いものから長いものまで）
- カジュアルな表現、略語、タイポを含む
- 明らかに無関係なクエリは不可（テストにならない）

---

## 7. フック設計パターン

### 7.1 フックのイベント種類

| イベント | タイミング | 用途 |
|---|---|---|
| PreToolUse | ツール実行前 | 検証、修正、ブロック |
| PostToolUse | ツール実行後 | フィードバック、ログ |
| Stop | エージェント停止時 | 完了性チェック |
| SubagentStop | サブエージェント停止時 | タスク検証 |
| SessionStart | セッション開始時 | コンテキストロード |
| SessionEnd | セッション終了時 | クリーンアップ |
| UserPromptSubmit | ユーザー入力時 | コンテキスト追加、検証 |
| PreCompact | コンテキスト圧縮前 | 重要情報の保存 |
| Notification | 通知時 | 反応 |

### 7.2 フックの二つのタイプ

**prompt型**（推奨）:
```json
{
  "type": "prompt",
  "prompt": "Validate if this tool use is appropriate: $TOOL_INPUT",
  "timeout": 30
}
```
- LLMによる文脈認識型の判断
- 柔軟なロジック
- エッジケースに強い

**command型**:
```json
{
  "type": "command",
  "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh",
  "timeout": 60
}
```
- 決定論的チェック
- 高速
- 外部ツール統合

### 7.3 plugins の hooks.json フォーマット

```json
{
  "description": "Brief explanation (optional)",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ${CLAUDE_PLUGIN_ROOT}/hooks/security_reminder_hook.py"
          }
        ]
      }
    ]
  }
}
```

- `description` は任意
- `hooks` ラッパーが必須（settings.jsonとは異なる）
- `matcher` はツール名のパターン（`*` で全ツール、`|` でOR、正規表現対応）
- 複数フックは並列実行（順序非保証）

### 7.4 `${CLAUDE_PLUGIN_ROOT}` の使用

プラグイン内のパス参照は必ずこの変数を使う：

```json
"command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
```

- インストール場所に依存しないポータビリティ
- ハードコードされた絶対パスは禁止
- フックスクリプト内でも環境変数として利用可能

### 7.5 SessionStart フックによるコンテキスト注入

explanatory-output-style の仕組み：

```bash
#!/usr/bin/env bash
cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "You are in 'explanatory' output style mode..."
  }
}
EOF
exit 0
```

セッション開始時にCCのシステムプロンプトに情報を追加。プラグインのコードを変えずにCCの振る舞いを変更できる。

### 7.6 Stop フックによるループ制御（ralph-loop）

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/stop-hook.sh"
          }
        ]
      }
    ]
  }
}
```

CCが停止しようとすると:
1. stop-hook.sh が `.claude/ralph-loop.local.md` を読む
2. iteration数をインクリメント
3. max_iterationsに達していなければ、同じプロンプトを再投入
4. CCは前回の作業結果をファイルやgit履歴として見る
5. `<promise>TASK COMPLETE</promise>` が出力されたときだけ脱出

### 7.7 PreToolUse フックの二層設計

| プラグイン | 方式 | 特性 |
|---|---|---|
| security-guidance | Pythonスクリプトで固定9パターンチェック | 静的、決定論的 |
| hookify | Pythonスクリプトで `.local.md` ルールを動的読み込み | 動的、拡張可能 |

両方PreToolUseだが、固定パターンと動的ルールの棲み分け。

---

## 8. 状態管理パターン

### 8.1 `.local.md` ファイルによる状態管理

YAML フロントマター + マークダウン本文の統一フォーマット：

```markdown
---
enabled: true
iteration: 3
max_iterations: 10
completion_promise: "All tests passing"
---

# Task Description

Fix all the linting errors in the project.
```

- `.claude/` ディレクトリに配置
- `.local.md` 拡張子 → gitignore対象
- フロントマター = 構造化データ（設定、状態）
- 本文 = 自由テキスト（プロンプト、説明）
- フックスクリプトがsedで読み書き

使用例：
- ralph-loop: ループ状態（iteration数、完了条件）
- hookify: ルール定義（パターン、アクション）
- plugin-settings: プラグイン設定（有効/無効、モード）

### 8.2 フロントマターの読み書き

```bash
# フロントマター抽出
FRONTMATTER=$(sed -n '/^---$/,/^---$/{ /^---$/d; p; }' "$STATE_FILE")

# フィールド読み取り
ENABLED=$(echo "$FRONTMATTER" | grep '^enabled:' | sed 's/enabled: *//' | sed 's/^"\(.*\)"$/\1/')

# 本文抽出（2番目の --- 以降）
BODY=$(awk '/^---$/{i++; next} i>=2' "$FILE")
```

### 8.3 TodoWrite による進捗追跡

feature-dev が全フェーズで使用。CC組み込みの機能で、コンテキストが長くなっても「今どこにいるか」のアンカーになる。

---

## 9. プロンプト設計の原則

### 9.1 重要フェーズの強調

```markdown
**CRITICAL**: This is one of the most important phases. DO NOT SKIP.
**DO NOT START WITHOUT USER APPROVAL**
```

CCがフェーズを飛ばす傾向への対策。メタレベルで「ここが重要だ」と書く。

### 9.2 「Whatever you think is best」への対応

```markdown
If the user says "whatever you think is best", 
provide your recommendation and get explicit confirmation.
```

feature-devのPhase 3で使用。ユーザーが判断を委ねた場合でも、推奨案を提示して明示的な承認を得る。

### 9.3 偽promise防止

ralph-loopのコマンドに：

```markdown
CRITICAL RULE: If a completion promise is set, you may ONLY output it 
when the statement is completely and unequivocally TRUE. 
Do not output false promises to escape the loop.
```

CCが「終わったことにしてループを抜ける」のを防止。

### 9.4 出力制御

commit-commands:
```markdown
Do not send any other text or messages besides these tool calls.
```

code-review の出力フォーマット:
```markdown
Keep your output brief. Avoid emojis. Link and cite relevant code.
```

### 9.5 スコープ制限

code-simplifier:
```markdown
Focus Scope: Only refine code that has been recently modified or 
touched in the current session, unless explicitly instructed otherwise.
```

code-review:
```markdown
Do not check build signal or attempt to build or typecheck the app. 
These will run separately.
```

---

## 10. 面白い仕組み

### 10.1 hookify の会話パターン分析

conversation-analyzerエージェントが過去の会話を遡り：
- 明示的な修正要求（「don't do X」「stop doing Y」）
- 不満の反応（「why did you do X?」「I didn't ask for that」）
- 修正や巻き戻し（ユーザーがCCの作業を修正）
- 繰り返し発生する問題

これらを抽出して、自動的にフックルールを生成。**開発中の失敗からルールが育っていく**仕組み。

### 10.2 ralph-loop の自己参照メカニズム

「自己参照的」の実態：
1. 同じプロンプトが繰り返し投入される
2. CCの作業結果はファイルとgit履歴に残る
3. 次のイテレーションでCCは前回の作業を「見る」
4. 出力のフィードバックではなく、ファイルシステムを介した間接的自己参照

「deterministically bad in an undeterministic world」— 毎回失敗するが、失敗が予測可能だからプロンプトチューニングで体系的に改善できる哲学。

### 10.3 skill-creator のブラインド比較

2つのスキルバージョンの A/B 比較で、評価エージェントにどちらがどちらか教えずに品質判断させる。人間のバイアスだけでなくCCのバイアスも排除。

comparator エージェント（ブラインド判定）→ analyzer エージェント（勝因分析）の二段構成。

### 10.4 code-review の二重適格性チェック

レビュー開始前と結果コメント投稿直前に同じ適格性チェックを実行。レビュー処理中にPRの状態が変わる可能性（クローズ、マージ等）への防御的設計。

### 10.5 learning-output-style のコード委譲判断

CCが「人間が書く価値のあるコード」を判断し、ユーザーにコードを書くよう促す：

対象:
- ビジネスロジック（複数の妥当なアプローチがある場合）
- エラーハンドリング戦略
- アルゴリズム選択
- データ構造決定

対象外:
- ボイラープレート
- 明白な実装
- 設定コード
- 単純なCRUD

5-10行の重要なコードだけをユーザーに委ねる。

### 10.6 commit-commands の clean_gone

git worktreeベースの並列開発で溜まるgoneブランチを一括クリーンアップ：

```bash
git branch -v | grep '\[gone\]' | sed 's/^[+* ]//' | awk '{print $1}' | while read branch; do
  # worktree が紐づいている場合は先にworktreeを削除
  worktree=$(git worktree list | grep "\\[$branch\\]" | awk '{print $1}')
  if [ ! -z "$worktree" ] && [ "$worktree" != "$(git rev-parse --show-toplevel)" ]; then
    git worktree remove --force "$worktree"
  fi
  git branch -D "$branch"
done
```

`+` プレフィックス（worktree付きブランチ）も処理する点がポイント。

---

## 11. feature-dev の詳細

### 11.1 構成

```
feature-dev/
├── .claude-plugin/plugin.json
├── commands/feature-dev.md     # 7フェーズのワークフロー
├── agents/
│   ├── code-explorer.md        # Sonnet, yellow
│   ├── code-architect.md       # Sonnet, green
│   └── code-reviewer.md        # Sonnet, red
├── README.md
└── LICENSE
```

### 11.2 7フェーズのワークフロー

| Phase | Goal | アクション |
|---|---|---|
| 1. Discovery | 何を作るか理解 | 要件確認、不明点はユーザーに質問 |
| 2. Codebase Exploration | 既存コードの理解 | code-explorer 2-3体並列 → 重要ファイルを本体が読む |
| 3. Clarifying Questions | 曖昧さの解消 | **CRITICAL: DO NOT SKIP** エッジケース・互換性等を質問 |
| 4. Architecture Design | 設計案の策定 | code-architect 2-3体並列 → 比較・推奨付きで提示 |
| 5. Implementation | 実装 | **DO NOT START WITHOUT APPROVAL** TodoWriteで進捗追跡 |
| 6. Quality Review | 品質レビュー | code-reviewer 3体並列 → 信頼度80+のみ報告 |
| 7. Summary | 成果まとめ | 変更ファイル・決定事項・次のステップ |

### 11.3 ユーザー承認ポイント

- Phase 3: 質問への回答待ち
- Phase 4: 設計案の選択
- Phase 6: レビュー結果への対応（今直す / 後で直す / このまま行く）

### 11.4 エージェントの設計

**code-explorer**: ツール制限あり（Glob, Grep, LS, Read, NotebookRead, WebFetch, TodoWrite, WebSearch, KillShell, BashOutput）。出力に「絶対に読むべきファイル5-10個のリスト」を含める指示。

**code-architect**: 1つのアプローチを選んでコミットする（「決断力のある」設計）。ファイルパス・関数名・具体的なステップまで含むブループリントを出力。

**code-reviewer**: 信頼度80以上のみ報告。Critical（90-100）とImportant（80-89）に分類。問題がなければ「基準を満たしています」と簡潔に報告。

---

## 12. code-review の詳細

### 12.1 パイプライン

```
1. Haiku: 適格性チェック（closed/draft/自動PR/レビュー済み → 中止）
2. Haiku: CLAUDE.mdファイルのパス一覧取得
3. Haiku: PRのサマリー取得
4. Sonnet × 5: 並列コードレビュー
   #1 CLAUDE.md準拠
   #2 変更箇所の浅いバグスキャン
   #3 git blame/履歴からのバグ検出
   #4 過去PRコメントとの照合
   #5 コード内コメントとの整合性
5. Haiku × N: 各指摘に信頼度スコア付与（0-100）
6. フィルタリング: 80未満を除外
7. Haiku: 再適格性チェック
8. gh pr comment: 結果投稿
```

### 12.2 gh CLI の使用

web fetchではなくgh CLIでGitHub操作：

```yaml
allowed-tools: Bash(gh issue view:*), Bash(gh search:*), Bash(gh pr comment:*), 
               Bash(gh pr diff:*), Bash(gh pr view:*), Bash(gh pr list:*)
```

---

## 13. pr-review-toolkit の詳細

### 13.1 6つの専門エージェント

| エージェント | モデル | 色 | 専門 |
|---|---|---|---|
| comment-analyzer | inherit | green | コメントの正確性・完全性・長期保守性 |
| pr-test-analyzer | inherit | cyan | テストカバレッジの質・ギャップ |
| silent-failure-hunter | inherit | yellow | サイレントな失敗・不適切なエラーハンドリング |
| type-design-analyzer | inherit | pink | 型設計・不変条件の表現力（1-10定量評価） |
| code-reviewer | opus | green | プロジェクトガイドライン準拠・バグ検出 |
| code-simplifier | opus | (なし) | コード簡潔化・可読性向上 |

### 13.2 選択的投入

全部を常に走らせるのではなく、変更内容に応じて選択：

- テストファイル変更 → pr-test-analyzer
- コメント/ドキュメント追加 → comment-analyzer
- エラーハンドリング変更 → silent-failure-hunter
- 型の追加/変更 → type-design-analyzer
- 常に → code-reviewer
- レビュー通過後 → code-simplifier（仕上げ）

### 13.3 逐次 vs 並列

デフォルトは逐次（1つずつ結果を見てから次へ）。`all parallel` オプションで並列実行。

---

## 14. hookify の詳細

### 14.1 構成

```
hookify/
├── commands/
│   ├── hookify.md          # ルール作成（引数ありで明示的指定、なしで会話分析）
│   ├── list.md             # ルール一覧表示
│   ├── configure.md        # ルールの有効/無効切り替え
│   └── help.md             # ヘルプ
├── agents/
│   └── conversation-analyzer.md  # 会話パターン分析
├── skills/
│   └── writing-rules/SKILL.md    # ルール記述のリファレンス
├── hooks/hooks.json               # 全イベントのハンドラー
└── examples/                      # サンプルルール
```

### 14.2 ルールファイルのフォーマット

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

### 14.3 即時反映

ルールファイルはフックが動的に読み込むため、CCの再起動不要で即座に有効化。

---

## 15. claude-md-management の詳細

### 15.1 revise-claude-md コマンド

セッション後の学習蓄積：
1. セッションを振り返り、不足していたコンテキストを特定
2. CLAUDE.md / .claude.local.md の使い分けを判断
3. 簡潔な1行フォーマットでドラフト
4. diffを提示してユーザー承認後に適用

「冗長な説明」「明白な情報」「一度きりの修正」は除外。

### 15.2 claude-md-improver スキル

品質監査のA-Fグレーディング：

| 基準 | 配点 | チェック内容 |
|---|---|---|
| コマンド/ワークフロー | 20 | ビルド/テスト/デプロイのコマンドが存在するか |
| アーキテクチャの明確さ | 20 | コードベース構造を理解できるか |
| 非自明なパターン | 15 | gotchaやquirkが文書化されているか |
| 簡潔さ | 15 | 冗長な説明や明白な情報がないか |
| 鮮度 | 15 | 現在のコードベースを反映しているか |
| 実行可能性 | 15 | 指示がコピペで実行できるか |

---

## 16. ralph-loop の詳細

### 16.1 メカニズム

```
ユーザー: /ralph-loop "Fix linting errors" --max-iterations 10 --completion-promise "FIXED"

1. setup-ralph-loop.sh が .claude/.ralph-loop.local.md を作成
2. CCがタスクを実行
3. CCが停止しようとする
4. Stop フックが発動
5. .local.md を読み、iteration++
6. max_iterations未達 & promise未検出 → 同じプロンプトを再投入
7. CCは前回の作業をファイルで「見る」
8. 繰り返し
9. <promise>FIXED</promise> が出力される or max_iterations到達 → 脱出
```

### 16.2 向いているケース

- 明確な成功基準があるタスク
- 反復と改善が必要なタスク
- グリーンフィールドプロジェクト

### 16.3 向いていないケース

- 人間の判断やデザイン決定が必要なタスク
- ワンショットの操作
- 成功基準が不明確なタスク

---

## 17. claude-code-setup の詳細

### 17.1 推奨カテゴリ

| カテゴリ | 最適な用途 |
|---|---|
| Hooks | 自動フォーマット、lint、保護ファイルのブロック |
| Subagents | コードレビュー、セキュリティ監査、API文書化 |
| Skills | 頻繁に使うワークフロー、テンプレート適用 |
| Plugins | 関連スキルのバンドル、チーム標準化 |
| MCP Servers | 外部サービス統合（DB、API、ブラウザ） |

### 17.2 推奨の決定フレームワーク

コードベースのシグナル（package.json、フレームワーク、テスト構成等）を分析し、各カテゴリで1-2個の最もインパクトのある推奨を出す。

---

## 18. コスト最適化の原則

### 18.1 モデル選択の指針

| 用途 | モデル | 理由 |
|---|---|---|
| 前処理・後処理 | Haiku | 定型的な確認、フィルタリング |
| 分析・レビュー | Sonnet | 判断力と速度のバランス |
| 深い推論・品質 | Opus | 複雑なコード品質判断 |
| 呼び出し元と同じ | inherit | 特別な理由がなければデフォルト |

### 18.2 並列 vs 逐次

- 並列: 互いに依存しない分析タスク（レビュー観点の分離）
- 逐次: 前の結果が次の入力になるパイプライン（code-reviewの適格性→レビュー→スコアリング）
- 選択可能: pr-review-toolkitのようにユーザーに選ばせる

---

## 19. セキュリティの原則

### 19.1 security-guidance のパターン

PreToolUseフックで検出する9パターン:
- コマンドインジェクション
- XSS
- eval使用
- 危険なHTML
- pickle逆シリアル化
- os.system呼び出し
- その他3パターン

### 19.2 hookify のセキュリティルール

動的ルールで追加可能:
- `rm\s+-rf` → 危険な削除
- `chmod\s+777` → 権限の緩すぎる設定
- `sudo\s+` → 権限昇格
- `\.env$` → 環境ファイルの編集
- `eval\(` → eval使用

### 19.3 入力検証（フックスクリプト）

```bash
set -euo pipefail

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name')

# ツール名のフォーマット検証
if [[ ! "$tool_name" =~ ^[a-zA-Z0-9_]+$ ]]; then
  echo '{"decision": "deny", "reason": "Invalid tool name"}' >&2
  exit 2
fi

# パストラバーサル検出
file_path=$(echo "$input" | jq -r '.tool_input.file_path')
if [[ "$file_path" == *".."* ]]; then
  echo '{"decision": "deny", "reason": "Path traversal detected"}' >&2
  exit 2
fi
```

---

## 20. まとめ: 設計原則のチェックリスト

### コマンド設計

- [ ] CCへの指示として書いている（人間への説明ではない）
- [ ] allowed-toolsで必要最小限のツールに制限している
- [ ] !`command` でインラインコンテキストを構築している
- [ ] $ARGUMENTS / $1, $2 で引数を受け取っている
- [ ] 重要フェーズに「DO NOT SKIP」等の強い制約がある
- [ ] ユーザー承認ポイントが明示されている

### エージェント設計

- [ ] name は kebab-case、3-50文字
- [ ] description に `<example>` ブロック2-4個
- [ ] 明示的要求とプロアクティブ発動の両方の例がある
- [ ] model は用途に応じて選択（inherit がデフォルト）
- [ ] tools は最小権限原則で制限
- [ ] 指摘者と評価者が分離されている
- [ ] 信頼度スコアでフィルタリングしている

### スキル設計

- [ ] description は第三人称（「This skill should be used when...」）
- [ ] 具体的なトリガーフレーズを列挙している
- [ ] description は「押し気味」に書いている
- [ ] 本文は命令法（「To create...」）
- [ ] SKILL.md は 1,500-2,000語に収まっている
- [ ] 詳細は references/ に分離している
- [ ] references/ への参照が SKILL.md に明記されている

### フック設計

- [ ] ${CLAUDE_PLUGIN_ROOT} でポータブルなパス参照
- [ ] すべての入力をバリデーションしている
- [ ] 変数をクォートしている
- [ ] 適切なタイムアウトを設定している
- [ ] 構造化JSONを出力している
- [ ] exit 0 = 成功、exit 2 = ブロックを守っている

### 品質制御

- [ ] 信頼度スコア80以上のみ報告
- [ ] 偽陽性の明示的な除外リストがある
- [ ] 二重チェック（開始前と完了前）を実施している
- [ ] 出力フォーマットが厳密に定義されている
