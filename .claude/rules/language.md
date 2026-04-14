# Language

## Default

- All output defaults to **English**.
- This covers documentation, code, in-code comments, commit messages, variable names, and UI text.
- Dialogue with the user (Claude → user) is separate: match the user's language.

## Exceptions

- When the user explicitly requests a different language.
- When aligning with existing content (e.g., a surrounding file that is already in Japanese) to avoid inconsistency. In that case, add a `<!-- TODO(translation) -->` marker so it stays on the translation backlog.
