# Actions

> Best-practice Actions for the **builder** smith, derived from `checklist-items.md` by: (1) re-coloring each item **A** (reproducibility) / **B** (quality) / **BOTH**, (2) pruning items that are now Claude Code **CC-default** format checks or **checker-only** (archived inspector/scoring pipeline), and (3) mapping survivors onto the three pattern layers and Phase>Step.
>
> Actions are a **source applied selectively** (see `smith-design.md` §Selective-Action governance): Mandatory always applies; applicability is by component type; Recommended/Quality apply only when a failing eval scenario needs them.

## Legend

- **Axis** — `A` reproducibility (removes a degree of freedom Claude would otherwise resolve nondeterministically) · `B` quality (beats the no-artifact baseline) · `BOTH`.
- **Layer** — `L1` structure/role · `L2` prompt-composition · `L3` concrete-writing.
- **Step** — `P4` requirements · `5-1` structure · `5-2` interfaces/wiring/gates · `5-3` composition · `5-4` writing · `P6` verification.

## Totals

| | Count |
|---|---|
| Original items | 108 |
| **Survive** | **88** (incl. 4 ARC archetype items folded into one decomposition action; SPC-EBT restored) |
| Removed — CC-default / spec-obsolete | 8 |
| Removed — checker-only | 10 |
| Folded into another action | 2 |
| **New** (from live official docs) | **5** |
| **Distinct Actions** | **~88 + 5 new = ~93** |

Axis split among survivors+new: **A ≈ 41, B ≈ 42, BOTH ≈ 9.**

---

## Phase 4 — Requirements

| id | slug | axis | note |
|---|---|---|---|
| ARC-AC | applicability-criteria | B | README "suitable for / not suitable for" — scope artifact. |
| SPC-DMI | disable-model-invocation | A | `disable-model-invocation: true` for side-effecting/manual skills; removes auto-fire risk. |
| SPC-HAR | hook-applicability-rule | A | Use a hook only for rules that must fire unconditionally; else a CLAUDE.md rule. |
| SPC-SDS | security-detector-set | B | Baseline dangerous-pattern coverage for security hooks. |
| PRM-VSC | verifiable-success-criteria | B | Define verifiable success criteria — becomes the eval rubric (evaluations-first). |
| CTX-CM | conversation-mining | B | For rule-gen plugins: what to capture (corrections, rollbacks, recurring failures). |

## Phase 5-1 — Structure (archetype / decomposition / flow)

| id | slug | axis | note |
|---|---|---|---|
| ARC-DECOMP | derive-component-set-from-goal | A | **Folded** from ARC-ACA/ASO/AH/AFD. Derive the component set from the goal; one driver, agents/forked-skills do bounded isolated work, reference skills hold knowledge. The old Archetype A/B/C trichotomy is legacy (commands merged into skills). |
| ARC-TLS | role-separation | A | Reframed: **driver/orchestration vs knowledge vs side-effecting execution** (not command/skill/agent layers). The decomposition spine. |
| ARC-CCH | component-choice-heuristic | BOTH | Pick user-invocable skill vs subagent vs hook by capability needed. |
| FLW-PVS | parallel-vs-sequential | B | Parallel for independent work, sequential for producer→consumer. |
| FLW-MTP | model-tier-pipeline | A | Tiered pipeline (Haiku filter → Sonnet analysis → Opus bottleneck). |
| FLW-PPS | parallel-perspective-split | B | Distinct lens per parallel agent. |
| FLW-RES | reporter-evaluator-separation | B | Producer ≠ judge; no self-scoring. (Drop the old convergence linkage.) |
| FLW-SDP | signal-driven-proposal | A | Proposals grounded in observed signals, not general state. |
| FLW-WVA | whole-view-agent | B | Singleton agent gets the whole-plugin view. Dispatched by the top-level orchestrator (subagents cannot spawn subagents). |
| FLW-STM | severity-tier-model | B | Three tiers: Mandatory / Recommended / Quality. |
| FLW-PSC | post-session-capture | B | Capture session-history signals into improvement proposals. |
| FLW-SDD | symptom-driven-diagnosis | B | Diagnose root cause from the symptom before fixing. |

## Phase 5-2 — Interfaces / wiring / gates

