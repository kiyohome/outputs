# HHKB Studio クロスOS キーバインド統一 設計ドキュメント

## 1. 背景

### 1.1 目的

HHKB Studioを Windows / Mac の両OSで使用する際に、頻繁に使う操作のキーバインドを可能な限り統一し、OS間の切り替え時のストレスを最小化する。

達成したいこと：
- 全アプリでEmacs風のテキスト編集ができる
- 頻繁に使うショートカットを（別キーでもいいので）統一できる

### 1.2 環境

| 項目 | 詳細 |
|------|------|
| キーボード | HHKB Studio（英語配列） |
| Windows | Windows 11（キーボード設定：英語配列） |
| Mac | MacBook Air M5（英語配列） |
| 接続方法 | Bluetooth / USB で両OS間を切り替え |

### 1.3 登場するキーボード状態

| # | キーボード | OS | HHKBプロファイル | 配列 |
|---|-----------|-----|-----------------|------|
| 1 | Win PC本体 | Windows | ー | 日本語配列（英語キーボードとして設定） |
| 2 | HHKB Studio | Windows | Profile1（Win用） | 英語配列 |
| 3 | Mac PC本体 | Mac | ー | 英語配列 |
| 4 | HHKB Studio | Mac | Profile2（Mac用） | 英語配列 |

HHKBはProfile1/2でキー配置が異なるため（左下Cmd/Optの位置が逆）、OS別に2行に分けている。

### 1.4 アプリ分類

**A. Emacs対応アプリ（テキスト操作を除外）**
- VS Code（Awesome Emacs Keymap）
- Win：Windows Terminal（readline）
- Mac：Ghostty / cmux（readline）

**B. ブラウザ**
- Chrome（Win / Mac共通）

**C. その他一般アプリ**
- Slack、Office等

### 1.5 前提・制約

**OSレベルの構造的制約：**

| 役割 | Windows | Mac |
|------|---------|-----|
| OS修飾キー（コピペ等） | Ctrl | Cmd |
| Emacsコントロール（C-） | Ctrl | Ctrl |
| Emacsメタ（M-） | Alt | Option |
| アプリ切り替え | Alt+Tab | Cmd+Tab |

核心的な問題：WinではCtrl、MacではCmdとなる操作群で、同じ物理キーで実行できない。vanilla Macではフルキーボードの⌘Cmdが右下のみで左親指から遠い。HHKBのMacプロファイルでCmdをスペース左に配置することでこれを解消している（3.4参照）。

**macOSデフォルトのEmacs対応状況：**

- 移動系（C-a/e/f/b/n/p）、C-k、C-h、C-d → 効く
- C-Space、C-w、M-w、C-y → 効かない（マーク選択・コピペ系は非対応）

---

## 2. 要件と決定理由

### 2.1 スコープ

**対象：** HHKB Studio（Win）と HHKB Studio（Mac）の操作統一（上記 #2, #4）

**スコープ外：** PC本体キーボード（#1, #3）はデフォルト設定 ＋ CapsLock→Ctrl のみ。

**決定理由：** 日頃はHHKBを使用する。PC本体はデフォルトのままにしておけば、見た目通りの操作で迷わない。

### 2.2 統一したい操作

#### 2.2.1 テキスト編集（Emacs系）

全アプリでEmacs風のテキスト編集を実現する。kill-ringはシステムクリップボード経由で代替する。

| 操作 | キー | 実装 |
|------|------|------|
| 移動 | C-a / C-e / C-f / C-b / C-n / C-p | カーソルキーに変換 |
| 単語単位の移動 | M-f / M-b | Ctrl+→ / Ctrl+← (Win)、Opt+→ / Opt+← (Mac) に変換。マーク中はShift付加 |
| 行末まで削除 | C-k | Shift+End → クリップボードにカット（C-yで戻せる） |
| Delete | C-d | Deleteキーに変換 |
| 単語削除 forward | M-d | Ctrl+Delete (Win)、Shift+Opt+→→Delete (Mac、クリップボード非汚染) |
| 単語削除 backward | M-DEL | Ctrl+Backspace (Win)、Opt+Backspace (Mac、OS標準) |
| undo | C-/ | Ctrl+Z (Win) / Cmd+Z (Mac)。マーク状態もクリア |
| redo | C-? (C-Shift+/) | Ctrl+Shift+Z (Win) / Cmd+Shift+Z (Mac)。マーク状態もクリア |
| マーク開始 | C-Space | マーク状態ON（移動でShift付加） |
| マーク解除 | C-g | マーク状態OFF + 選択解除（マーク中のみ、マーク外はパススルー） |
| コピー | M-w | システムクリップボードにコピー |
| ペースト | C-y | システムクリップボードからペースト |
| カット | C-w | システムクリップボードにカット |

