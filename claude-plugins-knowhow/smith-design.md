# smith — Design Specification

> smith is a craftsperson tool that evaluates and improves Claude Code setups end-to-end: inspects files, drafts improvements, applies them after user approval, and verifies the result.

## Overview

- **Identity**: craftsperson. smith applies changes itself — it is not a consultant.
- **Loop**: Evaluate → Propose → Apply (single pipeline).
- **Two-layer operating model**:
  - **Feature** = user-visible capability, the entry point (e.g., "PR review flow", "progress tracking").
  - **Component** = inspection unit: Prompt / Command / Agent / Skill / Hook / CLAUDE.md / Plugin.
- **Target scope**: inside `.claude/` of the aiya monorepo — plugins AND project-level setup.
- **Out of scope targets**: MCP servers, statusline, output-style.
- **Dogfooded**: smith is run on the aiya monorepo's own `.claude/` to refine itself.
- **Defaults**: dry-run; disk writes require explicit user approval.

## Flow

A single 10-step pipeline. Step order is fixed. Exceptions are listed at the end of this section.

1. **Identify target** — use the specified scope if given; otherwise hear it (max 2 rounds; exit on failure).
2. **Enumerate constituent files** — find the files composing the target and their call relationships (command→agent, hook→tool, skill reference, etc.).
3. **Inspect** — run `[auto]` pre-pass (deterministic mechanical checks) + 3-lens parallel inspection. Each finding recorded as `OK` / `NG` / `OOS` plus a comment.
4. **Draft improvements** — for each `NG` only, produce proposal + rationale + expected effect + patch content.
5. **Rank** — order by expected effect alone (severity is internalized; effort is ignored because AI applies).
6. **User selects adoptions** — all / subset / reject-all. Reject-all persists findings and exits.
7. **Preview** — synthesize patches from adopted items, show diff, final confirmation.
8. **Apply** — write in dependency order (foundation → dependents); re-verify pre-image immediately before each write; halt on failure (no auto-rollback — user reverts via git).
9. **Re-inspect and reconcile** — re-run inspection on touched files, compare expected effect with actual result. If `unmet` or `regressed` remain, loop to step 4 (max 3 iterations).
10. **Persist** — write findings, decisions, reconcile history to `.claude/.smith.local.md`.

### Exception flows

- **Target unidentifiable** (hearing fails after 2 rounds) → report and exit. Never fabricate a target.
- **All proposals rejected** → persist records and exit.
- **Self-inspection** (target == smith itself) → extra confirmation before Apply; iteration cap drops from 3 to 1 to prevent prompt-mutation mid-loop.
- **Write error mid-apply** → halt, report partial state, point the user at `git status`.
- **Loop cap hit** (3 iterations) → report residual findings and exit. Do not emit a completion claim while NG remain.

## Architecture

Hybrid plugin (Archetype C) at `agents-in-your-area/.claude/plugins/smith/`.

| Part | Model | Role | Flow steps |
|---|---|---|---|
| `/smith` command | inherit | Orchestrator: dialogue, approval gates, dependency sorting, writes, persistence | 1, 2, 5 dispatch, 6, 7, 8, 10 |
| `smith-inspector-conventions` agent | Opus | Applies `checklists.md` per component type. Parallel per file. | 3, 4, 9 |
| `smith-inspector-patterns` agent | Opus | Matches anti-patterns from `patterns.md`. Parallel per file. | 3, 4, 9 |
| `smith-inspector-architecture` agent | Opus | Whole-view: dependencies, roles, responsibilities, wiring. Single pass per Feature — not parallelized across files. | 3, 4, 9 |
| `smith-knowhow` skill | — | Progressive disclosure: SKILL.md (taxonomy + common FP + index + load heuristic) + `references/` (per-component checklists + patterns excerpts) | supports 3, 4, 9 |
| `scripts/smith-autocheck.sh` | — | `[auto]`-tagged mechanical checks, emits Finding schema | 3 |
| `scripts/smith-evaluate.sh` | — | Merge findings by tag → convergence score → threshold filter → rank by expected effect; also reconcile predicted vs actual in step 9 | 5, 9 |
| `scripts/smith-state.sh` | — | `.smith.local.md` front-matter I/O | 10 |

### Rationale for key architecture decisions

- **Inspector = Opus**: smith writes files that affect aiya's production setup. A false positive or a missed real issue costs real remediation time. Precedent: pr-review-toolkit uses Opus for its final code-reviewer agent, for the same reason (most-important judgment → highest-reasoning model).
- **Inspector combines inspection + improvement drafting + patch synthesis**: same file, same checklist — splitting would double the file reads and fragment reasoning. Project rule: collapse overlapping modes.
- **Scoring / ranking / reconcile implemented as a script, not an agent**: once findings carry tags and expected effect is numeric, every downstream step is deterministic. A script is faster, cheaper, reproducible, and removes a class of agent-bias risk. The evaluator agent was eliminated by this refactoring.
- **Three parallel inspector lenses**: independent judgments produce a convergence signal. Findings caught by multiple lenses get higher confidence; single-lens findings are filtered out by the threshold.
- **Architecture lens is singleton per Feature, not per-file parallel**: its job is to see the whole — dependencies, responsibilities, wiring. Splitting it by file would break its function. Per-file parallelism only helps where judgments are meaningfully independent.
- **`/smith` model = inherit**: inspectors emit full `patch_content`, so `/smith` only does orchestration — dialogue, approval gates, dependency sorting, Write/Edit, persistence. Respecting the user's model default (`inherit`) follows the knowhow recommendation for non-judgment work. Note: assumes Sonnet-or-better caller; under Haiku, pre-image verification quality may degrade.
- **No auto-rollback on write failure**: silent reversal would hide the failure and violate the "ban false promises" principle. git owns revert; smith halts and reports.

