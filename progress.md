# Progress

## Original Intent

> MacでCmdをスペースの左横に配置したいです。
> MacだとCmdを色々使うので、現状の一部Opt->Cmd切り替えでは不便でした。
> 影響範囲を調べて、どうするか検討したい。

## Current Phase

PR #12 オープン中。レビューコメント対応中（設計ドキュメントの改善）。ユーザーによる手動作業のみ残存。

## Key Decisions

### 方針：HHKBのMacプロファイルでCmdをスペース左に配置する

**根拠：**
- M-f/b/d（単語移動）は日本語入力のためほぼ使わない → デメリットなし
- M-w（コピー）はreadline/cmuxでKarabiner除外のため元々動かない → 変わらず
- cmux（Ghosttyベースのターミナル）ではOptはほぼ機能していない
- Win/Mac対称性より、MacでのCmd操作性を優先

### VS Code：CmdをMetaキーにする

`emacs-mcx.useMetaPrefixMacCmd: true` を設定する。

### ブラウザ操作：Ctrl統一を維持

- Win/Mac共通でCtrlベースのショートカット（Karabiner でCtrl→Cmd変換）
- Ctrl+Click → Cmd+Click はmacOSのOS制約で実現不可。Mac では Cmd+Click を使用
- 該当KarabinerルールはJSONから削除済み

## 変更内容

| # | 対象 | 変更内容 | 状態 |
|---|------|---------|------|
| 1 | HHKBキーマップツール（手動） | Macプロファイル：左下Cmd、右下Opt | ⏳ ユーザー手動 |
| 2 | HHKBキーマップツール（手動） | Win/Mac両プロファイル Fn1層 `` ` `` → Print Screen | ⏳ ユーザー手動 |
| 3 | VS Code settings.json | `"emacs-mcx.useMetaPrefixMacCmd": true` を追加 | ⏳ ユーザー手動 |
| 4 | Ghostty/cmux config | `macos-option-as-alt = right` に設定 | ⏳ ユーザー手動 |
| 5 | Karabiner JSON | Opt+Tab/Space/Q→Cmd の3ルールを削除 | ✅ 完了 |
| 6 | Karabiner JSON | cmux除外アプリリストに追加（bundle ID: com.cmuxterm.app） | ✅ 完了 |
| 7 | Karabiner JSON | Print Screen → Cmd+Ctrl+Shift+4（範囲SS→クリップボード）追加 | ✅ 完了 |
| 8 | Karabiner JSON | Ctrl+Click → Cmd+Click ルール削除（OS制約で動作不可のため） | ✅ 完了 |
| 9 | hhkb-keybinding-design.md | 設計ドキュメント全面改訂（変更履歴排除・まっさら前提・構造整理） | ✅ 完了 |

## ドキュメント改訂の主な内容（このセッションで実施）

- 「追加変更」「スワップ」等の変更履歴的表現をすべて排除
- セクション1.5「HHKBキーマップ設定」を背景から設計（3.4）へ移動
- Win/Macプロファイルのキー配置を並列表示（before/after表を廃止）
- 「現在の」「済み」等の表現を現在形・ゼロベース表現に統一
- 1.3に HHKBプロファイル列を追加（なぜHHKBが2行あるかを明示）
- MacBook Air M4 → M5 修正
- Ctrl+Clickの制約を表内注記に整理

## Next Tasks（残タスク：ユーザー手動作業）

1. **HHKBキーマップツール**：Macプロファイルの左下をCmd、右下をOptに設定
2. **HHKBキーマップツール**：Win/Mac両プロファイルのFn1層 `` ` `` に Print Screen を割り当て
3. **Ghostty / cmux config**：`~/.config/ghostty/config` に `macos-option-as-alt = right` を設定
4. **VS Code settings.json**：`"emacs-mcx.useMetaPrefixMacCmd": true` を追加
5. **Karabiner JSONの再適用**：Complex Modificationsから古いルールを削除し、更新済みJSONを再ロード

## PR

https://github.com/lovaizu/outputs/pull/12（worktree-keybind → main）

レビューコメントへの対応中。追加コメントがあれば対応してマージ待ち。

## Session Context

- 作業ブランチ: worktree-keybind（worktree: /Users/kiyo/work/lovaizu/outputs/.claude/worktrees/keybind）
- 対象ファイル:
  - `cross-platform-key-bindings-with-hhkb/hhkb-keybinding-design.md`
  - `cross-platform-key-bindings-with-hhkb/hhkb-emacs-keybindings.json`
  - `cross-platform-key-bindings-with-hhkb/emacs-keybind.ahk`
- cmux bundle ID: `com.cmuxterm.app`
