# Documentation conventions

## Structure

- In a monorepo, call the building blocks **"packages"**, not "components" (OSS convention).
- If the same content is duplicated across multiple documents, **consolidate the shared section into the README or a cross-cutting document**.
- Split a large refactor into two phases: **skeleton first, then fill in content**.

## Headings

- Do not force a shared template (e.g., `Overview / Usage / Architecture`) across every document. **Optimize headings per file** to fit its content.
- Drop unnecessary `## Overview` wrappers and flatten.
- Use **English headings that follow OSS conventions**. Avoid invented terms and literal translations.
  - Avoid `Development` — ambiguous between "how to contribute" and "how to use".
  - Avoid `Internals` — skews toward runtimes / databases / compilers; dev tools typically use `Architecture`.
- Before deciding on a new heading name, **research what real OSS projects use** (Diátaxis, standard-readme, matklad's ARCHITECTURE.md convention, etc.).

## Bilingual docs

- When a Japanese document is expected to be translated to English eventually, put a `<!-- TODO(translation) -->` marker at the top of the file.
- It is fine to translate only headings first. Translate the body in one pass later.