| id | slug | axis | note |
|---|---|---|---|
| ARC-PNE | propose-not-execute | B | Approval gate before irreversible actions. |
| SPC-ATR | allowed-tools-restriction | A | Minimal tool set per command/skill/agent (read-only for explorers). |
| SPC-AFM | agent-front-matter | A | **Modernized:** only `name`+`description` required; `model` defaults to `inherit`; no `<example>` blocks. Write a clear delegation-trigger description. |
| SPC-STR | skill-three-roles | A | Reference content vs task content (`/name`-invoked) vs forked; commit to one role. |
| SPC-SFC | skill-fork-context | A | `context: fork` for isolation (side effects / heavy I/O). |
| SPC-SAF | skill-agent-field | A | **Modernized:** `agent` selects the subagent type when `context: fork` is set (default `general-purpose`). |
| SPC-HER | hook-events-roster | A | Pick the correct hook event (PreToolUse blocking vs PostToolUse feedback vs SessionStart…). |
| SPC-THT | two-hook-types | A | `type: command` (deterministic) vs `type: prompt` (LLM judgment). |
| SPC-SSI | session-start-injection | A | SessionStart hook to guarantee per-session state injection. |
| FLW-EAG | explicit-approval-gate | A | Display-and-confirm before proceeding. |
| FLW-LEB | loop-escape-ban | A | No completion token until the condition is verified. |
| FLW-MTS | model-tier-selection | A | Deliberate per-agent model tier. |
| FLW-PC | phase-control | A | Explicit numbered phases + gates before irreversible actions. |
| FLW-SD | selective-dispatch | A | Dispatch only relevant agents on input signals. |
| FLW-PCP | parallel-candidate-presentation | B | Present candidates simultaneously for comparison. |
| FLW-DOW | dependency-ordered-writes | A | Write files in dependency order (foundation → dependents). |
| FLW-PVE | plan-validate-execute | A | No write before validation. |
| FLW-EPA | evaluate-propose-apply | A | Apply gated on prior phases. |
| FLW-DSAS | deterministic-steps-as-scripts | A | **Strongest A lever:** push deterministic logic (parsing, validation, dependency-ordering, plugin.json generation) into scripts, not prompts. |
| CTX-PD | progressive-disclosure | B | SKILL.md body holds core; edge-case detail → `references/` loaded on demand. |
| CTX-LMS | local-md-state-file | A | `.local.md` (YAML front matter + body) for resumable state. |
| CTX-TWA | todo-write-anchor | A | Externalize progress so long tasks don't lose place. |
| CTX-FFL | filesystem-feedback-loop | A | Read prior-turn outputs from disk, not conversation context. |
| CTX-RRR | runtime-rule-reload | A | Hook reloads rules fresh each invocation. |
| CTX-SST | session-snapshot-timing | A | SessionStart captures at open; mid-session changes need per-tool hooks. |
| CTX-CIR | claude-md-inclusion-rules | B | "Would removing this line cause mistakes?" — keep CLAUDE.md lean. |
| CTX-RHM | rule-hook-migration | A | Convert repeatedly-ignored rules into hooks for unconditional enforcement. |
| CTX-CMP | claude-md-placement | A | Right file level (personal / team / local). |
| CTX-SDW | skill-doc-wrapping | B | Wrap/link existing docs rather than duplicate. |

## Phase 5-3 — Prompt composition (Layer 2)

| id | slug | axis | note |
|---|---|---|---|
| SPC-ICE | inline-command-execution | A | `` !`cmd` `` to inject live context deterministically. |
| SPC-AE | argument-expansion | A | **Modernized:** `$ARGUMENTS` (full string) / `$ARGUMENTS[N]` **0-based** (`$ARGUMENTS[0]` = first) / `$N` shorthand (`$0` = first, `$1` = second) / named `$name` via `arguments:`. `@$1` no longer documented. (Verified against code.claude.com/docs/en/skills, 2026-05-29 — corrects the old shell-style 1-based assumption.) |
| SPC-PTL | pretool-two-layer | B | Fast deterministic first pass before any LLM pass. |
| PRM-SC | scope-constraint | BOTH | State scope explicitly (reinforced by Opus-4.8 literalism). |
| PRM-CD | code-delegation | B | Delegate genuine decisions only; keep solutions minimal. |
| PRM-FLD | freedom-level-declaration | BOTH | Declare high/medium/low degrees of freedom. |
| PRM-DPE | default-plus-escape | B | Provide a default with an escape hatch, not an option list. |
| PRM-SAC | single-approach-commitment | A | Pick one approach and commit; no mid-procedure branching. |
| PRM-FPE | false-positive-enumeration | B | **Modernized (inverted):** finding-stage prompts use coverage-then-filter (report all + confidence, downstream ranks). FP-enumeration only for genuine single-pass self-filter, and then concrete ("omit pure style nits"). |
| CTX-CS | context-separation | B | **Modernized:** what co-loads vs loads selectively (long-context ordering). |
| **PRM-CTX** | xml-scope | B | **NEW (revised).** Procedure structure (steps, branches, rules, exceptions) is **plain markdown**, not XML — matching the official `plugin-dev` authoring skills and real plugins (`code-review`). XML is used ONLY for (a) agent `description` invocation examples (`<example>/<commentary>`) and (b) optionally delimiting pasted runtime data. **Forbidden on skill `name`/`description`.** See `workflow-patterns.md` § Writing rule. |
| **PRM-LCO** | long-context-ordering | B | **NEW.** For 20k+ token inputs, longform data at top, query/instructions at end (up to ~30% quality gain). Content-conditional. |
| **PRM-RGC** | reversibility-gated-confirmation | BOTH | **NEW.** Gate confirmation on reversibility: act freely on local/reversible ops, confirm before destructive/shared/irreversible. Principled replacement for the old hard-marker gate. |

