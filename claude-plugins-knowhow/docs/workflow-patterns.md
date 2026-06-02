# Workflow Authoring Patterns

> A prompt is a **work instruction = a workflow**. This is the Layer-2 template+pattern library smith uses to author procedure prompts (commands / skills / agents). It defines the **Phase > Step > Action** skeleton and the control-flow constructs — sequential, conditional branch, loop, user notification, common rules, common flow, alternative/exception flow — with concrete templates.
>
> Feeds the `smith-prompt-patterns` skill (steering task #3). Cross-references Actions in `actions.md`.

## Writing rule: plain markdown (the plugin-authoring convention)

A plugin procedure is written in **plain markdown** — verified against Anthropic's official authoring guidance (the `plugin-dev` command-development / skill-development / agent-development skills) and against real plugins (e.g. `code-review`, which runs multi-agent fan-out, parallel review, a validation loop, branching and early-exit **entirely in markdown**, no XML). What makes a procedure reproducible (A) and clear (B) is **not** bracket syntax — it is **explicit branches, role decomposition, and pinned hand-offs**, all expressible in markdown:

| Need | Form |
|---|---|
| Sequence, phases | markdown headings + numbered list / `- [ ]` checklist |
| Branch | numbered `If … → … / Otherwise → … / else stop` steps, or the `$IF($N, then, else)` macro |
| Common rules | a bold heading (`**Rules (apply to every step):**`) + bullets |
| Exception | an `If any step fails: …` line / block |
| Inject live data | `` !`command` `` or `@file` (NOT an XML wrapper) |
| Deterministic / complex logic | a **script** (FLW-DSAS) — output used verbatim |
| Heavy / independent work | a **subagent** (separate `agents/*.md`), dispatched by name |

**XML appears in only two places**, because that is the only place real plugins use it: (1) **agent `description` invocation examples** — `Examples:` then `<example>…<commentary>…</commentary></example>` (taught by the agent-development skill; used by pr-review-toolkit); (2) optionally, to delimit a block of **pasted runtime data** inside a prompt. XML is **forbidden** on skill `name`/`description`. Do **not** wrap procedure structure (steps, branches, rules, exceptions) in XML.

→ Net: **markdown for the procedure; scripts/subagents for the hard parts; XML only for agent-description examples and (optionally) pasted data.**

**Enforce, don't emphasize (PRM-CPM).** A rule that must hold is enforced by **structure / process** — a gate step the procedure cannot pass, a script/hook that blocks, or a tool restriction (`allowed-tools`) — **never** by `CRITICAL` / `MUST` / ALL-CAPS. Emphasis is not a reproducibility mechanism: a rule that needs shouting to be obeyed will eventually be ignored, so it is not a rule. Use plain, direct wording for everything else.

## Skeleton — Phase > Step > Action

The top-level shape of every smith-authored workflow. Phases are gated; steps are markdown; actions are imperative.

```markdown
## Phase N — <name>
**Goal:** <what this phase achieves.>
1. **<step>** — <imperative action>.
2. **<step>** — <imperative action>.
**Exit:** <the condition that must hold before the next phase.>
```

- A: fixed phase order + explicit exit gates ⇒ same path every run (FLW-PC, FLW-EAG).
- B: a stated per-phase Goal keeps each step purposeful.

## Control-flow patterns

Each pattern: **when** · **A/B** · **template**. All map to Actions in `actions.md`.

### 1. Sequential

When: steps run in fixed order with no decision. Default.

```markdown
1. <action>.
2. <action>.
3. <action>.
```
A+B (PRM-MSS). Use a `- [ ]` checklist instead when the model should track completion across a long run (CTX-TWA).

### 2. Conditional branch ("in the case of XXX")

When: the path depends on a condition. **Enumerate cases exhaustively, including the fall-through**, so no path is left to guess (A).

Short branches — inline markdown:
```markdown
3. If tests exist, run them; otherwise note "no tests" and continue.
```

Multi-line / nested branches — one bold-headed case per branch, with an explicit fall-through:
```markdown
Determine the archetype, then follow the matching case:

- **If a procedure the user triggers:**
  1. ...
  2. ...
- **If reference knowledge only:**
  1. ...
- **Otherwise (none of the above):** report that the target is unclassifiable and stop. Do not guess.
```
For a branch on an argument, the `$IF` macro is also available: `$IF($0, Review PR #$0, Ask for a PR number and stop.)`

A: exhaustive cases + explicit fall-through remove a degree of freedom (PRM-SC, PRM-ESL). B: bold case headings keep multi-line branches readable without non-standard syntax. (This is how `code-review` writes its `If … → stop / continue to step N` branches.)

### 3. Loop (loop-until / for-each)

When: repeat until a condition holds, or iterate over a known set. **Always bound iterations and forbid false completion** (FLW-LEB).

```markdown
Repeat until <termination condition> (max <N> iterations):
1. <action>.
2. Re-check <termination condition>.
If still unmet after <N>, report the residual and stop — do not emit a completion claim.
```
For-each:
```markdown
For each <item> in <set>, iterated in a fixed order — sort <set> by a stable key (file path / item name), never raw glob or directory order:
1. <action on the item>.
(Process every item; do not sample. State the count handled.)
```
Pin the iteration **order**, not just the coverage: when `<set>` is an enumeration (glob, `find`, directory listing, a returned list), its order is resolved nondeterministically, so any order-dependent body effect — write order, report order, accumulation, dependency-ordered writes — varies run-to-run unless sorted. Mirror §8/§9: sort by a stable key. A Mode-B agent self-fetch command (§9 / templates § context) must likewise pipe its enumeration through `LC_ALL=C sort`.

A: bounded + explicit termination + no-false-completion + full-population (action.md §B.2) + fixed iteration order so order-dependent effects are byte-stable.

### 4. User notification & approval gate

When: a consequential or irreversible decision. The gate is **structural, not emphatic** (PRM-CPM / PRM-RGC): a numbered step whose **exit condition is "user approved"**, with no later step reachable until it is met. Reliability comes from step ordering, not from shouting. Gate only the irreversible; act-and-notify for the reversible.

Irreversible (a gate step — the procedure stops here):
```markdown
N. Present <summary of what will happen> and ask: apply all / select a subset / reject.
   Exit: do NOT proceed to step N+1 until the user has approved.
```
Reversible (notify, don't block):
```markdown
Proceed, then report what changed in one line. The user can revert via git.
```
A: the gate is enforced by a fixed, unskippable step position — not by emphasis. B: gating only the irreversible avoids friction (FLW-EAG, PRM-RGC).

### 5. Common rules block

When: constraints that apply to every step. State **once**, near the top, in a bounded block.

```markdown
**Rules (apply to every step):**
- Never write outside the repository.
- Stop and ask before any destructive or irreversible action.
- Report facts; if a step is skipped, say so.
```
A: identical constraints every run. B: single source, no per-step repetition (PRM-CWF). (This is exactly how `code-review` states its "Agent assumptions (applies to all agents and subagents)" block.)

### 6. Common flow (shared sub-procedure)

When: the same sub-procedure is invoked from several places. Give it a named heading and refer to it by name; if it is deterministic, make it a **script**; if it is heavy or needs isolation, make it a **subagent**.

```markdown
### Pre-image check (sub-procedure)
1. Re-read the target file.
2. Confirm it still matches the expected pre-image; if not, halt and report.

... later ...
Before each write, run the **Pre-image check** sub-procedure above.
```
A: the same sub-procedure runs identically wherever invoked (DRY → no drift) (FLW-PIV; FLW-DSAS when extracted to a script).

### 7. Alternative / exception flow (on-failure / fallback)

When: define what happens when a step fails — separated from the happy path so it can't be skipped.

```markdown
**If any step fails:**
- Halt at the failing step. Do not auto-rollback.
- Report the partial state and point the user at `git status`.
- Never emit a completion claim while the failure stands.
```
A: failure handling is fixed and explicit, not improvised. B: a labelled block keeps it out of the happy-path prose (FLW-PVE, FLW-LEB).

### 8. Deterministic step → script

When: a step's result must be **byte-identical** every run — generating `plugin.json`, parsing, validation, dependency-ordered writes. The model resolves prose nondeterministically; a script does not. **Strongest A lever** (FLW-DSAS). The prompt invokes the script and consumes its output **verbatim** — it must not recompute the result.

Prompt-side invocation (skills / commands only — `!`cmd`` expands there, not in agents):
```markdown
The plan is fixed by `!`${CLAUDE_PLUGIN_ROOT}/scripts/<name>.sh`` — use that output verbatim; do not re-derive it.
```
Or the model runs it via Bash and reads the result:
```markdown
1. Run `${CLAUDE_PLUGIN_ROOT}/scripts/<name>.sh <args>`.
2. Use its stdout exactly as returned. Do not recompute or reorder it.
```
The script must be byte-stable — defeat the common nondeterminism sources:
- `export LC_ALL=C` (locale-independent collation & formatting);
- sort every enumeration (`find … | LC_ALL=C sort`); never rely on glob order;
- emit JSON with stable key order (`jq -S`);
- exclude timestamps, PIDs, hostnames, and random from any persisted or compared output.

A: one source of truth, identical bytes every run. B: logic lives in a tested script, not re-explained prose (FLW-DSAS). See the `scripts/<name>.sh` template in `templates.md`.

### 9. Dispatch (driver → subagent)

When: the driver fans out work to an execution subagent. In smith's default plugin this is the **load-bearing seam** between the driver and the subagent — all fan-out (Task dispatch) originates in the orchestrator; **subagents cannot re-dispatch** (fan-out only from the top).

```markdown
Dispatch `<agent-name>` via Task with:
- context: <the exact scoped material the agent needs — diff, file list, parameters — inlined in the prompt. The agent is NOT preprocessed, so it cannot expand `!`cmd``>.
- return: <the contract the agent must return — e.g. one finding per issue, or an explicit empty result>.
Use the returned result verbatim. Do not re-derive it.
```
**Commit to one context-provisioning mode per artifact** (decided in 5-2) — do not leave both live, because this seam must be fixed (A):

| Mode | When | Behavior pinned by |
|---|---|---|
| **Inline (preferred — deterministic)** | the driver already holds the material | the exact text inlined in the prompt; byte-stable, same files touched every run |
| **Agent self-fetch** | the driver cannot inline it | a **single fixed Step 1** in the agent's instructions — "Fetch context via `<exact command>`", not free choice — plus the matching tool in `tools:` |

Never emit "pass it in **or** have the agent fetch it" in the artifact: an unpinned choice at the seam lets the built plugin vary run-to-run (agent self-fetch via Bash can touch different files). Pick one, emit only that.

**Parallel fan-out (N independent agents).** smith's own default plugin runs 2-3 architects and parallel per-part writers (FLW-PVS / FLW-PPS / FLW-PCP). When the work splits into independent units, two more seams must be pinned or the built artifact's shape varies run-to-run (A):

- **Dispatch shape — parallel, one batch.** Issue **all N Task calls in a single assistant message** (one fixed batch, fixed agent set). State it explicitly: *"dispatch all N in one message; do not dispatch sequentially."* Sequential vs parallel left unpinned is a reproducibility seam.
- **Aggregation — fixed merge order.** When collecting the N returns, **merge them in a fixed order — sort by a stable key (agent name or target file path), never arrival/completion order** — before using. For an N-candidate fan-out, present **all** candidates together (FLW-PCP), not the first to return. Merging in arbitrary completion order makes the combined output vary run-to-run — the same defect §8 warns about for unsorted enumerations, at the dispatch seam.

```markdown
Dispatch all N agents in ONE assistant message (one Task call each, same batch every run — not sequential):
- `<agent-1>`: context <scope 1>, return <contract>.
- `<agent-2>`: context <scope 2>, return <contract>.
- … (fixed set)
On collection: sort the returns by <stable key — agent name / file path> (not arrival order), then merge. For candidate fan-out, present all candidates together; do not prefer first-to-return.
```

A: a fixed dispatch shape (named agent(s) + one committed provisioning mode + return contract + pinned parallel batch + deterministic merge order) removes free choice at the seam. B: explicit scope, contract, and parallelizing independent work keep the delegation bounded and well-structured (PRM-ESL, PRM-NRP, FLW-PVS, FLW-PPS, FLW-PCP). See the driver-skill § Dispatch in `templates.md`.

### 10. Load knowledge skill (driver → knowledge)

When: the driver depends on a knowledge skill (smith's default architecture loads knowledge skills per phase). The canonical mechanism is **explicit load via the Skill tool** — "on-demand reference, explicitly loaded by a command/agent via the Skill tool" (concepts.md / components.md). This is a load-bearing seam: if left unpinned, the model may improvise (description-match auto-trigger vs explicit load), which varies run-to-run. Pin it to **one** mechanism — explicit Skill-tool load — at the phase that needs it.

```markdown
At Phase N, before <step>, load `<knowledge-skill-name>` via the Skill tool.
```
Requires `Skill` in the driver's `allowed-tools`. Do **not** rely on the knowledge skill's `description` auto-matching — load it explicitly so the same knowledge is in context every run. The explicit load fires at a fixed phase regardless of whether the description happens to auto-match, which is what closes the seam.

Knowledge skill frontmatter at this seam (verified against code.claude.com/docs/en/skills): set `user-invocable: false` (hides it from the `/` menu — "Only Claude can invoke" — while the driver's Skill-tool load still works). Do **not** set `disable-model-invocation: true` on a driver-loaded knowledge skill: the doc states it "block[s] programmatic invocation" and "removes the skill from Claude's context entirely," which would break the very Skill-tool load this pattern relies on (defeating A and B). See the Knowledge-skill template in `templates.md`.

A: an explicit, fixed load point (named skill + Skill tool + phase) removes the auto-trigger ambiguity at the seam. B: the dependency is stated, not implicit (CTX-PD, SPC-DOM). See the driver-skill § Load a knowledge skill and the Knowledge-skill template in `templates.md`.

### 11. Resumable state / progress anchor (multi-phase / gated drivers)

When: a driver runs a long gated workflow (the orchestrator's whole reason to exist — it holds the pinned intent, owns approval gates, and persists across phases). An interrupted run that cannot resume to the same point is not reproducible (A). Scope to multi-phase/gated drivers; do **not** add to trivial single-skill output.

Two mechanisms, paired:
- **Progress anchor (in-session):** maintain a `TodoWrite` list of phases/steps so the model tracks completion across a long run and cannot silently drop a step (CTX-TWA). Requires `TodoWrite` in the driver's `allowed-tools`.
- **Resumable state (across sessions):** persist pinned inputs, current phase, and the selection log to a `.<name>.local.md` file — YAML front matter for machine I/O, markdown body for the human log (CTX-LMS, SPC-FMS).

```markdown
On start, if `.<name>.local.md` exists: read its front matter and resume at `phase` (do NOT re-derive the pinned intent). Otherwise create it.
At each phase exit: update `phase`/`completed`, append the decision to the selection log, and mark the phase done in TodoWrite.
```
Read/write the front matter with `LC_ALL=C` and a fixed key order (SPC-FMS) so the state file is byte-stable.

A: pinned intent + checkpointed phase ⇒ an interrupted run resumes to the identical point; byte-stable state file. B: the resume contract is explicit, not improvised (CTX-LMS, CTX-TWA, SPC-FMS). See the `.<name>.local.md` template in `templates.md`.

### 12. Verify (evaluations-first): A-test + B-test

When: confirming the built artifact. **Author the evals at Phase 4** — the moment goal + scenarios + outputs exist — and run them at Phase 6. Never invent criteria at the end (that violates `action.md` §C and the official "evaluations first").

1. **Author (Phase 4):** write ≥3 frozen scenarios `{query, files, expected_behavior}` and capture the **no-artifact baseline**. See the eval-suite template in `templates.md`.
2. **A-test — reproducibility:** run each scenario **N≥3× per target model**; pass iff the invariants are **identical across all runs and models** — same trigger fired, same set of files touched, byte-stable script output, all `expected_behavior` pass. Any variance is a defect → lower a degree of freedom or move the varying step into a script (§8), then re-run.
3. **B-test — quality:** run the artifact and score against `expected_behavior`; pass iff it meets the rubric **and beats the captured baseline** on every scenario. (Optional relative-B between two built versions: skill-creator blind A/B — measures B, not A.)
4. **Continuous:** run a cheap subset as a validator→fix loop during 5-3/5-4; the full suite is the Phase-6 gate.

```markdown
At Phase 4, author evals/<name>.eval.md (≥3 frozen scenarios + no-artifact baseline) before building.
At Phase 6:
1. A-test — run each scenario N≥3× per target model; the invariants (trigger, files touched, script-output bytes, expected_behavior) must be identical across runs. Fix any variance, re-run.
2. B-test — the artifact must meet expected_behavior and beat the baseline on every scenario.
Do not claim completion while any scenario fails either test.
```
A: the A-test **is** the reproducibility proof (a non-deterministic LLM artifact is proven reproducible only by invariance across repeated runs). B: baseline-win is the quality proof (PRM-VSC, FLW-BAC, FLW-WQR, FLW-DEC, FLW-PIV, FLW-REA; `action.md` §C). See the eval-suite + pinned-intent templates in `templates.md`.

## Composition order within a single prompt

To support long-context ordering (PRM-LCO) and clean parsing:

1. Role lead (one sentence) — PRM-RLA.
2. **Rules (apply to every step)** — shared constraints (bold heading + bullets).
3. Injected live data near the top — pulled in with `` !`command` `` / `@file` (large material first; PRM-LCO).
4. The Phase > Step > Action body (markdown), with inline `If/Otherwise` branches and named sub-procedures.
5. The **If any step fails** block where needed.
6. Output contract near the end (PRM-OSD). For an **agent** file, the `<example>/<commentary>` invocation examples go in the `description` frontmatter, not the body (PRM-EI-*).

## Action cross-reference

| Pattern | Actions |
|---|---|
| Skeleton | FLW-PC, FLW-EAG, PRM-MSS |
| Sequential | PRM-MSS, CTX-TWA |
| Branch | PRM-SC, PRM-ESL, PRM-CTX |
| Loop | FLW-LEB, action.md §B.2 (full population) |
| Notify / approval | FLW-EAG, PRM-RGC, PRM-CPM (structural gate, not emphasis) |
| Common rules | PRM-CWF, PRM-CTX |
| Common flow | FLW-PIV, FLW-DSAS |
| Alternative / exception | FLW-PVE, FLW-LEB |
| Deterministic step → script | FLW-DSAS, SPC-PRV |
| Dispatch / parallel fan-out | FLW-PVS, FLW-PPS, FLW-PCP |
| Load knowledge skill | CTX-PD, SPC-DOM, SPC-ATR |
| Resumable state / progress anchor | CTX-LMS, CTX-TWA, SPC-FMS |
| Verify (A-test + B-test) | PRM-VSC, FLW-BAC, FLW-WQR, FLW-DEC, FLW-PIV, FLW-REA |
| Dispatch (driver → subagent) | PRM-ESL, PRM-NRP, SPC-ATR, FLW-PVS, FLW-PPS, FLW-PCP |
| Load knowledge skill | CTX-PD, SPC-DOM, SPC-ATR |
| Resumable state / progress anchor | CTX-LMS, CTX-TWA, SPC-FMS |
| Composition order | PRM-LCO, PRM-RLA, PRM-OSD, PRM-CTX |
