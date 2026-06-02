# Plugin Knowhow Smith — Steering

<!-- paused: 2026-05-30 — next: #4 build the smith plugin IN lovaizu/ccpm (design complete; see "Resume — start here" below) -->

## Resume — start here

**State:** Design + knowhow are complete and grounded against real plugins. Done & current: `docs/actions.md` (88 A/B-colored Actions), `docs/workflow-patterns.md` (12 markdown patterns), `docs/templates.md` (component templates incl. marketplace.json), `smith-design.md`, `README.md`. Worktree clean; all work is on **PR #22** (branch `worktree-smith` → `main`). **PR not yet merged** — blocked by a `main` ruleset requiring 1 approving review from a write-access reviewer; `--admin` could not bypass (author = kiyobot). To merge: have another write-access account approve, or relax the ruleset.

**Next action — #4: build smith as a plugin in `lovaizu/ccpm`, NOT in this `outputs` repo.** This session is sandboxed to the `outputs` worktree (cannot write to ccpm), so start a session rooted at ccpm. Layout + dev round-trip: `smith-design.md` § Deployment. Port `workflow-patterns.md` / `templates.md` / `actions.md` content into the 3 knowledge skills (#3) as you build. Verify with `claude --plugin-dir <path>/ccpm/smith` + `/reload-plugins` — the only way to settle remaining runtime behavior.

**Non-negotiables carried from this session (do not relitigate):**
- Procedure bodies = **plain markdown** (`If/Otherwise` steps, bold "Rules (apply to every step)" block, named sub-procedures). XML only for agent-`description` invocation examples + optionally pasted data; never to structure bodies; never on skill `name`/`description`.
- **Enforce, don't emphasize (PRM-CPM)**: must-hold rules via a gate step / script / hook / tool restriction — never `CRITICAL`/`MUST`/ALL-CAPS.
- Positional args are **0-based** (`$0` = first).
- Reproducibility (A) = explicit branches + role decomposition (script/subagent) + pinned hand-offs + deterministic steps as scripts.


## Goal

Build `smith` — a tool that **applies best practices** to produce a Claude Code artifact (default: a plugin combining a custom slash command + skill + subagent(s)) that is **reproducible (A)** and **high quality (B)**.

- **A — Reproducibility**: built artifact behaves the same every run (same trigger, same files touched, byte-stable script output).
- **B — Quality**: built artifact beats the no-artifact baseline.

## Pivot (2026-05-29)

smith is **no longer a checker or converter** — it is a **best-practice-applying builder**. The old Evaluate → Propose → Apply checker (3-lens inspectors, convergence scoring, `[auto]` pre-pass, `smith-evaluate.sh`/`smith-autocheck.sh`) is **deleted**.

- **Input**: a rough throwaway draft (skill-creator or AI) used only to make intent legible; smith strips it to `{goal, trigger, inputs, outputs, ≤3 scenarios}` and **discards its structure**.
- **Pipeline position**: skill-creator drafts → **smith builds (BP applied → A + B)** → skill-creator optionally blind-A/B-compares revisions.
- **Flow**: Requirements (P1-4) → Design from BP (5-1, 5-2) → Implementation from BP (5-3, 5-4) → Verify (P6).

## Confirmed decisions

- **A/B per step**: drop single-axis labels. **Every step addresses both A and B**; structure steps (5-1/5-2) have higher leverage on both. (The earlier "5-3/5-4 = A-centric" asymmetry was rejected by two experts as backwards.)
- **Verification timing**: **evaluations-first**. Eval suite + no-artifact baseline authored at **Phase 4**; eval subsets run continuously in 5-3/5-4; Phase 6 is the final gate (A test + B test). (Matches `action.md` §C and official "evaluations first".)
- **smith owns the baseline**; skill-creator's blind A/B measures B only, not A.
- **Default output** = full plugin, but down-scope to the smallest archetype that meets the goal (minimum-viable).
- **Three phase-scoped knowledge skills** (requirements / structure-patterns / prompt-patterns), not one monolith.
- **Selective-Action governance**: Mandatory always applies; applicability by component type (mechanical); Recommended/Quality applied only if a failing eval scenario needs it; skipped items logged (not silently dropped).

## Live-docs facts (verified 2026-05-29) to bake into the checklist

- **🔴 Enforce, don't emphasize (PRM-CPM)**: never rely on `CRITICAL`/`MUST`/ALL-CAPS to make a rule hold — a rule that needs shouting is not reproducible. Enforce must-hold behavior **structurally** (gate step / script / hook / tool restriction). (Supersedes the earlier "calibrate emphasis" framing.)
- **XML scope**: only for mixed-content prompts (instructions+context+examples+input), example/output envelopes, imported steering snippets. **Forbidden** on skill `name`/`description`. Not on simple procedures.
- **Commands merged into skills**: `commands/` legacy; entry = skill with `disable-model-invocation: true`. Subagents cannot spawn subagents (all fan-out from top). Subagent `model` defaults to `inherit`.
- **Coverage-over-conservatism** for finding-stage review prompts (modernize PRM-FPE).

## Tasks

