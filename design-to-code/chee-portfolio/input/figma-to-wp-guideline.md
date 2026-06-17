# Figma → WordPress ブロックテーマ 設計指針

## 概要

WEBデザイナー・伊藤千晶（Chee Design）のポートフォリオサイトを、Figmaデザインに基づきWordPressブロックテーマ（FSE）で構築する。非エンジニアが管理画面からコンテンツを安全に編集でき、SEOに有効なテキストコーディングで実装する。PC・タブレット・スマホの3デバイス対応。**無料（コスト0円）で構築する。**

## 設計判断

### ブロックテーマ（FSE）を採用する理由

管理画面からサイト全体（テンプレート・ヘッダー・フッター含む）を編集可能にするには、ブロックテーマが唯一の選択肢。クラシックテーマではPHP編集が必要になり、運用要件を満たせない。

### 変換の考え方

Figma → HTML/CSS ではなく、Figma → Block構造 へ変換する。HTML/CSSを直接書くのではなく、Gutenbergのブロックマークアップと `theme.json` でデザインを制御する。テキスト要素はすべてブロックとして実装し、画像テキストは使わない（SEO要件）。

### UI構築の3層戦略

構築コストの低い順に使い分ける。

1. **標準ブロック（70〜80%）** — Group / Columns / Heading / Paragraph / Image 等で土台を組む
2. **Block Pattern** — 繰り返し使うセクション（FV、Works、Service等）をパターン化して再利用
3. **カスタムブロック（必要最小限）** — 標準では不可能な機能のみ（後述）

## サイト構成

### ページ一覧

| ページ | テンプレート | 説明 |
|---|---|---|
| Home（トップ） | front-page | 8セクション構成のLP型ワンページ |
| 制作実績一覧 | archive-works | Works一覧（カード型グリッド） |
| LP詳細 | single-works | 個別実績の詳細ページ |

### Homeセクション構成

| # | セクション | 内容 | 動的/静的 |
|---|---|---|---|
| 01 | FV（ファーストビュー） | キャッチコピー＋スマホモックアップ画像×5のループ表示 | 静的（モックアップ画像は管理画面から差替可能） |
| 02 | Works | 制作実績をピックアップ表示（クライアント名・ラベル・説明・モックアップ画像）。詳細ページへのリンク付き | **動的（Query Loop）** — 実績の追加・表示変更を管理画面から行う |
| 03 | Voice | お客様の声カルーセル（3件）。番号・タイトル・本文・写真・肩書き | 静的（Pattern） |
| 04 | Service | ディレクション / LP制作 / 広告運用の3サービス紹介。アイコン＋ラベル＋説明文 | 静的（Pattern） |
| 05 | CTA | お問合せ誘導 | 静的（Pattern） |
| 06 | Profile | 自己紹介。顔写真＋経歴文＋提供サービス・居住地・趣味 | 静的（Pattern） |
| 07 | Flow | 制作フロー7ステップ。番号＋見出し＋説明文 | 静的（Pattern） |
| 08 | Contact | お問合せフォーム（会社名・名前・メール・内容・プライバシーポリシー同意） | 静的（フォームプラグイン連携） |
| 09 | Footer | サイトナビゲーション＋コピーライト | テンプレートパーツ |

### Header

全ページ共通。ロゴ（Chiaki Itoh / LP Design, Meta Ads）＋ナビゲーション（Home / Works / Voice / Service / Profile）＋Contactボタン。Contactボタンにはhoverバリアントあり（Figmaコンポーネント `btn`）。

スマホ時はNavigationブロックのOverlay Menu設定「Mobile」でハンバーガーメニューに自動切替。デフォルトブレイクポイント600pxでは切替が遅すぎるため、CSSで1024pxに引き上げる。

## デザイントークン（theme.json反映対象）

Figma JSONから抽出した値。

### カラー

