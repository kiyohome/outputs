# smith — Internal design

Reference consulted during implementation. Entry point: [`../README.md`](../README.md).

## Finding schema

Every inspector agent and the `[auto]` pre-pass script emit findings in this structure:

```json
{
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

After merging by `finding_type` exact match:

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

**`[auto]` findings bypass the threshold.** They have `self_confidence = 100` but by construction are emitted by only one "lens" (the script). Their determinism justifies the bypass — they are always kept.

## Ranking

Surviving findings are sorted by `len(expected_effect)` descending (more checklist items unlocked = higher priority). Ties break on `convergence_score` descending.

## Dependency ordering (step 8)

Step 2 produces a list of files plus directed edges (command → agent it invokes, hook → tool it matches, skill → reference files it points to, etc.). `/smith` topologically sorts for step 8:

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

## TODO

- Revisit whether `[auto]` findings should flow through the evaluator merge at all, or surface on a separate deterministic channel.
- When `docs/checklist-items.md` lands (`tasks.md` §Step 2), replace references to per-item ids in the Finding schema and `finding_type` examples with the canonical per-ID form.