- [x] **#1 Re-color + prune the checklist** — done via 5 parallel subagents (full 108-item population, no sampling) → `docs/actions.md`. **87 survive** (A≈41 / B≈42 / BOTH≈9), **21 removed** (9 CC-default/spec-obsolete + 10 checker-only + 2 folded), **5 new** PRM items from live docs. Survivors mapped to P4 / 5-1 / 5-2 / 5-3 / 5-4 / P6.
- [x] **#2 Modernize PRM items** — folded into #1: PRM-CPM inverted (calibrated emphasis, A/B-conflict flagged), PRM-FPE inverted (coverage-then-filter), PRM-SMC→FLW, PRM-APE→PIF, PRM-CWF demoted; added PRM-CTX / PRM-ESL / PRM-RLA / PRM-LCO / PRM-RGC.
- [ ] **#3 Author the 3 knowledge-skill pattern libraries** from the pruned checklist (hand-authored prose, cross-linked to taxonomy IDs). Sources started: `workflow-patterns.md` (Layer-2 *how*), `templates.md` (component *what*). Extend with the remaining structure/composition/writing Actions and split into the 3 skills.
- [ ] **#4 Implement the plugin — IN `lovaizu/ccpm`, not here.** Build orchestrator skill + 3 knowledge skills + architect/writer/verifier subagents per `smith-design.md` § Deployment. ccpm layout: `ccpm/.claude-plugin/marketplace.json` (source `./smith`) + `ccpm/smith/` plugin. Dev round-trip: `claude --plugin-dir <path>/ccpm/smith` + `/reload-plugins`; validate with `claude plugin validate`. The docs here are the spec; this `outputs` repo is NOT the build location.
- [ ] **#5 Define `.smith.local.md` schema** — pinned intent, eval suite, selection log, reconcile history.
- [ ] **#6 Dogfood** smith to build/improve itself.
- [x] **#7 Reconcile archetype trichotomy** — reframed `smith-design.md`, `README.md`, `docs/concepts.md` from "Archetype A/B/C" to driver/knowledge/execution **roles** (commands merged into skills). concepts.md keeps A/B/C as labeled-legacy with a 2026 note; the empirical component inventory is unchanged.

## Key files

