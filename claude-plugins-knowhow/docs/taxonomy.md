# Taxonomy

> Canonical index of every knowhow item in `concepts.md`, `components.md`, and `patterns.md`. Each item has a domain, a kebab-case name, and an abbreviated ID derived from the name's initials. Inspired by ESLint (kebab-case rule names), SpotBugs (`CATEGORY_ABBREV` pattern IDs), and TypeScript (stable numeric codes).

## Scope

Source documents in this pass:

- `concepts.md` — plugin shape, archetypes, design principles.
- `components.md` — per-component mechanics (commands / agents / skills / hooks).
- `patterns.md` — cross-cutting quality / state / security / advanced patterns.

Excluded from this pass:

- `case-studies.md` — concrete examples of the patterns below; will be linked to items later as exemplars.
- `checklists.md` — checkable surface of the items below; will be attached to parent items in a later pass.

## Domains

Five domains, classified by **what mechanism the knowhow operates on**, not by what goal it serves.

| Code | Domain | Operates on |
|---|---|---|
| `ARC` | Architecture | Plugin shape: directory layout, archetype choice, layer separation. |
| `SPC` | Component Spec | Per-component mechanics: front matter, allowed-tools, events, hooks.json, hook-script conventions. |
| `PRM` | Prompt Authoring | The text inside `.md` prompts: voice, imperative style, scope constraints, output directives. |
| `FLW` | Flow | Orchestration and control flow: phase gates, model tiering, parallel/sequential dispatch, reporter-evaluator, confidence scoring. |
| `CTX` | Context & State | Information flow, triggering, and persistence: progressive disclosure, `.local.md`, TodoWrite, filesystem as feedback channel. |

Tie-break rule when an item plausibly fits two domains:

1. If it defines a **component field or file format**, → `SPC`.
2. If it is about **what to write inside a prompt**, → `PRM`.
3. If it is about **how phases, agents, or tiers relate**, → `FLW`.
4. If it is about **what persists across a turn/session/iteration**, → `CTX`.
5. Otherwise, if it is about **plugin-level shape**, → `ARC`.

## Naming and ID conventions

- **Name**: kebab-case, 2–4 words, describes the mechanism (not the goal).
- **ID**: `DOMAIN-INITIALS` where `INITIALS` is the first letter of each word in the name, uppercased. Unique within the domain.
- **Stability**: once assigned, IDs are stable. Names can be refined but should keep the same initials so the ID survives.

Example: `three-layer-separation` → initials `TLS` → ID `ARC-TLS`.

## ARC — Architecture (5 items)

| ID | Name | Source |
|---|---|---|
| `ARC-SDL` | standard-directory-layout | `concepts.md` §What is a Plugin |
| `ARC-ACA` | archetype-command-agent | `concepts.md` §Plugin Taxonomy |
| `ARC-ASO` | archetype-skill-only | `concepts.md` §Plugin Taxonomy |
| `ARC-AH`  | archetype-hybrid | `concepts.md` §Plugin Taxonomy |
| `ARC-TLS` | three-layer-separation | `concepts.md` §Core Design Patterns |

## SPC — Component Spec (19 items)

### Commands

| ID | Name | Source |
|---|---|---|
| `SPC-ATR` | allowed-tools-restriction | `components.md` §Commands |
| `SPC-ICE` | inline-command-execution | `components.md` §Commands |
| `SPC-AE`  | argument-expansion | `components.md` §Commands |

### Agents

| ID | Name | Source |
|---|---|---|
| `SPC-AFM` | agent-front-matter | `components.md` §Agents |
| `SPC-EBT` | example-block-trigger | `components.md` §Agents |
| `SPC-CA`  | color-assignment | `components.md` §Agents |

### Skills

| ID | Name | Source |
|---|---|---|
| `SPC-SFM` | skill-front-matter | `components.md` §Skills |
| `SPC-DOM` | description-optimization-methodology | `components.md` §Skills |
| `SPC-STR` | skill-three-roles | `concepts.md` + `components.md` — canonical here |

### Hooks

| ID | Name | Source |
|---|---|---|
| `SPC-HER` | hook-events-roster | `components.md` §Hooks |
| `SPC-THT` | two-hook-types | `components.md` §Hooks |
| `SPC-HJF` | hooks-json-format | `components.md` §Hooks |
| `SPC-PRV` | plugin-root-variable | `components.md` §Hooks |
| `SPC-SSI` | session-start-injection | `components.md` §Representative hook patterns |
| `SPC-PTL` | pretool-two-layer | `components.md` + `patterns.md` — canonical here |

### Hook-script conventions

| ID | Name | Source |
|---|---|---|
| `SPC-FMS` | front-matter-shell-io | `patterns.md` §State Management |
| `SPC-SDS` | security-detector-set | `patterns.md` §Security |
| `SPC-HIV` | hook-input-validation | `patterns.md` §Security |
| `SPC-CGW` | clean-gone-worktrees | `patterns.md` §Advanced Patterns |

## PRM — Prompt Authoring (9 items)