**決定理由：**
- OS標準のコピペ（Ctrl+C/V/X、Cmd+C/V/X）はOSごとに物理キーが異なるため統一が困難。Emacs系コピペで統一すればOS差分を吸収できる。
- kill-ringの再現は一般アプリでは不可能。既存のEmacs-everywhere系プロジェクト（EWOW、emacs-everywhere等）も同様にシステムクリップボード経由を採用している。
- C-kもクリップボード経由（Shift+End → カット）にすることで、C-k → C-yの流れが一貫する。

#### 2.2.2 アプリ起動/切り替え

| 操作 | 統一キー | 理由 |
|------|---------|------|
| アプリ切り替え | Cmd+Tab (Mac) / Alt+Tab (Win) | MacはHHKBキーマップでCmdが左親指位置にあるためCmd+Tab（→3.4）。WinはAlt+Tabでデフォルト動作。 |
| アプリ起動 | Cmd+Space (Mac) / Alt+Space (Win) | MacはHHKBキーマップのCmd+SpaceがSpotlight（→3.4）。WinはAHKでAlt+Space→Win+S（検索）。 |
| アプリ終了 | Cmd+Q (Mac) / Alt+Q (Win) | MacはHHKBキーマップのCmd+Qが標準終了（→3.4）。WinはAHKでAlt+Q→Alt+F4。 |

#### 2.2.3 ブラウザ操作（Chrome）

| 操作 | 統一キー | 覚え方 |
|------|---------|--------|
| タブ切り替え | Ctrl+Tab | デフォルトのまま |
| 新タブで開く | Ctrl+Click | デフォルト（Win） |
| 新タブ | Ctrl+T | デフォルト（Win） |
| URL選択 | Ctrl+L | デフォルト（Win） |
| ページ更新 | Ctrl+R | デフォルト（Win）。Reload。 |
| タブを閉じる | Ctrl+J | Junk（いらないタブを捨てる） |
| ブックマーク | Ctrl+I | Important（大事なページを保存） |

**Ctrl+J / Ctrl+I の理由：** デフォルトのCtrl+W（タブを閉じる）とCtrl+D（ブックマーク）はEmacsのC-w（カット）とC-d（Delete）と衝突する。AHK/KarabinerがCtrl+W/Ctrl+Dを変換するため、Chromeにはこれらのキーが届かない。

#### 2.2.4 スクリーンショット

| 操作 | 統一キー | Win | Mac |
|------|---------|-----|-----|
| 範囲選択→クリップボードにコピー | Fn+`` ` `` | HHKB Fn1層（Print Screen割り当て） | HHKB Fn1層＋Karabiner |

**Mac の仕組み：** HHKBのMacプロファイルFn1層`` ` ``にPrint Screenを割り当て。macOS自体はPrint Screenを無視するが、KarabinerがkeycodeをキャッチしてCmd+Ctrl+Shift+4（範囲選択→クリップボード）に変換する。

#### 2.2.5 IME切り替え

かな／英数キーで両OS対応。Ctrl+SpaceにはIMEを割り当てない。

---

## 3. 設計と決定理由

### 3.1 全体方針：3レイヤー構成

| レイヤー | 役割 | 方針 |
|---------|------|------|
| 1. HHKBキーマップ | 物理キー配置 | セットアップ時に設定、以後変更なし |
| 2. AHK / Karabiner | OS横断の共通ルール | アプリ起動/切り替え、テキスト編集、ブラウザ操作変換 |
| 3. アプリ個別設定 | アプリ側の設定 | VS Code、Ghostty |

**決定理由：**
- HHKBをハードウェアレイヤーとして固定 → HHKBのプロファイル管理がシンプル。
- レイヤー2でOS横断ルール → アプリごとの条件分岐が可能。
- レイヤー3でアプリ固有の設定をアプリ側で行う → AHK/Karabinerの設定がシンプルになる。