## Interfaces

### Finding schema

Every inspector agent and the `[auto]` pre-pass script emit findings in this structure:

```json
{
  "target_file": "<absolute path or plugin-relative>",
  "finding_type": "<see naming convention>",
  "verdict": "OK" | "NG" | "OOS",
  "comment": "<always; for OK/OOS this is the whole content>",
  "self_confidence": 0,           // 0-100; inspector's own certainty
  "rationale": null,              // required when verdict == NG
  "expected_effect": null,        // required when verdict == NG; list of checklist_item_id the fix will cause to pass
  "patch_content": null           // required when verdict == NG; see patch_content format
}
```

### `finding_type` naming convention

Merge relies on exact string equality, so discipline is required.

- `checklist:<component-type>:<item-slug>` — e.g. `checklist:skill:description-too-long`
- `pattern:<name-slug>` — e.g. `pattern:reporter-self-scoring`
- `architecture:<name-slug>` — e.g. `architecture:wiring-mismatch`

All slugs are kebab-case. The full enumerated list lives in `smith-knowhow/SKILL.md`; it grows as implementation and dogfooding surface new types.

### `[auto]` pre-pass output

`scripts/smith-autocheck.sh` emits findings in the same Finding schema, with:

- `self_confidence = 100` (deterministic)
- `finding_type` derived directly from the checklist item id (e.g., `checklist:skill:kebab-case-filename`)
- `verdict` determined by the mechanical check (`NG` if violated, otherwise no emission)
- `patch_content` populated when the fix is mechanical (e.g., renaming to kebab-case); otherwise `null` with a note in `comment`

Scope covers items explicitly tagged `[auto]` in `checklists.md`: kebab-case file names, required front-matter fields, forbidden absolute paths, `${CLAUDE_PLUGIN_ROOT}` usage, line-count limits.

### `OOS` verdict rule

A finding is `Out-of-scope` only when a checklist item is logically inapplicable to the file type being inspected (e.g., "Skill description length" applied to a Command file). Ambiguous or partially-applicable cases resolve to `NG` or `OK` — never `OOS`.

`OOS` findings are recorded (for audit) but excluded from ranking and from the threshold filter.

### `patch_content` format

Inspectors return Edit-tool-compatible pairs per file:

```json
"patch_content": [
  {"old_string": "...", "new_string": "..."},
  {"old_string": "...", "new_string": "..."}
]
```

`/smith` applies each pair via the Edit tool. This matches the Edit tool's contract directly and avoids unified-diff fragility around whitespace and line numbering.

For whole-file creation or replacement, `old_string` is the empty string (create) or the full current content (replace); `/smith` uses the Write tool in those cases.

### Convergence score formula

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

Note: `[auto]` findings have `self_confidence = 100` but by construction are emitted by only one "lens" (the script). They bypass the threshold — `[auto]` findings are always kept (their determinism justifies the bypass).

### Ranking formula

Surviving findings are sorted by `len(expected_effect)` descending (more checklist items unlocked = higher priority). Ties break on `convergence_score` descending.

### `.claude/.smith.local.md` schema

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

Front-matter is parsed by `scripts/smith-state.sh` using the sed/awk pattern from the knowhow (`patterns.md §Reading front matter from shell`). File is gitignored by convention.

### `allowed-tools`

- `/smith` command: `Read, Glob, Grep, Write, Edit, Bash(git:*), Task`
- `smith-inspector-*` agents: `Read, Glob, Grep` (no write — `patch_content` is data returned to `/smith`)
- Scripts run via `/smith`'s `Bash` capability; no standalone tool grant is needed.

## Dependency ordering

Step 2 produces a list of files plus directed edges (command → agent it invokes, hook → tool it matches, skill → reference files it points to, etc.). `/smith` topologically sorts for step 8:

- foundation files first (no incoming edges)
- dependents in topological order
- cycles broken alphabetically, with a warning logged to `reconcile_history_ref`

## Deferred to implementation

The following will be written during the coding phase, not pre-specified:

- Exact prompt wording for `/smith`, the three inspector agents, and `smith-knowhow/SKILL.md`.
- Initial contents of the finding-type taxonomy. Seed from the checklist item ids and known patterns; grow as real inspections surface new types.
- Initial contents of the common false-positive list and per-lens false-positive lists.
- Exact structure of `reconcile_history_ref` anchors and body sections inside `.smith.local.md`.

## TODO

- Test / verification strategy for smith itself (post-v1, once dogfooding starts).
- Concrete dogfooding targets inside aiya monorepo (will emerge as aiya's `.claude/` develops).
- Revisit whether `[auto]` findings should flow through the evaluator merge at all, or be surfaced on a separate track (deterministic vs judgment channels).
