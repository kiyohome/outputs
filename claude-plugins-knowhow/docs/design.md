# smith — Internal design

Reference consulted during implementation. Entry point: [`../README.md`](../README.md).

## Finding schema

<!-- JSON shape emitted by every inspector agent and the [auto] pre-pass -->

## `finding_type` naming convention

<!-- checklist:/pattern:/architecture: prefixes; kebab-case slugs; merge-by-equality discipline -->

## `[auto]` pre-pass

<!-- script scope; self_confidence=100; threshold bypass; finding_type derivation -->

## `OOS` verdict rule

<!-- when to emit; excluded from ranking and threshold -->

## `patch_content` format

<!-- array of {old_string, new_string}; Edit-tool contract; create/replace via Write -->

## Agent and script data transport

<!-- JSON array per inspector, concatenated by /smith, piped to smith-evaluate.sh -->

## Convergence score

<!-- formula; drop threshold; table of cases -->

## Ranking

<!-- sort keys: len(expected_effect) desc, convergence_score desc -->

## Dependency ordering (step 8)

<!-- topo sort inputs; cycle handling -->

## `.claude/.smith.local.md` schema

<!-- front-matter + Findings + Reconcile log; in-memory during run; front-matter parser; gitignore -->

## `allowed-tools`

<!-- per-component tool grants -->

## Deferred to implementation

<!-- prompt wording; finding-type taxonomy seed; false-positive lists; reconcile anchor layout -->

## TODO

<!-- [auto] channel split revisit; checklist anchor swap when docs/checklist-items.md lands -->
