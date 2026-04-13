# Claude Code でのスライド作成 — 調査まとめ

## 背景・課題

Claude Code（CC）でのスライド作成は、他ツールと比べて不得意な領域。凝ったデザインではなく、シンプルでクールなデザインでポイントが伝わりやすいスライドを、CCを活用して効率的に作りたい。コンテンツは自分で考えるので、スライドの見た目と図の生成を自動化して作業時間を削減したい。

## 調査結果：3つのアプローチ

### 1. python-pptx 直接生成（CC標準 / claude.ai の pptx skill）

CCやclaude.aiが内部で使っている方式。Pythonでpython-pptxライブラリを叩いてPPTXを生成する。

- テンプレートを渡せばレイアウト・フォント・色を維持できる
- テンプレートなしだとデフォルトスライドに内容を流し込むだけになりがちで、ビジュアルの質は低い
- 図やダイアグラムもpython-pptxで描画するため、複雑な図は苦手

**Claude for PowerPoint（2026年2月リリース）**: PowerPointアドインとして、スライドマスター・レイアウト・フォント・配色を読み取って生成・編集。テンプレートベースの業務スライドならこちらが本命になりつつある。Pro以上のプランで利用可能。

### 2. Marp（Markdown → スライド）+ Claude Code

Markdown で書いてHTML/PDF/PPTXに変換するエコシステム。

- **CC との相性が抜群** — テキストベースなのでCCに「Marpフォーマットで10枚のスライド書いて」と言えば構造化されたMarkdownが返ってくる
- **git管理** — Markdownファイルなので差分管理が容易
- **CSSテーマで統一感** — 自分のブランドテーマを一度作れば全スライドに適用
- **エクスポート柔軟** — HTML、PDF、PPTXすべて対応
- **VS Code 拡張** — Marp for VS Code でリアルタイムプレビューしながら編集可能
- **skill化しやすい** — MarpフォーマットのSKILL.mdを作ればCCで `/create-marp-deck` のような使い方が可能
- **図**: Mermaidダイアグラム対応。凝った図が必要なときはSVGをCCに書かせて埋め込み

開発者の間で人気が高まっているワークフロー: CCにブレスト → Markdownで初稿生成 → リアクション → イテレーション の4段階。

### 3. HTML生成型スキル

#### 3a. frontend-slides（Zara Zhang 作）

Claude Code用スキル。依存なしの単一HTMLファイルとしてアニメーション付きプレゼンを生成。

- 「見せて選ばせる（show, don't tell）」方式 — スタイルの方向性をいくつか提示して選ばせてから生成
- デザインの質は高い。10種のスタイルプリセット（Neon Cyber, Swiss Modern, Brutalist 等）
- 全スライドが1つのHTMLファイル（scroll-snap方式）
- Vercelデプロイまでワンコマンド対応、PDF化はPlaywrightでスクリーンショット
- PPTX変換は非対応。Webベース共有向け

#### 3b. SlideKit（nogataka 作）

Claude Code用スキル。1スライド=1HTMLファイル（1280×720px）で生成し、PPTX変換にも対応。

- **PDF → HTML → PPTX パイプライン** — 既存PDFからテンプレートを抽出して再利用可能
- **PPTX変換を前提としたDOM構造** — テキストは `<p>`/`<h*>`、flexテーブルなど変換しやすい構造を遵守
- **20種のレイアウトパターン** — カバー、KPIダッシュボード、ファネル、TAM/SAM/SOM、VS比較など
- **テンプレートシステム** — 一度作ったデザインをテンプレート化して再利用可能。11種の付属テンプレート
- **一問一答形式のヒアリング** — 番号選択で進行する対話型ワークフロー
- Tailwind CSS + Font Awesome + Google Fonts + Chart.js（データ可視化時のみ）
- `/pptx` スキル（Anthropic公式）との連携でPPTX変換

## 比較表

| 観点 | python-pptx 直接 | Marp + CC | frontend-slides | SlideKit |
|---|---|---|---|---|
| 出力形式 | PPTX | MD → HTML/PDF/PPTX | 単一HTML | 個別HTML → PPTX可 |
| CC連携 | 標準 | テキスト生成が本質 | skill統合 | skill統合 |
| 図・ダイアグラム | python-pptxで描画 | Mermaid対応 | CSS/SVGで表現 | Tailwind + Chart.js |
| テンプレート再利用 | PPTXテンプレート | CSSテーマ | スタイルプリセット | HTMLテンプレートシステム |
| PPTX互換 | ネイティブ | `--pptx`で出力可 | なし（PDF化のみ） | DOM構造レベルで対応 |
| git管理 | バイナリで困難 | Markdownで最適 | HTML1ファイル | 個別HTMLで管理可 |
| 既存資料の取り込み | テンプレート上書き | なし | PPTX→HTML変換 | PDF→HTML変換 |
| デザイン品質 | テンプレ依存 | CSSテーマ依存 | 高い | 高い（パターン豊富） |
| 学習コスト | 低い | 低い | 低い | 低い |
| 回転速度 | 速い | 最速 | 中程度（対話あり） | 中程度（対話あり） |

## 用途別の推奨

| 用途 | 推奨 | 理由 |
|---|---|---|
| 記事発表・カンファレンスのデッキ | SlideKit | 見た目のクオリティが高い、レイアウトパターン豊富 |
| 社内向け・勉強会の素早いスライド | Marp | テキストベースで回転が速い |
| Webで共有するインタラクティブなデッキ | frontend-slides | アニメーション対応、Vercelデプロイ |
| テンプレート準拠の業務スライド | Claude for PowerPoint | スライドマスター読み取り対応 |
| AIYAドキュメント系のスライド | Marp | テキスト主体、git管理重視 |

## 関連リンク

- SlideKit: https://github.com/nogataka/SlideKit
- frontend-slides: https://github.com/zarazhangrui/frontend-slides
- Marp: https://marp.app/
- Marp + CC ワークフロー記事: https://www.freecodecamp.org/news/how-to-use-claude-code-and-marp-to-think-through-presentations/
- Claude for PowerPoint: https://support.claude.com/en/articles/13521390-use-claude-for-powerpoint
