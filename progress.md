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

**要件洗い出し中**（次セッション開始地点）

### 進め方

1. **要件を洗い出す**（実現方法は考えない）
2. 実現方法を検討する
3. 相談して決定する

---

## 次セッションでやること：要件洗い出し

以下の3カテゴリについて、「何をしたいか」を網羅する。実現方法は考えない。

### カテゴリ1：Emacs テキスト操作

「普段 Emacs / readline でよく使う操作を全部列挙する」

叩き台（現設計から）：
- 移動: C-a / C-e / C-f / C-b / C-n / C-p
- 単語移動: M-f / M-b
- マーク: C-Space / C-g（解除）
- コピペ: M-w（コピー）/ C-y（ペースト）/ C-w（カット）
- 削除: C-d / C-k / M-d / M-DEL
- undo/redo: C-/ / C-Shift-/

追加候補（ユーザーに確認）：
- C-s（isearch forward）/ C-r（isearch backward）
- C-v（page down）/ M-v（page up）
- C-l（recenter）
- その他、普段 Emacs で使っているもの

### カテゴリ2：ブラウザ操作

「ブラウザで統一したいショートカットを列挙する」

叩き台（現設計から）：
- 新タブ / タブを閉じる / タブ切り替え
- URL バー / ページ更新 / ブックマーク

追加候補（ユーザーに確認）：
- 新ウィンドウ / 戻る / 進む
- その他

### カテゴリ3：アプリ操作

「OS レベルのアプリ操作で統一したいものを列挙する」

叩き台（現設計から）：
- アプリ切り替え / アプリ起動（ランチャー）/ アプリ終了

追加候補（ユーザーに確認）：
- ウィンドウを閉じる / 新規作成
- その他

---

## Next Tasks

1. **要件洗い出し**：上記3カテゴリをユーザーと一緒に確定する
2. 実現方法の検討（要件確定後）
3. 設計・実装（検討後）

## Session Context

- 作業ブランチ: worktree-keybind
- 対象ファイル:
  - `cross-platform-key-bindings-with-hhkb/hhkb-keybinding-design.md`
  - `cross-platform-key-bindings-with-hhkb/hhkb-emacs-keybindings.json`
  - `cross-platform-key-bindings-with-hhkb/emacs-keybind.ahk`