### 3.2 AHK / Karabiner の適用ルール

| 種類 | 対象アプリ | 除外アプリ |
|------|----------|----------|
| テキスト操作（Emacs） | 全アプリ | VS Code、Windows Terminal、Ghostty、cmux、Terminal.app |
| ブラウザ操作 | Chromeのみ | ー |

**Mac アプリ起動/切り替えについて：** HHKBのMacプロファイルでスペース左にCmdを配置しているため、Cmd+Tab/Space/QはHHKBハードウェアから直接送出される。Karabinerは関与しない。

**Karabiner-Elementsの適用条件：**
- HHKB接続時のみ適用する（デバイス別条件、vendor_id: 1278, product_id: 22）。Mac本体キーボードには影響させない。
- テキスト操作はEmacs対応アプリを除外する（`frontmost_application_unless`）。

**除外の理由：**
- VS Code：Awesome Emacs Keymapが処理（独自kill-ring持ち）。
- ターミナル系：readlineが処理（独自kill-ring持ち）。C-k → C-yのkill & yankがreadline内で完結する。
- AHK/Karabinerが介入するとreadlineのkill-ringと競合するため除外。

### 3.3 対応状況マトリクス

#### 3.3.1 テキスト編集（Emacs系）

| 操作 | キー | Win: VS Code | Win: Terminal | Win: Chrome | Win: 一般 | Mac: VS Code | Mac: Ghostty | Mac: Chrome | Mac: 一般 |
|---|---|---|---|---|---|---|---|---|---|
| 移動 | C-a/e/f/b/n/p | ✅拡張 | ✅readline | ✅AHK | ✅AHK | ✅拡張 | ✅readline | ✅OS標準 | ✅OS標準 |
| 単語移動 | M-f / M-b | ✅拡張 | ✅readline | ✅AHK | ✅AHK | ✅拡張 | ✅readline | ✅Karabiner | ✅Karabiner |
| kill-line | C-k | ✅拡張 | ✅readline | ✅AHK | ✅AHK | ✅拡張 | ✅readline | ✅Karabiner | ✅Karabiner |
| Delete | C-d | ✅拡張 | ✅readline | ✅AHK | ✅AHK | ✅拡張 | ✅readline | ✅OS標準 | ✅OS標準 |
| 単語削除 fwd | M-d | ✅拡張 | ✅readline | ✅AHK | ✅AHK | ✅拡張 | ✅readline | ✅Karabiner | ✅Karabiner |
| 単語削除 back | M-DEL | ✅拡張 | ✅readline | ✅AHK | ✅AHK | ✅拡張 | ✅readline | ✅OS標準 | ✅OS標準 |
| undo | C-/ | ✅拡張 | ー（※） | ✅AHK | ✅AHK | ✅拡張 | ー（※） | ✅Karabiner | ✅Karabiner |
| redo | C-? | ✅拡張 | ー（※） | ✅AHK | ✅AHK | ✅拡張 | ー（※） | ✅Karabiner | ✅Karabiner |
| マーク | C-Space | ✅拡張 | ✅readline | ✅AHK | ✅AHK | ✅拡張 | ✅readline | ✅Karabiner | ✅Karabiner |
| マーク解除 | C-g | ✅拡張 | ー（※） | ✅AHK | ✅AHK | ✅拡張 | ー（※） | ✅Karabiner | ✅Karabiner |
| コピー | M-w | ✅拡張 | ー（※） | ✅AHK | ✅AHK | ✅拡張 | ー（※） | ✅Karabiner | ✅Karabiner |
| ペースト | C-y | ✅拡張 | ✅readline | ✅AHK | ✅AHK | ✅拡張 | ✅readline | ✅Karabiner | ✅Karabiner |
| カット | C-w | ✅拡張 | ー（※） | ✅AHK | ✅AHK | ✅拡張 | ー（※） | ✅Karabiner | ✅Karabiner |

※ ターミナルではreadlineデフォルトの操作を使う。M-w（copy-region-as-kill）はreadlineデフォルトでunbound。C-w（unix-word-rubout）は単語削除。C-gはabort。C-/はreadlineのundo。C-?は未対応。範囲コピーが必要な場合はCmd+C/Cmd+Vで対応。

