# コンセプト

> Claude Code プラグインの基礎概念と設計原則。公式リポジトリ `anthropics/claude-plugins-official` から抽出したもの。

## プラグインとは

Claude Code のプラグインとは、Claude Code の振る舞いを拡張する自己完結型のバンドルである。プラグインにはスラッシュコマンド、サブエージェント、スキル、フック、MCP サーバーを任意に組み合わせて含めることができ、Claude Code が統一的にインストール・ロード・呼び出しできるようパッケージ化されている。

### 標準ディレクトリ構成

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # メタデータ。`name` のみ必須。
├── commands/                 # スラッシュコマンド (.md ファイル)。
├── agents/                   # サブエージェント定義 (.md ファイル)。
├── skills/                   # スキル。スキルごとに 1 サブディレクトリ。
│   └── skill-name/
│       ├── SKILL.md
│       ├── references/       # 詳細なリファレンス資料。
│       ├── examples/         # 具体例。
│       └── scripts/          # ユーティリティスクリプト。
├── hooks/
│   └── hooks.json            # フック定義。
├── hooks-handlers/           # フックハンドラスクリプト。
├── .mcp.json                 # MCP サーバー定義。
├── scripts/                  # 共有ユーティリティ。
├── README.md
└── LICENSE
```

厳密に必須なのは `name` フィールドを持つ `plugin.json` のみ。それ以外はすべてオプションで、プラグインの成長に応じて追加していく。

## プラグインの分類

公式プラグインは 3 つの構造的なアーキタイプにまたがる。新しいプラグインを作るとき、自分がどのアーキタイプを構築しているかを理解することが最初の決定事項となる。

### アーキタイプ A: コマンド + エージェント (ワークフロー指向)

- 代表的なプラグイン: `feature-dev`、`code-review`、`pr-review-toolkit`。
- スラッシュコマンドが手順を駆動し、サブエージェントが分離されたコンテキストで作業を行う。
- 通常スキルは存在しない。
- ユーザーはスラッシュコマンドを通じて明示的にプラグインを呼び出す。

### アーキタイプ B: スキル単独 (知識プロバイダ)

- 代表的なプラグイン: `claude-code-setup`、`frontend-design`、`playground`。
- コマンドもエージェントもなし。
- ユーザーのリクエストがスキルの description にマッチしたとき、Claude Code が自動的に起動する知識ベース。
- スキルの description がユーザーの言い回しとマッチするかどうかで選択が決まる。

### アーキタイプ C: ハイブリッド (ツールキット)

- 代表的なプラグイン: `plugin-dev`、`hookify`、`claude-md-management`。
- コマンド、エージェント、スキルを組み合わせる。
- スキルは特定のフェーズでコマンドやエージェントが明示的にロードするオンデマンドのリファレンスとして機能する。

### 公式プラグインのコンポーネント一覧

| プラグイン | commands | agents | skills | hooks | 役割 |
|---|---|---|---|---|---|
| feature-dev | 1 | 3 | 0 | 0 | 7 フェーズ構造化フィーチャー開発 |
| code-review | 1 | 0 | 0 | 0 | PR コードレビューの自動化 |
| pr-review-toolkit | 1 | 6 | 0 | 0 | 6 種類の専門レビューエージェント |
| commit-commands | 3 | 0 | 0 | 0 | Git ワークフロー自動化 |
| ralph-loop | 3 | 0 | 0 | 1 | 自己参照型の反復開発ループ |
| hookify | 4 | 1 | 1 | 1 | フックルールの動的生成 |
| security-guidance | 0 | 0 | 0 | 1 | セキュリティパターン検出 |
| code-simplifier | 0 | 1 | 0 | 0 | 自律的なコード改善 |
| claude-code-setup | 0 | 0 | 1 | 0 | 環境最適化の提案 |
| claude-md-management | 1 | 0 | 1 | 0 | CLAUDE.md の品質管理 |
| skill-creator | 0 | 0 | 1 | 0 | スキルの作成・評価・最適化 |
| plugin-dev | 1 | 3 | 7 | 0 | プラグイン開発ツールキット |
| explanatory-output-style | 0 | 0 | 0 | 1 | 教育的洞察の出力スタイル |
| learning-output-style | 0 | 0 | 0 | 1 | インタラクティブ学習の出力スタイル |
| playground | 0 | 0 | 1 | 0 | HTML プレイグラウンド生成 |
| frontend-design | 0 | 0 | 1 | 0 | フロントエンド設計知識 |
| agent-sdk-dev | 1 | 2 | 0 | 0 | Agent SDK 開発 |

**TODO**: ユーザーの意図をアーキタイプ A/B/C にマッピングする判断ヒューリスティックを文書化する。

## コア設計パターン

### 3 層分離

プラグインの責務は手順、知識、実行の 3 層に分解される。

| 層 | 担い手 | 配置場所 | 役割 |
|---|---|---|---|
| 手順 | コマンド | `commands/*.md` | 何を、どの順序で行うか。フェーズ定義、分岐、ユーザー確認。 |
| 知識 | スキル | `skills/*/SKILL.md` | どうやるか。オンデマンドでロードされるドメイン知識。 |
| 実行 | エージェント | `agents/*.md` | 実際の作業者。分離されたコンテキストで動き、結果を返す。 |

`plugin-dev` がこの分離を最もきれいに体現している。

```
create-plugin command (手順: 8 フェーズワークフロー)
  Phase 2 → Skill ツールが plugin-structure スキルをロード (知識)
  Phase 5 → Skill ツールが hook-development スキルをロード (知識)
           → agent-creator エージェントが実行 (実行)
  Phase 6 → plugin-validator エージェントが実行 (実行)
```

### SKILL.md の 3 つの役割

| 役割 | メカニズム | 例 |
|---|---|---|
| 自動トリガーされる知識注入 | description がユーザーリクエストにマッチするとロードされる | frontend-design、playground |
| オンデマンドリファレンス | コマンドやエージェントが Skill ツールで明示的にロード | plugin-dev の 7 つのスキル |
| 長文の手順 | SKILL.md 自体がワークフロー全体 | skill-creator (例外的) |

### プログレッシブディスクロージャー

スキルはコンテキストウィンドウを軽く保つための 3 段階ロードシステムを実装する。

| 段階 | ロードされるタイミング | サイズ目安 |
|---|---|---|
| メタデータ (name + description) | 常にシステムプロンプトに存在 | 約 100 ワード |
| SKILL.md 本体 | スキルがトリガーされたとき | 1,500〜2,000 ワード (上限 5,000) |
| `references/`、`examples/`、`scripts/` | Claude が必要と判断したときのみ | 無制限 |

これがコンテキストウィンドウの肥大化に対する構造的な回答である。すべての手順詳細をインライン化したモノリシックなコマンドは呼び出しごとにコンテキストを膨張させるが、知識をスキルに分割したプラグインは現在のフェーズが必要とするものだけをロードする。

## 設計原則

### プロンプトは Claude への指示であり、人間向けの説明ではない

プラグイン内のすべての `.md` ファイル (コマンド、エージェント、スキル) はプロンプトである。命令形で書き、Claude に具体的なステップを与え、読み手向けのドキュメントとして書かないこと。

### 重要なフェーズを強調する

Claude はフェーズをスキップしがちである。これに対抗するには強い目印を使う。`**CRITICAL**: This is one of the most important phases. DO NOT SKIP.` や `**DO NOT START WITHOUT USER APPROVAL**` のように。表現が強いほど、Claude はフェーズ境界を確実に守る。

### 「お任せします」を明示的な承認に変換する

ユーザーが判断を委ねた場合でも、プラグインは具体的な推奨を提示し、進める前に明示的な確認を得るべきである。サイレントな決定は積み重なってレビューされない乖離になる。

### ループ脱出のための偽の宣言を禁止する

完了述語に依存するプラグイン (例: `ralph-loop`) は、条件が実際に真になるまで Claude が完了トークンを発行することを明示的に禁じなければならない。このルールがないと、Claude は脱出のために早すぎる「done」を捏造する。

### 出力の形を制御する

有用な出力指示の例。

- `Do not send any other text or messages besides these tool calls.` — `commit-commands` がシングルターン完了を強制するために使用。
- `Keep your output brief. Avoid emojis. Link and cite relevant code.` — `code-review` が構造化された検出のために使用。

### スコープを制約する

プラグインがやりすぎる傾向にあるときは、スコープを再確認する。

- `Only refine code that has been recently modified or touched in the current session, unless explicitly instructed otherwise.` (code-simplifier)
- `Do not check build signal or attempt to build or typecheck the app. These will run separately.` (code-review)

### コスト最適化: 適切なモデル階層を選ぶ

| ユースケース | モデル | 根拠 |
|---|---|---|
| 前処理・後処理 | Haiku | 定型的なチェック、フィルタリング。 |
| 分析とレビュー | Sonnet | 判断と速度のバランス。 |
| 深い推論 | Opus | 複雑な品質判断。 |
| 呼び出し元と同じ | `inherit` | 特別な理由がない限りデフォルト。 |

### 並列 vs 逐次

- 並列: 視点の分離が重要な独立した分析タスク (例: 異なるレンズを持つレビュー担当)。
- 逐次: 次のステップが前のステップの出力を消費するパイプライン (例: `code-review` における適格性 → レビュー → スコアリング)。
- ユーザー選択可能: 一部のプラグイン (`pr-review-toolkit`) は選択肢を公開する。
