# Keybinding Requirements

## How to Review

Mark each operation with one of:

- ✅ 採用
- ❌ 不要
- ❓ 要検討（コメントで条件・代替案を記載）

---

## Category 1: IME Toggle

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `英数` / `かな` | Toggle IME (En ↔ JP) |

---

## Category 2: App Operations

| Status | Key (Win) | Key (Mac) | Operation |
|--------|-----------|-----------|-----------|
| ✅ | `Alt+Tab` | `Cmd+Tab` | Switch app |
| ✅ | `Alt+Space` | `Cmd+Space` | Launch app (Search / Spotlight) |
| ✅ | `Alt+F4` | `Cmd+Q` | Quit app |
| ✅ | `Alt+F4` | `Cmd+W` | Close window |
| ✅ | `Ctrl+N` | `Cmd+N` | New window / document |

---

## Category 3: Screenshot

| Status | Key (Win) | Key (Mac) | Operation |
|--------|-----------|-----------|-----------|
| ✅ | `Win+Shift+S` | `Cmd+Ctrl+Shift+4` | Capture region → clipboard |
| ✅ | `Print Screen` | `Cmd+Ctrl+Shift+3` | Capture full screen → clipboard |
| ✅ | `Alt+Print Screen` | `Cmd+Ctrl+Shift+4` then `Space` | Capture window → clipboard |

---

## Category 4: Text Operations

### 4.1 Cursor Movement — Character / Line

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `C-f` | Move forward one character |
| ✅ | `C-b` | Move backward one character |
| ✅ | `C-n` | Move to next line |
| ✅ | `C-p` | Move to previous line |
| ✅ | `C-a` | Move to beginning of line |
| ✅ | `C-e` | Move to end of line |

### 4.2 Cursor Movement — Word / Page / Buffer

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

### 4.3 Deletion

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `C-d` | Delete character forward |
| ✅ | `DEL` | Delete character backward (Backspace — passthrough) |
| ✅ | `M-d` | Kill word forward |
| ✅ | `M-DEL` | Kill word backward |
| ✅ | `C-k` | Kill to end of line |
| ❌ | `C-S-Backspace` | Kill entire current line — rarely used even in Emacs |

### 4.4 Mark / Region

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `C-Space` | Set mark (start selection) |
| ✅ | `C-g` | Cancel mark / deselect |
| ❌ | `C-x C-x` | Exchange point and mark — niche |
| ✅ | `C-x h` | Mark whole buffer (select all) |

### 4.5 Kill / Yank (Copy / Paste / Cut)

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `M-w` | Copy region to clipboard |
| ✅ | `C-w` | Cut region to clipboard |
| ✅ | `C-y` | Paste from clipboard |
| ✅ | `M-y` | Cycle clipboard history (yank-pop) |

### 4.6 Undo / Redo

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `C-/` | Undo |
| ✅ | `C-?` (`C-S-/`) | Redo |

### 4.7 Search / Replace

| Status | Key | Operation |
|--------|-----|-----------|
| ✅ | `C-s` | Search forward |
| ✅ | `C-r` | Search backward |
| ✅ | `M-%` | Query replace |

### 4.8 Transpose

| Status | Key | Operation |
|--------|-----|-----------|
| ❌ | `C-t` | Transpose characters — niche |
| ❌ | `M-t` | Transpose words — niche |

### 4.9 Case Conversion

| Status | Key | Operation |
|--------|-----|-----------|
| ❌ | `M-u` | Upcase word — niche |
| ❌ | `M-l` | Downcase word — niche |
| ❌ | `M-c` | Capitalize word — niche |

### 4.10 Newline / Indent

| Status | Key | Operation |
|--------|-----|-----------|
| ❌ | `RET` / `C-m` | Newline (passthrough) |
| ❌ | `C-o` | Open line — niche |
| ❌ | `TAB` / `C-i` | Indent (passthrough) |

---

## Category 5: Browser Operations (Chrome)

| Status | Key (Win) | Key (Mac) | Operation |
|--------|-----------|-----------|-----------|
| ✅ | `Ctrl+T` | `Cmd+T` | New tab |
| ✅ | `Ctrl+Tab` | `Ctrl+Tab` | Switch to next tab |
| ✅ | `Ctrl+Shift+Tab` | `Ctrl+Shift+Tab` | Switch to previous tab |
| ✅ | `Ctrl+W` | `Cmd+W` | Close current tab |
| ✅ | `Ctrl+Shift+T` | `Cmd+Shift+T` | Reopen closed tab |
| ✅ | `Ctrl+L` | `Cmd+L` | Focus URL bar |
| ✅ | `Ctrl+R` | `Cmd+R` | Reload page |
| ✅ | `Ctrl+D` | `Cmd+D` | Bookmark current page |
| ✅ | `Ctrl+Click` | `Cmd+Click` | Open link in new tab |
| ✅ | `Alt+←` / `Alt+→` | `Cmd+←` / `Cmd+→` | Navigate back / forward |
