# Keybinding Requirements

## How to Review

Mark each operation with one of:

- ✅ 採用
- ❌ 不要
- ❓ 要検討（コメントで条件・代替案を記載）

Default status is **❓** for all items. Please update during PR review.

---

## Category 1: Emacs Text Operations

Operations to be handled by AHK (Windows) and Karabiner (Mac) in all apps except Emacs-native apps (VS Code, terminals).

### 1.1 Cursor Movement — Character / Line

| Status | Key | Operation |
|--------|-----|-----------|
| ❓ | `C-f` | Move forward one character |
| ❓ | `C-b` | Move backward one character |
| ❓ | `C-n` | Move to next line |
| ❓ | `C-p` | Move to previous line |
| ❓ | `C-a` | Move to beginning of line |
| ❓ | `C-e` | Move to end of line |

### 1.2 Cursor Movement — Word / Page / Buffer

| Status | Key | Operation |
|--------|-----|-----------|
| ❓ | `M-f` | Move forward one word |
| ❓ | `M-b` | Move backward one word |
| ❓ | `C-v` | Scroll down (page down) |
| ❓ | `M-v` | Scroll up (page up) |
| ❓ | `C-l` | Recenter (scroll so cursor is at center/top/bottom) |
| ❓ | `M-<` | Move to beginning of buffer |
| ❓ | `M->` | Move to end of buffer |
| ❓ | `M-g M-g` | Go to line number |

### 1.3 Deletion

| Status | Key | Operation |
|--------|-----|-----------|
| ❓ | `C-d` | Delete character forward |
| ❓ | `DEL` | Delete character backward (Backspace — passthrough) |
| ❓ | `M-d` | Kill word forward |
| ❓ | `M-DEL` | Kill word backward |
| ❓ | `C-k` | Kill to end of line |
| ❓ | `C-S-Backspace` | Kill entire current line |

### 1.4 Mark / Region

| Status | Key | Operation |
|--------|-----|-----------|
| ❓ | `C-Space` | Set mark (start selection) |
| ❓ | `C-g` | Cancel mark / deselect |
| ❓ | `C-x C-x` | Exchange point and mark (swap cursor and selection end) |
| ❓ | `C-x h` | Mark whole buffer (select all) |

### 1.5 Kill / Yank (Copy / Paste / Cut)

| Status | Key | Operation |
|--------|-----|-----------|
| ❓ | `M-w` | Copy region to clipboard |
| ❓ | `C-w` | Cut region to clipboard |
| ❓ | `C-y` | Paste from clipboard |
| ❓ | `M-y` | Cycle through clipboard history (yank-pop) |

### 1.6 Undo / Redo

| Status | Key | Operation |
|--------|-----|-----------|
| ❓ | `C-/` | Undo |
| ❓ | `C-?` (`C-S-/`) | Redo |

### 1.7 Search

| Status | Key | Operation |
|--------|-----|-----------|
| ❓ | `C-s` | Incremental search forward |
| ❓ | `C-r` | Incremental search backward |
| ❓ | `M-%` | Query replace |

### 1.8 Transpose

| Status | Key | Operation |
|--------|-----|-----------|
| ❓ | `C-t` | Transpose characters |
| ❓ | `M-t` | Transpose words |

### 1.9 Case Conversion

| Status | Key | Operation |
|--------|-----|-----------|
| ❓ | `M-u` | Upcase word |
| ❓ | `M-l` | Downcase word |
| ❓ | `M-c` | Capitalize word |

### 1.10 Newline / Indent

| Status | Key | Operation |
|--------|-----|-----------|
| ❓ | `RET` / `C-m` | Newline (passthrough) |
| ❓ | `C-o` | Open line (insert newline after cursor without moving) |
| ❓ | `TAB` / `C-i` | Indent (passthrough) |

---

## Category 2: Browser Operations (Chrome)

Operations to unify across Win/Mac via AHK / Karabiner.

| Status | Key | Operation |
|--------|-----|-----------|
| ❓ | `Ctrl+T` | New tab |
| ❓ | `Ctrl+Tab` | Switch to next tab |
| ❓ | `Ctrl+Shift+Tab` | Switch to previous tab |
| ❓ | `Ctrl+J` | Close current tab |
| ❓ | `Ctrl+Shift+T` | Reopen closed tab |
| ❓ | `Ctrl+L` | Focus URL bar |
| ❓ | `Ctrl+R` | Reload page |
| ❓ | `Ctrl+I` | Bookmark current page |
| ❓ | `Ctrl+Click` | Open link in new tab (Mac: structural limitation — Ctrl+Click = context menu) |
| ❓ | `Alt+←` / `Alt+→` | Back / Forward |
| ❓ | New window | Open new window |

---

## Category 3: App Operations (OS level)

Operations to unify via HHKB keymap (Mac) and AHK (Win).

| Status | Key (Mac) | Key (Win) | Operation |
|--------|-----------|-----------|-----------|
| ❓ | `Cmd+Tab` | `Alt+Tab` | Switch app |
| ❓ | `Cmd+Space` | `Alt+Space` | Launch app (Spotlight / Search) |
| ❓ | `Cmd+Q` | `Alt+Q` | Quit app |
| ❓ | `Cmd+W` | — | Close window / tab |
| ❓ | `Cmd+N` | — | New window / document |
| ❓ | `Cmd+Z` / `Cmd+Shift+Z` | `Ctrl+Z` / `Ctrl+Shift+Z` | Undo / Redo (OS-native, outside Emacs mode) |

---

## Category 4: Screenshot

| Status | Key | Operation | Notes |
|--------|-----|-----------|-------|
| ❓ | `Fn+\`` | Capture region → clipboard | Win: Print Screen via HHKB Fn layer. Mac: Karabiner converts Print Screen → Cmd+Ctrl+Shift+4 |
| ❓ | — | Capture full screen → clipboard | Currently not mapped |
| ❓ | — | Capture window → clipboard | Currently not mapped |
| ❓ | — | Capture region → file | Currently not mapped |

---

## Category 5: IME Toggle

| Status | Key | Operation | Notes |
|--------|-----|-----------|-------|
| ❓ | `英数` / `かな` | Toggle IME (En ↔ JP) | HHKB hardware keys, works on both Win/Mac |
| ❓ | `Ctrl+Space` | IME toggle | Currently **not assigned** — reserved for Emacs C-Space (mark) |

---

## Open Questions

- `M-y` (yank-pop): requires clipboard history tool (e.g. Clipy on Mac, Ditto on Win) — is this in scope?
- `C-s / C-r` (isearch): in a browser, `Ctrl+F` is the native find. Do we map `C-s` → `Ctrl+F`?
- `C-x h` (select all): conflicts with the `C-x` prefix — is a two-key sequence acceptable?
- `M-<` / `M->` (buffer boundaries): useful in editors, less common in browsers/apps — needed?
- Browser back/forward: `Alt+←/→` works on Win natively but conflicts with `M-f/b` (word move). How to resolve?
