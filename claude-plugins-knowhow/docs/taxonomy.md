# Taxonomy

> Domain classification of every knowhow item in `concepts.md`, `components.md`, and `patterns.md`. Each item is placed in exactly one of five mechanism-axis domains. This file is the canonical index; IDs and names will be assigned in a later pass.

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

## ARC — Architecture (5 items)

| # | Item | Source |
|---|---|---|
| ARC-1 | Standard directory layout | `concepts.md` §What is a Plugin |
| ARC-2 | Archetype A: Command + Agent (workflow-oriented) | `concepts.md` §Plugin Taxonomy |
| ARC-3 | Archetype B: Skill-only (knowledge provider) | `concepts.md` §Plugin Taxonomy |
| ARC-4 | Archetype C: Hybrid (toolkit) | `concepts.md` §Plugin Taxonomy |
| ARC-5 | Three-layer separation (procedure / knowledge / execution) | `concepts.md` §Core Design Patterns |

## SPC — Component Spec (19 items)

### Commands

| # | Item | Source |
|---|---|---|
| SPC-1 | Restrict tools with `allowed-tools` | `components.md` §Commands |
| SPC-2 | Inline execution with `` !`command` `` | `components.md` §Commands |
| SPC-3 | Argument expansion (`$ARGUMENTS`, `$1`, `@$1`, `@${CLAUDE_PLUGIN_ROOT}/...`) | `components.md` §Commands |

### Agents

| # | Item | Source |
|---|---|---|
| SPC-4 | Agent front matter (name / description / model / color / tools) | `components.md` §Agents |
| SPC-5 | Trigger definition via `<example>` blocks | `components.md` §Agents |
| SPC-6 | Color assignment conventions | `components.md` §Agents |

### Skills

| # | Item | Source |
|---|---|---|
| SPC-7 | Skill front matter (name / description / version) | `components.md` §Skills |
| SPC-8 | Description optimization methodology (skill-creator: 20 queries, 60/40 split, 5 rounds) | `components.md` §Skills |
| SPC-9 | Three roles of SKILL.md (auto-trigger / on-demand reference / long-form workflow) | `concepts.md` §Three roles of SKILL.md + `components.md` §Three roles a SKILL.md can play — canonical here |

### Hooks

| # | Item | Source |
|---|---|---|
| SPC-10 | Hook events roster (PreToolUse, PostToolUse, Stop, SubagentStop, SessionStart, SessionEnd, UserPromptSubmit, PreCompact, Notification) | `components.md` §Hooks |
| SPC-11 | Two hook types: `prompt` (LLM) vs `command` (deterministic) | `components.md` §Hooks |
| SPC-12 | `hooks.json` format (description / hooks / matcher / parallel execution) | `components.md` §Hooks |
| SPC-13 | Use `${CLAUDE_PLUGIN_ROOT}` for portability | `components.md` §Hooks |
| SPC-14 | SessionStart context injection exemplar | `components.md` §Representative hook patterns |
| SPC-15 | PreToolUse two-layer design (fixed policy vs dynamic rules) | `components.md` §Representative hook patterns + `patterns.md` §Fixed patterns vs dynamic rules — canonical here |

### Hook-script conventions

| # | Item | Source |
|---|---|---|
| SPC-16 | Reading and writing front matter from shell (`sed`/`awk` extraction) | `patterns.md` §State Management |
| SPC-17 | Representative security patterns (security-guidance nine, hookify five) | `patterns.md` §Security |
| SPC-18 | Hook script input validation (`set -euo pipefail`, JSON validation, exit 0/2) | `patterns.md` §Security |
| SPC-19 | `clean_gone` for git worktrees | `patterns.md` §Advanced Patterns |

## PRM — Prompt Authoring (9 items)

| # | Item | Source |
|---|---|---|
| PRM-1 | Prompts are instructions to Claude, not explanations for humans | `concepts.md` §Design Principles + `components.md` §Write commands as instructions — canonical here |
| PRM-2 | Emphasize critical phases (DO NOT SKIP / DO NOT START WITHOUT APPROVAL) | `concepts.md` §Design Principles |
| PRM-3 | Control output shape (single-turn directives, brevity, no emojis) | `concepts.md` §Design Principles |
| PRM-4 | Constrain scope (restate what not to do) | `concepts.md` §Design Principles |
| PRM-5 | Single-message completion pattern | `components.md` §Commands |
| PRM-6 | Skill body style (imperative, avoid second person, 1,500–2,000 words, explicit `references/` mentions) | `components.md` §Skills |
| PRM-7 | Explicit enumeration of false positives | `patterns.md` §Quality Control |
| PRM-8 | Output format discipline (link + cite, full SHA, line ranges with context) | `patterns.md` §Quality Control |
| PRM-9 | Code delegation prompt (what to ask the user to write vs auto-generate) | `patterns.md` §Advanced Patterns |

