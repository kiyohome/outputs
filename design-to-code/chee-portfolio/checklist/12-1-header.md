# 12.1 Header — チェックリスト

## カンプ画像: `sec01-fv.png` 上端
## スクショ: `e2e/screenshots/task12/top-header.png`

---

## チェック項目

### A. レイアウト・構造（目視確認）

| # | 項目 | カンプ | 現状 | 判定 |
|---|------|--------|------|------|
| A1 | 3カラム構成: ロゴ左 / ナビ中央 / Contactボタン右 | ✓ | ✓ | OK |
| A2 | ヘッダー背景色: 白 | ✓ | ✓ | OK |
| A3 | ヘッダー固定（スクロールしても上部に留まる） | ✓（ユーザー確認） | `position: sticky` | OK（sticky で動作上同等） |

### B. ロゴエリア（実装値確認）

| # | 項目 | カンプ目安値 | 実装値 | 判定 |
|---|------|-------------|--------|------|
| B1 | "Chiaki Itoh" フォント | Jost 系 | Jost (font-family: jost) | OK |
| B2 | "Chiaki Itoh" font-size | 判別不能（カンプ上端で小さい） | 20px (md) | 要確認 |
| B3 | "Chiaki Itoh" font-weight | 判別不能 | 500 | 要確認 |
| B4 | "Chiaki Itoh" color | 水色（accent系） | #4EB0EA (accent) | OK |
| B5 | "Chiaki Itoh" line-height | 判別不能 | 1.3 | 要確認 |
| B6 | "LP Design, Meta Ads" フォント | Jost 系 | Jost (font-family: jost) | OK |
| B7 | "LP Design, Meta Ads" font-size | 判別不能 | 14px (xs) | 要確認 |
| B8 | "LP Design, Meta Ads" font-weight | 判別不能 | 400 | 要確認 |
| B9 | "LP Design, Meta Ads" color | 水色 | #4EB0EA (accent) | OK |
| B10 | カンマ有無 "Design, Meta" vs "Design Meta" | 判別不能（文字が小さすぎる） | カンマあり | 判別不能 |

### C. ナビゲーション（実装値確認）

| # | 項目 | カンプ目安値 | 実装値 | 判定 |
|---|------|-------------|--------|------|
| C1 | ナビ項目: Home, Works, Voice, Service, Profile | ✓ | ✓ | OK |
| C2 | ナビ font-family | ゴシック系 | Noto Sans JP | OK |
| C3 | ナビ font-size | 判別不能 | 14px (xs) | 要確認 |
| C4 | ナビ font-weight | 判別不能 | 400 | 要確認 |
| C5 | ナビ color | ダーク（#111系） | #111111 (text-primary) | OK |
| C6 | ナビ項目間のスペーシング | 判別不能 | WP navigation デフォルト | 要確認 |

### D. アクティブナビ表示（目視確認 + 新規実装）

| # | 項目 | カンプ | 現状 | 判定 |
|---|------|--------|------|------|
| D1 | 現在セクションのナビリンクに下線表示 | ✓（ユーザー確認: Worksに下線） | scroll-spy.js + CSS実装済 | **OK（実装済）** |
| D2 | スクロールに連動して下線が移動（スクロールスパイ） | ✓（ユーザー確認） | Works→Voice切替確認済 | **OK（実装済）** |
| D3 | 下線のスタイル（色・太さ・位置） | 判別不能（カンプ画像が小さい） | — | 判別不能 |

### E. Contact ボタン（目視確認 + 実装値確認）

| # | 項目 | カンプ目安値 | 実装値 | 判定 |
|---|------|-------------|--------|------|
| E1 | ボタンスタイル | アウトライン（枠線のみ）に見える | アウトライン（transparent bg, 1px solid #111） | **OK（修正済）** |
| E2 | border-radius | pill（50px相当） | 50px | OK |
| E3 | font-size | 判別不能 | 15px | 要確認 |
| E4 | font-weight | 判別不能 | 700 | 要確認 |
| E5 | padding | 判別不能 | 8px 24px | 要確認 |
| E6 | box-shadow | なし | none | **OK（修正済）** |

### F. ヘッダー余白（実装値確認）

| # | 項目 | カンプ目安値 | 実装値 | 判定 |
|---|------|-------------|--------|------|
| F1 | padding-top / bottom | 判別不能 | 19px | 要確認 |
| F2 | padding-left / right | 判別不能 | 80px | 要確認 |

---

## 修正完了

1. **D1/D2: アクティブナビ（スクロールスパイ）** — `scroll-spy.js` 新規作成、CSS `.is-active-nav` 追加。Works/Voice 切替確認済。
2. **E1: Contact ボタン** — 塗りつぶし黒 → アウトライン（`is-style-outline`, transparent bg, 1px solid border）に変更。
3. **E6: box-shadow** — `0 2px 2px rgba(0,0,0,0.2)` → `none` に変更。

## 判別不能まとめ

カンプ画像の上端にヘッダーが小さく写っているため、以下は画像から正確な値を読み取れない:
- フォントサイズ各種（B2, B7, C3, E3）
- font-weight（B3, B8, C4, E4）
- line-height（B5）
- スペーシング（C6, E5, F1, F2）
- 下線のスタイル詳細（D3）
- box-shadow（E6）
- カンマ有無（B10）

---

## エキスパートレビュー

### レビュー1回目

- **見落とし**: なし。カンプのヘッダー上端に見える要素（ロゴ、ナビ5項目、Contactボタン）はすべて網羅。
- **誤読**: なし。
- **分類ミス**: なし。
- **余分な要素**:
  - E6 `box-shadow` — カンプの Contact ボタンに影は見えない。実装の `0 2px 2px rgba(0,0,0,0.2)` はカンプにない可能性 → **ユーザー確認が必要**

### 指摘まとめ（修正必須2件 + ユーザー確認2件）

| # | 内容 | 対応 |
|---|------|------|
| D1/D2 | アクティブナビ（スクロールスパイ + 下線） | **新規実装** |
| E1 | Contact ボタンのスタイル（アウトライン vs 塗りつぶし） | **ユーザー確認** |
| E6 | Contact ボタンの box-shadow | **ユーザー確認** |

→ **ユーザー確認が2件あるため、実装に進む前にユーザーに確認する。**
