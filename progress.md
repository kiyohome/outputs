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

**要件定義レビュー中** — PR #12 で `requirements.md` のコメント対応済み、再レビュー待ち

### 全体の進め方（このPRで完結）

1. **要件定義** — `requirements.md` の各項目を ✅/❌/❓ で確定（PR レビュー）
2. **設計** — 実現方法（AHK / Karabiner / HHKB キーマップ）を決定し設計書を作成
3. **セットアップ手順** — 設定ファイル（`.ahk`, `.json`）と手順書を作成

---

## Next Tasks

1. **要件定義レビュー**：PR #12 で `requirements.md` を確定する
2. **設計**：要件確定後、設計書を作成（実現方法・キー割り当て）
3. **設定ファイル作成**：`emacs-keybind.ahk`、`hhkb-emacs-keybindings.json`
4. **手順書作成**：セットアップ手順を `hhkb-keybinding-design.md` に記述

## Session Context

- 作業ブランチ: worktree-keybind
- PR: https://github.com/lovaizu/outputs/pull/12
- 要件ファイル: `cross-platform-key-bindings-with-hhkb/requirements.md`
- 成果物（作成予定）:
  - `cross-platform-key-bindings-with-hhkb/hhkb-keybinding-design.md`
  - `cross-platform-key-bindings-with-hhkb/hhkb-emacs-keybindings.json`
  - `cross-platform-key-bindings-with-hhkb/emacs-keybind.ahk`
