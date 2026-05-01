# Keybinding Requirements

## How to Review

Mark each operation with one of:

- ✅ 採用
- ❌ 不要
- ❓ 要検討（コメントで条件・代替案を記載）

---

## Category 1: Emacs Text Operations

Operations to be handled by AHK (Windows) and Karabiner (Mac) in all apps except Emacs-native apps (VS Code, terminals).

### 1.1 Cursor Movement — Character / Line

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `C-f` | Move forward one character |
| ✅ | `C-b` | Move backward one character |
| ✅ | `C-n` | Move to next line |
| ✅ | `C-p` | Move to previous line |
| ✅ | `C-a` | Move to beginning of line |
| ✅ | `C-e` | Move to end of line |

### 1.2 Cursor Movement — Word / Page / Buffer

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `M-f` | Move forward one word |
| ✅ | `M-b` | Move backward one word |
| ✅ | `C-v` | Scroll down (page down) |
| ✅ | `M-v` | Scroll up (page up) |
| ✅ | `C-l` | Recenter (scroll so cursor is at center/top/bottom) |
| ✅ | `M-<` | Move to beginning of buffer |
| ✅ | `M->` | Move to end of buffer |
| ❌ | `M-g M-g` | Go to line number — editor-specific, two-key sequence |

### 1.3 Deletion

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `C-d` | Delete character forward |
| ✅ | `DEL` | Delete character backward (Backspace — passthrough) |
| ✅ | `M-d` | Kill word forward |
| ✅ | `M-DEL` | Kill word backward |
| ✅ | `C-k` | Kill to end of line |
| ❌ | `C-S-Backspace` | Kill entire current line — niche, `C-a C-k` covers it |

### 1.4 Mark / Region

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `C-Space` | Set mark (start selection) |
| ✅ | `C-g` | Cancel mark / deselect |
| ❌ | `C-x C-x` | Exchange point and mark — two-key sequence, niche |
| ❌ | `C-x h` | Mark whole buffer — two-key sequence; use OS `Ctrl+A` / `Cmd+A` instead |

### 1.5 Kill / Yank (Copy / Paste / Cut)

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `M-w` | Copy region to clipboard |
| ✅ | `C-w` | Cut region to clipboard |
| ✅ | `C-y` | Paste from clipboard |
| ❌ | `M-y` | Cycle clipboard history (yank-pop) — requires external tool (Clipy / Ditto) |

### 1.6 Undo / Redo

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `C-/` | Undo |
| ✅ | `C-?` (`C-S-/`) | Redo |

### 1.7 Search

| Status | Key | Operation |
|--------|-----|-----------|
| ❓ | `C-s` | Incremental search forward — maps to `Ctrl+F` in most apps, but `C-s` = Save in some |
| ❓ | `C-r` | Incremental search backward — `Ctrl+F` has no backward equivalent in most apps |
| ❌ | `M-%` | Query replace — editor-specific |

### 1.8 Transpose

| Status | Key | Operation |
|--------|-----|-----------|
| ❌ | `C-t` | Transpose characters — niche |
| ❌ | `M-t` | Transpose words — niche |

### 1.9 Case Conversion

| Status | Key | Operation |
|--------|-----|-----------|
| ❌ | `M-u` | Upcase word — editor-specific |
| ❌ | `M-l` | Downcase word — editor-specific |
| ❌ | `M-c` | Capitalize word — editor-specific |

### 1.10 Newline / Indent

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `RET` / `C-m` | Newline (passthrough) |
| ❌ | `C-o` | Open line (insert newline after cursor) — niche |
| ✅ | `TAB` / `C-i` | Indent (passthrough) |

---

## Category 2: Browser Operations (Chrome)

Operations to unify across Win/Mac via AHK / Karabiner.

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `Ctrl+T` | New tab |
| ✅ | `Ctrl+Tab` | Switch to next tab |
| ✅ | `Ctrl+Shift+Tab` | Switch to previous tab |
| ✅ | `Ctrl+J` | Close current tab |
| ✅ | `Ctrl+Shift+T` | Reopen closed tab |
| ✅ | `Ctrl+L` | Focus URL bar |
| ✅ | `Ctrl+R` | Reload page |
| ✅ | `Ctrl+I` | Bookmark current page |
| ❌ | `Ctrl+Click` | Open link in new tab — Mac structural limitation (Ctrl+Click = context menu) |
| ❓ | `Alt+←` / `Alt+→` | Back / Forward — conflicts with `M-b` / `M-f` (word move) |
| ❓ | New window | Open new window — key undecided |

---

## Category 3: App Operations (OS level)

Operations to unify via HHKB keymap (Mac) and AHK (Win).

| Status | Key (Mac) | Key (Win) | Operation |
|--------|-----------|-----------|-----------|
| ✅ | `Cmd+Tab` | `Alt+Tab` | Switch app |
| ✅ | `Cmd+Space` | `Alt+Space` | Launch app (Spotlight / Search) |
| ✅ | `Cmd+Q` | `Alt+Q` | Quit app |
| ❓ | `Cmd+W` | — | Close window / tab — Mac standard; Win equivalent undecided |
| ❓ | `Cmd+N` | — | New window / document — Mac standard; Win equivalent undecided |
| ❌ | `Cmd+Z` / `Cmd+Shift+Z` | `Ctrl+Z` / `Ctrl+Shift+Z` | Undo / Redo — covered by `C-/` / `C-?` in Emacs mode |

---

## Category 4: Screenshot

| Status | Key | Operation | Notes |
|--------|-----|-----------|-------|
| ✅ | `Fn+\`` | Capture region → clipboard | Win: Print Screen via HHKB Fn layer. Mac: Karabiner → Cmd+Ctrl+Shift+4 |
| ❓ | — | Capture full screen → clipboard | Key undecided |
| ❌ | — | Capture window → clipboard | Low frequency; region capture covers it |
| ❌ | — | Capture region → file | Clipboard is sufficient |

---

## Category 5: IME Toggle

| Status | Key | Operation | Notes |
|--------|-----|-----------|-------|
| ✅ | `英数` / `かな` | Toggle IME (En ↔ JP) | HHKB hardware keys, works on both Win/Mac |
| ❌ | `Ctrl+Space` | IME toggle — reserved for Emacs `C-Space` (mark) |  |

---

## Open Questions

1. **`C-s` / `C-r` (search):** Map `C-s` → `Ctrl+F`? `C-r` has no standard reverse-search equivalent in browsers/apps.
2. **Browser back/forward:** `Alt+←/→` conflicts with `M-b`/`M-f`. Use a different key, or skip?
3. **`Cmd+W` / `Cmd+N` on Win:** What key should close window / open new window on Windows?
4. **Full screen screenshot:** Needed? If yes, what key?