#### 3.3.2 アプリ起動/切り替え

| 操作 | Win キー | Mac キー | Win | Mac |
|---|---|---|---|---|
| アプリ切り替え | Alt+Tab | Cmd+Tab | ✅デフォルト | ✅HHKBキーマップ |
| アプリ起動 | Alt+Space | Cmd+Space | ✅AHK | ✅HHKBキーマップ（Spotlight） |
| アプリ終了 | Alt+Q | Cmd+Q | ✅AHK | ✅HHKBキーマップ（Cmd+Q標準） |

#### 3.3.3 スクリーンショット

| 操作 | キー | Win | Mac |
|---|---|---|---|
| 範囲選択→クリップボード | Fn+`` ` `` | ✅HHKB Fn1層（Print Screen） | ✅HHKBFn1層＋Karabiner |

#### 3.3.4 ブラウザ操作（Chromeのみ）

| 操作 | 統一キー | Win: Chrome | Mac: Chrome |
|---|---|---|---|
| タブ切り替え | Ctrl+Tab | ✅ | ✅ |
| 新タブで開く | Ctrl+Click | ✅ | ✅Karabiner |
| 新タブ | Ctrl+T | ✅ | ✅Karabiner |
| URL選択 | Ctrl+L | ✅ | ✅Karabiner |
| ページ更新 | Ctrl+R | ✅デフォルト | ✅Karabiner |
| タブを閉じる | Ctrl+J | ✅AHK | ✅Karabiner |
| ブックマーク | Ctrl+I | ✅AHK | ✅Karabiner |

### 3.4 レイヤー別の対応内容

#### レイヤー1：HHKBキーマップ

HHKBキーマップツールで以下のように設定する。Win/Macプロファイルで左下キー配置が異なる。

**Winプロファイル（Profile1）標準レイヤー 左下の物理配置：**
```
[Control] ..... [Fn1] [Alt] [  Space  ] [かな] [⌘Win]
```

**Macプロファイル（Profile2）標準レイヤー 左下の物理配置：**
```
[Control] ..... [Fn1] [Cmd] [  Space  ] [かな] [Opt]
```

MacはCmdを多用するため、スペース左（左下2番目）にCmdを配置して左親指でCmd操作できるようにする。Emacs M-f/b/dはほぼ使わない（日本語入力のため）ため、Optが右下になるデメリットは無視できる。

**Win/Mac共通：**
- 右上：BS
- Fn1レイヤー：動画（https://www.youtube.com/watch?v=b90-wQWsETE）の設定に準拠
- Fn1層 `` ` `` → Print Screen

**IME切り替え：** かな／英数キーで対応。Ctrl+SpaceにはIMEを割り当てない。

#### レイヤー2：AHK / Karabiner

**Mac（Karabiner-Elements）：**

| 変換ルール | 条件 |
|-----------|------|
| Print Screen → Cmd+Ctrl+Shift+4（範囲選択→クリップボード） | HHKB接続時、全アプリ |
| Ctrl+Click → Cmd+Click | HHKB接続時、Chromeのみ |
| Ctrl+T → Cmd+T | HHKB接続時、Chromeのみ |
| Ctrl+L → Cmd+L | HHKB接続時、Chromeのみ |
| Ctrl+R → Cmd+R | HHKB接続時、Chromeのみ |
| Ctrl+J → Cmd+W | HHKB接続時、Chromeのみ |
| Ctrl+I → Cmd+D | HHKB接続時、Chromeのみ |
| C-Space → マーク状態ON | HHKB接続時、Emacs対応アプリ除外 |
| C-g → マーク状態OFF + 右矢印（選択解除） | HHKB接続時、Emacs対応アプリ除外、マーク中のみ |
| Opt+W → Cmd+C | HHKB接続時、Emacs対応アプリ除外 |
| C-y → Cmd+V | HHKB接続時、Emacs対応アプリ除外 |
| C-w → Cmd+X | HHKB接続時、Emacs対応アプリ除外 |
| C-k → Shift+End → Cmd+X | HHKB接続時、Emacs対応アプリ除外 |
| C-d → Delete | HHKB接続時、Emacs対応アプリ除外 |
| C-/ → Cmd+Z（マーク解除付き） | HHKB接続時、Emacs対応アプリ除外 |
| C-Shift+/ → Cmd+Shift+Z（マーク解除付き） | HHKB接続時、Emacs対応アプリ除外 |
| Opt+F → Opt+→（マーク中は Shift+Opt+→） | HHKB接続時、Emacs対応アプリ除外 |
| Opt+B → Opt+←（マーク中は Shift+Opt+←） | HHKB接続時、Emacs対応アプリ除外 |
| Opt+D → Shift+Opt+→ → Delete（クリップボード非汚染） | HHKB接続時、Emacs対応アプリ除外 |

