# コンポーネント

> Claude Code プラグインを構成する 4 種類のコンポーネント (コマンド、エージェント、スキル、フック) の設計パターン。公式プラグインリポジトリから抽出。

**TODO**:
- `.mcp.json` の設計パターンをドキュメント化する (まだソースから抽出できていない)。対応する `## MCP` セクションを追加する。
- ある責務に対してコマンド/エージェント/スキルのいずれを選ぶべきかについての明示的なガイダンスを追加する。
- 良い例だけでなく悪い例も収集し、smith のパターンインスペクターが照合できる具体的なアンチパターンを揃える。

## コマンド

スラッシュコマンドは `commands/` 配下の Markdown ファイルである。その本文は、ユーザーがコマンドを呼び出したときに Claude が実行する命令である。

### コマンドはドキュメントではなく命令として書く

```markdown
<!-- GOOD: imperative, addressed to Claude -->
Review this code for security vulnerabilities including:
- SQL injection
- XSS attacks

<!-- BAD: addressed to a human reader -->
This command will review your code for security issues.
```

### `allowed-tools` でツールを制限する

フロントマターでコマンドが呼び出せるツールを制限できる。これにより Claude が隣接した作業へ逸脱するのを防げる。

```yaml
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
---
```

`commit-commands` は git のみに限定し、`code-review` は `gh` CLI の呼び出しのみに限定している。原則は最小権限である: コマンドが Write アクセスを必要としないなら付与しない。

### 「単一メッセージ完了」パターン

Claude にはツール呼び出しの周りに説明的な文章を加える癖がある。一部のコマンドは余計なテキストなしで 1 ターンで完了させる必要がある。

```markdown
You have the capability to call multiple tools in a single response.
You MUST do all of the above in a single message.
Do not use any other tools or do anything else.
Do not send any other text or messages besides these tool calls.
```

`commit-commands` の `/commit` および `/commit-push-pr` で使用されている。

### `` !`command` ``によるインライン実行

バッククォートで前置されたコマンドは呼び出し時点で実行され、その出力がプロンプトに埋め込まれる。これによりコマンドは、Claude が命令を見る前に動的なコンテキストを構築できる。

```markdown
## Context
- Current git status: !`git status`
- Current git diff: !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`
```

### 引数の展開

```markdown
---
argument-hint: [pr-number] [priority] [assignee]
---

Review PR #$1 with priority $2. Assign to $3.
```

- `$ARGUMENTS` — 引数文字列全体。
- `$1`、`$2`、`$3` — 位置引数。
- `@$1` — そのパスをファイルとして読むよう Claude に指示する。
- `@${CLAUDE_PLUGIN_ROOT}/templates/report.md` — プラグイン内部のファイルを参照する。

### フェーズ制御パターン

`feature-dev` と `plugin-dev` で使用。コマンドが複数のフェーズを宣言し、それぞれに次の要素を持つ。

- **Goal**: このフェーズの目的。
- **Actions**: 具体的なステップ。ディスパッチするサブエージェントも含む。
- **User confirmation point**: 明示的な承認ゲート。

```markdown
## Phase 3: Clarifying Questions
**Goal**: Fill in gaps and resolve all ambiguities.
**CRITICAL**: This is one of the most important phases. DO NOT SKIP.

## Phase 5: Implementation
**DO NOT START WITHOUT USER APPROVAL**
```

「DO NOT SKIP」「DO NOT START WITHOUT APPROVAL」のような強いマーカーが、フェーズを統合してしまう Claude の傾向に対抗する。

## エージェント

サブエージェントは `agents/` 配下の Markdown ファイルで、フロントマターとペルソナ/命令本文から成る。

### フロントマター

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

| フィールド | 必須 | 備考 |
|---|---|---|
| `name` | はい | kebab-case、3〜50 文字。 |
| `description` | はい | トリガー表現と 2〜4 個の `<example>` ブロック。 |
| `model` | はい | `inherit` / `sonnet` / `opus` / `haiku`。 |
| `color` | はい | `blue` / `cyan` / `green` / `yellow` / `magenta` / `red`。 |
| `tools` | いいえ | 省略すると全ツールアクセス。指定すると制限する。 |

### `<example>` ブロックによるトリガー定義

```markdown
description: Use this agent when... Examples:

