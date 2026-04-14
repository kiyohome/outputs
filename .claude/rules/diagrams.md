# Diagrams

## Mermaid over ASCII

- 図は **mermaid** を優先する。ASCII art は避ける
- 例外: 擬似コード（Step の入出力を箇条書きで書くタイプ）は ASCII のままでOK
- インフラ構成図・フロー図・関係図はすべて mermaid に

## Mermaid syntax safety

スマホやシンプルなレンダラで壊れにくい書き方：

- `<br/>` は避ける。改行が必要なら `<br>` か、ノード分割
- subgraph 内の nested `direction` は避ける
- edge label に特殊文字（`→` など）を入れない。必要なら本文に出す
- node label に括弧やパイプを含める時は `"..."` でクオート

## User visibility

- ユーザーがスマホで作業している可能性がある。mermaid はレンダリングされないこともある
- 図を提案する時は、**構造的な意図を文章でも併記** する
