# Traceability Chain

> ドリフトを構造的に検知するための、目的から作業までの連鎖

<!-- TODO(translation): 本文を英語化する。 -->
<!-- NOTE: この文書は新規作成の骨組み。中身は次イテレーションで詰める。 -->

## Overview

### What is this

Traceability Chainは、「これ何のためにやってるんだっけ？」を構造的に追跡可能にする6要素の連鎖。

```
Situation → Pain → Benefit → Acceptance Scenarios → Approach → Steps
```

各要素の間にリンクがあり、リンクが切れたらプロセスが止まる。そのためにドキュメントとして明示的に管理する。

### Why it exists

コンテキスト肥大化とドリフトは品質の最大の敵。仕様駆動開発は「仕様を書いた時点」では目的と一致しているが、実装が進むにつれ「なぜこれを作るのか」が薄れていく。Chainは目的と作業の距離を常に測れる状態にする。

詳細な動機は [vision.md](vision.md) を参照。

### 6 Elements

<!-- TODO: 各要素の定義を詰める。現状は vision.md の一行説明レベル。 -->

| 要素 | 問い | 書く内容（TODO） |
|---|---|---|
| **Situation** | 今どういう状況か | TODO |
| **Pain** | 何が困っているか | TODO |
| **Benefit** | 解決したら何が得られるか | TODO |
| **Acceptance Scenarios** | どうなったら解決したと言えるか | TODO |
| **Approach** | どう解決するか（方針） | TODO |
| **Steps** | 具体的な作業手順 | TODO |

---

## Usage

<!-- TODO: 「いつ誰が何をする」の利用ガイド -->

### When to create a chain

<!-- TODO: issue起票時？計画時？ -->

TODO

### Who writes each element

<!-- TODO: エキスパートが書く要素とAIが下書きする要素の分担 -->

TODO

### Example

<!-- TODO: 実際のissueベースで1例を書く -->

```
TODO
```

### Common pitfalls

<!-- TODO: よくある失敗パターン -->

TODO

---

## Architecture

### Format definition

<!-- TODO: 各要素のスキーマ。YAML / Markdown frontmatter / プレーンMarkdown のどれか決める -->

**未決**: フォーマットをどうするか。候補：
- (a) 1ファイルにセクション分け
- (b) 要素ごとにファイル分割
- (c) ハイブリッド（Why側は統合、How側は分割）

### Physical layout

<!-- TODO: ファイルパス、ディレクトリ構成、命名規則 -->

**未決**: どこに置くか。候補：
- `aiya-jam/chains/<issue-id>/` 配下
- issueリポジトリ内
- 別管理

### Link to CCS

<!-- TODO: Chain と CCS の接続方式 -->

**未決**: Chain要素をCCSからどう参照するか。候補：
- (a) パス参照: `retrieved_artifacts: spec(chains/issue-123/benefit.md)`
- (b) ID参照: `BNF-123-01` のようなIDで引く
- (c) 展開コピー: CCS生成時にChain該当部分を `goal_orientation` / `constraints` に値渡し

CCS側の仕様は [ccs.md](ccs.md) を参照。

### Gates

<!-- TODO: 三段階ゲートの配置と判定基準 -->

**未決**: vision.md に「三段階ゲート」の記述があるが、具体的な配置と判定基準は未定義。

想定：
- ゲート1: Situation → Pain → Benefit の確定（「何のために作るか」の承認）
- ゲート2: Acceptance Scenarios → Approach の確定（「どうやって作るか」の承認）
- ゲート3: Steps 完了時の受け入れ（「目的に近づけたか」の判定）

各ゲートで:
- 誰が判定するか
- 何を判定するか
- 不合格時の戻り先

をTODO。

### Lifecycle

<!-- TODO: 作成→更新→アーカイブ -->

TODO

### Relation to other documents

- [vision.md](vision.md) — Chainの思想的背景
- [ccs.md](ccs.md) — Step実行時の状態表現
- [architecture.md](architecture.md) — Chain と Task/Context/Step/Action の対応
- [aiya-jam.md](aiya-jam.md) — Chain を管理するパッケージ

### Open questions

- [ ] 各要素のフォーマット定義
- [ ] 物理配置（ファイル分割 vs 統合）
- [ ] CCSへの連結方式
- [ ] 三段階ゲートの具体化
- [ ] Chain と ACC階層（Task/Context/Step/Action）の対応
- [ ] Chain のバージョニング（変更履歴をどう残すか）
- [ ] 粒度（1 issue = 1 Chain でよいか）
