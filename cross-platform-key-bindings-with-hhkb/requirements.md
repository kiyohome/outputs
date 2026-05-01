# Keybinding Requirements

## How to Review

Mark each operation with one of:

- ✅ 採用
- ❌ 不要
- ❓ 要検討（コメントで条件・代替案を記載）

---

## Category 1: Emacs Text Operations

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
| ✅ | `C-l` | Recenter |
| ✅ | `M-<` | Move to beginning of buffer |
| ✅ | `M->` | Move to end of buffer |
| ✅ | `M-g M-g` | Go to line number |

### 1.3 Deletion

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `C-d` | Delete character forward |
| ✅ | `DEL` | Delete character backward (Backspace — passthrough) |
| ✅ | `M-d` | Kill word forward |
| ✅ | `M-DEL` | Kill word backward |
| ✅ | `C-k` | Kill to end of line |
| ❌ | `C-S-Backspace` | Kill entire current line — rarely used even in Emacs |

### 1.4 Mark / Region

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `C-Space` | Set mark (start selection) |
| ✅ | `C-g` | Cancel mark / deselect |
| ❌ | `C-x C-x` | Exchange point and mark — niche |
| ✅ | `C-x h` | Mark whole buffer (select all) |

### 1.5 Kill / Yank (Copy / Paste / Cut)

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `M-w` | Copy region to clipboard |
| ✅ | `C-w` | Cut region to clipboard |
| ✅ | `C-y` | Paste from clipboard |
| ✅ | `M-y` | Cycle clipboard history (yank-pop) |

### 1.6 Undo / Redo

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `C-/` | Undo |
| ✅ | `C-?` (`C-S-/`) | Redo |

### 1.7 Search / Replace

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `C-s` | Search forward |
| ✅ | `C-r` | Search backward |
| ✅ | `M-%` | Query replace |

### 1.8 Transpose

| Status | Key | Operation |
|--------|-----|-----------|
| ❌ | `C-t` | Transpose characters — niche |
| ❌ | `M-t` | Transpose words — niche |

### 1.9 Case Conversion

| Status | Key | Operation |
|--------|-----|-----------|
| ❌ | `M-u` | Upcase word — niche |
| ❌ | `M-l` | Downcase word — niche |
| ❌ | `M-c` | Capitalize word — niche |

### 1.10 Newline / Indent

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `RET` / `C-m` | Newline (passthrough) |
| ❌ | `C-o` | Open line — niche |
| ✅ | `TAB` / `C-i` | Indent (passthrough) |

---

## Category 2: Browser Operations (Chrome)

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
| ✅ | `Ctrl+Click` | Open link in new tab |
| ✅ | Back / Forward | Navigate back / forward |
| ✅ | New window | Open new window |

---

## Category 3: App Operations (OS level)

| Status | Operation |
|--------|-----------|
| ✅ | Switch app |
| ✅ | Launch app (Spotlight / Search) |
| ✅ | Quit app |
| ✅ | Close window |
| ✅ | New window / document |

---

## Category 4: Screenshot

| Status | Operation |
|--------|-----------|
| ✅ | Capture region → clipboard |
| ✅ | Capture full screen → clipboard |
| ✅ | Capture window → clipboard |
| ❌ | Capture region → file — clipboard is sufficient |

---

## Category 5: IME Toggle

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `英数` / `かな` | Toggle IME (En ↔ JP) |
| ❓ | `Ctrl+Space` | IME toggle — conflicts with `C-Space` (mark); which takes priority? |