<example>
Context: User has just created a PR with new functionality.
user: "I've created the PR. Can you check if the tests are thorough?"
assistant: "I'll use the pr-test-analyzer agent to review the test coverage."
<commentary>
Since the user is asking about test thoroughness in a PR, use the Task tool to launch the agent.
</commentary>
</example>
```

明示的リクエスト例 (「PR をレビューして」) と能動的ディスパッチ例 (Claude が名指しされずにそのエージェントを選ぶ) の両方を含めること。assistant 行ではエージェントを具体的に名指しし、commentary でそのエージェントが適切である理由を説明する。

### モデルの階層化

`code-review` は 4 段のパイプラインを使用する。

```
Haiku → eligibility, file listing, summary
Sonnet → main review (5 parallel reviewers)
Haiku → confidence scoring per finding
Haiku → re-eligibility check
```

Sonnet は判断が必要なところにのみ使う。Haiku は決定論的なラッピング作業を担当する。

`pr-review-toolkit` は `code-reviewer` と `code-simplifier` を深い判断のために Opus に昇格させ、他の 4 エージェントは `inherit` のままにしている。

### 並列ディスパッチ

| プラグイン | フェーズ | エージェント | 数 | 観点の分担 |
|---|---|---|---|---|
| feature-dev | Phase 2 | code-explorer | 2〜3 | 類似フィーチャー / アーキテクチャ / UX |
| feature-dev | Phase 4 | code-architect | 2〜3 | 最小変更 / 綺麗な設計 / 実用主義 |
| feature-dev | Phase 6 | code-reviewer | 3 | 簡潔さ・DRY / バグ・正しさ / 規約 |

`code-review` は 5 つの並列 Sonnet レビュアーを使う。

| # | レンズ |
|---|---|
| 1 | CLAUDE.md 準拠 |
| 2 | 浅いバグスキャン (変更行のみ) |
| 3 | git blame と履歴から推測されるバグ |
| 4 | 過去の PR コメントとの突合 |
| 5 | ファイル内コメントとの整合性 |

### レポーターと評価器の分離

`code-review` における最も重要な設計原則: Sonnet レビュアーが検出を生成し、**別の Haiku エージェント**がそれをスコア付けする。単一のエージェントが自分自身の検出を生成し評定すると、それを肯定する方向にバイアスがかかる。役割を分割することで、そのバイアスを構造的に排除する。

### 色の割り当て

| プラグイン | 色 |
|---|---|
| feature-dev | explorer=yellow, architect=green, reviewer=red |
| pr-review-toolkit | エージェントごとに 1 色 (6 色) |
| hookify | analyzer=yellow |
| plugin-dev | creator=magenta, validator=yellow, reviewer=cyan |

tmux ベースの並列ワークフローでは、色によってどのエージェントがアクティブかが一目で分かる。

### 代表的な専門エージェント

- **silent-failure-hunter** (`pr-review-toolkit`): ペルソナは「サイレント失敗ゼロトレランス」。空の catch ブロック、ログ・アンド・コンティニューパターン、暗黙のフォールバックを検出する。各検出には CRITICAL/HIGH/MEDIUM の重大度と、隠れている可能性のあるエラー型のリストが付く。
- **type-design-analyzer** (`pr-review-toolkit`): 型のカプセル化、不変条件の表現力、有用性、強制力を 1〜10 のスケールでスコア付けする。原則は「不正な状態を表現不可能にする」。アンチパターン (貧血ドメインモデル、可変な内部状態の露出) を明示的に列挙する。
- **code-simplifier** (Opus): 最近変更されたコードのみを対象とする。簡潔さと可読性のバランスを取る。ネストされた三項演算子を禁じ、`switch`/`if-else` を推奨する。

## スキル

スキルは `skills/<skill-name>/` 配下に存在し、`SKILL.md` と任意の `references/`、`examples/`、`scripts/` サブディレクトリを持つ。

### フロントマター

```yaml
---
name: skill-name
description: This skill should be used when the user asks to "specific phrase 1",
  "specific phrase 2", "specific phrase 3". Include exact phrases users would say.
version: 0.1.0
---
```

- **三人称**: 「This skill should be used when...」。description はシステムプロンプトに注入されるため、一人称・二人称は意味をなさない。
- **具体的なトリガーフレーズ**: ユーザーが実際に発する言葉をそのまま引用する。
- **前のめりに書く**: Claude はスキルを*過小*にトリガーする傾向がある。description は積極的に書き、関連が薄いリクエストでも発火するようにする。

### 本文のスタイル

- **命令形/不定詞**: 「To create a hook, define...」。本文は実行層のプロンプトである。
- **二人称を避ける**: 「You should...」と書かない。
- **1,500〜2,000 語**: それを超えるなら `references/` に分割する。
- **`references/` を明示的に言及**して、Claude が追加資料の存在を知るようにする。

```markdown
## Additional Resources

