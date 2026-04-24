# smith — Internal design

Reference consulted during implementation. Entry point: [`../README.md`](../README.md).

## Finding schema

Every inspector agent and the `[auto]` pre-pass script emit findings in this structure:

```json
{
  "id": "<12 hex chars: first 12 of sha256(target_file + '|' + finding_type)>",
  "target_file": "<absolute path or plugin-relative>",
  "finding_type": "<see naming convention>",
  "verdict": "OK" | "NG" | "OOS",
  "comment": "<always; for OK/OOS this is the whole content>",
  "self_confidence": 0,
  "rationale": null,
  "expected_effect": null,
  "patch_content": null
}
```

- `id` — deterministic: the first 12 hex chars of `sha256(target_file + "|" + finding_type)`. Same issue flagged by multiple lenses (or re-flagged across iterations) carries the same `id`. Used as the merge key in convergence and as the token stored under `adoptions` / `rejections` in `.smith.local.md`.
- `self_confidence` — 0-100, inspector's own certainty.
- `rationale` — required when `verdict == NG`.
- `expected_effect` — required when `verdict == NG`; list of `checklist_item_id` values the fix will cause to pass.
- `patch_content` — required when `verdict == NG`; see [patch_content format](#patch_content-format).

## `finding_type` naming convention

Merge relies on exact string equality, so discipline is required.

- `checklist:<component-type>:<item-slug>` — e.g. `checklist:skill:description-too-long`
- `pattern:<name-slug>` — e.g. `pattern:reporter-self-scoring`
- `architecture:<name-slug>` — e.g. `architecture:wiring-mismatch`

All slugs are kebab-case. The enumerated list lives in `smith-knowhow/SKILL.md`; it grows as implementation and dogfooding surface new types.

**TODO**: when `docs/checklist-items.md` lands (`tasks.md` §Step 2), replace `<item-slug>` in the examples above with the canonical per-ID form.

## `[auto]` pre-pass

`scripts/smith-autocheck.sh` emits findings in the same Finding schema, with:

- `self_confidence = 100` (deterministic).
- `finding_type` derived directly from the checklist item id (e.g., `checklist:skill:kebab-case-filename`).
- `verdict` determined by the mechanical check (`NG` if violated, otherwise no emission).
- `patch_content` populated when the fix is mechanical (e.g., renaming to kebab-case); otherwise `null` with a note in `comment`.

Scope covers items explicitly tagged `[auto]` in [`checklists.md`](./checklists.md): kebab-case file names, required front-matter fields, forbidden absolute paths, `${CLAUDE_PLUGIN_ROOT}` usage, line-count limits.

## `OOS` verdict rule

A finding is `Out-of-scope` only when a checklist item is logically inapplicable to the file type being inspected (e.g., "Skill description length" applied to a Command file). Ambiguous or partially-applicable cases resolve to `NG` or `OK` — never `OOS`.

`OOS` findings are recorded (for audit) but excluded from ranking and from the threshold filter.

## `patch_content` format

Inspectors return Edit-tool-compatible pairs per file:

```json
"patch_content": [
  {"old_string": "...", "new_string": "..."},
  {"old_string": "...", "new_string": "..."}
]
```

`/smith` applies each pair via the Edit tool. This matches the Edit tool's contract directly and avoids unified-diff fragility around whitespace and line numbering.

For whole-file creation or replacement, `old_string` is the empty string (create) or the full current content (replace); `/smith` uses the Write tool in those cases.

## Agent and script data transport

- Each inspector agent returns its findings as a JSON array inside a single fenced ` ```json ` block as the final message of its invocation.
- `/smith` concatenates inspector outputs (plus the `[auto]` pre-pass script's output) into one JSON array and pipes it to `scripts/smith-evaluate.sh` on stdin.
- `scripts/smith-evaluate.sh` emits ranked findings as a JSON array on stdout.
- All inter-process runtime data flows as JSON; no shared files are used for transient data.

## Convergence score

After merging by `id` exact match (which encodes both `target_file` and `finding_type`, so the same issue in different files does not collapse):

```
convergence_score = (num_lenses_caught * 30) + (max(self_confidence) * 0.3)
```

Findings with `convergence_score < 80` are dropped.

| Lenses | max self_confidence | convergence_score | Result |
|---|---|---|---|
| 1 | 100 | 60 | drop |
| 2 | 70 | 81 | pass |
| 2 | 100 | 90 | pass |
| 3 | 0 | 90 | pass |
| 3 | 100 | 120 (clamp 100) | pass |

Lens agreement is the primary signal; `self_confidence` modifies.

**`[auto]` findings bypass the threshold.** They have `self_confidence = 100` but by construction are emitted by only one "lens" (the script). They still participate in the `id` merge: when an inspector lens flags the same `id`, the inspector is counted as an additional lens and the `[auto]` finding's `patch_content` wins (deterministic mechanical fix). `[auto]` findings that no inspector matched are kept unconditionally — the bypass applies.

**TODO**: revisit whether separating `[auto]` onto a dedicated deterministic channel (skipping the merger entirely) is simpler than this merge-and-bypass hybrid.

## Ranking

Surviving findings are sorted by `len(expected_effect)` descending (more checklist items unlocked = higher priority). Ties break on `convergence_score` descending.

## Dependency ordering (step 8)

Step 2 produces a list of files plus directed edges: `A → B` means `A` references `B`, so an edit to `B` can break `A` and `B` must land first. Edges are extracted by `/smith` itself (deterministic, via `Grep` / `Glob` — no inspector agent), with these scan patterns:

- **Command → Agent** — scan the command body for `subagent_type: <slug>` in Task-tool calls and for explicit `agents/<slug>.md` references.
- **Hook → Script** — scan `hooks.json` for `${CLAUDE_PLUGIN_ROOT}/scripts/<path>` commands.
- **Skill → Reference file** — scan `SKILL.md` for relative paths under `references/`.
- **CLAUDE.md → Component file** — scan for mentions of component filenames (command / agent / skill).
- **Plugin manifest → Any** — resolve references declared in `.claude-plugin/plugin.json`.

Ambiguous matches (e.g., a skill name appearing in prose rather than as a real reference) surface as findings for the user to confirm, not as silent edges.

`/smith` topologically sorts the resulting DAG for step 8:

- Foundation files first (no incoming edges).
- Dependents in topological order.
- Cycles broken alphabetically, with a warning logged to `reconcile_history_ref`.

## `.claude/.smith.local.md` schema

```markdown
---
current_target: "<path or capability phrase>"
iteration: 0                         # 0-indexed
max_iterations: 3                    # 1 for self-inspection
adoptions: ["<finding_id>", ...]
rejections: ["<finding_id>", ...]
reconcile_history_ref: "#iteration-0"
---

# Findings

<findings tree, grouped by target_file>

# Reconcile log

## iteration-0

<per-finding delta: met / partial / unmet / regressed>
```

- Front-matter is parsed by `scripts/smith-state.sh` using the sed/awk pattern from the knowhow (`patterns.md §Reading front matter from shell`).
- File is gitignored by convention.
- State is held in-memory during a single `/smith` run and written to the file at step 10; the file is not re-read within a run. Reconcile state for iterations 1–2 uses in-memory history carried by `/smith`.

### Reconcile verdicts

The reconcile log records one verdict per adopted finding by comparing its `expected_effect` before apply to the post-apply re-inspection:

- **`met`** — all `checklist_item_id` values in `expected_effect` now pass (re-inspection verdict `OK`).
- **`partial`** — at least one but not all of the `expected_effect` items transitioned to `OK`.
- **`unmet`** — none of the `expected_effect` items transitioned to `OK`.
- **`regressed`** — a checklist item that was `OK` on a touched file before the apply is now `NG`. Unlike the three buckets above (which measure whether the intended fix landed), `regressed` measures unintended side effects on other items.

Findings with verdict `unmet` or `regressed` are eligible for another draft iteration (step 4 re-entry) up to `max_iterations`.

## `allowed-tools`

- `/smith` command: `Read, Glob, Grep, Write, Edit, Bash(git:*), Task`.
- `smith-inspector-*` agents: `Read, Glob, Grep` (no write — `patch_content` is data returned to `/smith`).
- Scripts run via `/smith`'s `Bash` capability; no standalone tool grant is needed.

## Deferred to implementation

These will be written during the coding phase, not pre-specified here:

- Exact prompt wording for `/smith`, the three inspector agents, and `smith-knowhow/SKILL.md`.
- Initial contents of the finding-type taxonomy. Seed from the checklist item ids and known patterns; grow as real inspections surface new types.
- Initial contents of the common false-positive list and per-lens false-positive lists.
- Exact structure of `reconcile_history_ref` anchors and body sections inside `.smith.local.md`.

