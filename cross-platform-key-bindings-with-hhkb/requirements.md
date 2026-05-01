# Keybinding Requirements

---

## HHKB Key Layout (Bottom Row)

| OS  | SP2 (Space左2) | SL (Space左) | S (Space) | SR (Space右) | SR2 (Space右2) |
|-----|---------------|-------------|----------|-------------|--------------|
| Win | Fn1 | Alt | Space | かな | Win |
| Mac | Fn1 | Opt | Space | かな | Cmd |

> **Fn1 layer:** Fn1 を押している間、Space右（かな）は `英数` になる。

---

## Category 1: IME Toggle

| Key(HHKB) | Key | Operation |
|-----------|-----|-----------|
| `SR` / `SP2+SR` | `英数` / `かな` | Toggle IME (En ↔ JP) |

---

## Category 2: App Operations

| Key(HHKB) | Key (Win) | Key (Mac) | Operation |
|-----------|-----------|-----------|-----------|
| `SL+Tab` | `Alt+Tab` | `Cmd+Tab` | Switch app |
| `SL+S` | `Alt+Space` | `Cmd+Space` | Launch app (Search / Spotlight) |
| `SL+Q` | `Alt+F4` | `Cmd+Q` | Quit app |
| `SL+W` | `Alt+F4` | `Cmd+W` | Close window |
| `SL+N` | `Ctrl+N` | `Cmd+N` | New window / document |

---

## Category 3: Screenshot

| Key(HHKB) | Key (Win) | Key (Mac) | Operation |
|-----------|-----------|-----------|-----------|
| `SP2+Shift+S` | `Win+Shift+S` | `Cmd+Ctrl+Shift+4` | Capture region → clipboard |
| `SP2+S` | `Print Screen` | `Cmd+Ctrl+Shift+3` | Capture full screen → clipboard |
| `SP2+Shift+W` | `Alt+Print Screen` | `Cmd+Ctrl+Shift+4` then `Space` | Capture window → clipboard |

---

## Category 4: Text Operations

### 4.1 Cursor Movement — Character / Line

| Key(HHKB) | Key (Emacs) | Operation |
|-----------|-------------|-----------|
| `Ctrl+F` | `C-f` | Move forward one character |
| `Ctrl+B` | `C-b` | Move backward one character |
| `Ctrl+N` | `C-n` | Move to next line |
| `Ctrl+P` | `C-p` | Move to previous line |
| `Ctrl+A` | `C-a` | Move to beginning of line |
| `Ctrl+E` | `C-e` | Move to end of line |

### 4.2 Cursor Movement — Word / Page / Buffer

| Key(HHKB) | Key (Emacs) | Operation |
|-----------|-------------|-----------|
| `SL+F` | `M-f` | Move forward one word |
| `SL+B` | `M-b` | Move backward one word |
| `Ctrl+V` | `C-v` | Scroll down (page down) |
| `SL+V` | `M-v` | Scroll up (page up) |
| `Ctrl+L` | `C-l` | Recenter |
| `SL+Shift+,` | `M-<` | Move to beginning of buffer |
| `SL+Shift+.` | `M->` | Move to end of buffer |
| `SL+G SL+G` | `M-g M-g` | Go to line number |

### 4.3 Deletion

| Key(HHKB) | Key (Emacs) | Operation |
|-----------|-------------|-----------|
| `Ctrl+D` | `C-d` | Delete character forward |
| `DEL` | `DEL` | Delete character backward (Backspace — passthrough) |
| `SL+D` | `M-d` | Kill word forward |
| `SL+DEL` | `M-DEL` | Kill word backward |
| `Ctrl+K` | `C-k` | Kill to end of line |

### 4.4 Mark / Region

| Key(HHKB) | Key (Emacs) | Operation |
|-----------|-------------|-----------|
| `Ctrl+Space` | `C-Space` | Set mark (start selection) |
| `Ctrl+G` | `C-g` | Cancel mark / deselect |
| `Ctrl+X H` | `C-x h` | Mark whole buffer (select all) |

### 4.5 Kill / Yank (Copy / Paste / Cut)

| Key(HHKB) | Key (Emacs) | Operation |
|-----------|-------------|-----------|
| `SL+W` | `M-w` | Copy region to clipboard |
| `Ctrl+W` | `C-w` | Cut region to clipboard |
| `Ctrl+Y` | `C-y` | Paste from clipboard |
| `SL+Y` | `M-y` | Cycle clipboard history (yank-pop) |

### 4.6 Undo / Redo

| Key(HHKB) | Key (Emacs) | Operation |
|-----------|-------------|-----------|
| `Ctrl+/` | `C-/` | Undo |
| `Ctrl+Shift+/` | `C-?` (`C-S-/`) | Redo |

### 4.7 Search / Replace

| Key(HHKB) | Key (Emacs) | Operation |
|-----------|-------------|-----------|
| `Ctrl+S` | `C-s` | Search forward |
| `Ctrl+R` | `C-r` | Search backward |
| `SL+Shift+5` | `M-%` | Query replace |

---

## Category 5: Browser Operations (Chrome)

| Key(HHKB) | Key (Win) | Key (Mac) | Operation |
|-----------|-----------|-----------|-----------|
| `Ctrl+T` | `Ctrl+T` | `Cmd+T` | New tab |
| `Ctrl+Tab` | `Ctrl+Tab` | `Ctrl+Tab` | Switch to next tab |
| `Ctrl+Shift+Tab` | `Ctrl+Shift+Tab` | `Ctrl+Shift+Tab` | Switch to previous tab |
| `Ctrl+W` | `Ctrl+W` | `Cmd+W` | Close current tab |
| `Ctrl+Shift+T` | `Ctrl+Shift+T` | `Cmd+Shift+T` | Reopen closed tab |
| `Ctrl+L` | `Ctrl+L` | `Cmd+L` | Focus URL bar |
| `Ctrl+R` | `Ctrl+R` | `Cmd+R` | Reload page |
| `Ctrl+D` | `Ctrl+D` | `Cmd+D` | Bookmark current page |
| `Ctrl+Click` | `Ctrl+Click` | `Cmd+Click` | Open link in new tab |
| `SL+←` / `SL+→` | `Alt+←` / `Alt+→` | `Cmd+←` / `Cmd+→` | Navigate back / forward |