## Phase 5-4 — Concrete writing (Layer 3)

| id | slug | axis | note |
|---|---|---|---|
| PRM-IV | instruction-voice | B | Imperative directives. |
| PRM-CPM | enforce-not-emphasize | A | **Revised:** do **not** rely on emphasis (`CRITICAL` / `MUST` / ALL-CAPS) to make a rule hold — a rule that needs shouting to be obeyed is **not reproducible**. Enforce must-hold behavior **structurally**: a gate step the process cannot pass, a script/hook that blocks (exit 2), or a tool restriction (`allowed-tools`). Plain, direct wording for the rest. (Supersedes both the old hard-marker doctrine and the "calibrate emphasis" half-measure.) |
| PRM-OSD | output-shape-directives | B | Specify output structure. |
| PRM-SBS | concrete-example-shape | B | Literal I/O pairs, not abstract. |
| PRM-OFD | output-format-discipline | B | Precise format rules. |
| PRM-LFD | lean-forward-description | B | Third-person, active skill description (what it does + when). Overlaps SPC-DOM. |
| PRM-IS | instruction-specificity | BOTH | Specific instructions; underspecification breaks both axes. |
| PRM-PIF | positive-instruction-form | B | Tell what to do, not what not to do. (Absorbs former PRM-APE.) |
| PRM-IR | instruction-rationale | B | Add the "because" clause; Claude generalizes from it. |
| PRM-MSS | multi-step-structuring | B | Numbered checklist Claude can copy and check off. |
| PRM-TC | terminology-consistency | A | One term per concept. |
| PRM-TIC | time-independent-content | B | "Old patterns" section, no dated instructions. |
| PRM-NRP | null-result-protocol | BOTH | Define zero-result output. (Drop the keyword-matching `[auto]` portion.) |
| PRM-EI-S | example-inclusion-skill | B | Concrete example in skill body. |
| PRM-EI-CA | example-inclusion-command-agent | B | Few-shot example in command/agent. |
| PRM-CWF | context-window-frugality | B | **Demoted:** soft conciseness reminder; drop the 60-word/repeat regex. |
| SPC-DOM | description-optimization-methodology | B | Trigger-friendly description (verb + input + output). Highest skill-authoring lever. Overlaps PRM-LFD. |
| SPC-HSV | hook-stderr-visibility | A | exit-2 reason to stderr so Claude sees it. |
| SPC-HI | hook-idempotency | B | No unbounded append/accumulation. |
| SPC-FMS | front-matter-shell-io | A | Consistent YAML front-matter read/write for state files. Pairs with CTX-LMS. |
| SPC-HIV | hook-input-validation | B | Safe hook template (`set -euo pipefail`, jq stdin, quote expansions, block `..`). |
| **PRM-ESL** | explicit-scope-literalism | BOTH | **NEW.** Opus 4.8 won't silently generalize; state scope ("every section, not just the first"). |
| **PRM-RLA** | role-lead-agent | B | **NEW.** Open the agent/system body with a role sentence. |
| SPC-EBT | example-block-trigger | B | **RESTORED.** Agent `description` carries `<example>…<commentary>…</commentary></example>` invocation examples (real convention: agent-development skill, pr-review-toolkit). Earlier wrongly removed as "dead lore". |

