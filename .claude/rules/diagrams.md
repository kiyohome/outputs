# Diagrams

## Mermaid over ASCII

- Prefer **mermaid** for diagrams. Avoid ASCII art.
- Exception: pseudo-code (e.g., bullet-style "input / output of a Step") can stay as plain text.
- Infrastructure diagrams, flow diagrams, and relationship diagrams should all be mermaid.

## Mermaid syntax safety

Write mermaid in a way that survives smartphones and simple renderers:

- Avoid `<br/>`. If you need a line break, use `<br>` or split the node.
- Avoid nested `direction` inside subgraphs.
- Do not put special characters (e.g., `→`) in edge labels. Put them in prose instead if needed.
- When a node label contains parentheses or pipes, wrap it in `"..."`.

## User visibility

- The user may be working from a smartphone, where mermaid is not always rendered.
- When proposing a diagram, **also describe its structural intent in prose**.
