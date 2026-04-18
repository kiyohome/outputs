#Requires AutoHotkey v2.0

; =============================================================================
; HHKB Studio クロスOS キーバインド統一 - Windows用 AHKスクリプト
; =============================================================================
; 設計ドキュメント 3.4 レイヤー2 Win側の変換ルールに基づく
;
; 除外アプリ（テキスト操作のみ）：VS Code, Windows Terminal
; Chrome専用：Ctrl+J → Ctrl+W, Ctrl+I → Ctrl+D
; kill-ringはシステムクリップボード経由で代替
; =============================================================================

; --- 除外アプリの判定（テキスト操作用） ---
IsExcluded() {
    excludeList := ["Code.exe", "WindowsTerminal.exe"]
    for app in excludeList {
        if WinActive("ahk_exe " app)
            return true
    }
    return false
}

IsChrome() {
    return WinActive("ahk_exe chrome.exe")
}

; =============================================================================
; アプリ起動/切り替え（全アプリ対象、除外なし）
; =============================================================================

; Alt+Space → Win+S（アプリ起動/検索）
!Space:: {
    Send "#s"
}

; Alt+Q → Alt+F4（アプリ終了 / Quit）
!q:: {
    Send "!{F4}"
}

; =============================================================================
; Chrome専用 ブラウザ操作
; =============================================================================

#HotIf IsChrome()

; Ctrl+J → Ctrl+W（タブを閉じる / Junk）
^j:: {
    Send "^w"
}

; Ctrl+I → Ctrl+D（ブックマーク / Important）
^i:: {
    Send "^d"
}

#HotIf

; =============================================================================
; Emacs テキスト編集（除外アプリ以外）
; kill-ringはシステムクリップボード経由で代替
; =============================================================================

; --- マーク状態管理 ---
global markActive := false

; Ctrl+Space → マーク開始（常にON、トグルではない）
^Space:: {
    global markActive
    if IsExcluded()
        return
    markActive := true
}

; Ctrl+G → マーク中のみマーク解除＋選択解除、マーク外はパススルー
^g:: {
    global markActive
    if IsExcluded()
        return
    if markActive {
        markActive := false
        Send "{Right}"  ; 選択解除
    } else {
        Send "^g"
    }
}

; マーク解除ヘルパー（コピペ操作後に呼ぶ）
ResetMark() {
    global markActive
    markActive := false
}

; --- 移動系（マーク中はShift付加で選択範囲を拡張） ---

^a:: {
    if IsExcluded()
        return
    if markActive
        Send "+{Home}"
    else
        Send "{Home}"
}

^e:: {
    if IsExcluded()
        return
    if markActive
        Send "+{End}"
    else
        Send "{End}"
}

^f:: {
    if IsExcluded()
        return
    if markActive
        Send "+{Right}"
    else
        Send "{Right}"
}

^b:: {
    if IsExcluded()
        return
    if markActive
        Send "+{Left}"
    else
        Send "{Left}"
}

^n:: {
    if IsExcluded()
        return
    if markActive
        Send "+{Down}"
    else
        Send "{Down}"
}

^p:: {
    if IsExcluded()
        return
    if markActive
        Send "+{Up}"
    else
        Send "{Up}"
}

; --- 編集系 ---

; Ctrl+D → Delete
^d:: {
    if IsExcluded()
        return
    Send "{Delete}"
}

; Ctrl+K → 行末まで削除（クリップボードにカット、C-yで戻せる）
^k:: {
    if IsExcluded()
        return
    Send "+{End}^x"
}

; --- コピペ系（システムクリップボード経由） ---

; Alt+W → Ctrl+C（コピー / M-w）
!w:: {
    if IsExcluded()
        return
    Send "^c"
    ResetMark()
}

; Ctrl+Y → Ctrl+V（ペースト / yank）
^y:: {
    if IsExcluded()
        return
    Send "^v"
}

; Ctrl+W → Ctrl+X（カット / kill-region）
^w:: {
    if IsExcluded()
        return
    Send "^x"
    ResetMark()
}

; --- undo / redo ---

; Ctrl+/ → Ctrl+Z（undo / C-/）
^/:: {
    if IsExcluded()
        return
    Send "^z"
    ResetMark()
}

; Ctrl+Shift+/ → Ctrl+Shift+Z（redo / C-?）
^+/:: {
    if IsExcluded()
        return
    Send "^+z"
    ResetMark()
}

; --- 単語単位の移動（M-f / M-b） ---

; Alt+F → Ctrl+Right（forward-word）
!f:: {
    if IsExcluded()
        return
    if markActive
        Send "^+{Right}"
    else
        Send "^{Right}"
}

; Alt+B → Ctrl+Left（backward-word）
!b:: {
    if IsExcluded()
        return
    if markActive
        Send "^+{Left}"
    else
        Send "^{Left}"
}

; --- 単語単位の削除 ---

; Alt+D → Ctrl+Delete（kill-word）
!d:: {
    if IsExcluded()
        return
    Send "^{Delete}"
}

; Alt+Backspace → Ctrl+Backspace（backward-kill-word / M-DEL）
!Backspace:: {
    if IsExcluded()
        return
    Send "^{Backspace}"
}