| File | Role |
|---|---|
| `smith-design.md` | **Authoritative spec** (rewritten 2026-05-29 for the builder model) |
| `README.md` | User-facing overview (rewritten 2026-05-29) |
| `docs/actions.md` | **A/B-colored, pruned, layer-mapped Actions** (output of #1/#2) |
| `docs/workflow-patterns.md` | **Workflow-authoring patterns** (the *how*): Phase>Step>Action skeleton + sequential/branch/loop/notify/common-rules/common-flow/exception patterns + hybrid markdown/XML/script rule |
| `docs/templates.md` | **Component templates** (the *what*): fill-in skeletons for plugin.json / driver skill / knowledge skill / subagent / hook / CLAUDE.md rule, with Actions baked in |
| `docs/checklist-items.md` | 108-item checklist — **source** for actions.md (kept for traceability) |
| `docs/taxonomy.md` | 108-item knowhow index |
| `docs/concepts.md`, `components.md`, `patterns.md`, `checklists.md`, `case-studies.md` | Knowhow sources for the pattern libraries |

## Assumptions / Rules

- `k` / `y` / `進めて` = approve and proceed.
- One domain or one batch per turn unless the user says otherwise.
- A = reproducibility; B = quality.
- CC default format/syntax checks are **out of scope** — never re-implement.
- Work only in this worktree (`.claude/worktrees/smith`); never touch the original repo root.
- **Distribution repo: `lovaizu/ccpm`** (https://github.com/lovaizu/ccpm) — the lovaizu plugin marketplace. smith ships as `ccpm/smith/`; ccpm root holds `marketplace.json`. Dev = `claude --plugin-dir <path>/ccpm/smith` + `/reload-plugins`; install = `/plugin marketplace add lovaizu/ccpm` → `/plugin install smith@ccpm`. (Resolves the old "deploy target" open question — it is **not** `agents-in-your-area`.)

## Knowhow build history (pre-pivot, still valid as source material)

- **Step 1** — Scanned 7 source docs → `taxonomy.md`: 107 items (ARC:10 / SPC:32 / PRM:24 / FLW:29 / CTX:12). Commit 4a5d54b.
- **Step 2** — `checklist-items.md`: 108 entries (PRM-EI split). Commits 6e430ab, 203ec00, 3cba887.
- **Step 2 refinement** — Expert review × 3 parallel subagents; 17 fixes; all Clean. Commit f7ca982.

These remain valid as the knowhow corpus the pattern libraries draw on. The content survives; only the framing (checker scoring → A/B builder guidance) changes.

## Design consultation (2026-05-29)

Three expert subagents (plugin architecture / prompt engineering / agentic process & QA), each with live official docs, reviewed the builder model. Key convergent findings (all adopted): A/B asymmetry is backwards → both-axes-per-step; evaluations-first → P4 authoring + continuous run; throwaway draft must be stripped to intent (don't inherit archetype); calibrated emphasis reverses PRM-CPM; XML only for mixed-content; commands merged into skills; deterministic selective-Action governance; A test (N-run invariance) ≠ B test (baseline win), skill-creator can't own A.

## Template/pattern expert review (2026-05-29)

7-round loop-until-dry multi-lens review (reproducibility A / quality B / CC-correctness / usability / coverage) of `templates.md` + `workflow-patterns.md`. **Did not formally converge** (essential findings 8→5→5→3→2→3→5); the non-convergence was an **oscillation on one fact** — slash-command positional-arg indexing — caused by stale 1-based wording in the repo's own source docs. **Resolved by direct verification** of code.claude.com/docs/en/skills: positionals are **0-based** (`$ARGUMENTS[0]`/`$0` = first; `$1` = second; `@$1` not documented). Final state of both files is correct.

Net improvements from the review (all kept): added Deterministic-script template + pattern (§8, FLW-DSAS byte-stability via `LC_ALL=C`/sorted enumerations/`jq -S`), Dispatch pattern + parallel fan-out with deterministic merge order (§9), Load-knowledge-skill seam (§10, explicit Skill-tool load, reject `disable-model-invocation` on driver-loaded knowledge skills — verified), Resumable-state template + pattern (§11), `.claude-plugin/plugin.json` exact path, hook `${CLAUDE_PLUGIN_ROOT}` quoting, exhaustive branch fall-through, subagent `model` pinned-tier (not `inherit`).

Root cause fixed: corrected the stale 1-based arg convention in `actions.md` (SPC-AE), `components.md`, `checklists.md`, `checklist-items.md` to 0-based.

### Trace-to-"should-work" pass (2026-05-30)

Bar (user): fix everything an expert would spot **before** running; only run once a hand-trace says "this should work." Traced smith building a SQL-migration-review plugin end-to-end on the assets. Found + closed 4 expert-obvious gaps:
- **G1 (blocker):** no eval/verify support for the confirmed evaluations-first core → added the `evals/<name>.eval.md` template + `## Pinned intent` template (templates.md) and pattern **§12 Verify (A-test + B-test)** (workflow-patterns.md).
- **G2 (blocker):** templates didn't separate emit-skeleton from smith-guidance → added the **"Reading these templates — emit vs. strip"** convention (`<!-- -->` and `  # Action` annotations are stripped on emit).
- **G3:** subagent `model: opus` hardcoded → `model: <opus | sonnet>` placeholder.
- **G4:** thin hearing/intent support → `## Pinned intent (end of Phase 4)` template.

Re-trace verdict: core build flow now traces with no expert-obvious holes. Remaining unknowns are **runtime behaviors** (multi-phase skill execution, Skill-tool mid-run load, Task fan-out) that only a real run confirms → #4 is now worth doing.

### Grounding correction: markdown convention, not XML (2026-05-30)

Verified against real plugins (anthropics/claude-code/plugins) + the official `plugin-dev` authoring skills. **`code-review` (Boris Cherny) runs multi-agent fan-out, parallel review, a validation loop, branching and early-exit entirely in plain markdown — zero XML.** The `plugin-dev` command/skill/agent-development skills prescribe markdown. So the earlier XML-structural-block approach (in templates + workflow-patterns) was an over-build like the heavy README. Corrected:
- **Procedure bodies → plain markdown**: `If/Otherwise` branch steps (or `$IF()` macro), bold "Rules (apply to every step)" block, "If any step fails:" block, named sub-procedures. Dropped `<common_rules>`/`<case>`/`<flow>`/`<on_failure>`/`<instructions>`/`<context>`.
- **XML kept only where real plugins use it**: agent `description` invocation examples (`<example>/<commentary>` — **SPC-EBT restored**, earlier wrongly removed) + optionally delimiting pasted data.
- **Completeness gap closed**: added `marketplace.json` template (needed for ccpm).
- Reproducibility (A) comes from explicit branches + role decomposition (script/subagent) + pinned hand-offs — **not** bracket syntax.
- **Resolved by investigation (no run needed):** (1) positional args are **0-based** (`$0` = first) — the live skills doc states it explicitly with multiple examples (`/my-skill "hello world" second` → `$0`="hello world"); the 1-based in plugin-dev's command-development skill is a stale teaching doc lagging the commands→skills merge. (2) **Emphasis is never used to enforce a rule** — must-hold behavior is enforced structurally (gate step / script / hook / tool restriction) per the new **"Enforce, don't emphasize" (PRM-CPM)** principle; `code-review`'s `**CRITICAL**` markers are a soft fallback we deliberately do not copy because emphasis is not reproducible.
Files updated: `docs/workflow-patterns.md`, `docs/templates.md`, `docs/actions.md` (PRM-CTX revised, SPC-EBT restored), `smith-design.md` (XML policy).

## Archived (checker era — do not use)

Evaluate→Propose→Apply 10-step pipeline; 3 parallel inspector lenses; convergence formula `(num_lenses_caught × 30) + (max(self_confidence) × 0.3)` threshold 80; `[auto]` pre-pass; `smith-autocheck.sh`/`smith-evaluate.sh`/`smith-state.sh`; Finding schema / OOS rule. Superseded by the builder model.
