# Documentation conventions

## Structure

- モノレポでは、構成要素を「コンポーネント」ではなく **「パッケージ」** と呼ぶ（OSS慣習）
- 複数文書で同じ内容が重複していたら、**共通セクションを README や横串文書に集約** する
- 大きなリファクタリングは **骨組み → 中身詰め** の2段階に分ける

## Headings

- 共通テンプレ（例: `Overview / Usage / Architecture`）を全文書に強制しない。**ファイルごとに内容最適化** する
- 不要な `## Overview` ラッパーは廃止してフラット化する
- 見出しは **OSS慣習に沿った英語** を使う。造語や直訳を避ける
  - 避ける: `Development`（曖昧。コントリビューションか使い方か不明）
  - 避ける: `Internals`（ランタイム/DB/コンパイラ系に偏る。dev tool には `Architecture` が主流）
- 新しい見出し命名を決める前に、**実際のOSSプロジェクトの慣習を調査** する（Diátaxis, standard-readme, matklad の ARCHITECTURE.md など）

## Bilingual docs

- 最終英語化予定の日本語文書には、冒頭に `<!-- TODO(translation) -->` マーカーを置く
- 見出しだけ先に英語化するのはOK。本文は一括で翻訳する流れで良い
