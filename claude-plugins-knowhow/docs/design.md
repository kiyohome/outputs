# smith — 内部設計

実装時に参照するリファレンス。エントリポイントは [`../README.md`](../README.md)。

## Finding スキーマ

すべてのインスペクターエージェントと `[auto]` 前段パススクリプトは、以下の構造で検出を出力する：

```json
{
  "id": "<sha256(target_file + '|' + finding_type) の先頭 12 hex>",
  "target_file": "<絶対パス または プラグイン相対パス>",
  "finding_type": "<命名規則を参照>",
  "verdict": "OK" | "NG" | "OOS",
  "comment": "<常に必須。OK/OOS の場合はこれが全内容>",
  "self_confidence": 0,
  "rationale": null,
  "expected_effect": null,
  "patch_content": null
}
```

- `id` — 決定論的：`sha256(target_file + "|" + finding_type)` の先頭 12 hex 文字。同じ問題が複数レンズに引っかかっても（あるいはイテレーション間で再検出されても）同じ `id` を持つ。収束のマージキーとして、また `.smith.local.md` の `adoptions` / `rejections` に格納するトークンとして使う。
- `self_confidence` — 0-100。インスペクター自身の確信度。
- `rationale` — `verdict == NG` の場合に必須。
- `expected_effect` — `verdict == NG` の場合に必須。修正によって OK になるはずの `checklist_item_id` のリスト。
- `patch_content` — `verdict == NG` の場合に必須。形式は [patch_content 形式](#patch_content-形式) 参照。

## `finding_type` 命名規則

マージは厳密な文字列一致に依存するため、規律が必要。

- `checklist:<component-type>:<item-slug>` — 例：`checklist:skill:description-too-long`
- `pattern:<name-slug>` — 例：`pattern:reporter-self-scoring`
- `architecture:<name-slug>` — 例：`architecture:wiring-mismatch`

スラッグはすべて kebab-case。enumeration は `smith-knowhow/SKILL.md` に置き、実装とドッグフーディングを通じて新タイプが現れた段階で追加する。

**TODO**: `docs/checklist-items.md` が出来た段階（`tasks.md` §Step 2）で、上記例の `<item-slug>` 部を ID ベースの正規形に置き換える。

## `[auto]` 前段パス

`scripts/smith-autocheck.sh` は同じ Finding スキーマで出力する。違いは：

- `self_confidence = 100`（決定論的）。
- `finding_type` はチェックリスト項目 ID から直接導出（例：`checklist:skill:kebab-case-filename`）。
- `verdict` は機械的チェックの結果（違反していれば `NG`、それ以外は出力なし）。
- `patch_content` は機械的に修正可能な場合（例：kebab-case へのリネーム）に埋める。それ以外は `null` で `comment` にメモを残す。

スコープは [`checklists.md`](./checklists.md) で `[auto]` タグが付いた項目に限る：kebab-case ファイル名、必須フロントマター項目、絶対パス禁止、`${CLAUDE_PLUGIN_ROOT}` の使用、行数上限。

## `OOS` 判定ルール

`OOS` (Out-of-scope) は、検査中のファイルタイプにそのチェックリスト項目が論理的に適用不能な場合に限る（例：「Skill description length」を Command ファイルに当てる）。曖昧または部分的に当てはまるケースは `NG` または `OK` に解決し、`OOS` にはしない。

`OOS` は監査用に記録するが、ランキングと閾値フィルタからは除外する。

## `patch_content` 形式

インスペクターは Edit ツール互換のペアをファイル単位で返す：

```json
"patch_content": [
  {"old_string": "...", "new_string": "..."},
  {"old_string": "...", "new_string": "..."}
]
```

`/smith` は各ペアを Edit ツールで適用する。Edit ツールの契約に直接対応するため、unified-diff の空白や行番号まわりの脆さを回避できる。

ファイル全体の作成や置換では、`old_string` を空文字列（作成）または現在の全内容（置換）にする。その場合は `/smith` が Write ツールを使う。

## エージェントとスクリプト間のデータ転送

- 各インスペクターエージェントは、検出を JSON 配列で、最後のメッセージとして 1 つの ` ```json ` フェンスで囲んで返す。
- `/smith` はインスペクター出力（および `[auto]` 前段パスのスクリプト出力）を 1 つの JSON 配列に連結し、`scripts/smith-evaluate.sh` の stdin に流し込む。
- `scripts/smith-evaluate.sh` はランク付け済みの検出を JSON 配列で stdout に出す。
- プロセス間のランタイムデータはすべて JSON で流れる。一時データに共有ファイルは使わない。

## 収束スコア

`id` の厳密一致でマージしたあと（`id` は `target_file` と `finding_type` の両方をエンコードしているため、別ファイル上の同じ問題が誤って統合されることはない）：

```
convergence_score = (num_lenses_caught * 30) + (max(self_confidence) * 0.3)
```

`convergence_score < 80` の検出は除外する。

| Lenses | max self_confidence | convergence_score | 結果 |
|---|---|---|---|
| 1 | 100 | 60 | drop |
| 2 | 70 | 81 | pass |
| 2 | 100 | 90 | pass |
| 3 | 0 | 90 | pass |
| 3 | 100 | 120（100 にクランプ） | pass |

レンズの一致が主シグナル。`self_confidence` は補助。

**`[auto]` の検出は閾値をバイパスする**。`self_confidence = 100` ではあるが、構造上「1 つのレンズ」（スクリプト）からしか出ない。`id` マージには参加する：インスペクターレンズが同じ `id` を出した場合、そのインスペクターは追加レンズとしてカウントされ、`patch_content` は `[auto]` のもの（決定論的な機械修正）が勝つ。インスペクターと一致しなかった `[auto]` 検出は無条件で残す（バイパスが効く）。

**TODO**: `[auto]` を「マージに参加させない別の決定論チャネル」として完全分離する案が、現在の merge-and-bypass ハイブリッドより簡潔か再検討する。

## ランキング

残った検出は `len(expected_effect)` の降順でソート（解放されるチェックリスト項目が多いほど優先度が高い）。同点は `convergence_score` の降順でブレーク。

## 依存順序（ステップ 8）

ステップ 2 はファイル一覧と有向エッジを生成する：`A → B` は「`A` が `B` を参照する」を意味し、`B` への編集が `A` を壊しうるので `B` を先に着地させる必要がある。エッジ抽出は `/smith` 自身が `Grep` / `Glob` で決定論的に行う（インスペクターエージェントは使わない）。スキャンパターンは：

- **Command → Agent** — コマンド本文中の Task ツール呼び出しの `subagent_type: <slug>` および `agents/<slug>.md` の明示参照を走査。
- **Hook → Script** — `hooks.json` 中の `${CLAUDE_PLUGIN_ROOT}/scripts/<path>` コマンドを走査。
- **Skill → Reference file** — `SKILL.md` 中の `references/` 配下への相対パスを走査。
- **CLAUDE.md → Component file** — コンポーネント名（command / agent / skill）への参照を走査。
- **Plugin manifest → Any** — `.claude-plugin/plugin.json` で宣言された参照を解決。

曖昧な一致（例：散文中にスキル名が出現するだけで実際の参照ではないケース）はサイレントなエッジにせず、ユーザー確認のための検出として表に出す。

`/smith` は得られた DAG をステップ 8 のためにトポロジカルソートする：

- 基盤ファイル（入力エッジなし）から先。
- 依存先はトポロジカル順。
- 循環があればアルファベット順で破断し、警告を `reconcile_history_ref` にログ出力。

## `.claude/.smith.local.md` スキーマ

```markdown
---
current_target: "<パス または 機能を表す語句>"
iteration: 0                         # 0 始まり
max_iterations: 3                    # 自己検査時は 1
adoptions: ["<finding_id>", ...]
rejections: ["<finding_id>", ...]
reconcile_history_ref: "#iteration-0"
---

# Findings

<target_file ごとにグルーピングされた検出ツリー>

# Reconcile log

## iteration-0

<検出ごとの差分: met / partial / unmet / regressed>
```

- フロントマターは `scripts/smith-state.sh` が、knowhow にある sed/awk パターン（`patterns.md §Reading front matter from shell`）でパースする。
- ファイルは慣例として gitignore する。
- 状態は単一の `/smith` 実行内ではメモリで保持し、ステップ 10 でファイルに書き出す。実行中は再読み込みしない。イテレーション 1〜2 の突合状態は `/smith` がメモリで持ち回る履歴を使う。

### Reconcile 判定

突合ログは、適用前の `expected_effect` と適用後の再検査結果を突き合わせて、採用された検出ごとに 1 つの判定を記録する：

- **`met`** — `expected_effect` のすべての `checklist_item_id` が `OK` になった。
- **`partial`** — `expected_effect` のうち少なくとも 1 つが `OK` になったが、すべてではない。
- **`unmet`** — `expected_effect` のいずれも `OK` にならなかった。
- **`regressed`** — 触ったファイル上で適用前に `OK` だったチェックリスト項目が、適用後 `NG` になった。上の 3 バケット（意図した修正が着地したか）と異なり、`regressed` は他項目への意図しない副作用を測る。

`unmet` または `regressed` の判定を持つ検出は、`max_iterations` の範囲でステップ 4 への再投入対象となる。

## `allowed-tools`

- `/smith` command: `Read, Glob, Grep, Write, Edit, Bash(git:*), Task`。
- `smith-inspector-*` agents: `Read, Glob, Grep`（書き込みなし — `patch_content` は `/smith` に返すデータ）。
- スクリプトは `/smith` の `Bash` 権限で実行されるので、独立した tool 付与は不要。

## 実装フェーズに先送り

以下は本ドキュメントでは事前定義せず、実装フェーズで書き起こす：

- `/smith`、3 つのインスペクターエージェント、`smith-knowhow/SKILL.md` の正確なプロンプト文言。
- finding-type taxonomy の初期内容。チェックリスト項目 ID と既知パターンを種にし、実検査で出てくる新タイプを順次追加する。
- 共通誤検出リストと、レンズごとの誤検出リストの初期内容。
- `.smith.local.md` 内の `reconcile_history_ref` アンカーと本文セクションの正確な構造。