**Win（AutoHotKey v2）：**

| 変換ルール | 条件 |
|-----------|------|
| Alt+Space → Win+S | 全アプリ |
| Alt+Q → Alt+F4 | 全アプリ |
| Ctrl+A → Home | Emacs対応アプリ除外 |
| Ctrl+E → End | Emacs対応アプリ除外 |
| Ctrl+F → → | Emacs対応アプリ除外 |
| Ctrl+B → ← | Emacs対応アプリ除外 |
| Ctrl+N → ↓ | Emacs対応アプリ除外 |
| Ctrl+P → ↑ | Emacs対応アプリ除外 |
| Ctrl+K → Shift+End → Ctrl+X | Emacs対応アプリ除外 |
| Ctrl+D → Delete | Emacs対応アプリ除外 |
| Ctrl+Space → マーク状態ON | Emacs対応アプリ除外 |
| Ctrl+G → マーク状態OFF + 右矢印（選択解除） | Emacs対応アプリ除外、マーク中のみ |
| Alt+W → Ctrl+C | Emacs対応アプリ除外 |
| Ctrl+Y → Ctrl+V | Emacs対応アプリ除外 |
| Ctrl+W → Ctrl+X | Emacs対応アプリ除外 |
| Ctrl+/ → Ctrl+Z（マーク解除付き） | Emacs対応アプリ除外 |
| Ctrl+Shift+/ → Ctrl+Shift+Z（マーク解除付き） | Emacs対応アプリ除外 |
| Alt+F → Ctrl+→（マーク中は Ctrl+Shift+→） | Emacs対応アプリ除外 |
| Alt+B → Ctrl+←（マーク中は Ctrl+Shift+←） | Emacs対応アプリ除外 |
| Alt+D → Ctrl+Delete | Emacs対応アプリ除外 |
| Alt+Backspace → Ctrl+Backspace | Emacs対応アプリ除外 |
| Ctrl+J → Ctrl+W | Chromeのみ |
| Ctrl+I → Ctrl+D | Chromeのみ |

**除外アプリ一覧（テキスト操作のみ除外）：**
- VS Code（`Code.exe` / `com.microsoft.VSCode`）
- Windows Terminal（`WindowsTerminal.exe`）
- Ghostty（`com.mitchellh.ghostty`）
- cmux（`com.cmuxterm.app`）
- Terminal.app（`com.apple.Terminal`）

#### レイヤー3：アプリ個別設定

| アプリ | 対応内容 |
|-------|---------|
| VS Code | `"emacs-mcx.useMetaPrefixMacCmd": true` を settings.json に追加（CmdをMetaキーとして使用）。Awesome Emacs Keymapが M-w（Cmd+W）等を正しく処理するようになる。 |
| Mac: Ghostty / cmux | `macos-option-as-alt = right` を設定（Macプロファイルでは右OptがMetaとして機能するため `right` を指定）。cmuxはGhosttyベースで同じ設定ファイル（`~/.config/ghostty/config`）を使用。 |
| ターミナル | readlineデフォルトのまま（.inputrc追加不要） |

---

## 4. セットアップ手順

すべてデフォルト状態から設定する前提の手順。

### 4.1 HHKB Studio のセットアップ

#### 4.1.1 Keymap Tool のインストール

1. https://happyhackingkb.com/download/ から「HHKB Studio キーマップ変更ツール」をダウンロード
   - macOS：`brew install --cask hhkb-studio` でもインストール可能
   - Windows：ダウンロードしたexeを実行してインストール
2. 合わせてHHKB Studio用の最新ファームウェアもダウンロードしておく

#### 4.1.2 ファームウェア更新