| ID | Name | Source |
|---|---|---|
| `PRM-IV`  | instruction-voice | `concepts.md` + `components.md` — canonical here |
| `PRM-CPM` | critical-phase-markers | `concepts.md` §Design Principles |
| `PRM-OSD` | output-shape-directives | `concepts.md` §Design Principles |
| `PRM-SC`  | scope-constraint | `concepts.md` §Design Principles |
| `PRM-SMC` | single-message-completion | `components.md` §Commands |
| `PRM-SBS` | skill-body-style | `components.md` §Skills |
| `PRM-FPE` | false-positive-enumeration | `patterns.md` §Quality Control |
| `PRM-OFD` | output-format-discipline | `patterns.md` §Quality Control |
| `PRM-CD`  | code-delegation | `patterns.md` §Advanced Patterns |

## FLW — Flow (11 items)

| ID | Name | Source |
|---|---|---|
| `FLW-EAG` | explicit-approval-gate | `concepts.md` §Design Principles |
| `FLW-LEB` | loop-escape-ban | `concepts.md` §Design Principles |
| `FLW-MTS` | model-tier-selection | `concepts.md` §Design Principles |
| `FLW-PVS` | parallel-vs-sequential | `concepts.md` §Design Principles |
| `FLW-PC`  | phase-control | `components.md` §Commands |
| `FLW-MTP` | model-tier-pipeline | `components.md` §Agents |
| `FLW-PPS` | parallel-perspective-split | `components.md` §Agents |
| `FLW-RES` | reporter-evaluator-separation | `components.md` + `patterns.md` — canonical here |
| `FLW-CTF` | confidence-threshold-filter | `patterns.md` §Quality Control |
| `FLW-DEC` | double-eligibility-check | `patterns.md` §Quality Control + §Advanced Patterns — canonical here |
| `FLW-BAC` | blind-ab-comparison | `patterns.md` §Advanced Patterns |

## CTX — Context & State (5 items)

| ID | Name | Source |
|---|---|---|
| `CTX-PD`  | progressive-disclosure | `concepts.md` §Core Design Patterns |
| `CTX-LMS` | local-md-state-file | `patterns.md` §State Management |
| `CTX-TWA` | todo-write-anchor | `patterns.md` §State Management |
| `CTX-FFL` | filesystem-feedback-loop | `components.md` + `patterns.md` — canonical here |
| `CTX-CM`  | conversation-mining | `patterns.md` §Advanced Patterns |

## Duplicates resolved

Six items appear in more than one source. Canonical ID is the single entry listed above; other occurrences are cross-references.

| Canonical ID | Name | Duplicate sources collapsed into it |
|---|---|---|
| `SPC-STR` | skill-three-roles | `concepts.md` §Three roles of SKILL.md, `components.md` §Three roles a SKILL.md can play |
| `SPC-PTL` | pretool-two-layer | `components.md` §Representative hook patterns (PreToolUse bullet), `patterns.md` §Fixed patterns vs dynamic rules |
| `PRM-IV`  | instruction-voice | `concepts.md` §Prompts are instructions to Claude, `components.md` §Write commands as instructions |
| `FLW-RES` | reporter-evaluator-separation | `components.md` §Separation of reporter and evaluator, `patterns.md` §Separation of reporter and evaluator |
| `FLW-DEC` | double-eligibility-check | `patterns.md` §Double eligibility check, `patterns.md` §Double eligibility in long-running reviews |
| `CTX-FFL` | filesystem-feedback-loop | `components.md` §Representative hook patterns (Stop-based loop bullet), `patterns.md` §Self-referential loop |

## Out of scope (this pass)

| Source | Treatment | Reason |
|---|---|---|
| `concepts.md` §Component inventory of official plugins | Reference table, not an item. | Data, not knowhow. |
| `components.md` §Representative specialized agents | Exemplars of existing items (`SPC-AFM`, `FLW-PPS`, `FLW-MTP`). | Illustrations, not standalone knowhow. |
| `case-studies.md` (all) | Will be linked to items as exemplars in a later pass. | Case studies are examples of these patterns, not independent items. |
| `checklists.md` (all) | Will be attached as checkable surface of parent items in a later pass. | Checkboxes express the same knowhow in verification form. |

## Totals

| Domain | Items | Share |
|---|---|---|
| ARC | 5  | 10% |
| SPC | 19 | 39% |
| PRM | 9  | 18% |
| FLW | 11 | 22% |
| CTX | 5  | 10% |
| **Total** | **49** | — |

Duplicates collapsed: 6 (listed above). Raw count before dedup: 55.

## TODO

- Stage 3: attach `checklists.md` items to their parent IDs as the checkable surface.
- Stage 4: link `case-studies.md` sections to the IDs they exemplify.
- Decide whether `SPC` is too large (19 items, ~39%) and needs a sub-axis, or stays flat because its items are genuinely component-scoped.
- Confirm `CTX-FFL` naming — the mechanism is "filesystem as feedback channel"; Stop hook is one triggering mode. `ralph-loop` is the canonical exemplar.
- Consider whether 2-letter IDs (`ARC-AH`, `SPC-AE`, `SPC-CA`, `PRM-IV`, `PRM-SC`, `PRM-CD`, `FLW-PC`, `CTX-PD`, `CTX-CM`) should be padded to 3 letters for visual consistency, or left as-is (ESLint accepts variable-length rule names).
