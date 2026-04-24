# Taxonomy

> Canonical index of every knowhow item extracted from the smith knowledge base. Each item has a domain, a kebab-case name, and an abbreviated ID derived from the name's initials. Inspired by ESLint (kebab-case rule names), SpotBugs (`CATEGORY_ABBREV` pattern IDs), and TypeScript (stable numeric codes).

## Scope

All 7 source documents audited during Stage 3 (`smith-design.md` has since been migrated into `../README.md` and `./design.md`):

- `concepts.md` — plugin shape, archetypes, design principles.
- `components.md` — per-component mechanics (commands / agents / skills / hooks).
- `patterns.md` — cross-cutting quality / state / security / advanced patterns.
- `case-studies.md` — seven official plugin deep-dives; independent knowhow extracted.
- `checklists.md` — quality checklists; prompt/skill/hook/CLAUDE.md authoring rules extracted.
- `README.md` — smith usage and architecture; flow patterns extracted.
- `smith-design.md` (retired) — implementation spec; scoring, ranking, and pipeline patterns extracted.

## Domains

Five domains, classified by **what mechanism the knowhow operates on**, not by what goal it serves.

| Code | Domain | Operates on |
|---|---|---|
| `ARC` | Architecture | Plugin shape: directory layout, archetype choice, layer separation, operational stance. |
| `SPC` | Component Spec | Per-component mechanics: front matter, allowed-tools, events, hooks.json, hook-script conventions, agent interfaces. |
| `PRM` | Prompt Authoring | The text inside `.md` prompts: voice, style, scope, output directives, instruction quality. |
| `FLW` | Flow | Orchestration and control flow: phase gates, model tiering, dispatch, quality scoring, improvement pipelines. |
| `CTX` | Context & State | Information flow, triggering, and persistence: progressive disclosure, `.local.md`, session state, CLAUDE.md management. |

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
- **Length**: 2–4 characters after the hyphen. Variable length is intentional (ESLint precedent).

Example: `three-layer-separation` → initials `TLS` → ID `ARC-TLS`.

## ARC — Architecture (10 items)

| ID | Name | Source |
|---|---|---|
| `ARC-SDL` | standard-directory-layout | `concepts.md` §What is a Plugin |
| `ARC-ACA` | archetype-command-agent | `concepts.md` §Plugin Taxonomy |
| `ARC-ASO` | archetype-skill-only | `concepts.md` §Plugin Taxonomy |
| `ARC-AH`  | archetype-hybrid | `concepts.md` §Plugin Taxonomy |
| `ARC-TLS` | three-layer-separation | `concepts.md` §Core Design Patterns |
| `ARC-MVP` | minimum-viable-plugin | `concepts.md` §Standard directory layout (last sentence) |
| `ARC-AFD` | archetype-first-decision | `concepts.md` §Plugin Taxonomy (intro paragraph) |
| `ARC-CCH` | component-choice-heuristic | `case-studies.md` §claude-code-setup §Categories |
| `ARC-PNE` | propose-not-execute | `case-studies.md` §claude-code-setup + `README.md` §Shared principles |
| `ARC-AC`  | applicability-criteria | `case-studies.md` §ralph-loop §Suitable for / §Not suitable for |

## SPC — Component Spec (32 items)

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
| `SPC-DMI` | disable-model-invocation | `checklists.md` §Skill §1 Metadata |
| `SPC-RTT` | reference-toc-threshold | `checklists.md` §Skill §2 Progressive disclosure |
| `SPC-SFC` | skill-fork-context | `checklists.md` §Skill §6 CC-specific |
| `SPC-SAF` | skill-agent-field | `checklists.md` §Skill §6 CC-specific |

### Hooks

| ID | Name | Source |
|---|---|---|
| `SPC-HER` | hook-events-roster | `components.md` §Hooks |
| `SPC-THT` | two-hook-types | `components.md` §Hooks |
| `SPC-HJF` | hooks-json-format | `components.md` §Hooks |
| `SPC-PRV` | plugin-root-variable | `components.md` §Hooks |
| `SPC-SSI` | session-start-injection | `components.md` §Representative hook patterns |
| `SPC-PTL` | pretool-two-layer | `components.md` + `patterns.md` — canonical here |
| `SPC-HAR` | hook-applicability-rule | `checklists.md` §Hook §1 |
| `SPC-HSV` | hook-stderr-visibility | `checklists.md` §Hook §3 I/O design |
| `SPC-HI`  | hook-idempotency | `checklists.md` §Hook §5 Execution |