| slug | 用途 | 値 |
|---|---|---|
| bg-main | 背景メイン（FV・Voice・Service・Profile） | #DCEFFB |
| bg-sub | 背景サブ（Contact等） | #F6F6F6 |
| white | 白 | #FFFFFF |
| text-primary | テキスト黒 | #111111 |
| text-secondary | テキストグレー | #333333 |
| accent | ラベル・ボタン・リンク | #4EB0EA |
| highlight | ハイライト | #FBFF92 |
| border | ボーダー | #D7D7D7 |

### フォント

すべてGoogle Fontsの無料フォントで構成する。テーマにバンドル（セルフホスト）し、外部CDNは使用しない（GDPR・パフォーマンス考慮）。`theme.json` の `fontFace[].src` に `file:./assets/fonts/...` 形式で指定。

フォントは後から差し替え可能。`theme.json` のフォント定義を変更すればサイト全体に反映される。デザイナーの判断で有料フォント（Futura PT、花とちょうちょ）に変更する場合はライセンス取得後に差替。

| slug | フォント | 代替元 | 用途 | ウェイト | ライセンス |
|---|---|---|---|---|---|
| noto-sans-jp | Noto Sans JP | — （変更なし） | 日本語本文 | 100 / 400 / 500 / 700 | SIL OFL（無料） |
| roboto-condensed | Roboto Condensed | — （変更なし） | 英字セクション見出し | 300 / 500 | Apache 2.0（無料） |
| jost | Jost | Futura PTの代替 | 英字サブテキスト | 400 / 500 | SIL OFL（無料） |
| zen-kurenaido | Zen Kurenaido | 花とちょうちょの代替 | 手書き風装飾 | 400 | SIL OFL（無料） |

**代替フォントの選定根拠：**
- **Jost** — 1920年代ドイツのサンセリフに着想を得た幾何学的書体。Futura PTと同じ設計思想を持ち、最も近いプロポーションの無料代替として広く認知されている。バリアブルフォント対応で軽量
- **Zen Kurenaido（ZEN紅道）** — ボールペンで書いたような手書き風日本語フォント。花とちょうちょと同じ「ペン手書き系」のカテゴリで、可読性と手書き感を両立。漢字（JIS第一・第二水準）対応

### フォントサイズスケール

`theme.json` の `settings.typography.fontSizes` にプリセット登録。`fluid` 設定で `clamp()` によるレスポンシブ対応を有効化。

| slug | サイズ | fluid min | fluid max | 用途 |
|---|---|---|---|---|
| xs | 14px | — | — | キャプション・ラベル（固定） |
| sm | 16px | 15px | 16px | 本文 |
| md | 20px | 18px | 20px | リード文 |
| lg | 28px | 24px | 28px | セクション見出し（日本語） |
| xl | 36px | 28px | 36px | ページタイトル |
| 2xl | 70px | 40px | 70px | 英字セクションタイトル |
| hero | 128px | 48px | 128px | FV装飾テキスト |

### レイアウト

| 設定 | 値 |
|---|---|
| contentSize | 840px |
| wideSize | 1100px |
| allowEditing | false |

### エフェクト

ドロップシャドウ（0 2px 2px rgb(153,153,153)）、ボトムボーダーシャドウ（0 1px 0 rgb(171,212,237)）

## 見出し階層（SEO構造）

| レベル | 用途 |
|---|---|
| h1 | ページタイトル（Homeでは「LP制作×広告運用」、下層では「制作実績一覧」等） |
| h2 | セクション見出し（Works / Voice / Service / Profile / Flow / Contact） |
| h3 | セクション内の項目見出し（各Works案件名、各Serviceカード名、Flowの各ステップ名） |
| h4以下 | 使用しない |

英字装飾テキスト（"Works", "Voice"等）はParagraphブロック＋装飾用クラスとして実装。h2はその下の日本語テキストに割り当てる。

## Worksカスタム投稿タイプ設計

### 投稿タイプ

| 設定 | 値 |
|---|---|
| スラッグ | works |
| ラベル | 制作実績 |
| アーカイブ | 有効（/works/） |
| 個別ページ | 有効（/works/{slug}/） |
| REST API / show_in_rest | true（Query Loopで必須） |

