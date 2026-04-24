# Final-artifact-first

## Start from the final artifact

- On day one, write the final shape of the deliverable: title, section headings, diagram placeholders, table skeletons. Do not create separate plan / draft / design-preview files.
- Every subsequent change brushes up the same artifact. There is no intermediate form that gets discarded.

## Mark gaps inline

- Unresolved items, open questions, and deferred work go **in the section they belong to**, as inline TODO markers — not in a trailing `## TODO` section.
- Preferred marker: `**TODO**: <what is missing>` (prose-visible) or `<!-- TODO: <what> -->` (hidden from rendered output).
- Completion = zero TODO markers remain. Do not delete a TODO before its resolution lands in the surrounding text.

## No intermediate artifacts

- Do not keep stepping-stone files that will be superseded. If content needs to migrate, migrate it; do not leave the old file as a transitional copy.
- `tasks.md` is an exception: it preserves the user's original intent verbatim and tracks multi-session coordination. It is an orthogonal session log, not a draft of another artifact. See [`workflow.md`](./workflow.md).