### Hook-script conventions

| ID | Name | Source |
|---|---|---|
| `SPC-FMS` | front-matter-shell-io | `patterns.md` §State Management |
| `SPC-SDS` | security-detector-set | `patterns.md` §Security |
| `SPC-HIV` | hook-input-validation | `patterns.md` §Security |
| `SPC-CGW` | clean-gone-worktrees | `patterns.md` §Advanced Patterns |

### Plugin files

| ID | Name | Source |
|---|---|---|
| `SPC-MSF` | mcp-server-file | `concepts.md` §Standard directory layout (`.mcp.json` row) |

### Multi-agent interfaces

| ID | Name | Source |
|---|---|---|
| `SPC-FS`  | finding-schema | `smith-design.md` §Interfaces §Finding schema |
| `SPC-FTT` | finding-type-taxonomy | `smith-design.md` §Interfaces §`finding_type` naming convention |
| `SPC-PCF` | patch-content-format | `smith-design.md` §Interfaces §`patch_content` format |
| `SPC-AJT` | agent-json-transport | `smith-design.md` §Interfaces §Agent/script data transport |
| `SPC-OVR` | oos-verdict-rule | `smith-design.md` §Interfaces §`OOS` verdict rule |

## PRM — Prompt Authoring (24 items)

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
| `PRM-LFD` | lean-forward-description | `components.md` §Skills §Front matter (lean-forward bullet) |
| `PRM-APE` | anti-pattern-enumeration | `components.md` §Agents §Representative specialized agents |
| `PRM-CWF` | context-window-frugality | `checklists.md` §Prompt §1 Conciseness |
| `PRM-IS`  | instruction-specificity | `checklists.md` §Prompt §2 Specificity |
| `PRM-PIF` | positive-instruction-form | `checklists.md` §Prompt §3 Positive form |
| `PRM-IR`  | instruction-rationale | `checklists.md` §Prompt §4 Motivation |
| `PRM-IFL` | instruction-freedom-level | `checklists.md` §Prompt §5 Degree of freedom |
| `PRM-VSC` | verifiable-success-criteria | `checklists.md` §Prompt §6 Verification |
| `PRM-MSS` | multi-step-structuring | `checklists.md` §Prompt §7 Workflow structure |
| `PRM-TC`  | terminology-consistency | `checklists.md` §Prompt §8 Terminology |
| `PRM-TIC` | time-independent-content | `checklists.md` §Skill §3 Content |
| `PRM-DPE` | default-plus-escape | `checklists.md` §Skill §3 Content |
| `PRM-SAC` | single-approach-commitment | `case-studies.md` §feature-dev §Agent design notes (code-architect) |
| `PRM-NRP` | null-result-protocol | `case-studies.md` §feature-dev §Agent design notes (code-reviewer) |
| `PRM-NT`  | necessity-test | `checklists.md` §CLAUDE.md §2 Conciseness |

## FLW — Flow (29 items)

### Dispatch & control flow

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
| `FLW-SD`  | selective-dispatch | `case-studies.md` §pr-review-toolkit §Selective dispatch |
| `FLW-SDP` | signal-driven-proposal | `case-studies.md` §claude-code-setup §Recommendation framework |
| `FLW-PCP` | parallel-candidate-presentation | `README.md` §Usage §Create step 3 |
| `FLW-WVA` | whole-view-agent | `smith-design.md` §Architecture §Rationale bullet 5 |
| `FLW-DOW` | dependency-ordered-writes | `smith-design.md` §Dependency ordering |

### Quality gates

| ID | Name | Source |
|---|---|---|
| `FLW-CTF` | confidence-threshold-filter | `patterns.md` §Quality Control |
| `FLW-DEC` | double-eligibility-check | `patterns.md` §Quality Control + §Advanced Patterns — canonical here |
| `FLW-BAC` | blind-ab-comparison | `patterns.md` §Advanced Patterns |
| `FLW-STM` | severity-tier-model | `checklists.md` §How to Use §Severity tiers |
| `FLW-AST` | automation-stance-tagging | `checklists.md` §How to Use §Automation stance |
| `FLW-FSB` | finding-severity-bins | `README.md` §Usage §Improve (invocation table) |
| `FLW-WQR` | weighted-quality-rubric | `case-studies.md` §claude-md-management §A–F grading |