### カスタムフィールド（ACF Free版）

無料要件のため、ACF Free版で対応可能な構成にする。ギャラリーフィールド（PRO版機能）は使わず、画像フィールドを複数定義して代替する。

| フィールド名 | 型 | 説明 |
|---|---|---|
| client_name | テキスト | クライアント名 |
| project_title | テキスト | 案件タイトル |
| description | テキストエリア | 案件説明文 |
| mockup_main | 画像 | メインモックアップ画像 |
| mockup_2〜mockup_5 | 画像 | サブモックアップ画像（最大4枚） |

### カテゴリラベル（カスタムタクソノミー）

| スラッグ | ラベル名 |
|---|---|
| lp-design | LPデザイン |
| ad-operation | 広告運用 |
| ad-banner | 広告バナー |
| direction | ディレクション |
| design | デザイン |
| lp | LP制作 |

### Homeでのピックアップ表示

Query Loopブロックで `postType: works` を指定。表示件数2件、新着順。

### 下層ページ（LP詳細）のモックアップ画像表示

PC時：横並びレイアウト（メイン1枚大＋サブ4枚小）。スマホ時：横スクロール（Splide.jsでスワイプ対応）。

## カスタムブロック・プラグイン・ライブラリの仕様

### FVモックアップスライダー

Splide.js Auto Scrollエクステンション使用。

| 設定 | 値 |
|---|---|
| type | loop |
| autoScroll.speed | 1（ピクセル/フレーム。約6秒/周期） |
| pauseOnHover / pauseOnFocus | true（アクセシビリティ準拠） |
| drag | free |
| arrows / pagination | false |
| gap | 1rem |
| perPage | 3（PC）/ 2（タブレット）/ 1（スマホ） |
| reducedMotion | 自動対応（prefers-reduced-motion検知） |

### Voiceカルーセル

| 設定 | 値 |
|---|---|
| type | loop |
| autoplay | true |
| interval | 8000（8秒） |
| speed | 600（トランジション速度ms） |
| pauseOnHover / pauseOnFocus | true |
| arrows / pagination | true（左右矢印＋ドットナビ） |
| perPage | 1 |
| drag | true（スワイプ対応） |

### Contactフォーム

| 項目 | 設定 |
|---|---|
| 必須項目 | お名前・メールアドレス・お問合せ内容 |
| 任意項目 | 会社名 |
| プライバシーポリシー | チェックボックス必須 |
| 送信先 | サイト管理者メールアドレス |
| 完了時 | サンクスメッセージ表示（画面遷移なし、Ajax送信） |

## 利用プラグイン・ライブラリ一覧

すべて無料。

| 名称 | 用途 | ライセンス | 費用 |
|---|---|---|---|
| WordPress | CMS本体 | GPLv2 | 無料 |
| Create Block Theme | テーマ雛形生成・フォント管理 | GPLv2 | 無料 |
| Contact Form 7 | お問合せフォーム | GPLv2 | 無料 |
| ACF（Free版） | カスタムフィールド管理 | GPLv2 | 無料 |
| Splide.js v4 | カルーセル・スライダー | MIT | 無料 |
| Splide.js Auto Scroll | FVの連続スクロール | MIT | 無料 |
| Noto Sans JP | 日本語本文フォント | SIL OFL | 無料 |
| Roboto Condensed | 英字見出しフォント | Apache 2.0 | 無料 |
| Jost | 英字サブテキストフォント | SIL OFL | 無料 |
| Zen Kurenaido | 手書き風装飾フォント | SIL OFL | 無料 |

## レスポンシブ対応

WordPressブロックテーマにはネイティブのブレイクポイント制御がない。fluid設計を基本とし、不足箇所のみカスタムCSSで補う。

