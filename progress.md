# Progress

## Original Intent

> MacでCmdをスペースの左横に配置したいです。
> MacだとCmdを色々使うので、現状の一部Opt->Cmd切り替えでは不便でした。
> 影響範囲を調べて、どうするか検討したい。

## 方針転換（仕切り直し）

Cmd/Opt スワップの検討を経て、根本から再設計することに決定。

**新方針：Ctrl/Alt で全操作を統一し、Karabiner（Mac）/AHK（Win）で OS ネイティブに変換する。**

- Karabiner は全アプリに適用（除外なし）
- Win/Mac でできるだけ同一のキー操作を実現する
- Cmd/Opt スワップは行わない（HHKB Mac プロファイルは標準配置）

## Current Phase

**要件整理中**（ゼロベース）

---

## 要件整理

### 対象操作カテゴリ

#### 1. Emacs テキスト操作

現在の設計にあるもの：

| 操作 | キー |
|------|------|
| 移動 | C-a / C-e / C-f / C-b / C-n / C-p |
| 単語移動 | M-f / M-b |
| マーク | C-Space |
| マーク解除 | C-g |
| コピー | M-w |
| ペースト | C-y |
| カット | C-w |
| kill-line | C-k |
| 文字削除 | C-d |
| 単語削除(fwd) | M-d |
| 単語削除(back) | M-DEL |
| undo | C-/ |
| redo | C-Shift-/ |

追加検討中：

| 操作 | キー | 備考 |
|------|------|------|
| isearch forward | C-s | Emacs 標準。OS の保存と衝突 |
| isearch backward | C-r | |
| recenter / scroll | C-l | |
| page down | C-v | |
| page up | M-v | |
| その他 | ? | ユーザーが普段使うもの |

#### 2. ブラウザ操作

現在の設計にあるもの（Chrome）：

| 操作 | キー |
|------|------|
| 新タブ | C-t |
| タブを閉じる | C-j（C-w は Emacs カットと衝突） |
| URL バー | C-l（Emacs C-l と衝突？） |
| ページ更新 | C-r（Emacs C-r と衝突？） |
| ブックマーク | C-i |
| タブ切り替え | C-Tab |

追加検討中：

| 操作 | キー | 備考 |
|------|------|------|
| 新ウィンドウ | C-n？ | Emacs C-n（次行）と衝突 |
| 戻る/進む | ? | |

#### 3. アプリ操作

現在の設計にあるもの：

| 操作 | Win | Mac |
|------|-----|-----|
| アプリ切り替え | Alt+Tab | Cmd+Tab |
| アプリ起動 | Alt+Space | Cmd+Space |
| アプリ終了 | Alt+Q | Cmd+Q |

追加検討中：

| 操作 | キー候補 | 備考 |
|------|---------|------|
| ウィンドウを閉じる | C-w？ | Emacs C-w（カット）と衝突 |
| 新規 | C-n？ | Emacs C-n（次行）と衝突 |

---

## 衝突マップ（整理が必要な箇所）

| キー | Emacs の意味 | ブラウザ/アプリでの意味 |
|------|-------------|----------------------|
| C-s | isearch forward | 保存（Save） |
| C-r | isearch backward | ページ更新（Reload） |
| C-l | recenter | URL バー選択 |
| C-v | page down | ペースト（一般アプリ） |
| C-n | next line | 新規（New） |
| C-w | kill/cut | ウィンドウ/タブを閉じる |
| C-t | ? | 新タブ（New Tab） |

---

## Next Tasks

1. **要件確定**：追加したい操作のリストアップ、衝突の解消方針を決定
2. **設計**：全アプリ統一の Karabiner/AHK ルール設計
3. **実装**：JSON/AHK スクリプト更新
4. **ドキュメント**：設計書全面改訂

## Session Context

- 作業ブランチ: worktree-keybind
- 対象ファイル:
  - `cross-platform-key-bindings-with-hhkb/hhkb-keybinding-design.md`
  - `cross-platform-key-bindings-with-hhkb/hhkb-emacs-keybindings.json`
  - `cross-platform-key-bindings-with-hhkb/emacs-keybind.ahk`