1. HHKB StudioをUSBケーブルでPCに接続
2. `Fn + Control + 0` を押してUSB接続モードに切り替え
3. Keymap Toolを起動
4. 「キーボードファームウェア更新」をクリック
5. ダウンロードしたファームウェアファイルを選択し「HHKBへ書込み」をクリック
6. 更新中はキーボードが使用不可になる（約5分）。PCをスリープさせないこと

※ Bluetooth接続ではKeymap Toolは起動不可。必ずUSBケーブルで接続すること。

#### 4.1.3 キーマップの変更

以下の動画の設定に従ってキーマップを変更する：
https://www.youtube.com/watch?v=b90-wQWsETE

設定手順：
1. Keymap Toolで「キーマップ編集」をクリック
2. Profile1（Windows用）を選択し、動画の内容に従って標準レイヤー・Fn1レイヤーを変更
3. 「HHKBへ書込み」で保存
4. Profile2（Mac用）を選択し、同様に設定（左下キーのみProfile1と異なる）
5. 「HHKBへ書込み」で保存

標準レイヤーの設定内容：

**Profile1（Win用）：**
- 左下2キー：Fn1 / Alt
- 右下2キー：かな / ⌘Win
- 右上：BS

**Profile2（Mac用）：**
- 左下2キー：Fn1 / Cmd（スペース左にCmdを配置）
- 右下2キー：かな / Opt
- 右上：BS

Fn1レイヤーや詳細なキー配置は動画を参照のこと。

**Win/Mac共通：Fn1層 `` ` `` → Print Screen**

両プロファイルのFn1レイヤーで `` ` `` キーに Print Screen を割り当てる。MacではKarabinerがPrint Screenをキャッチして範囲スクリーンショット（クリップボード）に変換する。

プロファイルの切り替え：`Fn + Q` で Profile1〜4を順に切り替え。

#### 4.1.4 DIPスイッチ・ジェスチャーパッド

DIPスイッチ、Pointing Stick、ジェスチャーパッドはデフォルトのまま変更なし。

### 4.2 Windows セットアップ

#### 4.2.1 キーボード設定を英語に変更

1. 設定 → 時刻と言語 → 言語と地域
2. 日本語の「...」→ 言語のオプション
3. キーボードの「レイアウトを変更する」をクリック
4. 「英語キーボード（101/102キー）」を選択
5. PCを再起動

#### 4.2.2 スクロール方向をMacに合わせる（ナチュラルスクロール）

Macと同じ方向にスクロールするよう変更する（下に動かすとコンテンツが下に動く）。

**マウス（HHKB Studioのポインティングスティック含む）：**
1. 設定 → Bluetooth & デバイス → マウス
2. 「スクロールの方向」を「Down motion scrolls down」に変更

※ この設定項目はWindows 11 24H2以降で利用可能。表示されない場合はWindows Updateを実行してOSを最新にする。

**タッチパッド（PC本体使用時）：**
1. 設定 → Bluetooth & デバイス → タッチパッド
2. 「スクロールとズーム」をクリック
3. 「スクロールの方向」を「Down motion scrolls down」に変更

#### 4.2.3 IME設定（Ctrl+Spaceの無効化）

1. タスクバーのIMEアイコンを右クリック → 設定
2. キーとタッチのカスタマイズ
3. 「各キーに好みの機能を割り当てる」をオンにする
4. Ctrl+Spaceに「なし」を設定

#### 4.2.4 CapsLock → Ctrl（PC本体キーボード用）

PC本体キーボード使用時の最小設定。レジストリを変更する。

1. 管理者権限でPowerShellを開く
2. 以下を実行：
```powershell
$hexified = "00,00,00,00,00,00,00,00,02,00,00,00,1d,00,3a,00,00,00,00,00".Split(',') | % { "0x$_"}
$kbLayout = 'HKLM:\System\CurrentControlSet\Control\Keyboard Layout'
New-ItemProperty -Path $kbLayout -Name "Scancode Map" -PropertyType Binary -Value ([byte[]]$hexified)
```
3. PCを再起動

#### 4.2.5 AutoHotKey v2 のインストール

1. https://www.autohotkey.com/v2/ からインストーラーをダウンロード
2. ダウンロードしたexeを実行
3. インストールオプションを確認し「Install」をクリック
4. インストール完了後、`.ahk` ファイルをダブルクリックでスクリプトが実行可能になる

#### 4.2.6 AHKスクリプトの作成と配置

