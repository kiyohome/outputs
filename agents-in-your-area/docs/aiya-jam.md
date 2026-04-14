# aiya-jam

> 一緒にやろう — タスク管理

<!-- TODO(translation): 本文を英語化する。 -->
<!-- NOTE: この文書は新規作成の骨組み。中身は次イテレーションで詰める。 -->

## Overview

### Purpose

Traceability Chain と CCS を実運用するためのタスク管理パッケージ。エキスパートが「何を作るか」を Chain として定義し、Task/Context/Step を流し、CCS を受け渡しながら作業を進める。そのワークフローとスキル定義を提供する。

### What it provides

<!-- TODO: SKILL.md / ワークフロー定義 / Chain管理ツール / CCS保管 などの責務を確定 -->

想定：

- **Traceability Chain の生成・更新** — Situation〜Stepsの雛形とゲート
- **CCS の受け渡し管理** — Step間でのCCSファイル保管・参照
- **Step実行の指示** — Step Agentへの委譲インターフェース
- **SKILL.md** — Claude Codeに読ませるスキル定義
- **ワークフロー定義** — Planning → Implementation の流れを宣言的に表現

---

## Usage

### Quickstart

<!-- TODO -->

TODO

### Creating a new chain

<!-- TODO: 新しいタスクを起票してChainを立ち上げる手順 -->

TODO

### Running a task

<!-- TODO: Task Agent → Step Agent への流れ -->

TODO

---

## Architecture

### Components

<!-- TODO: 構成要素の確定 -->

- [ ] SKILL.md の配置と読み込み方式
- [ ] ワークフロー定義フォーマット（YAML / TypeScript / プレーンMarkdown）
- [ ] Chain ストレージ（ファイル / DB / issue本体）
- [ ] CCS ストレージ

### Interfaces

<!-- TODO: aiya-pit / aiya-tape との接続 -->

- [ ] aiya-pit との接続（Task Agent は pit の外？中？）
- [ ] aiya-tape との接続（CCS 生成イベントを tape に記録するか）

### Relation to other documents

- [traceability-chain.md](traceability-chain.md) — Chain の定義
- [ccs.md](ccs.md) — CCS の定義
- [architecture.md](architecture.md) — Task/Context/Step/Action の構造
- [aiya-pit.md](aiya-pit.md) — 実行環境
- [aiya-tape.md](aiya-tape.md) — 監査

### Open questions

- [ ] Chain管理の実装形態（ファイルベース / issue拡張 / 独自DB）
- [ ] SKILL.md の粒度（Task単位 / Step種別単位 / Context単位）
- [ ] ワークフロー定義言語の選定
- [ ] Task Agent の実装（Claude Codeのサブエージェント / 別コンテナ / 別セッション）
- [ ] 三段階ゲートのUI（CLI対話 / web UI / PR review）
- [ ] 並列Stepの扱い