### Reference Files
- **`references/patterns.md`** — Common hook patterns (8+ proven patterns)
- **`references/advanced.md`** — Advanced use cases and techniques

### Utility Scripts
- **`scripts/validate-hook-schema.sh`** — Validate hooks.json structure
```

### description の最適化 (skill-creator の方法論)

1. テストクエリを 20 件作成する: トリガーすべきものを 10 件、トリガーすべきでないものを 10 件。
2. トリガーすべきでないクエリは「惜しいが違う」ものにする — 明らかに無関係なクエリはテストとして役に立たない。
3. 60% を train、40% を test に分割する。
4. 各クエリを 3 回実行し、信頼できるトリガー率を得る。
5. 拡張思考を用いて description 改善候補を生成する。
6. train と test の両方で評価するが、選択は test スコアで行う (過学習を避ける)。
7. 最大 5 ラウンドまでイテレーションする。

テストクエリの品質基準:

- 具体的で詳細であること (ファイルパス、個人的な文脈、会社名、URL を含める)。
- 長さに変化を持たせる (短いものから長いものまで)。
- カジュアルな言い回し、略語、タイポを含める。
- 明らかに無関係なクエリは含めない — それは選択をテストしない。

### SKILL.md が果たし得る 3 つの役割

| 役割 | 場面 | 例 |
|---|---|---|
| 自動トリガー型の知識注入 | スキルの description が Claude の意図解決にマッチする | frontend-design, playground |
| オンデマンド参照 | コマンドやエージェントが Skill ツール経由で明示的に読み込む | plugin-dev の 7 つのスキル |
| 長尺ワークフロー | SKILL.md の本文*そのもの*が手順全体である | skill-creator (例外的) |

## フック

フックは特定のライフサイクルイベントで実行される。`hooks/hooks.json` で定義する。

### イベント

| イベント | タイミング | 用途 |
|---|---|---|
| PreToolUse | ツール実行前 | 検証、書き換え、ブロック。 |
| PostToolUse | ツール実行後 | フィードバック、ログ。 |
| Stop | エージェントが停止しようとするとき | 完了性のチェック。 |
| SubagentStop | サブエージェントが停止しようとするとき | タスクの検証。 |
| SessionStart | セッション開始 | コンテキストの読み込み。 |
| SessionEnd | セッション終了 | クリーンアップ。 |
| UserPromptSubmit | ユーザー入力受信時 | コンテキスト注入、検証。 |
| PreCompact | コンテキスト圧縮前 | 重要情報の保存。 |
| Notification | 通知時 | 反応する。 |

### 2 種類のフック

**`prompt` 型 (推奨)**:

```json
{
  "type": "prompt",
  "prompt": "Validate if this tool use is appropriate: $TOOL_INPUT",
  "timeout": 30
}
```

- LLM ベースで、コンテキストを踏まえた判断が可能。
- 柔軟。
- エッジケースを扱える。

**`command` 型**:

```json
{
  "type": "command",
  "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh",
  "timeout": 60
}
```

- 決定論的。
- 高速。
- 外部ツールと統合できる。

### `hooks.json` のフォーマット

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

- `description` は任意。
- `hooks` ラッパーは必須 (`settings.json` とはここが異なる)。
- `matcher` はツール名のパターン: 全ツール対象は `*`、OR は `|`、正規表現対応。
- 複数のフックは並列に実行され、順序保証はない。

### 移植性のために `${CLAUDE_PLUGIN_ROOT}` を使う

プラグイン内部のパスはすべてこの変数を使うこと。

```json
"command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
```

ハードコードされた絶対パスは禁止。この変数はフックスクリプト内でも環境変数として利用できる。

### 代表的なフックパターン

- **SessionStart コンテキスト注入** (`explanatory-output-style`): Bash スクリプトが JSON を出力し、セッション開始時にシステムプロンプトへテキストを追加する。プラグインのコードに触れずに出力スタイルを変える。
- **Stop ベースのループ制御** (`ralph-loop`): Stop フックが `.claude/ralph-loop.local.md` を読み、イテレーションカウンタをインクリメントし、完了の宣言が検出されない限りプロンプトを再注入する。Claude はファイルと git 履歴を通じて過去のイテレーションを「見る」。
- **PreToolUse の二層設計**: `security-guidance` は 9 つのパターンを Python にハードコードする (静的、決定論的)。`hookify` は `.local.md` のルールを動的に読み込む (拡張可能)。どちらも PreToolUse だが、前者は固定ポリシー、後者はユーザー記述のルールセットである。
