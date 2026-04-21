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

Subsequent intent (this work-stream, verbatim):

> claude pluginのノウハウ、ノウハウに分かりやすく覚えやすい名前を付けて、チェック項目を扱いやすくしたい。

User's explicit 2-step plan (verbatim):

> **１** taxonomyにノウハウ集めてるんですよね？チェックリストやケーススタディなど、すべてのドキュメントを精査してtaxonomyに具体的なノウハウとして集めましょう
>
> **２** １でノウハウが固まるので、あとはチェックリストがあればよいですよね。ノウハウからチェックリストを作成しましょう、チェックリストにはチェック方法、改善方法、改善例など、smithの実行を想定して必要な項目を定義してから進めましょう。

## Pivots

- jam removed from smith's scope; Create mode dropped.
- "Consultant" reframed to "craftsperson".
- Knowhow indexing surfaced as a prerequisite to smith implementation.
- Original 49-item extraction was contaminated by domain-classification bias. All 7 files re-scanned.

## Step status

### Step 1 — Scrub all docs, collect all knowhow into taxonomy ✅ COMPLETE

All 7 source files scanned. taxonomy.md updated.

| File | Status |
|---|---|
| `docs/concepts.md` | ✅ scanned (commit b7f53bd) |
| `docs/components.md` | ✅ scanned (commit 55433d5) |
| `docs/patterns.md` | ✅ scanned (commit 778936d) |
| `docs/case-studies.md` | ✅ scanned (commit 496d639) |
| `docs/checklists.md` | ✅ scanned (commit 5f758f9) |
| `README.md` | ✅ scanned (commit d436b2e) |
| `smith-design.md` | ✅ scanned (commit 4a5d54b) |

Reconciliation complete (commit 4489a96). taxonomy.md: **107 items** across 5 domains.

| Domain | Items |
|---|---|
| ARC | 10 |
| SPC | 32 |
| PRM | 24 |
| FLW | 29 |
| CTX | 12 |
| **Total** | **107** |

Excluded 2 items with reasons (see taxonomy.md §Excluded).

### Step 2 — Generate checklists from taxonomy ❌ NOT STARTED

For each taxonomy item, define:

| Field | Description |
|---|---|
| `id` | taxonomy ID (e.g. `PRM-IV`) |
| `severity` | Mandatory / Recommended / Quality |
| `auto` | `[auto]` (machine-verifiable) or `[judgment]` (requires LLM/human) |
| `check` | What to verify (one sentence) |
| `fix` | How to improve when NG (one sentence) |
| `example` | Before/after illustration (optional but preferred) |

Output: a structured checklist file that smith's `smith-knowhow` skill can load at runtime. One entry per taxonomy ID.

**Before starting Step 2**: agree on the output format and file structure with the user. Do not generate 107 entries without alignment.

## Decisions made

- 5 domains: `ARC` / `SPC` / `PRM` / `FLW` / `CTX` (mechanism-axis).
- ID format: `DOMAIN-INITIALS` (e.g. `SPC-ATR`).
- Name: kebab-case 2–4 words, mechanism-focused.
- IDs are stable once assigned.
- Severity model: Mandatory / Recommended / Quality (3-tier).
- Automation stance: `[auto]` / `[judgment]` per item.
- All 7 source files in taxonomy scope (no exclusions by file).

## Decisions deferred

- Single-file vs per-domain split for the Step 2 checklist output.
- Whether Step 2 output is a new file (`docs/checklist-items.md`) or replaces / extends the existing `docs/checklists.md`.
- Exact schema for `example` field (inline markdown vs separate file reference).
- Whether to generate all 107 at once or domain by domain.

## Next task

**Step 2, pre-work**: propose the output format and file structure for the checklist items to the user. Wait for agreement, then generate.

## Session context

- Working branch: `claude/plugin-knowledge-naming-dYL6G`.
- `k` or `y` = approve. `進めて` = proceed autonomously.
- One domain or one batch per turn — do not generate all 107 at once without user signal.

## How to resume

1. Read `.claude/rules/*.md` (esp. `interaction.md`, `workflow.md`, `language.md`).
2. Read this file — current state is in "Step status" above.
3. Confirm with user: "Step 1 is done. Step 2 is next — shall I propose the output format?"
4. Do NOT restart Step 1 scans. taxonomy.md is the authoritative output of Step 1.
