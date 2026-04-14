# Documentation Rules

## Start from a mapping of existing material
- Before refactoring docs, produce an explicit mapping table from existing files/sections to the new structure. Verify no content is lost and no duplication is introduced.

## README + docs/ pattern
- Use a single `README.md` as the entry point and a `docs/` directory for detailed references. The README links into docs; docs do not duplicate the README.

## Optimize headings per document
- Do not force a uniform template on every doc. Choose headings that fit each document's content.
- Keep the macro ordering consistent across docs: overview-level → user-facing → developer-facing.

## Mark unresolved items as TODO
- Every doc ends with a TODO section listing unresolved questions and deferred work.