## Phase 6 — Verification

| id | slug | axis | note |
|---|---|---|---|
| FLW-DEC | double-eligibility-check | A | Re-check eligibility before applying (guards state drift). |
| FLW-BAC | blind-ab-comparison | B | Blind A/B to remove identity bias in evaluation (the B test; skill-creator can run it). |
| FLW-FSB | finding-severity-bins | B | Group output by severity tier when reporting. |
| FLW-WQR | weighted-quality-rubric | A | Mechanical weighted rubric, not holistic impression. |
| FLW-PIV | pre-image-verification | A | Verify file pre-image before applying a patch. |
| FLW-REA | reconcile-expected-actual | A | Reconcile intended vs actual effects after applying. (Reframe `expected_effect` to "intended changes", not the old finding field.) |

---

## Removed — CC-default / spec-obsolete (8)

The Claude Code harness validators (`claude plugin validate`, the skill/agent loaders, `/agents`) already enforce these, or the spec they targeted no longer exists. smith must not re-implement them.

| id | slug | reason |
|---|---|---|
| ARC-SDL | standard-directory-layout | Harness-enforced top-level layout. |
<!-- SPC-EBT moved OUT of this list — restored as a kept Phase 5-4 action (agent-description invocation examples are a real convention). -->
| ARC-MVP | minimum-viable-plugin | `plugin.json` presence + `name` is harness-validated. |
| SPC-CA | color-assignment | Optional, fixed enum, `/agents` UI-assigned. |
| SPC-SFM | skill-front-matter | Format/presence harness-owned; also stale (1,536-char cap, `name` optional). |
| SPC-RTT | reference-toc-threshold | Line-count heuristic superseded by "<500 lines, supporting files on demand". |
| SPC-HJF | hooks-json-format | Valid-JSON + required fields = loader validation. |
| SPC-PRV | plugin-root-variable | `${CLAUDE_PLUGIN_ROOT}`-vs-absolute path is a harness path check. |
| SPC-MSF | mcp-server-file | `.mcp.json` valid-JSON + required server fields = loader validation. |

## Removed — checker-only (10)

Existed solely for the archived inspector/scoring pipeline. The builder has no finding/scoring pipeline.

| id | slug | reason |
|---|---|---|
| SPC-CGW | clean-gone-worktrees | Bug-specific inspector rule, not a generative best practice. |
| SPC-FS | finding-schema | Inspector finding object. |
| SPC-FTT | finding-type-taxonomy | `checklist:<type>:<slug>` finding strings. |
| SPC-PCF | patch-content-format | `patch_content` unified-diff for `smith-apply.sh`. |
| SPC-AJT | agent-json-transport | "Emit findings as JSON array" inspector contract. |
| SPC-OVR | oos-verdict-rule | OOS-vs-NG inspection-scoring rule. |
| FLW-CTF | confidence-threshold-filter | Convergence threshold (80). |
| FLW-CSF | convergence-scoring-formula | `(num_lenses × 30) + (max_confidence × 0.3)`. |
| FLW-AST | automation-stance-tagging | `[auto]`/`[judgment]` checklist-management mechanic. |
| FLW-EER | expected-effect-ranking | Ranks archived-schema findings; no builder analogue. |

## Folded into another action (2)

| id | slug | folded into | reason |
|---|---|---|---|
| PRM-SMC | single-message-completion | FLW dispatch contracts | Keyword-matching ("do not send any other text") is brittle and ungrounded; the one-shot-completion intent is a flow concern. |
| PRM-APE | anti-pattern-enumeration | PRM-PIF | Heading-count co-location lint is over-engineered; the substance is "prefer positive form". |

---

## Open follow-ups

- **Archetype trichotomy obsolete.** `smith-design.md` and `docs/concepts.md` still reference "Archetype A/B/C". Live docs merged commands into skills, so the trichotomy is legacy — reconcile both docs to the driver/knowledge/execution role framing (ARC-DECOMP / ARC-TLS).
- **Overlaps to merge when authoring the pattern libraries (task #3):** SPC-DOM ≈ PRM-LFD (skill description); SPC-FMS ≈ CTX-LMS (state-file pattern); SPC-SFC + SPC-SAF (one fork-config decision); CTX-PD + CTX-CS + CTX-SDW (progressive-disclosure cluster).
- **Clean `related` fields** on survivors that pointed at removed checker-only items.