1. 任意の場所に `emacs-keybind.ahk` ファイルを配置
2. ファイルをダブルクリックして動作確認
3. 動作確認後、スタートアップに登録して自動起動にする：
   - `Win + R` → `shell:startup` を入力してスタートアップフォルダを開く
   - `emacs-keybind.ahk` のショートカットを作成し、スタートアップフォルダに配置

### 4.3 Mac セットアップ

#### 4.3.1 Karabiner-Elements のインストール

1. https://karabiner-elements.pqrs.org/ からdmgをダウンロード
   - または `brew install --cask karabiner-elements` でインストール
2. dmgを開き、Karabiner-Elements.pkg を実行
3. インストール後、Karabiner-Elementsを起動すると権限設定を求められる。以下を設定：
   - システム設定 → 一般 → ログイン項目と機能拡張：
     - 「アプリのバックグラウンドでのアクティビティ」で「Karabiner-Elements Non-Privileged Agents v2」と「Karabiner-Elements Privileged Daemons v2」をONにする
     - 「機能拡張」（アプリ別）で「.Karabiner-VirtualHIDDevice-Manager」（ドライバ機能拡張）が表示されていることを確認
   - システム設定 → プライバシーとセキュリティ → 入力監視：
     - 「Karabiner-Core-Service」をONにする
     - 「Karabiner-EventViewer」をONにする
4. キーボードレイアウトの選択で「ANSI」を選択（英語配列）

#### 4.3.2 CapsLock → Ctrl（PC本体キーボード用）

OS側の修飾キー設定ではなく、**Karabiner-ElementsのSimple Modifications**で設定する。Karabinerを使う場合、OSの修飾キーリマップと競合するためKarabiner側に寄せるのが推奨（Karabinerも警告を出す）。

1. システム設定 → キーボード → キーボードショートカット → 修飾キー：「Apple Internal Keyboard」のCaps Lockが「Caps Lock」のまま（デフォルト）であることを確認する。以前Controlに変更していた場合はCaps Lockに戻す。
2. Karabiner-Elements Settingsを開く
3. 「Simple Modifications」タブを開く
4. 「Target Device」のプルダウンで「**Apple Internal Keyboard / Trackpad**」を選択
5. 「Add item」をクリック
6. From key: `caps_lock` 、To key: `left_control` を選択

※ HHKB Studioはファームウェアレベルで既にCapsLock位置がControlのため、本設定はHHKBには影響しない（Target DeviceをApple Internalに限定しているため）。

#### 4.3.3 Karabiner-Elements の設定

**Step 1：HHKB Studioのデバイスを有効化する**

1. HHKB StudioをUSBまたはBluetoothでMacに接続する
2. Karabiner-Elements Settingsを開く（メニューバーのKarabinerアイコン → Settings）
3. 左メニューの「Devices」を開く
4. 「HHKB-Studio1 (PFU Limited)」の「Modify events」をONにする
5. Vendor ID（1278）と Product ID（22）が表示されているので確認する

※ Modify eventsがOFFのままだとKarabinerがHHKBのキー入力を処理しない。

**Step 2：ルールファイルのデバイスIDを確認する**

Step 1で確認したVendor IDとProduct IDが、`hhkb-emacs-keybindings.json` 内の値と一致していることを確認する。一致していない場合はJSON内のすべての `vendor_id` と `product_id` を書き換える。

**Step 3：ルールファイルを配置する**

1. ターミナルで以下を実行し、ディレクトリを作成（存在しない場合）：
```bash
mkdir -p ~/.config/karabiner/assets/complex_modifications/
```
2. `hhkb-emacs-keybindings.json` を上記ディレクトリにコピー：
```bash
cp hhkb-emacs-keybindings.json ~/.config/karabiner/assets/complex_modifications/
```

**Step 4：ルールを有効化する**

1. Karabiner-Elements Settingsを開く
2. 「Complex Modifications」タブを開く
3. 「Add predefined rule」をクリック
4. 「HHKB Studio Emacs Keybindings」配下にルールが一覧表示される
5. 各ルールの「Enable」をクリックして有効化する（すべて有効にする）

**Step 5：動作確認**

