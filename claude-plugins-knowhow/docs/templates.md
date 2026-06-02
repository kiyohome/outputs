# Component Templates

> Fill-in-the-blank skeletons for each artifact smith emits, with best practices **baked in** — frontmatter, role lead, common-rules block, Phase>Step>Action body, approval gates, output contract, deterministic scripts, safe hook scripts. smith fills the `<...>` placeholders in Phase 5; the structure is fixed.
>
> Templates are the **what** (the skeleton); `workflow-patterns.md` is the **how** (the control-flow patterns used inside). Each template notes the Actions (`actions.md`) it embodies. Feeds the `smith-prompt-patterns` / `smith-structure-patterns` skills (steering #3).

## How to use

1. Pick the component roles in Phase 5-1 (driver / knowledge / execution).
2. For each part, copy the matching template below.
3. Fill placeholders in 5-3; polish wording in 5-4.
4. XML appears only where these templates already place it (structural blocks); the linear step sequence stays markdown — per `workflow-patterns.md`.

## Reading these templates — what to emit vs. strip

A template's fenced block is the skeleton smith emits, **minus the authoring annotations**. On emit, smith:

- **Fills** every `<...>` placeholder.
- **Strips** all `<!-- ... -->` comments — they are guidance to smith, never part of the emitted artifact.
- **Strips** trailing annotations introduced by **two or more spaces then `#`** that name an Action ID or give authoring advice (e.g. `   # PRM-RLA`, `   # least privilege — trim to what's needed`).
- **Keeps** genuine artifact content: markdown `#` headings (at line start), and in-script comments inside `.sh` blocks that explain the script's own logic (e.g. `# Reject path traversal`).

Rule of thumb: if an annotation names an Action ID or tells smith *how to author*, it is guidance → strip. If it explains *what the emitted code does*, it is content → keep.

---

## `.claude-plugin/plugin.json` (manifest)

Always emit at the exact path `.claude-plugin/plugin.json` — a manifest at the plugin root is **not** loaded (validation fails: `Plugin has an invalid manifest file at .claude-plugin/plugin.json ... name: Required`, and `name` silently falls back to the directory name). Keep minimal — only `name` is strictly required; the harness validates the rest (so smith does not over-specify).

```json
{
  "name": "<plugin-name>",
  "description": "<one line: what the plugin does and when to use it>",
  "version": "0.1.0"
}
```

---

## Marketplace manifest — `.claude-plugin/marketplace.json` (ccpm repo root)

The "store listing" that makes the plugin **installable**. Lives at the **marketplace repo (ccpm) root**, not the plugin. `/plugin marketplace add lovaizu/ccpm` reads this catalog; then `/plugin install smith@ccpm`. `source: "./smith"` is the relative path to the plugin inside ccpm (resolved from the marketplace root; works when added via git). Schema verified against anthropics/claude-code's real `marketplace.json`. Embodies: SPC-DOM/PRM-LFD (clear description for discovery).

```json
{
  "$schema": "https://json.schemastore.org/claude-code-marketplace.json",
  "name": "ccpm",
  "version": "1.0.0",
  "description": "<one line: what this marketplace catalogs>",
  "owner": { "name": "lovaizu" },
  "plugins": [
    {
      "name": "smith",
      "description": "<one line — match smith's plugin.json description>",
      "source": "./smith",
      "version": "0.1.0",
      "category": "development"
    }
  ]
}
```

Per-plugin, only `name` + `source` are required; `version` / `category` / `author` are optional. Add more entries to `plugins[]` as ccpm grows (or set `metadata.pluginRoot` to shorten relative paths).

---

## Plugin README — `<name>/README.md`

The plugin's homepage/usage doc. The `/plugin` pane already auto-shows the `description`, the component list ("Will install"), and the context-cost estimate — so the README is where **usage** lives (users are explicitly pointed to the homepage for it). **Keep it lean.** Survey of the 13 official Anthropic plugins (977 B–14.6 KB): the consistent **core is 5 sections**; everything else is optional and added *only* in proportion to the plugin's size. Embodies: SPC-DOM/PRM-LFD (clear what + when), PRM-EI-S (concrete example).

```markdown
# <Plugin Name>

> <one line — match plugin.json `description`>

## Overview
<One short paragraph: what it does and when to use it.>

## What it provides
- `/<plugin>:<skill>` — <one line>.
- `<agent-name>` (agent) — <one line>.   # list only user-relevant components

## Usage
<A concrete example invocation, then what Claude does — a short bullet list of the outcome.>

## Installation
/plugin marketplace add <owner/repo>
/plugin install <plugin>@<marketplace>
/reload-plugins
```

Add these **only if they apply** (official plugins include them in proportion to size, never by default): **Requirements** (external binaries / tools / services, target model), **Best practices / Tips**, **Troubleshooting**, **Author / Version / License**. Do **not** add dedicated Permissions/Trust, Context-cost, or Changelog sections — trust is handled by the marketplace, context cost is shown in-app, and version lives in `plugin.json`.

---

## Driver skill — `skills/<name>/SKILL.md`

The user-invoked entry point (the modern slash command). Embodies: SPC-DMI, SPC-ATR, PRM-LFD/SPC-DOM (description), PRM-RLA (role lead), the Phase>Step>Action skeleton (FLW-PC), common-rules/on-failure blocks, FLW-EAG/PRM-RGC (gates), PRM-OSD (output contract), SPC-AE (argument expansion).

```markdown
---
name: <kebab-name>                 # optional; defaults to directory name
description: <Third-person, active. What it does + when to use it. e.g. "Reviews SQL migrations and reports risky changes. Use when the user asks to check or review a migration.">   # NO XML tags here (validation forbids it)
argument-hint: <hint>              # include ONLY if the command takes user input — e.g. "<file>" or "<pr-number> [--fix]" (SPC-AE)
disable-model-invocation: true     # user-triggered, not auto-fired
allowed-tools: Read, Glob, Grep, Edit, Write, Bash(git:*), Task, TodoWrite, Skill   # least privilege — trim to what's needed; Task only if this driver fans out (see Dispatch below); TodoWrite only for multi-phase/gated drivers (see Resumable state in workflow-patterns.md); Skill only if this driver loads knowledge skills (see Load a knowledge skill below)
---

You are <role lead — one sentence: who this skill is and its stance>.   # PRM-RLA

<!-- If the command takes input: reference the user's arguments as `$ARGUMENTS` (full string) or positionals — 0-based: `$ARGUMENTS[0]` (or the shorthand `$0`) is the FIRST positional, `$1` the second, …. Named args via the `arguments:` frontmatter are also available (`$name`, mapped to positions in order). Omit entirely when the command takes no input. (SPC-AE) -->
The target is `$ARGUMENTS`.   # or `$0` for the first positional arg (`$1` for the second) — present only when argument-hint is set above

**Rules (apply to every step):**
- Never write outside the repository.
- Stop and ask before any destructive or irreversible action.   # PRM-RGC
- Report facts; if a step is skipped or fails, say so.

## Phase 1 — <name>
**Goal:** <what this phase achieves.>
1. **<step>** — <imperative action>.
2. **<step>** — <imperative action>.
**Exit:** <condition that must hold before Phase 2.>

## Phase 2 — <name>
**Goal:** <...>
1. **<step>** — <action>, then branch (exhaustive, incl. fall-through):
   - **If <branch A>:** <action>.
   - **If <branch B>:** <action>.
   - **Otherwise (none of the above):** report that the situation is unhandled and stop. Do not guess.   # A

**Approval gate (irreversible only):** present what will happen; ask apply all / select / reject; do NOT proceed until approved.   # enforced by step order, not emphasis — PRM-CPM/PRM-RGC/FLW-EAG

### Dispatch a subagent (driver → execution)
When the driver fans out to an execution subagent, invoke `Task` with the agent name, the **scoped context inlined in the prompt**, and the expected return contract. Subagents cannot re-dispatch — all fan-out originates here. smith commits to **one** context-provisioning mode per artifact in 5-2 (see `workflow-patterns.md` § Dispatch); the preferred default is inline (deterministic). See `workflow-patterns.md` § Dispatch.
```markdown
Dispatch `<agent-name>` via Task with:
- context: <the exact files / diff / scope the agent needs, inlined in the prompt — the agent does not fetch it>.
- return: <the contract the agent must return, e.g. one finding per issue or an explicit empty result>.
Use the returned result verbatim; do not re-derive it.
```

**Parallel fan-out (N independent agents — e.g. 2-3 architects, per-part writers).** When the work splits into independent units, dispatch them as **one fixed batch in a single assistant message** (parallel), not one at a time, and **aggregate the returns in a fixed order**. See `workflow-patterns.md` § Dispatch (parallel fan-out + aggregation).
```markdown
Dispatch all N agents in ONE assistant message (one Task call per agent, same batch every run — do not dispatch sequentially):
- `<agent-1>` with context: <scope 1>, return: <contract>.
- `<agent-2>` with context: <scope 2>, return: <contract>.
- … (fixed agent set)
On collection: merge the returns in a fixed order (sort by a stable key — agent name or target file path — NOT arrival order). For an N-candidate fan-out, present all candidates together; do not pick first-to-return.
```

### Load a knowledge skill (driver → knowledge)
When this driver depends on a knowledge skill, load it **explicitly via the Skill tool** at the phase that needs it — do not rely on description auto-match (that varies run-to-run). Requires `Skill` in `allowed-tools` above. See `workflow-patterns.md` § Load knowledge skill.
```markdown
At Phase N, before <step>, load `<knowledge-skill-name>` via the Skill tool.
```

**If any step fails:** halt at the failing step. Do not auto-rollback. Report the partial state and point the user at `git status`. Never claim completion while the failure stands.

## Output
<What to return: structure first, then format rules.>   # PRM-OSD/PRM-OFD
<What to return when there is nothing to report.>          # PRM-NRP
```

---

## Knowledge skill — `skills/<name>/SKILL.md`

On-demand reference loaded by the driver during a phase. Embodies: CTX-PD (progressive disclosure), PRM-LFD (description as trigger), CTX-SDW (no duplication), SPC-RTT-replacement (<500 lines, detail in references/).

```markdown
---
name: <kebab-name>
description: <When this knowledge applies — third person. e.g. "Best-practice patterns for authoring Claude Code subagents. Loaded when designing or writing an agent.">
user-invocable: false              # hides it from the `/` menu; the driver still loads it via the Skill tool. Do NOT add `disable-model-invocation: true` here — see note below.
---

<!-- Invocation fields at this seam (verified against the current skills doc — code.claude.com/docs/en/skills, "Restrict Claude's skill access"):
     - `user-invocable: false` controls MENU VISIBILITY ONLY, not Skill-tool access — "Only Claude can invoke." The driver's explicit Skill-tool load still works. This is the correct field for a driver-loaded knowledge skill.
     - `disable-model-invocation: true` would "block programmatic invocation" and "removes the skill from Claude's context entirely" — it would break the driver→knowledge Skill-tool load (the load-bearing seam) and defeat both A and B. Do NOT set it on a knowledge skill the driver loads. -->
<!-- Driver-side load: the driver loads this skill with the line `load \`<this-skill-name>\` via the Skill tool` at the phase that needs it (driver template § Load a knowledge skill; workflow-patterns.md § Load knowledge skill). The load is explicit and fires at a fixed phase regardless of whether the description happens to auto-match — never relies on description auto-match — so the seam is fixed (A). -->


# <Title>

<Core knowledge that the consumer needs inline. Keep the body focused; under ~500 lines.>

## When to apply
<The trigger / situation in which this knowledge is used.>

## Detail
For <edge cases / long reference material>, see `references/<topic>.md` — loaded on demand.   # progressive disclosure
```

---

## Execution subagent — `agents/<name>.md`

A bounded, isolated worker dispatched by the driver (subagents cannot dispatch subagents). Embodies: SPC-AFM (frontmatter), PRM-LFD (delegation-trigger description), SPC-EBT/PRM-EI (invocation examples in the description), FLW-MTS (model by judgment density), SPC-ATR (least privilege), PRM-RLA (role), PRM-ESL (explicit scope), PRM-NRP. Body is plain markdown (no XML) — matching real agents like pr-review-toolkit/code-reviewer.

```markdown
---
name: <kebab-name>
description: <When to delegate — third person trigger, e.g. "Reviews a single changed file for correctness bugs."> followed by invocation examples (the real convention — see comment).
# Append invocation examples INTO the description string, real format uses literal \n (agent-development skill; pr-review-toolkit):
#   …trigger.  Examples:\n<example>\nContext: <situation>.\nuser: "<request>"\nassistant: "I'll launch <agent> via the Task tool."\n<commentary>\n<why this agent fits>\n</commentary>\n</example>
model: <opus | sonnet>             # PIN the tier to the judgment density: opus (deepest judgment) / sonnet (bounded analysis). Any subagent whose output depends on judgment MUST pin a fixed tier — `inherit` makes the model whatever the caller's session is, so the same built artifact yields different judgment under Sonnet vs Opus (reopens the model-variance seam). Reserve `inherit` ONLY for non-judgment, dialogue-only work. (FLW-MTS / A — behavior must be stable across runs AND models)
tools: Read, Glob, Grep            # least privilege; omit Write if it only reports
---

You are <role lead — one sentence>.   # PRM-RLA

## Task
<The scoped task.> Apply to <explicit scope — e.g. every changed line>, not just the first.   # PRM-ESL

## Context
<!-- agents/*.md is NOT preprocessed, so `!`command`` does not expand here. smith commits to ONE provisioning mode in 5-2 and emits only that mode — never "A or B" (fixed seam — A). -->
<!-- MODE A (preferred — deterministic): this section states the material the driver inlines into the Task prompt at dispatch — e.g. the diff or file list. The agent does NOT fetch it. -->
<The scoped material the driver passes in — e.g. the diff or file list.>
<!-- MODE B (only if the driver cannot inline it): instead, add a fixed Step 1 under ## Task — "Fetch context via `<exact command>`" (a single pinned command, not free choice). Requires the matching tool in `tools:`. The command must emit a byte-stable result — sort any enumeration via `LC_ALL=C sort`, never raw glob/find/directory order (A). -->

## Output
Return <output contract>. If <nothing is found>, return <explicit empty result>.   # PRM-NRP
```

---

## Deterministic script — `scripts/<name>.sh`

The strongest A lever (FLW-DSAS). Use for any step whose result must be byte-identical every run — `plugin.json` generation, parsing, validation, dependency-ordered writes. A prompt cannot guarantee this; a script can. The driver invokes it and uses its output **verbatim** (see `workflow-patterns.md` § Deterministic step → script). Embodies: FLW-DSAS, SPC-PRV (`${CLAUDE_PLUGIN_ROOT}`).

```bash
#!/usr/bin/env bash
set -euo pipefail
export LC_ALL=C   # locale-independent collation & formatting — byte-stability

# Read fixed inputs (args or stdin); do not read ambient state that varies between runs.
input="${1:?usage: <name>.sh <input>}"

# <The deterministic logic. Produce the same bytes for the same inputs.>

# Byte-stability rules (defeat the common nondeterminism sources):
#  - sort every enumeration:        find ... | LC_ALL=C sort
#  - stable JSON key order:         jq -S ...
#  - no timestamps / PIDs / random / hostnames in persisted or compared output
#  - no unsorted glob order — pipe through sort

# Emit a byte-stable result to stdout (or a fixed file path).
printf '%s\n' "<result>"
```

---

## Hook — `hooks/hooks.json` + `hooks-handlers/<name>.sh`

Deterministic enforcement that fires unconditionally (the optional default-output component, distinct from the script above). Embodies: SPC-HER (correct event), SPC-THT (`type: command`), SPC-PRV (`${CLAUDE_PLUGIN_ROOT}`), SPC-HIV (safe script), SPC-HSV (exit-2 reason to stderr), SPC-HI (idempotent).

`hooks/hooks.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "<ToolName>",
        "hooks": [
          { "type": "command", "command": "\"${CLAUDE_PLUGIN_ROOT}\"/hooks-handlers/<name>.sh" }
        ]
      }
    ]
  }
}
```

> `${CLAUDE_PLUGIN_ROOT}` **must be double-quoted** in the shell-form `command` (`"${CLAUDE_PLUGIN_ROOT}"/...`) — the plugin install path can contain spaces; unquoted, the command splits into multiple arguments and fails to run (an install-location-dependent break of the unconditional-enforcement guarantee — A). SPC-PRV.

`hooks-handlers/<name>.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
export LC_ALL=C   # byte-stable: locale-independent. If this hook persists or compares any output, sort enumerations and exclude timestamps/PIDs/random.

input=$(cat)
tool_name=$(printf '%s' "$input" | jq -r '.tool_name')
file_path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')

# Reject path traversal
case "$file_path" in
  *..*) echo "Refusing path outside the workspace: $file_path" >&2; exit 2 ;;   # reason → stderr (SPC-HSV)
esac

# <Block the dangerous condition this hook exists for>
if <dangerous condition>; then
  echo "<why this was blocked>" >&2
  exit 2
fi

exit 0
```

---

## Resumable state file — `.<name>.local.md` (multi-phase / gated drivers only)

For a driver that runs a long gated workflow, an interrupted run must resume to the same point or it is not reproducible (A). Persist pinned inputs, progress, and the selection log to a state file with YAML front matter (machine-readable I/O) and a markdown body (human-readable log). Pair with a TodoWrite progress anchor in-session. Scope to multi-phase/gated drivers — do **not** emit for trivial single-skill output. Embodies: CTX-LMS (`.local.md` resumable state), CTX-TWA (TodoWrite anchor), SPC-FMS (front-matter shell I/O). See `workflow-patterns.md` § Resumable state / progress anchor.

```markdown
---
phase: <current-phase-number>      # where to resume
inputs:                            # the pinned, immutable run inputs
  <key>: <value>
completed: [<phase-1>, <phase-2>]  # phases already passed their exit gate
---

# <workflow> run state

## Pinned intent
<the fixed goal statement, copied verbatim — never re-derived on resume>

## Selection log
- <decision made and why — append-only>
```

> On start: if this file exists, read it and resume at `phase`; otherwise create it. On each phase exit, update `phase`/`completed` and append to the selection log. Front matter is read/written with `LC_ALL=C` and a fixed key order (SPC-FMS) so the file is byte-stable.

---

## CLAUDE.md rule (when a project-level rule is the right tool)

Embodies: CTX-CIR ("would removing this cause mistakes?"), CTX-CMP (placement), SPC-HAR (rule vs hook).

```markdown
## <Rule name>

<The rule, stated imperatively. Include the "because" so Claude generalizes.>   # PRM-IR
```

> Use a hook instead (template above) when the rule **must** fire unconditionally and a soft instruction has proven unreliable — CTX-RHM.

---

## Pinned intent (end of Phase 4)

The fixed point for Phases 5–6. Derived from the throwaway draft **stripped to intent** (its component structure discarded — never inherited) plus proposal-based hearing. Never re-derived on resume. Embodies: `action.md` §A (goal is the fixed point), strip-to-intent (`smith-design.md` § Input model).

```markdown
---
goal: <the fixed final state the artifact must achieve — in the user's terms, not reinterpreted/narrowed/expanded>
trigger: <who or what invokes it, and when>
inputs: <what it receives>
outputs: <what it produces>
constraints: <target model(s), allowed tools, side-effects, explicit non-goals>
scenarios:                          # ≥3 concrete usage scenarios — these seed the eval suite
  - <scenario 1>
  - <scenario 2>
  - <scenario 3>
---
```

> Confirm this with the user at the Phase-4 gate before any building starts. Persist it verbatim in the resumable-state file (`## Pinned intent`).

---

## Evaluation suite — `evals/<name>.eval.md`

The artifact smith authors at Phase 4 (**before** building — evaluations-first) and runs at Phase 6. Ships with the plugin as its regression evals. Each scenario is frozen: same query + same input files every run. Embodies: PRM-VSC (verifiable success criteria), FLW-BAC (blind A/B), FLW-WQR (rubric); see `workflow-patterns.md` § Verify.

```markdown
# Evals — <plugin-name>

> Authored at Phase 4, run at Phase 6. Scenarios are frozen (same query + same fixtures every run).

## Baseline (no-artifact)
<Claude's result on the scenarios WITHOUT this plugin — captured once at Phase 4, so Phase 6 can prove the artifact beats it (B-test).>

## Scenarios
### <scenario-id>
- query: <exact invocation — e.g. `/sql-review migrations/0007_add_index.sql`>
- files: <fixed input fixture(s)>
- expected_behavior: <observable, checkable outcome — what must be true of the result>
```

> A-test (reproducibility): run each scenario N≥3× per target model; the invariants — same trigger, same files touched, byte-stable script output, all `expected_behavior` pass — must be identical across runs. B-test (quality): the artifact must meet `expected_behavior` and beat the captured baseline. See `workflow-patterns.md` § Verify.
