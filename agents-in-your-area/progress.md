# Progress

> 作業の意図・完了事項・次の作業を記録する。再開時はここから読む。

<!-- TODO(translation): 本文を英語化する。 -->

## 現在のフェーズ

**要件フェーズ**。要件 → UX → 設計 の順で進めている中の最初の段階。

特に AIYA の Traceability Chain と CCS の実現方法を詰めている。ドキュメントのリファクタリングが完了し、これから各文書の中身を埋めていく。

## 完了

### PR #1: モノレポ構造へのリファクタリング

- [x] `agents-in-your-area/` をモノレポ構造に（`README.md` + `docs/`）
- [x] 既存4文書（vision / acc-agent-architecture / aiya-pit / aiya-tape）のマッピング・分割・重複排除
- [x] 文書タイプ分類（Concept 4本 / Package 3本）
- [x] 見出し構造をファイルごとに最適化（共通テンプレは撤回、フラットな `##` 構造）
- [x] ASCII 図を mermaid 化（`architecture.md` の2枚、`README.md` のシステム図）
- [x] `traceability-chain.md` / `aiya-jam.md` の骨組み作成
- [x] 各文書に `<!-- TODO(translation) -->` マーカー配置

## 次の作業（優先順）

### 1. Traceability Chain の要件詰め ★最優先

`docs/traceability-chain.md` の TODO を埋める。ヒアリングポイント：

- Chain 6要素（Situation / Pain / Benefit / Acceptance Scenarios / Approach / Steps）それぞれのフォーマット定義
- 物理配置（1ファイル統合 vs 要素分割 vs ハイブリッド）
- 粒度（1 issue = 1 Chain でよいか）
- Chain のバージョニング方式（変更履歴をどう残すか）
- 執筆分担（エキスパートが書く / AIが下書きする要素）

### 2. Chain と CCS の接続方式

- (a) パス参照 `retrieved_artifacts: spec(chains/issue-123/benefit.md)`
- (b) ID参照 `BNF-123-01` のようなIDで引く
- (c) 展開コピー CCS生成時に Chain該当部分を `goal_orientation` / `constraints` に値渡し

どれにするか決定する。

### 3. 三段階ゲートの具体化

[vision.md](docs/vision.md) に言及はあるが未定義：

- 配置：Task開始時 / Context境界 / Step完了時 のどこに置くか
- 各ゲートの判定者・判定基準・不合格時の戻り先
- UI（CLI対話 / web UI / PR review）

### 4. 用語衝突の解消

Chain の "Steps"（Approach の次に来る作業手順）と ACC の "Step"（Context を構成する作業フロー）が同じ語で違う意味。リネームまたは明示的な区別が必要。

### 5. Chain ↔ Task/Context/Step/Action の対応

[architecture.md § Chain ↔ Task mapping](docs/architecture.md) の未決事項。想定：

- Situation / Pain / Benefit / Acceptance Scenarios → Task 全体の文脈
- Approach → Context 分割の根拠
- Steps → Implementation Context の Step 列

### 6. aiya-jam の実装形態

[aiya-jam.md](docs/aiya-jam.md) の TODO：

- SKILL.md の粒度（Task単位 / Step種別単位 / Context単位）
- ワークフロー定義言語（YAML / TypeScript / プレーンMarkdown）
- Chain ストレージ（ファイル / DB / issue本体）
- CCS ストレージ
- Task Agent の実装形態（Claude Code のサブエージェント / 別コンテナ / 別セッション）

### 7. Quickstart の記述

以下のすべてで Quickstart が TODO：

- `README.md`
- `docs/aiya-pit.md`
- `docs/aiya-tape.md`
- `docs/aiya-jam.md`

### 8. 本文の英語化

全文書の見出しは英語化済み。本文は日本語のまま。各ファイル冒頭の `<!-- TODO(translation) -->` マーカーで追跡。

## セッションの文脈（再開用）

- ユーザーは **ヒアリング・提案ベース** で進めたい
- **モノレポで開発する** 前提（パッケージ: aiya / aiya-pit / aiya-tape / aiya-jam）
- **要件 → UX → 設計** の順
- ドキュメントは最終的に **英語化** 予定（現時点では見出しのみ英語）
- 作業ブランチ: `claude/traceability-chain-docs-VTFb8`

## ドキュメント構成（現状）

```
agents-in-your-area/
├── README.md                   # モノレポ総覧
├── progress.md                 # このファイル
└── docs/
    ├── vision.md               # Why（既存から移設）
    ├── traceability-chain.md   # Chain 仕様（骨組み、TODO多）
    ├── ccs.md                  # CCS 仕様（既存から抽出）
    ├── architecture.md         # 作業単位 + エージェント配置
    ├── aiya-pit.md             # サンドボックス
    ├── aiya-tape.md            # 監査プロキシ
    └── aiya-jam.md             # タスク管理（骨組み、TODO多）
```
