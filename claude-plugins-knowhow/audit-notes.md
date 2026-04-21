# Audit Notes

> Per-file knowhow extraction. Each file is scanned at fine granularity with no domain-fitting bias. Findings accumulate here and are reconciled against `docs/taxonomy.md` after all 7 files are scanned.

## Next file to scan

`docs/components.md` (file 2 of 7)

## Method

For each file, list every extractable knowhow unit:

- A unit is anything a plugin author could check or apply.
- Include table rows individually if each row encodes a distinct decision.
- Include "examples" sections if they encode a usage pattern.
- Include intro paragraphs if they state a principle.
- Mark each unit with: `NEW` (not in taxonomy) / `EXISTS:<ID>` (covered) / `SUBSUMED-BY:<ID>` (covered but should split) / `REFINES:<ID>` (covered but description outdated).

## File 1: docs/concepts.md

Scanned top-to-bottom. Every paragraph, bullet, and table row was considered as a potential unit.

### Covered by existing taxonomy

| Source location | Unit | Status |
|---|---|---|
| §Standard directory layout (table) | plugin directory layout | `EXISTS:ARC-SDL` |
| §Plugin Taxonomy §Archetype A | command+agent workflow plugin | `EXISTS:ARC-ACA` |
| §Plugin Taxonomy §Archetype B | skill-only knowledge plugin | `EXISTS:ARC-ASO` |
| §Plugin Taxonomy §Archetype C | hybrid toolkit plugin | `EXISTS:ARC-AH` |
| §Core Design Patterns §Three-layer separation | procedure / knowledge / execution split | `EXISTS:ARC-TLS` |
| §Core Design Patterns §Three roles of SKILL.md | auto-trigger / on-demand / long-form procedure | `EXISTS:SPC-STR` |
| §Core Design Patterns §Progressive disclosure | three-tier skill loading | `EXISTS:CTX-PD` |
| §Design Principles §Prompts are instructions | imperative voice for `.md` files | `EXISTS:PRM-IV` |
| §Design Principles §Emphasize critical phases | `**CRITICAL**` / `DO NOT SKIP` markers | `EXISTS:PRM-CPM` |
| §Design Principles §Convert "whatever you think is best" | explicit approval gate | `EXISTS:FLW-EAG` |
| §Design Principles §Ban false promises | forbid premature completion token | `EXISTS:FLW-LEB` |
| §Design Principles §Control output shape | output-shape directives | `EXISTS:PRM-OSD` |
| §Design Principles §Control output shape (ex. 1) | "no text besides these tool calls" | `EXISTS:PRM-SMC` |
| §Design Principles §Constrain scope | restate-the-scope directives | `EXISTS:PRM-SC` |
| §Design Principles §Cost optimization | Haiku / Sonnet / Opus / inherit tiering | `EXISTS:FLW-MTS` |
| §Design Principles §Parallel vs sequential | parallel / sequential / user-selectable | `EXISTS:FLW-PVS` |

### NEW candidates

| Source location | Unit | Proposed name | Notes |
|---|---|---|---|
| §What is a Plugin (last sentence of layout section) | "only `plugin.json` with `name` is required; everything else is optional" — the **minimum viable plugin** starting point | `minimum-viable-plugin` (ARC) | Distinct from `ARC-SDL` (full layout). This is the "start here, grow as needed" decision. A plugin author may ship a 2-file plugin. |
| §Standard directory layout table row `.mcp.json` | MCP server definitions file at plugin root | `mcp-server-file` (SPC) | Sits alongside `hooks.json` as a component-entry file. Not covered by any existing SPC item. |
| §Plugin Taxonomy intro paragraph | "Understanding which archetype you are building is **the first decision** when creating a new plugin" — procedural priority of the archetype choice | `archetype-first-decision` (ARC or FLW) | The three archetype items (`ARC-ACA/ASO/AH`) describe **what** each archetype is, not that archetype-selection **must come first**. Also flagged as a known gap in the doc's own TODO ("Document the decision heuristic"). |

### REFINES candidates (existing item is correct, but source adds detail worth folding in)

| Source location | Refinement | Target ID |
|---|---|---|
| §Progressive disclosure table | Quantitative sizes: metadata ≈100 words, body 1,500–2,000 words (hard cap 5,000), tier-3 unlimited. The `CTX-PD` description should carry these numbers. | `CTX-PD` |
| §Design Principles §Parallel vs sequential (bullet 3) | "User-selectable" sub-mode — some plugins (`pr-review-toolkit`) expose the parallel/sequential choice to the caller. Currently embedded implicitly; worth explicit mention in `FLW-PVS`. | `FLW-PVS` |
| §Design Principles §Cost optimization (row 4) | `inherit` as the **default** unless a specific reason exists. Currently embedded in the table row; worth promoting as an explicit "default = inherit" rule in `FLW-MTS`. | `FLW-MTS` |
| §Design Principles §Emphasize critical phases (last sentence) | "The stronger the phrasing, the more reliably Claude respects the phase boundary" — escalation heuristic. | `PRM-CPM` |

### Out of scope

| Source location | Reason |
|---|---|
| §Component inventory table (17 plugins × 5 columns) | Reference data about existing plugins, not a knowhow unit. Useful as exemplars; not taxonomy entries. |
| "`plugin-dev` embodies this separation most cleanly" block + 4-line pseudo-trace | Exemplar for `ARC-TLS`, not an independent unit. |
| Three archetype "Representative plugins" bullets | Exemplars per archetype, not independent knowhow. |
| The doc's §TODO section | Meta-TODO for the doc itself, not plugin-authoring knowhow. |

### Summary

- **3 NEW candidates**: `minimum-viable-plugin`, `mcp-server-file`, `archetype-first-decision`.
- **4 REFINES candidates**: `CTX-PD` (tier sizes), `FLW-PVS` (user-selectable), `FLW-MTS` (inherit default), `PRM-CPM` (escalation heuristic).
- **16 units confirmed EXISTS** (no change).
- No `SUBSUMED-BY` (no item needs splitting based on this file alone).
- Decisions on adding NEW items are deferred to the reconciliation pass after all 7 files are scanned, in case later files change the picture.

## File 2: docs/components.md

(pending)

## File 3: docs/patterns.md

(pending)

## File 4: docs/case-studies.md

(pending)

## File 5: docs/checklists.md

(pending)

## File 6: README.md

(pending)

## File 7: smith-design.md

(pending)

## Reconciliation summary

(pending — to be filled after all 7 files scanned)
