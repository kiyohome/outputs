# smith — Design Specification

> smith applies best practices to build a high-quality, reproducible Claude Code artifact. It is **not** a checker and **not** a converter. Given a rough throwaway draft of what the user wants, smith elicits the real intent, then designs and implements a proper artifact (by default a plugin) grounded in canonical patterns, verifying against a pre-authored evaluation suite throughout.

## Overview

- **Purpose**: apply best practices (定石) to produce a Claude Code artifact that is **reproducible (A)** and **high quality (B)**.
  - **A — Reproducibility**: the built artifact behaves the same way every run (same trigger, same files touched, byte-stable script output).
  - **B — Quality**: the built artifact produces better results (right structure, clean responsibility split, sharp instructions).
- **Default output**: a **plugin** combining a custom slash command + skill + subagent(s). smith may emit a smaller artifact (skill-only, or command+agent) when the intent is small — see [Minimum-viable output](#minimum-viable-output).
- **Input**: a rough, **throwaway** draft made by skill-creator or by an AI. Its only role is to make the user's intent legible. smith strips it to intent and **discards its component structure** — see [Input model](#input-model).
- **Identity**: a builder/craftsperson. smith designs and writes the artifact itself; it does not grade an existing one.
- **Out of scope**: re-implementing Claude Code's built-in format/syntax validation (kebab-case names, required front-matter, line limits, `${CLAUDE_PLUGIN_ROOT}` usage). The harness already does this; smith does not.

## Input model

smith starts from a rough draft (typically a skill emitted by skill-creator) plus user dialogue. The draft is an **intent-elicitation seed, not a base to improve**.

1. **Strip to intent.** smith reads the draft and restates, as a proposal, only: `{goal, user/trigger, inputs, outputs, ≤3 concrete usage scenarios}`.
2. **Discard structure.** The draft's component shape (e.g. "one skill") is dropped. It must **not** anchor the structure — a skill-shaped draft must not bias smith toward skill-only output.
3. **Hearing supplements.** Phases 1–3 fill the gaps the draft doesn't reveal, proposal-based with rationale.
4. **Re-derive structure in 5-1** from the taxonomy, never inherited from the draft.

> Rationale: a rough draft makes intent legible faster than a blank interview, but a draft is never structurally neutral — it smuggles in a structure. Keeping its intent and discarding its structure captures the benefit without the anchoring risk. (Aligns with `action.md` §A.5 — do not narrow/expand the goal.)

## Flow — Phase > Step > Action

Six phases. Hearing (1–4) is **proposal-based**: each proposal builds on prior phases and carries its rationale. Evaluations are authored at the end of Phase 4 and run continuously from there (evaluations-first).

### Phase 1–4 — Requirements

| Phase | Action | A/B |
|---|---|---|
| 1 Background | Restate the problem the artifact solves (start from the real gap, not the draft). | B-led |
| 2 Goal | Define the goal **plus success criteria and verification method** (`action.md` §A.2). The criteria authored here become the eval rubric. | B-led |
| 3 Constraints | Target model(s) (Haiku/Sonnet/Opus), tools, side-effects, scope/non-goals. The model set and `disable-model-invocation` bound the non-determinism A must later prove stable. | A-led |
| 4 Propose UX + author evals | Propose usage, ≥3 concrete scenarios, and output examples. **Then author the evaluation suite** (`{query, files, expected_behavior}` ×≥3) and **capture the no-skill baseline** (Claude on the same scenarios without the artifact). | A+B |

Phase 4 is the pivot: nothing in Phase 5 starts until the eval suite and baseline exist.

### Phase 5 — Design then Implementation, applying best practices

Every step addresses **both** A and B. Structure steps (5-1, 5-2) have the highest leverage on both axes; part-polish steps (5-3, 5-4) have lower but nonzero leverage on both. There are **no single-axis steps**.

| Step | Action | A contribution | B contribution |
|---|---|---|---|
| **5-1 Turn goal into structure** (roles + parts + flow) | Re-derive the structure from the goal — assign **driver / knowledge / execution** roles and the component mix that realizes them (not the legacy Archetype A/B/C); decompose into parts; design the flow. Decide **what becomes a deterministic script vs. an LLM step**, and where verifiable intermediate outputs sit. | Highest A lever: pushing logic into byte-stable scripts and gating non-determinism is what makes runs repeatable. | Highest B lever: how parts divide/connect sets the ceiling on quality. |
| **5-2 Confirm parts & interfaces** | Pin the seams: handoffs, approval gates, `plan→validate→execute` boundaries, per-part degree-of-freedom budget, description-as-trigger. Run the eval subset covering wiring. | Fixed seams ⇒ same handoff every run. | Responsibility separation + trigger design ⇒ quality. |
| **5-3 Build per-part work instructions** | Write each part's prompt from the pinned design: numbered procedure + branches + output contract; instruction-vs-explanation separation; scripts that "solve, don't punt." | Removing room for guessing ⇒ stable behavior. | **B lives here too:** trigger wording, concrete I/O examples, consistent terminology, rationale-not-just-rules. |
| **5-4 Optimize parts one by one** | Polish each isolated part. Run the eval subset for each touched part as a feedback loop (validator → fix → repeat). | Tighten freedom on fragile parts; move flaky steps into scripts. | Prune verbosity; capture gotchas/failure modes. |

### Phase 6 — Verify & improve

Runs the **pre-authored** Phase-4 suite (not freshly invented criteria). Two independent passes (`action.md` §C.4):

- **A test (reproducibility):** run each fixed scenario **N≥3 times per target model**; A passes iff the **invariants are identical across all runs and models** — (a) same skill/command triggered, (b) same set of files touched, (c) byte-identical script outputs, (d) all `expected_behavior` rubric items pass. Variance in (a)–(c) is a defect → lower degrees of freedom or move the varying step into a script, then re-run.
- **B test (quality):** run the artifact on the scenarios and score against the rubric; **B passes iff artifact ≥ no-skill baseline** on every scenario. Optional relative-B comparison between two built versions may delegate to skill-creator's blind A/B comparator.

Phase 6 is the final gate. It does not author criteria and it does not fix-and-self-approve (the verifier reports; the orchestrator applies fixes).

### Approval gates

Hard gates (no proceed without user approval):

1. **End of Phase 4** — confirm the pinned intent statement + UX + eval suite. This is the fixed point for Phases 5–6.
2. **End of 5-1** — user picks among the 2–3 parallel architect designs.
3. **Before any disk write** — preview the file tree + per-file diffs.
4. **Phase 6 findings** — per finding: fix now / accept / defer. No silent skips (`action.md` §C.5).

These gates are enforced **structurally** — each is a step the procedure cannot pass until its exit condition (e.g. user approval) is met; reproducibility comes from this ordering, not from emphasis. smith never relies on `CRITICAL`/`MUST` markers to make a rule hold — a rule that needs emphasis to be obeyed is not reproducible. See `docs/workflow-patterns.md` § Writing rule (Enforce, don't emphasize).

## A/B model

A and B are orthogonal **value axes**, but they are **not** split across the flow halves. Both are present in every step; structure (first half) has higher leverage on both. Per-wording A-vs-B classification is replaced by one question per Action: *does this remove a degree of freedom Claude would otherwise resolve nondeterministically?* (raises A) and *does it raise result quality vs. baseline?* (raises B). Many Actions raise both.

## Best-practice pattern libraries (the 定石 smith holds)

Three layers, each loaded only by the phase that needs it (progressive disclosure). IDs cross-reference `taxonomy.md`. The libraries are **sources of Actions, applied selectively** — see [Selective-Action governance](#selective-action-governance).

The full, layer-mapped Action list lives in `docs/actions.md` (each item tagged A/B and assigned to P4 / 5-1 / 5-2 / 5-3 / 5-4 / P6); the three knowledge skills (`smith-structure-patterns`, `smith-prompt-patterns`, plus the requirement procedures in `smith-requirements`) are authored by porting these Actions into prose, phase-scoped per the table below. Layer 1 ↔ structure Actions; Layers 2–3 ↔ writing Actions + `docs/workflow-patterns.md`.

### Layer 1 — Structure/role patterns (Phase 5-1/5-2)

Structure selection (decide first): assign roles — driver/orchestration, knowledge, side-effecting execution — and the component mix that realizes them, before decomposition. (The legacy Archetype A/B/C trichotomy is a special case from when commands were distinct from skills; commands are now authored as skills.) Decomposition: three-layer separation, minimum-viable-plugin, skill-three-roles, progressive-disclosure layering. Multi-agent wiring: reporter/evaluator separation, parallel-perspective split, parallel-vs-sequential, selective dispatch, whole-view singleton agent, **subagent-vs-inline** (hard rule: subagents cannot spawn subagents — all fan-out originates at the top-level orchestrator), `skills`-preload vs `context: fork`, model-tier-by-judgment-density. Interfaces: allowed-tools least-privilege, explicit approval gates, phase-control markers, `.local.md` state + TodoWrite anchor, `${CLAUDE_PLUGIN_ROOT}` portability.

### Layer 2 — Prompt-composition patterns (Phase 5-3)

How a command/agent/skill prompt is structured — **plain markdown** (see `docs/workflow-patterns.md` § Writing rule): role lead for agent bodies; numbered procedure + `If/Otherwise` branch steps with explicit fall-through; a bold "Rules (apply to every step)" block; two-step output contract (declare structure, then format rules); long-context ordering (longform material at top, task at bottom); inject live data with `` !`command` `` / `@file`; reversibility-gated confirmation (act freely on reversible ops, confirm before destructive/shared/irreversible). XML only for agent-`description` invocation examples (`<example>/<commentary>`) and optionally delimiting pasted data — never to structure the body.

### Layer 3 — Concrete-writing patterns (Phase 5-4)

Word-level craft. **Enforce critical behavior with structure, not emphasis (PRM-CPM)** — never rely on `CRITICAL`/`MUST`/ALL-CAPS to make a rule hold (not reproducible); move must-hold rules to a gate step / script / hook / tool restriction. Plain, direct wording for the rest. Positive form over negative; reason-attached instructions; explicit scope to defeat literalism ("apply to every section, not just the first"); concrete over qualitative bars; third-person active skill descriptions; consistent terminology; default + escape over option lists; time-independent phrasing.

### XML policy (revised — grounded in real plugins)

Plugin procedures are written in **plain markdown** (headings, numbered steps, `If/Otherwise` branches, bold "Rules" blocks) — matching the official `plugin-dev` authoring skills and real plugins like `code-review` (which runs multi-agent fan-out, branching, and a validation loop entirely in markdown). XML is used in only two places, the only places real plugins use it: (1) **agent `description` invocation examples** (`<example>/<commentary>`), and (2) optionally, delimiting a block of **pasted runtime data**. XML is **forbidden** on skill `name`/`description`, and is **not** used to structure procedure bodies (steps / branches / rules / exceptions). The structure that delivers reproducibility (A) is explicit branches + role decomposition (script / subagent) + pinned hand-offs — not bracket syntax. See `docs/workflow-patterns.md` § Writing rule.

### Model-era note

The literalism / explicit-scope patterns target Opus 4.5/4.6/4.8. The Enforce-not-emphasize principle is **model-independent** — structural enforcement (gate step / script / hook / tool restriction) works on every model, so smith does not fall back to `MUST`/`CRITICAL` markers even for older targets; it relies on structure instead.

## Selective-Action governance

"Apply only what serves the goal" must be deterministic, or smith's own behavior becomes non-reproducible. Selection is a pure function of `(component type, eval results, severity tier)`:

1. **Mandatory tier is non-selective** — always applied to every component of the matching type.
2. **Applicability is mechanical** — by component type (lookup against the per-type pattern files), not judgment.
3. **Recommended/Quality is eval-gated** — applied only if it targets a checklist item that a currently-failing eval scenario needs. Unneeded items are **deferred (logged), not silently dropped**.
4. **Selection is logged** to `.smith.local.md` so the same inputs yield the same selection and a reviewer can audit why an item was skipped (`action.md` §C.5).

## Architecture

A plugin combining a driver skill + knowledge skills + execution subagents (formerly the "hybrid" archetype). All fan-out (Task dispatch) originates in the orchestrator; subagents never dispatch subagents.

Each part below is emitted from its fill-in skeleton in `docs/templates.md` (`marketplace.json` / `plugin.json` / driver skill / knowledge skill / subagent / hook / `evals/*.eval.md`); the Actions baked into each part are in `docs/actions.md` (A/B-colored, mapped to the phase that applies them); how those Actions are written into a procedure body is `docs/workflow-patterns.md` § Writing rule. **To implement, read those three files plus this spec — nothing in `steering.md` is needed (steering drove the design, not the build).**

| Part | Form | Model | Role | Phases |
|---|---|---|---|---|
| `smith` | Entry skill (`disable-model-invocation: true`) — the `/smith` slash command | inherit | Orchestrator: hearing, holds the pinned intent statement, owns approval gates, all fan-out, writes, persistence. | 1–6 |
| `smith-requirements` | knowledge skill (`user-invocable: false`) | — | The 4 requirement phases, strip-to-intent rule, eval-authoring + baseline procedure. | 1–4 |
| `smith-structure-patterns` | knowledge skill | — | Layer-1 structure/role patterns. | 5-1, 5-2 |
| `smith-prompt-patterns` | knowledge skill | — | Layer-2 composition + Layer-3 writing patterns; XML policy. | 5-3, 5-4 |
| `smith-architect` | subagent, 2–3 parallel | Opus | 5-1: propose competing structural designs; each commits to one blueprint. | 5-1 |
| `smith-writer` | subagent, parallel per independent part | Sonnet | 5-3/5-4: write each part's prompt from the pinned design. | 5-3, 5-4 |
| `smith-verifier` | subagent (or delegate to skill-creator eval) | Opus | 6: A test + B test; reports, does not fix. | 6 |

### Rationale

- **Three knowledge skills, not one monolith** — the pattern layers are phase-scoped, so each phase loads only its slice (progressive disclosure). Loading all patterns every phase would defeat it.
- **architect = Opus** — 5-1 is the highest judgment density; a wrong decomposition propagates. **writer = Sonnet** — bounded, pattern-guided prose from a fixed blueprint. **verifier = Opus** — a late goal-misalignment is the costliest miss, and the verifier must resist rubber-stamping. **orchestrator = inherit** — dialogue/gates/writes are non-judgment work; respects the caller's default.
- **No checker machinery** — the old inspector trio, convergence score, `smith-evaluate.sh`, and `smith-autocheck.sh` are deleted (review-pipeline residue, and the format checks are now harness built-ins). Phase 6 may keep a lightweight finding list for its approval gate only.

### Minimum-viable output

Default output is a full plugin, but smith down-scopes when the pinned intent is small (a single skill, or a driver skill + one subagent) per minimum-viable-plugin. smith proposes the smallest structure that satisfies the goal at the end of 5-1.

## skill-creator integration

| Stage | Owner | Produces | Consumes |
|---|---|---|---|
| Elicit | skill-creator | throwaway draft (intent only) | user idea |
| Baseline | **smith** Phase 4 | no-skill baseline run + frozen eval suite | draft reduced to intent |
| Build | **smith** Phases 5–6 | the plugin + continuous eval | eval suite |
| Relative-B compare (optional, on revisions) | skill-creator | blind A/B verdict between two built versions | two built versions |

Boundary: smith owns intent, structure, and **both** eval axes. skill-creator owns only draft generation and the optional relative-B blind comparison. smith owns the no-skill baseline (skill-creator's blind A/B measures B, not A — it cannot prove reproducibility).

## Assumptions from live official docs (2026-05-29)

- **Commands merged into skills** — `commands/` is legacy; new plugins use `skills/`. A skill with `disable-model-invocation: true` is the modern user-invoked slash command. Skill front-matter now carries `model`, `effort`, `allowed-tools`, `context: fork`, `agent`, `paths`, `user-invocable`, `argument-hint`/`arguments`.
- **Subagents cannot spawn subagents** — all fan-out originates at the top-level orchestrator.
- Subagent `model` defaults to `inherit`; `name`/`color` no longer required; subagents gained a `skills` preload field.

Sources: code.claude.com/docs (plugins, skills, sub-agents); platform.claude.com/docs prompting best practices (XML scope, calibrated emphasis, literalism, long-context ordering, code-review coverage-over-conservatism); agent-skills best practices (evaluations-first, third-person descriptions, "solve don't punt", XML-forbidden in name/description).

## Deployment & development round-trip

**Distribution repo:** `lovaizu/ccpm` (https://github.com/lovaizu/ccpm) — "Claude Code plugin marketplace for lovaizu projects". smith ships as a plugin **inside** ccpm. The design/knowhow in `claude-plugins-knowhow/` (repo `lovaizu/outputs`) is the **spec** the ccpm implementation follows; the plugin itself is built and distributed in ccpm, not in `outputs`.

**Layout in ccpm** — one repo serves as marketplace + plugin + dev target:

```
ccpm/
├── .claude-plugin/
│   └── marketplace.json      # { "name":"ccpm", "owner":{...}, "plugins":[{ "name":"smith", "source":"./smith", "description":..., "version":... }] }
├── smith/
│   ├── .claude-plugin/plugin.json     # { "name":"smith", "version":..., "description":... }
│   ├── skills/   smith (driver), smith-requirements, smith-structure-patterns, smith-prompt-patterns
│   ├── agents/   smith-architect, smith-writer, smith-verifier
│   ├── hooks/  scripts/  evals/
│   └── README.md
├── LICENSE
└── README.md
```

`source: "./smith"` is a **relative path** resolved from the marketplace root (the directory containing `.claude-plugin/`); relative-path sources only resolve when the marketplace is added via git. (`metadata.pluginRoot` could shorten it if more plugins are added later.)

**Round-trip — develop in place, no install, no two-repo sync:**

1. **Develop:** `claude --plugin-dir <path>/ccpm/smith` — loads the plugin straight from its directory, no install/marketplace needed.
2. **Iterate:** edit files, then `/reload-plugins` (reloads skills/agents/hooks/MCP/LSP without restarting). `--plugin-dir` takes precedence over an installed same-name plugin for the session.
3. **Test:** invoke `/smith:<skill>` (plugin skills are namespaced `smith:`), confirm subagents in `/agents`, verify hooks fire.
4. **Validate:** `claude plugin validate` (run in CI before publishing).
5. **Distribute:** push ccpm to GitHub. Users add it with `/plugin marketplace add lovaizu/ccpm`, install with `/plugin install smith@ccpm`, and update with `/plugin marketplace update`.

Standalone `.claude/` development and a GitHub-Action sync between repos are **not** needed — ccpm is simultaneously the dev location and the marketplace.

## Open items / deferred

- Exact prompt wording for the orchestrator skill, the three knowledge skills, and the three subagents (written during implementation).
- Reproducibility N and whether `temperature=0` is available in the target harness (affects the A test bar).
- Whether `smith-structure-patterns` / `smith-prompt-patterns` are hand-authored prose or generated from the taxonomy (lean: hand-authored, cross-linked to taxonomy IDs).
- `.smith.local.md` schema for the pinned intent, eval suite, selection log, and reconcile history.
- Model-era toggle behavior for older-model targets.
