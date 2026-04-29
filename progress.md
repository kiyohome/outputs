# Progress

## Original Intent

> MacでCmdをスペースの左横に配置したいです。
> MacだとCmdを色々使うので、現状の一部Opt->Cmd切り替えでは不便でした。
> 影響範囲を調べて、どうするか検討したい。

## Current Phase

設計確定。実装待ち。

## Key Decisions

### 方針：HHKBのMacプロファイルでOpt↔Cmdをスワップする

**根拠：**
- M-f/b/d（単語移動）は日本語入力のためほぼ使わない → スワップのデメリットなし
- M-w（コピー）はreadline/cmuxでKarabiner除外のため元々動かない → 変わらず
- cmux（Ghosttyベースのターミナル）ではOptはほぼ機能していない
- Win/Mac対称性より、MacでのCmd操作性を優先

### VS Code：CmdをMetaキーにする

`emacs-mcx.useMetaPrefixMacCmd: true` を設定する。

**根拠：**
- Awesome Emacs Keymapはpure keymapではなくTypeScript製Emacsエンジン
- `meta+` トークンをランタイムで解決する仕組みを持つ
- Ctrl+S = isearch（Windows/Mac共通）、Save = Ctrl+X Ctrl+S
- Cmd=MetaにしてもWindows（Alt=Meta）と完全に対応する構造になる
- Cmd+F（Find）はCmdをMetaにすると使えなくなるが、C-sで代替済み（Windows同様）

### cmuxについて

- cmux = Ghosttyのlibghosttyベースの macOS ネイティブターミナル（2026年2月公開）
- `~/.config/ghostty/config` をそのまま使う
- tmuxではないのでtmux copy modeはなし
- Karabiner除外リストに追加が必要（bundle IDは要確認）

## 変更内容（未実施）

| # | 対象 | 変更内容 |
|---|------|---------|
| 1 | HHKBキーマップツール（手動） | Macプロファイル：Opt↔Cmdスワップ |
| 2 | VS Code settings.json | `"emacs-mcx.useMetaPrefixMacCmd": true` を追加 |
| 3 | Karabiner JSON | Opt+Tab→Cmd+Tab / Opt+Space→Cmd+Space / Opt+Q→Cmd+Q の3ルールを削除 |
| 4 | Ghostty/cmux config | `macos-option-as-alt = left` → `right` に変更 |
| 5 | Karabiner JSON | cmuxをEmacs除外アプリリストに追加（bundle ID要調査） |
| 6 | hhkb-keybinding-design.md | 設計ドキュメント更新 |

## 影響まとめ（スワップ後）

| 領域 | 変化 | 対応 |
|------|------|------|
| Karabiner Opt+Tab/Space/Q | 不要になる | 削除 |
| Emacs M-w（VS Code） | Cmd+W（左手）で動く | useMetaPrefixMacCmd: true |
| Emacs M-w（一般アプリ） | 右Opt+W。Karabiner→Cmd+C | ルールはそのまま（右Optが発火） |
| Emacs M-f/b/d | 右Opt（ほぼ使わない） | 問題なし |
| Ghostty/cmux readline | `macos-option-as-alt = right` | config変更 |
| VS Code検索 | Ctrl+S (isearch)。Cmd+Fは使えなくなる | Windows同様で問題なし |
| VS Code保存 | Ctrl+X Ctrl+S。Cmd+Sは使えなくなる | Windows同様 |

## Next Tasks（優先順）

1. cmuxのbundle IDを調べる
2. Karabiner JSONを更新（3ルール削除 + cmux除外追加）
3. Ghostty/cmux config更新（`macos-option-as-alt = right`）
4. VS Code settings.json更新（useMetaPrefixMacCmd: true）
5. HHKBキーマップツールでMacプロファイルを手動変更（ユーザーが実施）
6. hhkb-keybinding-design.md更新

## Session Context

- 作業ブランチ: main（worktree: keybind）
- 対象ファイル:
  - `cross-platform-key-bindings-with-hhkb/hhkb-keybinding-design.md`
  - `cross-platform-key-bindings-with-hhkb/hhkb-emacs-keybindings.json`
  - `cross-platform-key-bindings-with-hhkb/emacs-keybind.ahk`
- cmux公式: https://cmux.com / https://github.com/manaflow-ai/cmux
- cmux bundle ID: `com.cmuxterm.app`
- vscode-emacs-mcx: https://github.com/whitphx/vscode-emacs-mcx
