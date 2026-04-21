# Audit Notes

> Per-file knowhow extraction. Each file is scanned at fine granularity with no domain-fitting bias. Findings accumulate here and are reconciled against `docs/taxonomy.md` after all 7 files are scanned.

## Next file to scan

`docs/patterns.md` (file 3 of 7)

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

Scanned top-to-bottom. Every `###` heading, table, code block, and bullet was considered.

### Covered by existing taxonomy

| Source location | Unit | Status |
|---|---|---|
| §Commands §Write commands as instructions | imperative voice for commands | `EXISTS:PRM-IV` |
| §Commands §Restrict tools with `allowed-tools` | allowed-tools front-matter | `EXISTS:SPC-ATR` |
| §Commands §"Single-message completion" pattern | no-prose single-turn directive | `EXISTS:PRM-SMC` |
| §Commands §Inline execution | `` !`cmd` `` inline shell embedding | `EXISTS:SPC-ICE` |
| §Commands §Argument expansion | `$ARGUMENTS`, `$1..n`, `@$1`, `@${CLAUDE_PLUGIN_ROOT}/…` | `EXISTS:SPC-AE` |
| §Commands §Phase control pattern | phase blocks with Goal / Actions / Approval | `EXISTS:FLW-PC` |
| §Agents §Front matter | name / description / model / color / tools | `EXISTS:SPC-AFM` |
| §Agents §Trigger definition via `<example>` | `<example>` blocks with `<commentary>` | `EXISTS:SPC-EBT` |
| §Agents §Model tiering | per-agent model tier + 4-tier pipeline | `EXISTS:FLW-MTP` |
| §Agents §Parallel dispatch | parallel perspective-split dispatch | `EXISTS:FLW-PPS` |
| §Agents §Separation of reporter and evaluator | reporter agent + separate evaluator agent | `EXISTS:FLW-RES` |
| §Agents §Color assignment | per-agent color convention | `EXISTS:SPC-CA` |
| §Skills §Front matter | name / description / version | `EXISTS:SPC-SFM` |
| §Skills §Body style | imperative / no 2nd person / 1500-2000 words | `EXISTS:PRM-SBS` |
| §Skills §Description optimization | 7-step test-set methodology | `EXISTS:SPC-DOM` |
| §Skills §Three roles a SKILL.md can play | auto-trigger / on-demand / long-form | `EXISTS:SPC-STR` |
| §Hooks §Events | 9-event roster | `EXISTS:SPC-HER` |
| §Hooks §Two hook types | prompt vs command | `EXISTS:SPC-THT` |
| §Hooks §`hooks.json` format | wrapper schema + matcher syntax | `EXISTS:SPC-HJF` |
| §Hooks §Use `${CLAUDE_PLUGIN_ROOT}` | portability variable | `EXISTS:SPC-PRV` |
| §Hooks §Representative hook patterns — SessionStart | context-inject on session start | `EXISTS:SPC-SSI` |
| §Hooks §Representative hook patterns — Stop-based loop | filesystem-as-feedback via Stop hook | `EXISTS:CTX-FFL` |
| §Hooks §Representative hook patterns — PreToolUse two-layer | static policy + dynamic rules | `EXISTS:SPC-PTL` |

### NEW candidates

| Source location | Unit | Proposed name | Notes |
|---|---|---|---|
| §Skills §Front matter — third bullet | "Claude tends to *under*-trigger skills. Write the description aggressively so tangential requests still activate it." | `lean-forward-description` (PRM) | A **principle** about drafting bias, distinct from `SPC-DOM` (which is the test-set **process**). |
| §Agents §Representative specialized agents — silent-failure-hunter + type-design-analyzer | Enumerate anti-patterns explicitly in the agent body ("empty catch blocks, log-and-continue, implicit fallbacks" / "anemic domain models, exposed mutable internals"). | `anti-pattern-enumeration` (PRM) | Cross-agent authoring pattern. Also flagged as a known gap in the file's own TODO: "Collect bad examples, not just good ones." |

### REFINES candidates

| Source location | Refinement | Target ID |
|---|---|---|
| §Commands §Argument expansion | `@$1` tells Claude to read the argument as a file; `@${CLAUDE_PLUGIN_ROOT}/templates/report.md` references plugin-internal files. These `@`-forms deserve explicit mention (not just positional `$n`). | `SPC-AE` |
| §Agents §Front matter (name row) | `name` must be kebab-case, 3–50 characters. | `SPC-AFM` |
| §Agents §Front matter (tools row) | `tools` omitted = full access; specified = restricted. Maps the "opt-in restrict" semantics. | `SPC-AFM` |
| §Agents §Trigger definition | Include both **explicit-request** examples ("review my PR") and **proactive-dispatch** examples (Claude chooses without being named). | `SPC-EBT` |
| §Skills §Body style | Write an explicit `## Additional Resources` section listing `references/` and `scripts/` so Claude knows they exist. Tier-3 resources are invisible unless signposted. | `PRM-SBS` |
| §Hooks §Two hook types | `prompt` type is the **preferred** default; `command` type is for deterministic/speed/external-tool cases. | `SPC-THT` |
| §Hooks §`hooks.json` format | `hooks` wrapper is **required** (differs from `settings.json`). Multiple hooks per matcher run **in parallel with no ordering guarantee**. | `SPC-HJF` |
| §Hooks §Use `${CLAUDE_PLUGIN_ROOT}` | Hard-coded absolute paths are **forbidden**. The variable is also available inside hook scripts as an **environment variable** (not just inside `hooks.json`). | `SPC-PRV` |
| §Commands §Phase control pattern | Phase blocks follow a **template** — `**Goal**`, `**Actions**`, `**User confirmation point**` / `**CRITICAL**` / `**DO NOT START WITHOUT USER APPROVAL**`. The template itself is the transferable pattern. | `FLW-PC` |
| §Agents §Model tiering | Selective **Opus promotion** for judgment-heavy agents (`code-reviewer`, `code-simplifier`) while keeping peers at `inherit`. | `FLW-MTP` or `FLW-MTS` |

### Out of scope

| Source location | Reason |
|---|---|
| §Agents §Representative specialized agents — full bullets | Exemplars of `SPC-AFM`, `FLW-PPS`, `FLW-MTP`, `PRM-SC`, and the NEW-candidate `anti-pattern-enumeration`. Keep as case-study material, not standalone items. |
| §Commands §Restrict tools — examples of `commit-commands` / `code-review` locking down | Exemplars of `SPC-ATR`. |
| §Hooks §Events — per-event "Use" column phrasing | Descriptive commentary within `SPC-HER`, not separate items. |
| §TODO section | Meta-TODO for the doc itself. The three TODOs there (`.mcp.json` patterns / component-choice heuristic / bad-example collection) are all known gaps — `.mcp.json` aligns with the file-1 NEW candidate `mcp-server-file`; bad-example collection aligns with the NEW candidate `anti-pattern-enumeration`; component-choice heuristic is a new known gap (no candidate yet). |

### Summary

- **23 units confirmed EXISTS** (no change).
- **2 NEW candidates**: `lean-forward-description`, `anti-pattern-enumeration`.
- **10 REFINES candidates** across `SPC-AE`, `SPC-AFM`, `SPC-EBT`, `PRM-SBS`, `SPC-THT`, `SPC-HJF`, `SPC-PRV`, `FLW-PC`, `FLW-MTP/MTS`.
- **Known gap surfaced (no candidate yet)**: "when to choose command vs agent vs skill for a given responsibility."
- Reconciliation deferred to post-scan pass.

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