### Improvement pipeline

| ID | Name | Source |
|---|---|---|
| `FLW-PSC` | post-session-capture | `case-studies.md` §claude-md-management §`revise-claude-md` |
| `FLW-PVE` | plan-validate-execute | `checklists.md` §Skill §5 Code and scripts |
| `FLW-SDD` | symptom-driven-diagnosis | `README.md` §Usage §Improve (path + problem variant) |
| `FLW-EPA` | evaluate-propose-apply | `smith-design.md` §Flow (steps 3–9 overall shape) |
| `FLW-PIV` | pre-image-verification | `smith-design.md` §Flow step 8 |
| `FLW-REA` | reconcile-expected-actual | `smith-design.md` §Flow step 9 |

### Scoring & ranking

| ID | Name | Source |
|---|---|---|
| `FLW-CSF` | convergence-scoring-formula | `smith-design.md` §Interfaces §Convergence score formula |
| `FLW-EER` | expected-effect-ranking | `smith-design.md` §Interfaces §Ranking formula |
| `FLW-DSAS` | deterministic-steps-as-scripts | `smith-design.md` §Architecture §Rationale bullet 3 |

## CTX — Context & State (12 items)

| ID | Name | Source |
|---|---|---|
| `CTX-PD`  | progressive-disclosure | `concepts.md` §Core Design Patterns |
| `CTX-LMS` | local-md-state-file | `patterns.md` §State Management |
| `CTX-TWA` | todo-write-anchor | `patterns.md` §State Management |
| `CTX-FFL` | filesystem-feedback-loop | `components.md` + `patterns.md` — canonical here |
| `CTX-CM`  | conversation-mining | `patterns.md` §Advanced Patterns |
| `CTX-RRR` | runtime-rule-reload | `case-studies.md` §hookify §Immediate reflection |
| `CTX-CS`  | context-separation | `checklists.md` §Skill §2 Progressive disclosure |
| `CTX-SST` | session-snapshot-timing | `checklists.md` §Hook §5 Execution |
| `CTX-CIR` | claude-md-inclusion-rules | `checklists.md` §CLAUDE.md §1 Content inclusion |
| `CTX-RHM` | rule-hook-migration | `checklists.md` §CLAUDE.md §3 Instruction effectiveness |
| `CTX-CMP` | claude-md-placement | `checklists.md` §CLAUDE.md §4 Placement |
| `CTX-SDW` | skill-doc-wrapping | `README.md` §Architecture §Skills |

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

## Excluded from taxonomy

Items considered and deliberately excluded from this pass.

| Item | Reason |
|---|---|
| `hook-rule-schema` — hookify's `name/enabled/event/pattern/action` rule file format | Single-plugin convention. Not yet generalizable. Add when a second plugin adopts the same schema. |
| `feature-vs-component-scope` — smith's Feature vs Component two-layer model | Specific to improvement-class plugins. Too narrow for the general taxonomy. Remains in `smith-design.md`. |
| `concepts.md` §Component inventory table (17 plugins) | Reference data. Not authoring knowhow. |
| `components.md` §Representative specialized agents (bullets) | Exemplars of `SPC-AFM`, `FLW-PPS`, `FLW-MTP`. Not standalone items. |

## Totals

| Domain | Items | Share |
|---|---|---|
| ARC | 10 | 9% |
| SPC | 32 | 30% |
| PRM | 24 | 22% |
| FLW | 29 | 27% |
| CTX | 12 | 11% |
| **Total** | **107** | — |

Stage 2 total (concepts + components + patterns only): 49 items.
Stage 3 additions (case-studies + checklists + README + smith-design): +58 items.
Duplicates collapsed: 6 (unchanged from Stage 2). Raw count before dedup: 113.

## TODO

- Assign each taxonomy item as the parent of one or more checklist items from `checklists.md` (many new PRM items are derived directly from the §Prompt section).
- Link `case-studies.md` sections to the IDs they exemplify (Stage 4).
- Decide whether `SPC` (32 items, 30%) needs a permanent sub-axis beyond the current subsections, or whether the subsections are sufficient navigation.
- Decide whether `FLW` (29 items, 27%) needs further subsection refinement as the improvement-pipeline cluster grows.
- Consider whether 2-letter IDs should be padded for visual consistency, or left as-is (variable length accepted by convention).
- Revisit `hook-rule-schema` exclusion once a second plugin adopts the same rule-file schema.
