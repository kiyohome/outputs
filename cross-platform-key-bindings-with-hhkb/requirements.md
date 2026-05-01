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

| Operation | Key (Win) | Key (Mac) | Key(HHKB) |
|-----------|-----------|-----------|-----------|
| Toggle IME (En ↔ JP) | `半角/全角` | — | — |
| Switch to English | — | `英数` | `SP2+SR` |
| Switch to Japanese | — | `かな` | `SR` |

---

## Category 2: App Operations

| Operation | Key (Win) | Key (Mac) | Key(HHKB) |
|-----------|-----------|-----------|-----------|
| Switch app | `Alt+Tab` | `Cmd+Tab` | `SL+Tab` |
| Launch app (Search / Spotlight) | `Alt+Space` | `Cmd+Space` | `SL+S` |
| Quit app | `Alt+F4` | `Cmd+Q` | `SL+Q` |
| Close window | `Alt+F4` | `Cmd+W` | `SL+W` |
| New window / document | `Ctrl+N` | `Cmd+N` | `SL+N` |

---

## Category 3: Screenshot

| Operation | Key (Win) | Key (Mac) | Key(HHKB) |
|-----------|-----------|-----------|-----------|
| Capture region → clipboard | `Win+Shift+S` | `Cmd+Ctrl+Shift+4` | `SP2+Shift+S` |
| Capture full screen → clipboard | `Print Screen` | `Cmd+Ctrl+Shift+3` | `SP2+S` |
| Capture window → clipboard | `Alt+Print Screen` | `Cmd+Ctrl+Shift+4` then `Space` | `SP2+Shift+W` |

---

## Category 4: Text Operations

### 4.1 Cursor Movement — Character / Line

| Operation | Key (Emacs) | Key(HHKB) |
|-----------|-------------|-----------|
| Move forward one character | `C-f` | `Ctrl+F` |
| Move backward one character | `C-b` | `Ctrl+B` |
| Move to next line | `C-n` | `Ctrl+N` |
| Move to previous line | `C-p` | `Ctrl+P` |
| Move to beginning of line | `C-a` | `Ctrl+A` |
| Move to end of line | `C-e` | `Ctrl+E` |

### 4.2 Cursor Movement — Word / Page / Buffer

| Operation | Key (Emacs) | Key(HHKB) |
|-----------|-------------|-----------|
| Move forward one word | `M-f` | `SL+F` |
| Move backward one word | `M-b` | `SL+B` |
| Scroll down (page down) | `C-v` | `Ctrl+V` |
| Scroll up (page up) | `M-v` | `SL+V` |
| Recenter | `C-l` | `Ctrl+L` |
| Move to beginning of buffer | `M-<` | `SL+Shift+,` |
| Move to end of buffer | `M->` | `SL+Shift+.` |
| Go to line number | `M-g M-g` | `SL+G SL+G` |

### 4.3 Deletion

| Operation | Key (Emacs) | Key(HHKB) |
|-----------|-------------|-----------|
| Delete character forward | `C-d` | `Ctrl+D` |
| Delete character backward (Backspace — passthrough) | `DEL` | `DEL` |
| Kill word forward | `M-d` | `SL+D` |
| Kill word backward | `M-DEL` | `SL+DEL` |
| Kill to end of line | `C-k` | `Ctrl+K` |

### 4.4 Mark / Region

| Operation | Key (Emacs) | Key(HHKB) |
|-----------|-------------|-----------|
| Set mark (start selection) | `C-Space` | `Ctrl+Space` |
| Cancel mark / deselect | `C-g` | `Ctrl+G` |
| Mark whole buffer (select all) | `C-x h` | `Ctrl+X H` |

### 4.5 Kill / Yank (Copy / Paste / Cut)

| Operation | Key (Emacs) | Key(HHKB) |
|-----------|-------------|-----------|
| Copy region to clipboard | `M-w` | `SL+W` |
| Cut region to clipboard | `C-w` | `Ctrl+W` |
| Paste from clipboard | `C-y` | `Ctrl+Y` |
| Cycle clipboard history (yank-pop) | `M-y` | `SL+Y` |

### 4.6 Undo / Redo

| Operation | Key (Emacs) | Key(HHKB) |
|-----------|-------------|-----------|
| Undo | `C-/` | `Ctrl+/` |
| Redo | `C-?` (`C-S-/`) | `Ctrl+Shift+/` |

### 4.7 Search / Replace

| Operation | Key (Emacs) | Key(HHKB) |
|-----------|-------------|-----------|
| Search forward | `C-s` | `Ctrl+S` |
| Search backward | `C-r` | `Ctrl+R` |
| Query replace | `M-%` | `SL+Shift+5` |

---

## Category 5: Browser Operations (Chrome)

| Operation | Key (Win) | Key (Mac) | Key(HHKB) |
|-----------|-----------|-----------|-----------|
| New tab | `Ctrl+T` | `Cmd+T` | `Ctrl+T` |
| Switch to next tab | `Ctrl+Tab` | `Ctrl+Tab` | `Ctrl+Tab` |
| Switch to previous tab | `Ctrl+Shift+Tab` | `Ctrl+Shift+Tab` | `Ctrl+Shift+Tab` |
| Close current tab | `Ctrl+W` | `Cmd+W` | `Ctrl+W` |
| Reopen closed tab | `Ctrl+Shift+T` | `Cmd+Shift+T` | `Ctrl+Shift+T` |
| Focus URL bar | `Ctrl+L` | `Cmd+L` | `Ctrl+L` |
| Reload page | `Ctrl+R` | `Cmd+R` | `Ctrl+R` |
| Bookmark current page | `Ctrl+D` | `Cmd+D` | `Ctrl+D` |
| Open link in new tab | `Ctrl+Click` | `Cmd+Click` | `Ctrl+Click` |
| Navigate back / forward | `Alt+←` / `Alt+→` | `Cmd+←` / `Cmd+→` | `SL+←` / `SL+→` |
