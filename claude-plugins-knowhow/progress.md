# Progress Log

> Resumption log. smith design lives in `smith-design.md`. Knowhow taxonomy lives in `docs/taxonomy.md`. Per-file audit findings live in `audit-notes.md`.

## Original intent

First message (Japanese, preserved verbatim):

> plugin-smith
> aiya-jam
> の順に作成を進めたい。
> すべてaiyaのモノレポで開発、ただしこの2つはモノレポのパッケージ開発でも使いながら改善するので、モノレポの.claudeに配置します。
> イメージできますか？
> smith作って、smith使ってjamを作る

Subsequent intent (this work-stream):

> claude pluginのノウハウ、ノウハウに分かりやすく覚えやすい名前を付けて、チェック項目を扱いやすくしたい。

## Pivots

- jam removed from smith's scope; Create mode dropped.
- "Consultant" reframed to "craftsperson".
- **Knowhow indexing surfaced as a prerequisite to smith implementation.** smith's `smith-knowhow` skill needs a structured taxonomy with stable IDs.
- **Original 49-item extraction was contaminated by domain-classification bias.** Items that didn't fit 5 domains were silently dropped; table rows were collapsed; case-studies/checklists/README/smith-design were never scanned. Re-audit required.

## Current phase

**Stage 3 — Full knowhow audit across 7 files.** smith implementation blocked on this.

## Files in scope (7)

| File | Status |
|---|---|
| `docs/concepts.md` | needs re-scan (domain bias) |
| `docs/components.md` | needs re-scan (table rows collapsed) |
| `docs/patterns.md` | needs re-scan |
| `docs/case-studies.md` | not yet scanned |
| `docs/checklists.md` | not yet scanned (orphans confirmed) |
| `README.md` | not yet scanned |
| `smith-design.md` | not yet scanned |

Per-file findings accumulate in `audit-notes.md`.

## Decisions made

- 5 domains: `ARC` / `SPC` / `PRM` / `FLW` / `CTX` (mechanism-axis).
- ID format: `DOMAIN-INITIALS` (e.g. `SPC-ATR`).
- Name: kebab-case 2-4 words, mechanism-focused.
- Stability: IDs stable once assigned.

## Decisions deferred (revisit after audit)

- Single-file vs per-domain split of `taxonomy.md` (currently single).
- `severity` 3-tier vs `blocking: bool` (user leaning M/R/Q).
- `checklists.md` as authoring surface vs generated view (user leaning authoring surface).
- Schema fields per item: minimal vs rich (lean minimal until smith forces additions).
- `case-studies.md` atomization.

## Next tasks (one at a time)

1. Re-scan `docs/concepts.md`. Append findings to `audit-notes.md`. Confirm with user.
2. Re-scan `docs/components.md`.
3. Re-scan `docs/patterns.md`.
4. Scan `docs/case-studies.md`.
5. Scan `docs/checklists.md`.
6. Scan `README.md`.
7. Scan `smith-design.md`.
8. Reconcile against existing 49: list new / revised / merged / dropped.
9. Update `taxonomy.md`.
10. Resolve deferred decisions.
11. (Then) implement smith.

## Session context

- **One file per turn**. Do not bundle. User explicitly requested incremental progress.
- After each file scan: write to `audit-notes.md`, then ask user to confirm before next file.
- `k` = approve, `進めて` = proceed autonomously.
- Working branch: `claude/plugin-knowledge-naming-dYL6G`.

## How to resume

1. Read `.claude/rules/*.md` (esp. `interaction.md`, `workflow.md`, `language.md`).
2. Read this file.
3. Read `audit-notes.md`. The "Next file to scan" pointer at the top tells you where to continue.
4. Re-read existing `docs/taxonomy.md` to know what's already classified.
5. Resume from the next unscanned file.