- **フルード設計** — `theme.json` の `fluid` フォントサイズ（`clamp()`）でビューポートに応じた滑らかな変化
- **Columnsブロック** — 「Stack on mobile」ONでモバイル時自動縦積み
- **カスタムCSS** — Navigation切替ブレイクポイント、FVモックアップサイズ調整のみ

| デバイス | 幅 |
|---|---|
| PC | 1025px以上 |
| タブレット | 782px〜1024px |
| スマホ | 781px以下 |

## 編集体験の設計

- Patternでレイアウト構造をロック
- 編集可能な範囲をテキスト・画像に限定
- `theme.json` でカラー・フォントの選択肢をプリセットのみに制限
- `layout.allowEditing: false` でレイアウト幅変更を防止
- FVモックアップ画像は管理画面から差替可能にする

## 画像アセット

- フォーマット：JPEG/PNGをそのまま使用
- 遅延読み込み：WordPress標準の `loading="lazy"` が自動付与
- モックアップ画像サイズ：Figma原寸を使用し、WordPress側でリサイズ

## 入力データの役割

| 入力 | ファイル | 用途 |
|---|---|---|
| デザイン画像 | design/*.png, images/sec*.jpg | レイアウト再現の参照元 |
| Figma JSON | structures/*.json | デザイントークン抽出＋ブロック構造の設計根拠 |
| 画像アセット | images/*.jpg, images/*.png | テーマアセット |

## 開発フロー

1. 環境構築 — Localでローカル環境を用意
2. テーマ雛形生成 — Create Block Themeで初期構造作成
3. フォント準備 — Noto Sans JP / Roboto Condensed / Jost / Zen KurenaidoをGoogle Fontsからダウンロードし、テーマにバンドル
4. theme.json — デザイントークン（カラー・フォント・フォントサイズ・レイアウト）定義
5. カスタム投稿タイプ — Works＋タクソノミー＋カスタムフィールド登録
6. テンプレートパーツ — Header / Footer作成
7. templates — front-page / archive-works / single-works作成
8. patterns — FV / Works / Voice / Service / CTA / Profile / Flow / Contact（8パターン）
9. Splide.js組込 — FV（Auto Scroll）/ Voice / LP詳細モックアップ横スクロール
10. フォーム — Contact Form 7でお問合せフォーム構築
11. レスポンシブ調整 — 3デバイスで表示確認
12. SEO確認 — 見出し階層・テキスト実装の検証
13. デプロイ

## AI活用

人が設計（構造・編集体験）を決め、AIがコードを生成する。theme.json生成、ブロックマークアップ、Patternコード生成が活用ポイント。小さく指示し、差分で修正する反復前提の運用。

## フォント差替ガイド（将来の有料フォント移行時）

`theme.json` のフォント定義を差し替えるだけでサイト全体に反映される。テンプレートやパターンの修正は不要。

| 現在（無料） | 差替先（有料） | 必要なもの |
|---|---|---|
| Jost | Futura PT | Webフォントライセンス（$39〜/スタイル、MyFonts/Fontspring）。フォントファイルを `assets/fonts/` に配置し、`theme.json` のfontFamilies定義を変更 |
| Zen Kurenaido | 花とちょうちょ | 購入（¥13,200、デザインポケット）。**ただしWebフォント利用はライセンスで禁止**。使用箇所を画像化するか、作者に個別許諾を確認する必要あり |

## 制約

- FVモックアップのループアニメーションとVoiceカルーセルは標準ブロックでは実現不可 → Splide.jsをテーマに組込
- お問合せフォームは標準ブロックでは送信処理不可 → Contact Form 7使用
- WordPressブロックテーマにネイティブのブレイクポイント制御はない → fluid設計＋最小限のカスタムCSSで対応
- カスタムフィールドの表示にはACF等のプラグインが必要（Query Loopブロック単体ではカスタムフィールド値を表示できない）
- ACF Free版ではギャラリーフィールドが使えない → 画像フィールド×5で代替
- タブレット・スマホデザインはFigma上にないため、標準ブロックの折り返し挙動をベースに調整
