# Documentation Rules

## Start from a mapping of existing material
- Before refactoring docs, produce an explicit mapping table from existing files/sections to the new structure. Verify no content is lost and no duplication is introduced.

## README + docs/ pattern
- Use a single `README.md` as the entry point and a `docs/` directory for detailed references. The README links into docs; docs do not duplicate the README.

## Optimize headings per document
- Do not force a uniform template on every doc. Choose headings that fit each document's content.
- Keep the macro ordering consistent across docs: overview-level → user-facing → developer-facing.
- Drop unnecessary `## Overview` wrappers and flatten.
- Use **English headings that follow OSS conventions**. Avoid invented terms and literal translations.
  - Avoid `Development` — ambiguous between "how to contribute" and "how to use".
  - Avoid `Internals` — skews toward runtimes / databases / compilers; dev tools typically use `Architecture`.
- Before deciding on a new heading name, **research what real OSS projects use** (Diátaxis, standard-readme, matklad's ARCHITECTURE.md convention, etc.).

## Mark unresolved items as TODO
- Every doc ends with a TODO section listing unresolved questions and deferred work.

## Structure
- In a monorepo, call the building blocks **"packages"**, not "components" (OSS convention).
- If the same content is duplicated across multiple documents, **consolidate the shared section into the README or a cross-cutting document**.
- Split a large refactor into two phases: **skeleton first, then fill in content**.

## Bilingual docs
- When a Japanese document is expected to be translated to English eventually, put a `<!-- TODO(translation) -->` marker at the top of the file.
- It is fine to translate only headings first. Translate the body in one pass later.