1. HHKB Studioが接続されている状態でChromeを開く
2. テキスト入力欄で C-Space → C-f → M-w でマーク→移動→コピーが動くことを確認
3. C-y でペーストが動くことを確認
4. C-g でマーク解除されることを確認
5. VS Code、Ghostty、cmuxではルールが発動しないことを確認（除外アプリ）
6. HHKBのCmd+Tab でアプリ切り替えが動くことを確認（MACプロファイルのCmd配置確認）

※ JSONファイルを修正した場合は、Complex Modificationsタブで該当ルールを「🗑（ゴミ箱アイコン）」で削除してから、再度Step 3〜4を行う。

#### 4.3.4 Ghostty のインストールと設定

1. https://ghostty.org/ からGhosttyをダウンロードしてインストール
   - または `brew install --cask ghostty` でインストール
2. Ghosttyを起動
3. メニューバーから Ghostty → Settings... を選択（設定ファイルがエディタで開く）
4. 以下の設定を追加/変更して保存（MACプロファイルでは右OptがMetaとして機能するため `right` を指定）：
```
macos-option-as-alt = right
```
5. Ghosttyウィンドウをクリックし、メニューバーから Ghostty → Reload Configuration を選択

※ cmuxはGhosttyのlibghosttyベースのため、同じ設定ファイル（`~/.config/ghostty/config`）が適用される。cmux用に別途設定不要。

#### 4.3.5 VS Code の設定（Mac）

VS CodeでCmdキーをMetaとして認識させる（MACプロファイルではCmdがスペース左に配置されているため）。

1. VS Codeを開く
2. `Cmd+Shift+P` → 「Open User Settings (JSON)」を選択
3. 以下を追加して保存：
```json
"emacs-mcx.useMetaPrefixMacCmd": true
```

これにより Awesome Emacs Keymap が `Cmd+W` を `M-w`（コピー）として処理する。Cmd+F（検索）は使えなくなるが、Ctrl+S（isearch）で代替（Windows同様）。

### 4.4 確認チェックリスト

セットアップ完了後、以下の操作が正しく動くことを確認する。

**テキスト編集（Chromeのテキスト入力欄で確認）：**
- [ ] C-a / C-e：行頭・行末に移動
- [ ] C-f / C-b：右・左に移動
- [ ] C-n / C-p：下・上に移動
- [ ] M-f / M-b：単語右・左に移動
- [ ] C-k：行末まで削除（クリップボードに入る）
- [ ] C-y：ペースト（C-kで削除したものが戻る）
- [ ] C-d：一文字削除
- [ ] M-d：単語削除 forward（クリップボードを汚さない）
- [ ] M-DEL：単語削除 backward
- [ ] C-/：undo
- [ ] C-?（C-Shift+/）：redo
- [ ] C-Space → C-f → M-w：マーク→移動→コピー
- [ ] C-y：ペースト
- [ ] C-Space → C-f → C-w：マーク→移動→カット
- [ ] C-Space → M-f → M-d：マーク→単語移動→kill-word
- [ ] C-g：マーク解除（選択が外れる）

**アプリ起動/切り替え：**
- [ ] Win: Alt+Tab / Mac: Cmd+Tab（左親指）：アプリ切り替え
- [ ] Win: Alt+Space / Mac: Cmd+Space（左親指）：アプリ起動（Win: 検索、Mac: Spotlight）
- [ ] Win: Alt+Q / Mac: Cmd+Q（左親指）：アプリ終了

**ブラウザ操作（Chromeで確認）：**
- [ ] Ctrl+Tab：タブ切り替え
- [ ] Ctrl+T：新タブ
- [ ] Ctrl+L：URL選択
- [ ] Ctrl+R：ページ更新
- [ ] Ctrl+J：タブを閉じる
- [ ] Ctrl+I：ブックマーク
- [ ] Ctrl+Click：リンクを新タブで開く

**スクリーンショット：**
- [ ] Fn+`` ` ``：範囲選択→クリップボードにコピー（Mac: Karabiner経由、Win: Print Screen標準動作）

**除外アプリの確認：**
- [ ] VS Code：Awesome Emacs Keymapの操作が正常（Karabinerが干渉しない）。M-w（Cmd+W）でコピーが動く（useMetaPrefixMacCmd: true）
- [ ] Ghostty / cmux：readlineのC-a/C-e/C-k/C-yが正常（Karabinerが干渉しない）。右OptがMeta（M-f/b等）として動く