## FLW — Flow (11 items)

| # | Item | Source |
|---|---|---|
| FLW-1 | Convert "whatever you think is best" into explicit approval | `concepts.md` §Design Principles |
| FLW-2 | Ban false promises for loop escape | `concepts.md` §Design Principles |
| FLW-3 | Cost optimization: pick the right model tier (Haiku / Sonnet / Opus / `inherit`) | `concepts.md` §Design Principles |
| FLW-4 | Parallel vs sequential dispatch choice | `concepts.md` §Design Principles |
| FLW-5 | Phase control pattern (Goal / Actions / User confirmation point) | `components.md` §Commands |
| FLW-6 | Model tiering pipeline (four-tier example from `code-review`) | `components.md` §Agents |
| FLW-7 | Parallel dispatch with perspective split | `components.md` §Agents |
| FLW-8 | Separation of reporter and evaluator | `components.md` §Agents + `patterns.md` §Quality Control — canonical here |
| FLW-9 | Confidence scoring and threshold filtering (0–100, threshold 80) | `patterns.md` §Quality Control |
| FLW-10 | Double eligibility check (pre and post, to survive long-running reviews) | `patterns.md` §Quality Control + `patterns.md` §Advanced Patterns — canonical here |
| FLW-11 | Blind A/B comparison (comparator + analyzer) | `patterns.md` §Advanced Patterns |

## CTX — Context & State (5 items)

| # | Item | Source |
|---|---|---|
| CTX-1 | Progressive disclosure (three-tier skill loading) | `concepts.md` §Core Design Patterns |
| CTX-2 | `.local.md` pattern (YAML front matter + Markdown body, gitignored state) | `patterns.md` §State Management |
| CTX-3 | `TodoWrite` for progress tracking (externalized stable anchor) | `patterns.md` §State Management |
| CTX-4 | Self-referential loop / Stop-based loop control (filesystem as feedback channel) | `components.md` §Representative hook patterns + `patterns.md` §Advanced Patterns — canonical here |
| CTX-5 | Conversation pattern mining (history → hook rules) | `patterns.md` §Advanced Patterns |

## Duplicates resolved

Six items appear in more than one source. Canonical domain is the single entry listed above; other occurrences are now cross-references.

| Canonical | Duplicate sources collapsed into it |
|---|---|
| `SPC-9` Three roles of SKILL.md | `concepts.md` §Three roles of SKILL.md, `components.md` §Three roles a SKILL.md can play |
| `SPC-15` PreToolUse two-layer design | `components.md` §Representative hook patterns (PreToolUse bullet), `patterns.md` §Fixed patterns vs dynamic rules |
| `PRM-1` Prompts are instructions | `concepts.md` §Prompts are instructions to Claude, `components.md` §Write commands as instructions |
| `FLW-8` Reporter-evaluator separation | `components.md` §Separation of reporter and evaluator, `patterns.md` §Separation of reporter and evaluator |
| `FLW-10` Double eligibility check | `patterns.md` §Double eligibility check, `patterns.md` §Double eligibility in long-running reviews |
| `CTX-4` Self-referential / Stop-based loop | `components.md` §Representative hook patterns (Stop-based loop bullet), `patterns.md` §Self-referential loop |

## Out of scope (this pass)

| Source | Treatment | Reason |
|---|---|---|
| `concepts.md` §Component inventory of official plugins | Reference table, not an item. | Data, not knowhow. |
| `components.md` §Representative specialized agents | Exemplars of existing items (agent front matter, parallel dispatch, model tiering). | Illustrations, not standalone knowhow. |
| `case-studies.md` (all) | Will be linked to items as exemplars in a later pass. | Case studies are examples of these patterns, not independent items. |
| `checklists.md` (all) | Will be attached as checkable surface of parent items in a later pass. | Checkboxes express the same knowhow in verification form. |

## Totals

| Domain | Items | Share |
|---|---|---|
| ARC | 5 | 10% |
| SPC | 19 | 39% |
| PRM | 9 | 18% |
| FLW | 11 | 22% |
| CTX | 5 | 10% |
| **Total** | **49** | — |

Duplicates collapsed: 6 (listed above). Raw count before dedup: 55.

## TODO

- Stage 2: assign ESLint-style kebab-case names and abbreviated IDs derived from initials, scoped per domain.
- Stage 3: attach `checklists.md` items to their parent knowhow entries as the checkable surface.
- Stage 4: link `case-studies.md` sections to the knowhow items they exemplify.
- Decide whether `SPC` is too large (19 items, ~39%) and needs a sub-axis, or stays flat because its items are genuinely component-scoped.
- Confirm `CTX-4` naming — "Self-referential loop" is `ralph-loop`-specific; the general mechanism is "filesystem-as-feedback-channel" and the Stop hook is one way to trigger it.
