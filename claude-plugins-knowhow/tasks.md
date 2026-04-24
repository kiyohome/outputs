# Tasks

## Original intent

最初のメッセージ（日本語、verbatim 保持）：

> plugin-smith
> aiya-jam
> の順に作成を進めたい。
> すべてaiyaのモノレポで開発、ただしこの2つはモノレポのパッケージ開発でも使いながら改善するので、モノレポの.claudeに配置します。
> イメージできますか？
> smith作って、smith使ってjamを作る

本ワークストリームでの後続意図、verbatim：

> claude pluginのノウハウ、ノウハウに分かりやすく覚えやすい名前を付けて、チェック項目を扱いやすくしたい。

ユーザーの 2 ステップ計画、verbatim：

> **１** taxonomyにノウハウ集めてるんですよね？チェックリストやケーススタディなど、すべてのドキュメントを精査してtaxonomyに具体的なノウハウとして集めましょう
>
> **２** １でノウハウが固まるので、あとはチェックリストがあればよいですよね。ノウハウからチェックリストを作成しましょう、チェックリストにはチェック方法、改善方法、改善例など、smithの実行を想定して必要な項目を定義してから進めましょう。

## Active tasks

### Step 2 — taxonomy からチェックリストを生成

ゴール: `smith-knowhow` スキルが実行時にロードできる、ID 単位の構造化チェックリストを作る。

- **2.0** 出力形式の合意。提案スキーマ（`id` / `severity` / `auto` / `check` / `fix` / `example`）と、ファイル名（新規 `docs/checklist-items.md` か、既存 `docs/checklists.md` の拡張か）。決定待ち。
- **2.1–2.5** ドメインごとに項目生成：ARC（10）→ SPC（32）→ PRM（24）→ FLW（29）→ CTX（12）。合計 107 項目。各項目は親 taxonomy ID への back-reference を持ち、`docs/taxonomy.md` ↔ `docs/checklist-items.md` が双方向リンクになる。
- **2.6** 整合レビュー：ID カバレッジ、重要度分布、`[auto]` の機械検証可能性、`fix` の実行可能性。
- **2.7** `checklist-items.md` が一次資料化したら `docs/checklists.md` をリタイア or 役割再定義する。

未決事項（2.0 の前提）：

- Step 2 出力を単一ファイルにするか、ドメイン別に分けるか。
- 107 項目を一度に出すか、ドメインごとに刻むか。
- `example` フィールドの厳密スキーマ（インライン Markdown か、別ファイル参照か）。

### Step 3 — smith を実装

- **3.1** `docs/checklist-items.md` を `smith-knowhow` スキル（`agents-in-your-area/.claude/plugins/smith/skills/smith-knowhow/`）にポート。
- **3.2** `README.md` + `docs/design.md` に従い、`/smith` コマンド・3 インスペクターエージェント・3 スクリプトを書く。
- **3.3** smith を `claude-plugins-knowhow/` 自身に対してドッグフーディング。

### Deferred

- **smith のドキュメント routing アーキテクチャ図** — smith のインスペクターが `docs/concepts.md`、`docs/components.md`、`docs/patterns.md`、`docs/checklists.md` をどう参照するかを示す図。描き起こした段階で `docs/concepts.md` 冒頭に着地させる。
- **case-study ↔ taxonomy のリンク（Stage 4）** — `docs/case-studies.md` の各セクションを、それが例示する taxonomy ID にリンクする。
- **smith のテスト / 検証戦略** — v1 後、ドッグフーディング開始時点で。
- **ドッグフーディング対象カタログ** — aiya モノレポ内の具体対象。aiya の `.claude/` の発展に合わせて選定。

## Pivots

- jam を smith のスコープから外した。Create モードを廃止。
- 「コンサルタント」表現を「職人」に再フレーム。
- ノウハウのインデックス化が smith 実装の前提条件として浮上。
- 当初の 49 項目抽出にドメイン分類バイアスが混入していた。7 ソースファイルすべてを再スキャン。
- 設計ドキュメントを再構成：`smith-design.md` をリタイアし、`README.md`（使い方 + アーキテクチャ）と `docs/design.md`（内部データ契約）に分割。
- ルール変更：final-artifact-first（`.claude/rules/artifact.md`）。末尾 `## TODO` 節を inline TODO マーカーに置換中。
- ルール変更：既定言語を English から日本語に切替（`.claude/rules/language.md`）。既存ドキュメントを順次和訳。
