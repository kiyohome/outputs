# Checklist Items

> Machine-readable checklist entries for smith's inspector agents. Each item is derived from the taxonomy in `taxonomy.md` and carries all fields needed to inspect, score, and propose fixes for plugin quality issues.
>
> Source decisions: `progress.md §PRM domain pre-decisions` (PRM domain); `concepts.md`, `components.md`, `patterns.md`, `checklists.md` (all other domains).

## Schema

| Field | Description |
|---|---|
| `id` | Taxonomy ID (e.g. `ARC-TLS`) |
| `slug` | Kebab-case name used in `finding_type` strings (e.g. `three-layer-separation`) |
| `domain` | `ARC` / `SPC` / `PRM` / `FLW` / `CTX` |
| `applies_to` | Component types this check targets: `command`, `agent`, `skill`, `hook`, `all`. Comma-separated. Content-conditional items note their precondition. |
| `severity` | `Mandatory` — blocker; `Recommended` — quality debt; `Quality` — polish. |
| `auto` | `[auto]` — deterministic, machine-verifiable; `[judgment]` — requires LLM or human assessment. `[auto]` findings bypass the convergence threshold. |
| `check` | One sentence: what to verify. |
| `fix` | One sentence: how to correct a NG finding. |
| `related` | IDs of other items in the same convergence cluster. A fix to any cluster member may cause others to change verdict. |
| `example` | Optional before/after illustration. |

**finding_type format**: `checklist:<component-type>:<slug>` — e.g. `checklist:command:three-layer-separation`. Use the `slug` field, never the `id`.

**OOS rule**: Mark OOS when the item is logically inapplicable to the file being inspected (wrong component type, or content precondition absent for content-conditional items). OOS is not NG.

**NG beats OOS for Mandatory items**: If any lens marks NG on a Mandatory item, the finding is promoted regardless of OOS votes from other lenses. Smith-evaluate.sh implements this.

---

## ARC — Architecture (10 items)

---

### ARC-SDL

| Field | Value |
|---|---|
| **id** | `ARC-SDL` |
| **slug** | `standard-directory-layout` |
| **domain** | ARC |
| **applies_to** | all |
| **severity** | Recommended |
| **auto** | `[auto]` |
| **check** | Do all top-level directories inside the plugin root match the standard set (`.claude-plugin/`, `commands/`, `agents/`, `skills/`, `hooks/`, `hooks-handlers/`, `scripts/`)? |
| **fix** | Move files into the closest standard directory; rename or remove non-standard top-level directories. |
| **related** | `ARC-MVP` |
| **example** | NG: `my-plugin/utils/` (non-standard directory). OK: `my-plugin/scripts/` (standard). |

---

### ARC-ACA

| Field | Value |
|---|---|
| **id** | `ARC-ACA` |
| **slug** | `archetype-command-agent` |
| **domain** | ARC |
| **applies_to** | all (content-conditional: plugin has commands + agents, no skills — Archetype A) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | In an Archetype A plugin (commands + agents, no skills), does the command act as the sole procedure driver while each agent performs a bounded, isolated subtask with no knowledge-delivery role? |
| **fix** | If an agent serves as a knowledge source, convert it to a skill; if the command contains execution logic (tool calls, file writes), extract it into a dedicated agent. |
| **related** | `ARC-TLS`, `ARC-AFD` |
| **example** | NG: agent that returns static guidance text. OK: agent that reads files and writes a patch. |

---

### ARC-ASO

| Field | Value |
|---|---|
| **id** | `ARC-ASO` |
| **slug** | `archetype-skill-only` |
| **domain** | ARC |
| **applies_to** | all (content-conditional: plugin has skills only, no commands or agents — Archetype B) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | In an Archetype B plugin (skills only), does the skill description match the user's natural-language trigger, and does the skill body avoid dispatching to subagents or performing side effects? |
| **fix** | Improve the skill description to match likely user phrasing; remove any agent dispatch from the skill body (convert to Archetype C if dispatch is needed). |
| **related** | `ARC-TLS`, `ARC-AFD` |
| **example** | NG: skill body that calls `Agent(...)`. OK: skill body that contains domain knowledge only. |

---

### ARC-AH

| Field | Value |
|---|---|
| **id** | `ARC-AH` |
| **slug** | `archetype-hybrid` |
| **domain** | ARC |
| **applies_to** | all (content-conditional: plugin has commands + agents + skills — Archetype C) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | In an Archetype C plugin (commands + agents + skills), do skills serve exclusively as on-demand knowledge sources loaded via the Skill tool or description match, rather than as procedure drivers? |
| **fix** | If a skill contains phase logic or user-interaction steps, move that logic into a command; if it produces findings directly, route through an agent. |
| **related** | `ARC-TLS`, `ARC-AFD` |
| **example** | NG: skill with numbered phases that instruct Claude to ask the user for approval. OK: skill loaded mid-command to supply domain knowledge. |

---

### ARC-TLS

| Field | Value |
|---|---|
| **id** | `ARC-TLS` |
| **slug** | `three-layer-separation` |
| **domain** | ARC |
| **applies_to** | all |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Do commands stay in the procedure layer (what/when/branching/user gates), skills in the knowledge layer (how), and agents in the execution layer (tool calls, reads, writes)? |
| **fix** | Move domain knowledge from command bodies into skills; move file I/O and tool calls from commands into dedicated agents. |
| **related** | `ARC-ACA`, `ARC-ASO`, `ARC-AH`, `ARC-AFD` |
| **example** | NG: command body that directly edits files. OK: command that dispatches an agent to edit files, loading a skill for context. |

---

### ARC-MVP

| Field | Value |
|---|---|
| **id** | `ARC-MVP` |
| **slug** | `minimum-viable-plugin` |
| **domain** | ARC |
| **applies_to** | all |
| **severity** | Mandatory |
| **auto** | `[auto]` |
| **check** | Does `.claude-plugin/plugin.json` exist at the plugin root and contain a `name` field? |
| **fix** | Create `.claude-plugin/plugin.json` with at minimum `{"name": "your-plugin-name"}`. |
| **related** | `ARC-SDL` |
| **example** | NG: missing `.claude-plugin/` directory. NG: `plugin.json` with no `name` key. OK: `{"name": "code-review", "version": "1.0"}`. |

---

### ARC-AFD

| Field | Value |
|---|---|
| **id** | `ARC-AFD` |
| **slug** | `archetype-first-decision` |
| **domain** | ARC |
| **applies_to** | all |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Is the plugin's archetype (A: command+agent, B: skill-only, C: hybrid) consistent with its stated purpose, and does the component mix match that archetype without unnecessary additions? |
| **fix** | Identify the intended archetype explicitly in README.md; remove components that don't serve the plugin's purpose; add missing components for the archetype. |
| **related** | `ARC-ACA`, `ARC-ASO`, `ARC-AH`, `ARC-TLS` |
| **example** | NG: plugin with a single skill that also has an empty `commands/` directory. OK: plugin whose README states "Archetype B" and contains only `skills/`. |

---

### ARC-CCH

| Field | Value |
|---|---|
| **id** | `ARC-CCH` |
| **slug** | `component-choice-heuristic` |
| **domain** | ARC |
| **applies_to** | all |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Is each component type present only when its specific capability is needed — commands for user-triggered workflows, agents for isolated execution with side effects, skills for knowledge injection, hooks for unconditional enforcement? |
| **fix** | Replace over-specified components with simpler alternatives (e.g., agent returning only read-only analysis → command phase; command containing hard policy → hook). |
| **related** | `ARC-AFD`, `ARC-TLS` |
| **example** | NG: agent whose only job is returning static guidance (should be a skill). OK: agent that reads the diff, writes a patch, and returns results. |

---

### ARC-PNE

| Field | Value |
|---|---|
| **id** | `ARC-PNE` |
| **slug** | `propose-not-execute` |
| **domain** | ARC |
| **applies_to** | command, agent (content-conditional: plugin produces irreversible outputs — file writes, pushes, API calls, PR creation) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | When the plugin performs irreversible actions, does it present a plan and obtain explicit user approval before executing? |
| **fix** | Add an explicit confirmation phase: display the proposed changes, wait for user approval (`y/n` or equivalent), then execute. |
| **related** | — |
| **example** | NG: command that creates a PR without displaying the draft first. OK: command that shows PR title/body and asks "Proceed? [y/n]" before calling `gh pr create`. |

---

### ARC-AC

| Field | Value |
|---|---|
| **id** | `ARC-AC` |
| **slug** | `applicability-criteria` |
| **domain** | ARC |
| **applies_to** | all |
| **severity** | Quality |
| **auto** | `[judgment]` |
| **check** | Does README.md state when the plugin is and is not appropriate to use — at minimum, what project types, input formats, or workflows it targets? |
| **fix** | Add "Suitable for" and "Not suitable for" sections to README.md with concrete examples of each. |
| **related** | — |
| **example** | NG: README with only a feature list and no applicability guidance. OK: README with "Suitable for: PRs with code changes. Not suitable for: documentation-only PRs." |

---

## SPC — Component Spec (32 items)

### Commands

---

### SPC-ATR

| Field | Value |
|---|---|
| **id** | `SPC-ATR` |
| **slug** | `allowed-tools-restriction` |
| **domain** | SPC |
| **applies_to** | command |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the command's `allowed-tools` front-matter field restrict to the minimum set of tools actually needed for the command's task? |
| **fix** | Enumerate the tools the command calls and set `allowed-tools` to exactly that list; remove `Bash` or `Write` if the command only reads files. |
| **related** | — |
| **example** | NG: `allowed-tools: [Bash, Read, Write, Edit, Agent]` for a read-only analysis command. OK: `allowed-tools: [Read, Bash]`. |

---

### SPC-ICE

| Field | Value |
|---|---|
| **id** | `SPC-ICE` |
| **slug** | `inline-command-execution` |
| **domain** | SPC |
| **applies_to** | command |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | When the command needs dynamic context at invocation time (e.g., current branch, date, git status), does it use `` !`shell-command` `` inline execution rather than asking Claude to run the command manually? |
| **fix** | Replace prose like "First run `git status`" with `` !`git status` `` in the command front matter or body so the context is injected automatically. |
| **related** | — |
| **example** | NG: command body says "Run `git log --oneline -10` and use the result." OK: command header contains `` !`git log --oneline -10` ``. |

---

### SPC-AE

| Field | Value |
|---|---|
| **id** | `SPC-AE` |
| **slug** | `argument-expansion` |
| **domain** | SPC |
| **applies_to** | command |
| **severity** | Recommended |
| **auto** | `[auto]` |
| **check** | When the command accepts user-supplied arguments, does the command body use the standard expansion variables (`$ARGUMENTS`, 0-based positionals `$0`/`$1`/`$ARGUMENTS[N]`, or named `$name` via `arguments:`) wherever those arguments are referenced? |
| **fix** | Scan the command body for any reference to user-supplied values; replace ad-hoc handling with the standard variables; document expected argument format in the command description. |
| **related** | — |
| **example** | NG: "The user will supply the PR number. Use it to run `gh pr view`." OK: `gh pr view $0` (first positional, 0-based). |

---

### Agents

---

### SPC-AFM

| Field | Value |
|---|---|
| **id** | `SPC-AFM` |
| **slug** | `agent-front-matter` |
| **domain** | SPC |
| **applies_to** | agent |
| **severity** | Recommended |
| **auto** | `[auto]` |
| **check** | Does the agent's front matter include: `name` (kebab-case), `description` with 2–4 `<example>` tags, and a deliberate `model` choice? |
| **fix** | Add or correct the `name` field (kebab-case); add `<example>` tag blocks to `description`; set `model` explicitly (use `inherit` if no specific reason for a tier). |
| **related** | `SPC-EBT`, `SPC-CA` |
| **example** | NG: `name: myAgent` (camelCase). OK: `name: code-reviewer` with `model: sonnet` and two `<example>` blocks. |

---

### SPC-EBT

| Field | Value |
|---|---|
| **id** | `SPC-EBT` |
| **slug** | `example-block-trigger` |
| **domain** | SPC |
| **applies_to** | agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Do the agent's `<example>` blocks cover both explicit-request dispatch (a user or command explicitly names the agent) and proactive-dispatch scenarios (the agent should be auto-selected based on context)? |
| **fix** | Add or revise `<example>` blocks so at least one covers explicit invocation and at least one covers proactive dispatch; aim for 2 blocks minimum. |
| **related** | `SPC-AFM`, `SPC-CA` |
| **example** | NG: description with no `<example>` blocks. OK: two blocks — one "when the user says 'review my PR'" and one "when a command dispatches `code-reviewer` after collecting diff". |

---

### SPC-CA

| Field | Value |
|---|---|
| **id** | `SPC-CA` |
| **slug** | `color-assignment` |
| **domain** | SPC |
| **applies_to** | agent |
| **severity** | Quality |
| **auto** | `[auto]` |
| **check** | Is the agent's `color` field set and distinct from all sibling agents in the same plugin? |
| **fix** | Set a `color` value and verify it doesn't duplicate any other agent's color in the plugin. |
| **related** | `SPC-AFM`, `SPC-EBT` |
| **example** | NG: two agents both using `color: blue`. OK: `color: green` and `color: orange` for two siblings. |

---

### Skills

---

### SPC-SFM

| Field | Value |
|---|---|
| **id** | `SPC-SFM` |
| **slug** | `skill-front-matter` |
| **domain** | SPC |
| **applies_to** | skill |
| **severity** | Mandatory |
| **auto** | `[auto]` |
| **check** | Does the skill's SKILL.md front matter include: `name` (lowercase, hyphens only, ≤ 64 characters, no reserved prefixes), and `description` (≤ 1024 characters, third-person)? |
| **fix** | Rename to lowercase-hyphen form; shorten description to ≤ 1024 characters; rewrite in third person ("Analyzes…" not "I analyze…"). |
| **related** | `SPC-DOM`, `SPC-STR` |
| **example** | NG: `name: MySkill`, `description: "I help you..."`. OK: `name: code-reviewing`, `description: "Analyzes code diffs and returns structured findings."` |

---

### SPC-DOM

| Field | Value |
|---|---|
| **id** | `SPC-DOM` |
| **slug** | `description-optimization-methodology` |
| **domain** | SPC |
| **applies_to** | skill |
| **severity** | Quality |
| **auto** | `[judgment]` |
| **check** | Does the skill description use precise, trigger-friendly language — stating what the skill does and when it applies — so that Claude selects it reliably for the intended use case? |
| **fix** | Rephrase the description to include the action verb, the input type, and the expected output; avoid vague nouns like "helper" or "tool for". |
| **related** | `SPC-SFM`, `SPC-STR` |
| **example** | NG: "A skill for working with PDFs." OK: "Extracts structured data from PDF files and returns it as a JSON array." |

---

### SPC-STR

| Field | Value |
|---|---|
| **id** | `SPC-STR` |
| **slug** | `skill-three-roles` |
| **domain** | SPC |
| **applies_to** | skill |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the skill serve exactly one of the three valid roles — (A) auto-triggered knowledge injection, (B) on-demand reference loaded via the Skill tool, or (C) long-form procedure — and is it designed accordingly? |
| **fix** | Identify which role the skill plays and remove elements that belong to a different role (e.g., user-interaction steps from a knowledge skill, or auto-trigger description from a Skill-tool-only reference). |
| **related** | `SPC-SFM`, `SPC-DOM` |
| **example** | NG: skill with a trigger description that also contains multi-step procedure phases that ask the user for input. OK: skill that is either a pure knowledge body or a pure procedure. |

---

### SPC-DMI

| Field | Value |
|---|---|
| **id** | `SPC-DMI` |
| **slug** | `disable-model-invocation` |
| **domain** | SPC |
| **applies_to** | skill |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | When the skill triggers side effects (PR creation, file writes, deployments, API calls), is `disable-model-invocation: true` set in the front matter? |
| **fix** | Add `disable-model-invocation: true` to the SKILL.md front matter for any skill that produces irreversible outputs. |
| **related** | — |
| **example** | NG: skill that calls `gh pr create` with no `disable-model-invocation`. OK: same skill with `disable-model-invocation: true`. |

---

### SPC-RTT

| Field | Value |
|---|---|
| **id** | `SPC-RTT` |
| **slug** | `reference-toc-threshold` |
| **domain** | SPC |
| **applies_to** | skill |
| **severity** | Quality |
| **auto** | `[auto]` |
| **check** | Do all reference files under `skills/<name>/references/` that exceed 100 lines include a table of contents? |
| **fix** | Add a markdown heading labeled `## Contents` or `## Table of Contents` followed by a list of links or anchors to each major section. |
| **related** | — |
| **example** | NG: `references/patterns.md` at 180 lines with no TOC. OK: same file with `## Contents` section listing headings and line anchors. |

---

### SPC-SFC

| Field | Value |
|---|---|
| **id** | `SPC-SFC` |
| **slug** | `skill-fork-context` |
| **domain** | SPC |
| **applies_to** | skill |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | When the skill executes in an isolated sub-context (e.g., long-running analysis or a task with side effects), is `context: fork` set in the front matter? |
| **fix** | Add `context: fork` to the SKILL.md front matter for skills that need an isolated execution context. |
| **related** | — |
| **example** | NG: analysis skill that modifies files running in the parent context. OK: same skill with `context: fork`. |

---

### SPC-SAF

| Field | Value |
|---|---|
| **id** | `SPC-SAF` |
| **slug** | `skill-agent-field` |
| **domain** | SPC |
| **applies_to** | skill |
| **severity** | Recommended |
| **auto** | `[auto]` |
| **check** | When the skill delegates execution to a named agent, is the `agent` field set in front matter and does it match an existing agent name in the plugin? |
| **fix** | Set `agent: <agent-name>` in SKILL.md front matter; verify the named agent file exists under `agents/`. |
| **related** | — |
| **example** | NG: skill body says "use the code-reviewer agent" but no `agent` field in front matter. OK: `agent: code-reviewer` in front matter. |

---

### Hooks

---

### SPC-HER

| Field | Value |
|---|---|
| **id** | `SPC-HER` |
| **slug** | `hook-events-roster` |
| **domain** | SPC |
| **applies_to** | hook |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Is the hook's event type correct for its intent — PreToolUse for blocking, PostToolUse for feedback, UserPromptSubmit for input pre-processing, Stop/SubagentStop for completion, SessionStart/SessionEnd for lifecycle? |
| **fix** | Replace the event type with the one matching the hook's intent; consult the event roster to pick the correct type. |
| **related** | `SPC-THT`, `SPC-HAR` |
| **example** | NG: PostToolUse hook that tries to block a dangerous command (too late — action already executed). OK: PreToolUse hook for the same check. |

---

### SPC-THT

| Field | Value |
|---|---|
| **id** | `SPC-THT` |
| **slug** | `two-hook-types` |
| **domain** | SPC |
| **applies_to** | hook |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Is the hook's `type` field set to `command` for deterministic checks (pattern matching, exit code logic) or `prompt` for LLM-based judgment? |
| **fix** | Use `type: command` for all pattern-matching and static-analysis hooks; use `type: prompt` only when the decision requires language understanding. |
| **related** | `SPC-HER`, `SPC-HAR` |
| **example** | NG: `type: prompt` for a hook that just checks if the file path contains `..`. OK: `type: command` for that check. |

---

### SPC-HJF

| Field | Value |
|---|---|
| **id** | `SPC-HJF` |
| **slug** | `hooks-json-format` |
| **domain** | SPC |
| **applies_to** | hook |
| **severity** | Mandatory |
| **auto** | `[auto]` |
| **check** | Is `hooks.json` valid JSON and does each hook entry include `event`, `matcher` (or absence documented as wildcard), and `command` or `prompt` field? |
| **fix** | Validate `hooks.json` with a JSON linter; add any missing required fields; fix syntax errors. |
| **related** | `SPC-PRV` |
| **example** | NG: `hooks.json` with a trailing comma or missing `event` field. OK: `[{"event": "PreToolUse", "matcher": "Bash", "command": "./hooks-handlers/check.sh"}]`. |

---

### SPC-PRV

| Field | Value |
|---|---|
| **id** | `SPC-PRV` |
| **slug** | `plugin-root-variable` |
| **domain** | SPC |
| **applies_to** | hook |
| **severity** | Mandatory |
| **auto** | `[auto]` |
| **check** | Do all references to files within the plugin itself (i.e., plugin-internal paths) in hook scripts use `${CLAUDE_PLUGIN_ROOT}` rather than hard-coded absolute paths? System binary paths (e.g., `/usr/bin/jq`, `/bin/bash`) are not plugin-internal and are excluded. |
| **fix** | Replace every plugin-internal absolute path with `${CLAUDE_PLUGIN_ROOT}/relative/path`; verify with `grep -r '/home\|/Users\|/root'` in the hooks-handlers directory; exclude system binary paths from this scan. |
| **related** | `SPC-HJF` |
| **example** | NG: `source /home/user/.claude/plugins/my-plugin/lib/utils.sh`. OK: `source "${CLAUDE_PLUGIN_ROOT}/scripts/utils.sh"`. |

---

### SPC-SSI

| Field | Value |
|---|---|
| **id** | `SPC-SSI` |
| **slug** | `session-start-injection` |
| **domain** | SPC |
| **applies_to** | hook |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | When the plugin needs to inject state or instructions at the start of every session, does it use a SessionStart hook rather than relying on CLAUDE.md or a skill trigger? |
| **fix** | Move session-initialization logic into a SessionStart hook handler; use `${CLAUDE_PLUGIN_ROOT}` for all paths. |
| **related** | `CTX-SST` |
| **example** | NG: CLAUDE.md entry that sets environment context (not guaranteed to be re-read each session). OK: SessionStart hook that reads `.local.md` and injects current state. |

---

### SPC-PTL

| Field | Value |
|---|---|
| **id** | `SPC-PTL` |
| **slug** | `pretool-two-layer` |
| **domain** | SPC |
| **applies_to** | hook |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the PreToolUse hook use a two-layer approach — a fast deterministic first pass (pattern matching, exit code) before invoking any LLM-based second pass? |
| **fix** | Add a static pattern-matching layer that exits early (exit 0 or exit 2) for clear cases; only invoke LLM judgment for ambiguous inputs that pass the first layer. |
| **related** | `SPC-SDS`, `SPC-HIV` |
| **example** | NG: single-layer hook that sends every Bash command to an LLM for safety analysis. OK: hook that blocks `rm -rf /` deterministically, then uses LLM for edge cases. |

---

### SPC-HAR

| Field | Value |
|---|---|
| **id** | `SPC-HAR` |
| **slug** | `hook-applicability-rule` |
| **domain** | SPC |
| **applies_to** | hook |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Does the hook enforce a rule that genuinely must fire on every matching tool call with zero exceptions, rather than a rule that only applies sometimes? |
| **fix** | If the rule has exceptions, convert it to a CLAUDE.md instruction instead; only use a hook when unconditional enforcement is required. |
| **related** | `SPC-HER`, `SPC-THT` |
| **example** | NG: hook that blocks `Bash` commands unless the user has "approved" a flag (conditional). OK: hook that always blocks `rm -rf` regardless of context. |

---

### SPC-HSV

| Field | Value |
|---|---|
| **id** | `SPC-HSV` |
| **slug** | `hook-stderr-visibility` |
| **domain** | SPC |
| **applies_to** | hook |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Does the hook script write decision messages to stderr (not stdout) when exiting with code 2, so that Claude receives the block reason? |
| **fix** | Change all `echo "reason"` calls that accompany `exit 2` to `echo "reason" >&2`; stdout is not visible to Claude on blocking exits. |
| **related** | — |
| **example** | NG: `echo "Path traversal detected"; exit 2`. OK: `echo '{"decision":"deny","reason":"Path traversal"}' >&2; exit 2`. |

---

### SPC-HI

| Field | Value |
|---|---|
| **id** | `SPC-HI` |
| **slug** | `hook-idempotency` |
| **domain** | SPC |
| **applies_to** | hook |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Is the hook idempotent — running the same hook multiple times on the same input produces the same outcome without accumulating side effects? |
| **fix** | Replace any append-only operations (e.g., `>> log.txt`) with idempotent equivalents; use lock files or state checks if the hook writes to disk. |
| **related** | `CTX-SST` |
| **example** | NG: hook that appends a line to a log file on every call, growing unboundedly. OK: hook that writes a fixed-key JSON state file (overwrite, not append). |

---

### Hook-script conventions

---

### SPC-FMS

| Field | Value |
|---|---|
| **id** | `SPC-FMS` |
| **slug** | `front-matter-shell-io` |
| **domain** | SPC |
| **applies_to** | hook |
| **severity** | Recommended |
| **auto** | `[auto]` |
| **check** | When a plugin uses `.local.md` state files, do the hook scripts read and write them using the YAML front-matter pattern (sed/awk extraction of the `---` block) rather than custom ad-hoc parsing? |
| **fix** | Replace fragile custom parsing with a consistent front-matter extraction approach; the canonical pattern is `sed -n '/^---$/,/^---$/{ /^---$/d; p; }` for the YAML block and `awk '/^---$/{i++; next} i>=2'` for the body — any equivalent approach that reliably handles the `---` delimiters without ad-hoc grepping is acceptable. |
| **related** | `CTX-LMS` |
| **example** | NG: `cat state.md \| grep "enabled"` (fragile). OK: `ENABLED=$(sed -n '/^---$/,/^---$/{ /^---$/d; p; }' state.md \| grep '^enabled:' \| sed 's/enabled: *//')`. |

---

### SPC-SDS

| Field | Value |
|---|---|
| **id** | `SPC-SDS` |
| **slug** | `security-detector-set` |
| **domain** | SPC |
| **applies_to** | hook |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Does the security hook detect the minimum required dangerous patterns — at minimum: command injection, XSS, `eval` usage, dangerous HTML, pickle deserialization, `os.system` calls, and path traversal? |
| **fix** | Add missing pattern detectors; reference the `security-guidance` plugin's pattern set as a baseline; add plugin-specific patterns on top. |
| **related** | `SPC-HIV`, `SPC-PTL` |
| **example** | NG: hook that only checks for `rm -rf`. OK: hook that covers the full baseline set plus project-specific rules. |

---

### SPC-HIV

| Field | Value |
|---|---|
| **id** | `SPC-HIV` |
| **slug** | `hook-input-validation` |
| **domain** | SPC |
| **applies_to** | hook |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Does every hook script: (1) start with `set -euo pipefail`, (2) parse stdin JSON with `jq`, (3) quote all variable expansions, (4) validate tool name format, and (5) block path traversal by checking for `..`? |
| **fix** | Add the missing safety measures; treat the hook-input-validation code template in `patterns.md` as the canonical reference. |
| **related** | `SPC-SDS`, `SPC-PTL` |
| **example** | NG: hook script that reads `$tool_name` from an unvalidated variable. OK: script with `set -euo pipefail`, jq parsing, `[[ ! "$tool_name" =~ ^[a-zA-Z0-9_]+$ ]]` guard, and `..` check. |

---

### SPC-CGW

| Field | Value |
|---|---|
| **id** | `SPC-CGW` |
| **slug** | `clean-gone-worktrees` |
| **domain** | SPC |
| **applies_to** | hook |
| **severity** | Quality |
| **auto** | `[auto]` |
| **check** | When the plugin includes worktree cleanup logic, does it handle the `+` prefix (worktree-attached branches) in `git branch -v` output before deleting branches? |
| **fix** | Add a `git worktree remove --force` step before `git branch -D` for branches that appear as `+` in the branch list. |
| **related** | — |
| **example** | NG: `git branch -v \| grep '\[gone\]' \| awk '{print $1}' \| xargs git branch -D` (skips worktree removal). OK: same pipeline with worktree check via `git worktree list \| grep "\\[$branch\\]"` before delete. |

---

### Plugin files

---

### SPC-MSF

| Field | Value |
|---|---|
| **id** | `SPC-MSF` |
| **slug** | `mcp-server-file` |
| **domain** | SPC |
| **applies_to** | all (content-conditional: plugin uses MCP servers) |
| **severity** | Quality |
| **auto** | `[auto]` |
| **check** | When the plugin uses MCP servers, does `.mcp.json` exist at the plugin root, is it valid JSON, and does each server entry include at least `command` (for local servers) or `url` (for remote servers)? |
| **fix** | Create `.mcp.json` at the plugin root; validate JSON; ensure each server entry has at minimum a `command` field (local) or `url` field (remote). |
| **related** | `ARC-SDL` |
| **example** | NG: plugin that references an MCP tool in its commands but has no `.mcp.json`. OK: `.mcp.json` with `{"mcpServers": {"my-server": {"command": "npx my-mcp"}}}`. |

---

### Multi-agent interfaces

---

### SPC-FS

| Field | Value |
|---|---|
| **id** | `SPC-FS` |
| **slug** | `finding-schema` |
| **domain** | SPC |
| **applies_to** | agent (content-conditional: inspection-class agents that emit findings) |
| **severity** | Mandatory |
| **auto** | `[auto]` |
| **check** | Does every finding emitted by the agent conform to the finding schema — fields: `target_file`, `finding_type`, `verdict`, `comment`, `self_confidence`, `rationale`, `expected_effect`, `patch_content`? |
| **fix** | Add any missing fields; ensure `verdict` is one of OK/NG/OOS; ensure `self_confidence` is 0–100 integer; ensure `expected_effect` is a list of checklist item IDs. |
| **related** | `SPC-FTT`, `SPC-PCF`, `SPC-AJT`, `SPC-OVR` |
| **example** | NG: finding with no `expected_effect` field. OK: `{"target_file": "commands/create.md", "finding_type": "checklist:command:allowed-tools-restriction", "verdict": "NG", ...}`. |

---

### SPC-FTT

| Field | Value |
|---|---|
| **id** | `SPC-FTT` |
| **slug** | `finding-type-taxonomy` |
| **domain** | SPC |
| **applies_to** | agent (content-conditional: inspection-class agents) |
| **severity** | Mandatory |
| **auto** | `[auto]` |
| **check** | Does every `finding_type` string follow the format `checklist:<component-type>:<item-slug>`, using the item's slug (kebab-case name) and never the ID? |
| **fix** | Replace any finding_type that uses the ID (e.g., `PRM-IV`) with the slug form (e.g., `checklist:command:instruction-voice`). |
| **related** | `SPC-FS`, `SPC-PCF`, `SPC-AJT`, `SPC-OVR` |
| **example** | NG: `"finding_type": "PRM-IV"`. NG: `"finding_type": "instruction-voice"` (missing prefix). OK: `"finding_type": "checklist:command:instruction-voice"`. |

---

### SPC-PCF

| Field | Value |
|---|---|
| **id** | `SPC-PCF` |
| **slug** | `patch-content-format` |
| **domain** | SPC |
| **applies_to** | agent (content-conditional: inspection-class agents) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | When the finding includes a `patch_content` field, is it a well-formed unified diff or a structured replacement block that smith-apply.sh can consume without ambiguity? |
| **fix** | Reformat `patch_content` as a unified diff (`--- a/file\n+++ b/file\n@@ ...`); ensure context lines (3 lines each side) are included for unambiguous application. |
| **related** | `SPC-FS`, `SPC-FTT`, `SPC-AJT`, `SPC-OVR` |
| **example** | NG: `patch_content: "Change line 4 to say X"` (prose). OK: unified diff with `-` and `+` lines. |

---

### SPC-AJT

| Field | Value |
|---|---|
| **id** | `SPC-AJT` |
| **slug** | `agent-json-transport` |
| **domain** | SPC |
| **applies_to** | agent (content-conditional: inspection-class agents) |
| **severity** | Mandatory |
| **auto** | `[auto]` |
| **check** | Does the agent emit its findings as a JSON array on stdout, parseable by the orchestrating script without additional transformation? |
| **fix** | Wrap all findings in a top-level JSON array; remove any prose output that precedes or follows the JSON block. |
| **related** | `SPC-FS`, `SPC-FTT`, `SPC-PCF`, `SPC-OVR` |
| **example** | NG: agent that prints "Here are my findings:" followed by JSON (unparseable preamble). OK: agent that emits only `[{...}, {...}]` on stdout. |

---

### SPC-OVR

| Field | Value |
|---|---|
| **id** | `SPC-OVR` |
| **slug** | `oos-verdict-rule` |
| **domain** | SPC |
| **applies_to** | agent (content-conditional: inspection-class agents) |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Does the agent use OOS verdict only when a checklist item is logically inapplicable to the file (wrong component type or absent content precondition), and never as a softer NG? |
| **fix** | Review all OOS verdicts; replace any that represent "hard to judge" or "probably fine" with NG (if violation exists) or OK (if compliant); reserve OOS for genuine inapplicability. |
| **related** | `SPC-FS`, `SPC-FTT`, `SPC-PCF`, `SPC-AJT` |
| **example** | NG: OOS verdict for PRM-CPM on a command file that has multi-phase logic but no phase markers (should be NG). OK: OOS verdict for PRM-CPM on a skill file (skills are not in scope for CPM). |

---

## PRM — Prompt Authoring (25 items)

> All severity, auto/judgment, applies_to, and related values are from the authoritative pre-decisions in `progress.md §PRM domain pre-decisions`. Redefinitions override `checklists.md` where noted.

---

### PRM-IV

| Field | Value |
|---|---|
| **id** | `PRM-IV` |
| **slug** | `instruction-voice` |
| **domain** | PRM |
| **applies_to** | all |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Are the primary directives (instructions to Claude) written in imperative form — direct commands ("Do X", "Return Y") rather than descriptions ("This command does X") or questions? Rationale sentences, contextual descriptions, and examples are exempt. |
| **fix** | Rewrite descriptive or passive directive sentences as imperative commands; remove "This command will…" or "You can…" framing from instruction lines. |
| **related** | `PRM-LFD` |
| **example** | NG: "This command helps you review PRs." OK: "Review the PR diff and return a list of issues." |

---

### PRM-CPM

| Field | Value |
|---|---|
| **id** | `PRM-CPM` |
| **slug** | `critical-phase-markers` |
| **domain** | PRM |
| **applies_to** | command, agent (content-conditional: prompt contains ≥2 explicitly numbered phases) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | In multi-phase prompts, are critical phases explicitly labeled with hard markers (`**CRITICAL**: DO NOT SKIP`, `**DO NOT START WITHOUT USER APPROVAL**`) to prevent Claude from skipping them? |
| **fix** | Add emphasis markers before each phase that must not be skipped; use bold + ALL-CAPS phrasing for maximum compliance. |
| **related** | `PRM-MSS`, `PRM-SAC` |
| **example** | NG: "Phase 3: Get user approval." OK: "**Phase 3 — CRITICAL: DO NOT PROCEED WITHOUT EXPLICIT USER APPROVAL.**" |

---

### PRM-OSD

| Field | Value |
|---|---|
| **id** | `PRM-OSD` |
| **slug** | `output-shape-directives` |
| **domain** | PRM |
| **applies_to** | command, agent, skill |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the prompt specify the structural shape of its output — what sections, fields, or top-level format the response must contain? Evaluate OSD before PRM-OFD. |
| **fix** | Add an output specification section: "Return a JSON array with fields X, Y, Z" or "Respond with a markdown table with columns A, B". |
| **related** | `PRM-OFD` |
| **example** | NG: "Report your findings." OK: "Return a markdown list of issues, one bullet per issue, each on a single line." |

---

### PRM-SC

| Field | Value |
|---|---|
| **id** | `PRM-SC` |
| **slug** | `scope-constraint` |
| **domain** | PRM |
| **applies_to** | all |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the prompt explicitly bound its operating scope — stating what inputs, domains, or file types are in-scope and what is excluded? |
| **fix** | Add a scope section: "Only review files changed in this PR. Do not check build signal or unrelated files." |
| **related** | `PRM-FLD`, `PRM-SAC`, `PRM-IS`, `PRM-FPE`, `PRM-DPE` |
| **example** | NG: "Review the code for issues." OK: "Review only the files listed in the diff. Do not check build signal or attempt to typecheck." |

---

### PRM-SMC

| Field | Value |
|---|---|
| **id** | `PRM-SMC` |
| **slug** | `single-message-completion` |
| **domain** | PRM |
| **applies_to** | command, agent |
| **severity** | Mandatory |
| **auto** | `[auto]` for known phrases; `[judgment]` for paraphrases |
| **check** | For commands requiring single-turn completion, does the prompt include a directive prohibiting mid-task clarification or follow-up? Known phrases: "do not send any other text", "complete in one turn", "do not ask for confirmation", "respond in a single message", "no follow-up". |
| **fix** | Add one of the known phrases (or a clear semantic equivalent) to the prompt. |
| **related** | `PRM-CWF` |
| **example** | NG: command that expects one-shot output with no such directive. OK: "Do not send any other text or messages besides these tool calls." |

---

### PRM-SBS

| Field | Value |
|---|---|
| **id** | `PRM-SBS` |
| **slug** | `concrete-example-shape` |
| **domain** | PRM |
| **applies_to** | skill |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Are the examples in the skill body concrete in I/O shape — showing the input format AND the expected output format, not just describing them in prose? |
| **fix** | Replace prose descriptions of examples with literal input/output pairs; show the actual data structure or format Claude should produce. |
| **related** | `PRM-EI-S`, `PRM-EI-CA` |
| **example** | NG: "For example, if given a CSV, return the parsed data." OK: Input: `name,age\nAlice,30` → Output: `[{"name":"Alice","age":30}]`. |

---

### PRM-FPE

| Field | Value |
|---|---|
| **id** | `PRM-FPE` |
| **slug** | `false-positive-enumeration` |
| **domain** | PRM |
| **applies_to** | command, agent (content-conditional: inspection-class prompts whose output is a list of findings, issues, or recommendations) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the inspection-class prompt include an explicit enumeration of false-positive categories — finding types that look valid but must not be reported? |
| **fix** | Add a "Do not report" section listing: pre-existing issues, issues lint/CI will catch, stylistic nitpicks not in CLAUDE.md, intentional changes, problems on unchanged lines. |
| **related** | `PRM-IS`, `PRM-SC`, `PRM-DPE` |
| **example** | NG: "Find all issues in the code." OK: "Find issues. Do not report: pre-existing issues, lint-caught issues, style preferences not in CLAUDE.md." |

---

### PRM-OFD

| Field | Value |
|---|---|
| **id** | `PRM-OFD` |
| **slug** | `output-format-discipline` |
| **domain** | PRM |
| **applies_to** | command, agent, skill |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | After PRM-OSD passes (structure defined), does each format rule name (a) what must appear, (b) what must not appear, and (c) any quantity or ordering constraint? Evaluate OFD only after OSD passes. |
| **fix** | Starting from a defined output structure (PRM-OSD must pass first), replace vague directives like "Keep it brief" with precise rules: "Each finding must include one file link. No emojis. Findings ordered by severity descending." |
| **related** | `PRM-OSD` |
| **example** | NG: "Be concise and clear." OK: "Every finding must link to the file with full SHA and line range. No short SHAs. No emojis." |

---

### PRM-CD

| Field | Value |
|---|---|
| **id** | `PRM-CD` |
| **slug** | `code-delegation` |
| **domain** | PRM |
| **applies_to** | command, agent (content-conditional: orchestrator-type that dispatches ≥1 agent or invokes ≥1 skill) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | When the orchestrator delegates code writing to the user, does it delegate only genuinely important decisions (business logic, algorithm choice, error handling strategy) and retain boilerplate, configuration, and obvious implementations? |
| **fix** | Move boilerplate and CRUD to automated generation; reserve user input for genuine business-logic decisions (branching conditions, error-handling strategy, algorithm choice). |
| **related** | — |
| **example** | NG: asking user to write a standard CRUD endpoint. OK: asking user to write the business-logic branching condition inside a handler. |

---

### PRM-LFD

| Field | Value |
|---|---|
| **id** | `PRM-LFD` |
| **slug** | `lean-forward-description` |
| **domain** | PRM |
| **applies_to** | skill (description field in SKILL.md front matter only) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the skill's `description` field use active verbs and state a concrete outcome — not a passive noun phrase or vague capability label? |
| **fix** | Rewrite the description starting with an action verb and ending with what the skill produces: "Analyzes X and returns Y" rather than "A tool for X analysis". |
| **related** | `PRM-IV` |
| **example** | NG: "A skill for PR analysis." OK: "Analyzes PR diffs and returns structured issue findings with file links." |

---

### PRM-APE

| Field | Value |
|---|---|
| **id** | `PRM-APE` |
| **slug** | `anti-pattern-enumeration` |
| **domain** | PRM |
| **applies_to** | command, agent, skill |
| **severity** | Recommended |
| **auto** | `[auto]` |
| **check** | Count prohibition-opener sentences/bullets ("Do not", "Never", "Avoid", "Don't") in the prompt. "Different sections" means appearing under different markdown heading blocks (##, ###, etc.). A "shared inline list" means a markdown bullet or numbered list where all prohibition items appear consecutively under the same heading. If ≥2 are found in different sections AND not within a shared inline list, the check is NG — co-locate them. If ≥2 in the same section or list, OK. If count = 1, OOS. |
| **fix** | Consolidate scattered prohibition directives into a single "Do not" or "Avoid" section/list so they are co-located and easy to scan. |
| **related** | `PRM-PIF` |
| **example** | NG: "Do not use emojis." in Phase 1 and "Never include pre-existing issues." in Phase 3 (scattered). OK: a single "Exclusions" bullet list containing both. |

---

### PRM-CWF

| Field | Value |
|---|---|
| **id** | `PRM-CWF` |
| **slug** | `context-window-frugality` |
| **domain** | PRM |
| **applies_to** | all |
| **severity** | Quality |
| **auto** | `[auto]` for both mechanical rules; `[judgment]` for subjective density |
| **check** | (1) No paragraph in the prompt exceeds 60 words. (2) No identical 4+-word phrase (exact string match, case-insensitive) is repeated within a 150-word window — common structural phrases (e.g., "the following", "in this case", "one of the") are excluded from this rule. Both rules are `[auto]`. |
| **fix** | Split paragraphs longer than 60 words into shorter ones; deduplicate repeated phrases. |
| **related** | `PRM-SMC` |
| **example** | NG: 80-word paragraph. NG: phrase "return structured findings" appearing 3 times within 100 words. OK: all paragraphs ≤60 words, no phrase over-repeated. |

---

### PRM-IS

| Field | Value |
|---|---|
| **id** | `PRM-IS` |
| **slug** | `instruction-specificity` |
| **domain** | PRM |
| **applies_to** | all |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Are instructions concrete enough that Claude can execute them without inferring unstated details — naming target files, referencing existing patterns, specifying edge cases? |
| **fix** | Replace vague directives ("add tests") with specific ones ("write a test for `foo.py` covering the logged-out edge case; avoid mocks; use the pattern in `BarTest.py`"). |
| **related** | `PRM-IR`, `PRM-SC`, `PRM-FPE`, `PRM-DPE` |
| **example** | NG: "Add error handling." OK: "Add a try/except around the `db.connect()` call in `storage.py:42` and return a 503 on failure." |

---

### PRM-PIF

| Field | Value |
|---|---|
| **id** | `PRM-PIF` |
| **slug** | `positive-instruction-form` |
| **domain** | PRM |
| **applies_to** | all |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Are instructions written as "do X" rather than "don't do Y" wherever a positive form is possible? |
| **fix** | Rewrite each "do not use markdown" as "respond in flowing prose paragraphs"; reserve negative form only for true exclusions where a positive alternative doesn't exist. |
| **related** | `PRM-APE` |
| **example** | NG: "Do not use markdown in your response." OK: "Respond in smoothly flowing prose paragraphs." |

---

### PRM-IR

| Field | Value |
|---|---|
| **id** | `PRM-IR` |
| **slug** | `instruction-rationale` |
| **domain** | PRM |
| **applies_to** | all |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the prompt include ≥1 sentence that connects a reason to the instruction it justifies (e.g., "This is required because…" or "Without this, Claude will…")? The rationale may precede or follow its instruction. A standalone fact not tied to any instruction does not count. |
| **fix** | Add a rationale sentence adjacent to the instruction it supports; use "because" or "otherwise" connectors to make the link explicit. |
| **related** | `PRM-IS` |
| **example** | NG: "Use the full SHA1." (no rationale). OK: "Use the full SHA1, because short SHAs can match multiple commits and cause incorrect links." |

---

### PRM-FLD

| Field | Value |
|---|---|
| **id** | `PRM-FLD` |
| **slug** | `freedom-level-declaration` |
| **domain** | PRM |
| **applies_to** | all |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the prompt contain an explicit statement of intended freedom level using one of these terms or clear paraphrases — open-ended ("Claude chooses the approach"), parameterized ("follow this template"), or procedural ("follow phases in order, do not deviate")? A numbered list of phases without such a statement does not qualify. |
| **fix** | Add one explicit freedom-level sentence near the top of the prompt; choose the form that matches the task's actual flexibility. |
| **related** | `PRM-SAC`, `PRM-SC` |
| **example** | NG: numbered phases with no freedom declaration. OK: "This is a procedural workflow — follow phases in order, do not deviate." |

---

### PRM-VSC

| Field | Value |
|---|---|
| **id** | `PRM-VSC` |
| **slug** | `verifiable-success-criteria` |
| **domain** | PRM |
| **applies_to** | command, agent, skill |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Does the prompt define verifiable success criteria — specific tests, lint outputs, expected file states, or observable outputs that Claude can check to confirm the task is complete? |
| **fix** | Add a "Definition of done" or "Verify by" section naming the exact checks (e.g., "All tests pass", "No TypeScript errors", "The output file contains a valid JSON array"). |
| **related** | `PRM-NRP`, `PRM-TIC` |
| **example** | NG: "Complete the feature." OK: "The task is complete when `npm test` exits 0 and `src/feature.ts` exports a `Feature` type." |

---

### PRM-MSS

| Field | Value |
|---|---|
| **id** | `PRM-MSS` |
| **slug** | `multi-step-structuring` |
| **domain** | PRM |
| **applies_to** | command, agent, skill (content-conditional: prompt contains a multi-step procedure) |
| **severity** | Recommended |
| **auto** | `[auto]` |
| **check** | In multi-step prompts, are steps numbered and structured as a checklist that Claude can track progress against? |
| **fix** | Convert the procedure into a numbered list; add a checklist prefix (e.g., `- [ ]`) to each step so Claude can mark progress. |
| **related** | `PRM-CPM`, `PRM-SAC` |
| **example** | NG: multi-step procedure described in prose paragraphs. OK: "1. [ ] Read the diff. 2. [ ] Identify files changed. 3. [ ] Run analysis." |

---

### PRM-TC

| Field | Value |
|---|---|
| **id** | `PRM-TC` |
| **slug** | `terminology-consistency` |
| **domain** | PRM |
| **applies_to** | all |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Is the same term used for the same concept throughout the prompt — no mixing of "API endpoint", "URL", "route", and "path" for the same thing? A synonym is intentional only when the prompt itself explicitly documents the equivalence (e.g., "endpoint (also called route)"). Undocumented synonym variation is NG. |
| **fix** | Pick one canonical term per concept; do a find-replace pass to unify all occurrences; document intentional synonyms explicitly if needed. |
| **related** | — |
| **example** | NG: "Call the endpoint… fetch the URL… hit the route…" all referring to the same API path. OK: "Call the endpoint" consistently throughout. |

---

### PRM-TIC

| Field | Value |
|---|---|
| **id** | `PRM-TIC` |
| **slug** | `time-independent-content` |
| **domain** | PRM |
| **applies_to** | all |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the prompt avoid time-bound references (specific dates, release version thresholds like "until v2.0 use the old API") that will silently produce incorrect behavior when the date passes or version changes? |
| **fix** | Replace "until August 2025, use the old API" with an "old patterns" section; remove specific dates; reference stable identifiers (e.g., "the v1 API") instead. |
| **related** | `PRM-VSC` |
| **example** | NG: "Use the legacy endpoint until we migrate in Q3." OK: "Use the v1 endpoint (legacy); migrate to v2 when `FEATURE_V2` flag is enabled." |

---

### PRM-DPE

| Field | Value |
|---|---|
| **id** | `PRM-DPE` |
| **slug** | `default-plus-escape` |
| **domain** | PRM |
| **applies_to** | all (content-conditional: prompt contains a choice gateway — branch point where ≥2 approaches are valid and Claude must select one) |
| **severity** | Quality |
| **auto** | `[judgment]` |
| **check** | When the prompt presents a choice between ≥2 valid approaches, does it provide one recommended default and an escape hatch, rather than leaving the choice fully open or listing all options as equal? |
| **fix** | Designate one option as the default ("Use approach A unless…") and state the condition under which the alternative applies. |
| **related** | `PRM-IS`, `PRM-SC`, `PRM-FPE` |
| **example** | NG: "You can use either JSON or YAML." OK: "Use JSON by default; use YAML only when the project's config directory already contains `.yaml` files." |

---

### PRM-SAC

| Field | Value |
|---|---|
| **id** | `PRM-SAC` |
| **slug** | `single-approach-commitment` |
| **domain** | PRM |
| **applies_to** | all (content-conditional: prompt governs a structured, reproducible task with a defined completion state) |
| **severity** | Quality |
| **auto** | `[judgment]` |
| **check** | For structured, reproducible tasks, does the prompt commit to one approach throughout rather than offering alternatives mid-procedure that would make the workflow non-deterministic? |
| **fix** | Remove branching alternatives from mid-procedure steps; if flexibility is needed, make the choice at the start and commit to it for the rest of the procedure. |
| **related** | `PRM-FLD`, `PRM-SC`, `PRM-MSS`, `PRM-CPM` |
| **example** | NG: "In step 3, you can either run tests or skip them." OK: "Run all tests in step 3. If tests cannot run, abort and report the reason." |

---

### PRM-NRP

| Field | Value |
|---|---|
| **id** | `PRM-NRP` |
| **slug** | `null-result-protocol` |
| **domain** | PRM |
| **applies_to** | command, agent (content-conditional: inspection-class prompts AND any prompt where zero results is a plausible completion state — determined by `[judgment]`) |
| **severity** | Mandatory |
| **auto** | `[auto]` for known phrases; `[judgment]` for semantic equivalents and applicability |
| **check** | Does the prompt specify what to output when there are zero results? `[auto]` known phrases: "if no results", "return empty", "nothing to report", "no findings", "when nothing is found". |
| **fix** | Add a null-result clause: "If no issues are found, return an empty list" or "If nothing matches, output 'No findings'." |
| **related** | `PRM-VSC` |
| **example** | NG: inspection prompt with no guidance on the zero-findings case. OK: "If no issues found, respond with 'No issues identified'." |

---

### PRM-EI-S

| Field | Value |
|---|---|
| **id** | `PRM-EI-S` |
| **slug** | `example-inclusion-skill` |
| **domain** | PRM |
| **applies_to** | skill |
| **severity** | Recommended |
| **auto** | `[auto]` |
| **check** | Does the skill body (SKILL.md) contain at least one concrete example? Presence-only check — quality of the example is evaluated separately by PRM-SBS. |
| **fix** | Add at least one example to the SKILL.md body; a concrete example is a markdown code block, a table, or a labeled input/output pair — prose description alone does not qualify. |
| **related** | `PRM-SBS`, `PRM-EI-CA` |
| **example** | NG: skill body with only prose description and no example. OK: skill body with at least one code block, table, or labeled input/output pair. |

---

### PRM-EI-CA

| Field | Value |
|---|---|
| **id** | `PRM-EI-CA` |
| **slug** | `example-inclusion-command-agent` |
| **domain** | PRM |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the command or agent prompt include at least one concrete example that illustrates the expected behavior — showing what input triggers the behavior and what output is expected? |
| **fix** | Add an example section with a realistic scenario; show the input (user request or trigger condition) and the expected output format. |
| **related** | `PRM-SBS`, `PRM-EI-S` |
| **example** | NG: command that describes its behavior in prose only. OK: command with "Example: given `$1=123`, produces a PR comment with the following format: …". |

---

## FLW — Flow (29 items)

### Dispatch & control flow

---

### FLW-EAG

| Field | Value |
|---|---|
| **id** | `FLW-EAG` |
| **slug** | `explicit-approval-gate` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | When the user delegates a decision to the plugin, does the plugin surface a concrete recommendation and obtain explicit user confirmation before proceeding — rather than silently choosing? |
| **fix** | Add a display-and-confirm step: show the proposed action/choice, wait for user approval (`y/n`), then proceed. |
| **related** | `FLW-PC`, `FLW-LEB` |
| **example** | NG: plugin that silently picks an approach when given "do whatever you think is best." OK: "I recommend approach A because X. Proceed? [y/n]" |

---

### FLW-LEB

| Field | Value |
|---|---|
| **id** | `FLW-LEB` |
| **slug** | `loop-escape-ban` |
| **domain** | FLW |
| **applies_to** | command, agent (content-conditional: plugin uses an iterative loop with a completion predicate) |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Does the loop prompt explicitly forbid emitting the completion token until the completion condition is actually verified — not just assumed? |
| **fix** | Add an explicit ban: "Do not output `<completion-token>` unless you have verified that `<condition>` is true. Do not emit it to escape the loop." |
| **related** | `FLW-EAG`, `FLW-PC` |
| **example** | NG: loop that allows Claude to output "DONE" at any time. OK: loop with "Only output DONE when all tests pass (exit 0). Do not output DONE before verifying." |

---

### FLW-MTS

| Field | Value |
|---|---|
| **id** | `FLW-MTS` |
| **slug** | `model-tier-selection` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Is each agent's model tier chosen deliberately — Haiku for routine pre/post-processing, Sonnet for analysis and review, Opus only for deep reasoning tasks, and `inherit` as the default? |
| **fix** | Review each agent's `model` field; downgrade Opus agents that don't require deep judgment to Sonnet; downgrade Sonnet agents doing only filtering to Haiku. |
| **related** | `FLW-MTP` |
| **example** | NG: `model: opus` for an agent that just reformats JSON. OK: `model: haiku` for filtering, `model: sonnet` for code analysis, `model: opus` for nuanced quality judgment. |

---

### FLW-PVS

| Field | Value |
|---|---|
| **id** | `FLW-PVS` |
| **slug** | `parallel-vs-sequential` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Are independent tasks dispatched in parallel, while pipeline stages that depend on prior output run sequentially? |
| **fix** | Identify task dependencies; dispatch independent agents simultaneously; chain dependent stages so each waits for its predecessor's output. |
| **related** | `FLW-PPS`, `FLW-PCP` |
| **example** | NG: three independent review agents dispatched sequentially. OK: same three agents dispatched in parallel, results merged before the scoring stage. |

---

### FLW-PC

| Field | Value |
|---|---|
| **id** | `FLW-PC` |
| **slug** | `phase-control` |
| **domain** | FLW |
| **applies_to** | command |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | In multi-phase commands, are phase boundaries explicit and enforced — each phase numbered, critical phases labeled, and user-approval gates placed before irreversible actions? |
| **fix** | Number all phases; add `**CRITICAL: DO NOT SKIP**` to phases with irreversible actions; add explicit user-confirmation gates before applying changes. |
| **related** | `FLW-EAG`, `FLW-LEB`, `PRM-CPM` |
| **example** | NG: command that moves from planning to file edits without a confirmation step. OK: "Phase 3 — CRITICAL: Present the plan and wait for 'y' before writing any files." |

---

### FLW-MTP

| Field | Value |
|---|---|
| **id** | `FLW-MTP` |
| **slug** | `model-tier-pipeline` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the plugin use a tiered model pipeline — cheaper models (Haiku) for eligibility checks and filtering, mid-tier (Sonnet) for analysis, and expensive models (Opus) only at the quality-judgment bottleneck? |
| **fix** | Move eligibility pre-checks to a Haiku agent; use Sonnet for the main analysis pass; restrict Opus to the final quality evaluation step if any. |
| **related** | `FLW-MTS` |
| **example** | NG: single Opus agent doing eligibility check + analysis + scoring. OK: Haiku eligibility check → Sonnet analysis → Haiku scoring (or Opus if judgment-intensive). |

---

### FLW-PPS

| Field | Value |
|---|---|
| **id** | `FLW-PPS` |
| **slug** | `parallel-perspective-split` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | When multiple agents run in parallel, do they have distinct roles or lenses — not redundant identical prompts — so their outputs are genuinely complementary? |
| **fix** | Give each parallel agent a distinct lens (e.g., security, performance, style) rather than the same generic "review" prompt. |
| **related** | `FLW-PVS`, `FLW-RES` |
| **example** | NG: three agents with identical "find issues" prompts. OK: agent A focuses on correctness, agent B on security, agent C on architecture. |

---

### FLW-RES

| Field | Value |
|---|---|
| **id** | `FLW-RES` |
| **slug** | `reporter-evaluator-separation` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Is the agent that reports findings different from the agent that scores or evaluates them — so neither scores its own output? |
| **fix** | Create a separate evaluator agent that receives the reporter's findings as input and scores them; the reporter does not set its own confidence threshold. |
| **related** | `FLW-PPS`, `FLW-CTF` |
| **example** | NG: single agent that both finds issues and assigns confidence scores. OK: Sonnet reporter emits findings → Haiku evaluator scores each finding independently. |

---

### FLW-SD

| Field | Value |
|---|---|
| **id** | `FLW-SD` |
| **slug** | `selective-dispatch` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | When the plugin has multiple specialized agents, does the orchestrator dispatch only the relevant agents based on input signals — not always all agents? |
| **fix** | Add routing logic that inspects the input (e.g., file types, PR labels, user flags) and dispatches only the agents whose domain applies. |
| **related** | `FLW-PVS`, `FLW-PPS` |
| **example** | NG: PR review that always runs all six review agents regardless of what changed. OK: routing that runs the security agent only when security-sensitive files are in the diff. |

---

### FLW-SDP

| Field | Value |
|---|---|
| **id** | `FLW-SDP` |
| **slug** | `signal-driven-proposal` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Are proposals generated from observed signals (changed files, error output, git diff, failing tests) rather than from general project state? |
| **fix** | Add a signal-collection phase before proposal generation; ground each proposal in a specific signal (e.g., "because test X failed" or "because file Y changed"). |
| **related** | `FLW-EPA`, `FLW-SDD` |
| **example** | NG: proposal based on "reviewing the overall codebase." OK: proposal based on "test `auth_test.py` is failing with error X." |

---

### FLW-PCP

| Field | Value |
|---|---|
| **id** | `FLW-PCP` |
| **slug** | `parallel-candidate-presentation` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Quality |
| **auto** | `[judgment]` |
| **check** | When multiple design candidates are generated, are they presented to the user simultaneously for comparison rather than sequentially one at a time? |
| **fix** | Collect all candidates before presenting; display them side-by-side or as a numbered list in a single message. |
| **related** | `FLW-PVS`, `FLW-PPS` |
| **example** | NG: present option A, wait for feedback, then present option B. OK: present options A, B, and C together with a comparison table. |

---

### FLW-WVA

| Field | Value |
|---|---|
| **id** | `FLW-WVA` |
| **slug** | `whole-view-agent` |
| **domain** | FLW |
| **applies_to** | agent (content-conditional: architecture-level inspection agent) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the architecture-level agent receive the full plugin context (all component files, directory structure, README) rather than individual files in isolation? |
| **fix** | Pass the full plugin file list to the architecture agent; do not filter to a single file before dispatching. |
| **related** | `FLW-PPS` |
| **example** | NG: architecture agent that sees only `commands/create.md`. OK: architecture agent that sees all files listed in the Feature manifest. |

---

### FLW-DOW

| Field | Value |
|---|---|
| **id** | `FLW-DOW` |
| **slug** | `dependency-ordered-writes` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | When the plugin writes multiple files, are they written in dependency order — interface/type definitions before their implementations, schemas before consumers? |
| **fix** | Add a dependency-ordering step before file writes; establish the write sequence so that no file references a symbol defined in a file written later. |
| **related** | `FLW-EPA`, `FLW-PIV` |
| **example** | NG: implementation file written before the type it imports. OK: types written first, then implementations that import them. |

---

### Quality gates

---

### FLW-CTF

| Field | Value |
|---|---|
| **id** | `FLW-CTF` |
| **slug** | `confidence-threshold-filter` |
| **domain** | FLW |
| **applies_to** | command, agent (content-conditional: inspection-class plugins using convergence scoring) |
| **severity** | Mandatory |
| **auto** | `[auto]` |
| **check** | Does the scoring pipeline drop findings with convergence_score below the defined threshold (80), and promote `[auto]`-tagged findings regardless of score? |
| **fix** | Implement the threshold filter in the evaluation script: drop findings where `(num_lenses × 30) + (max_confidence × 0.3) < 80`; bypass threshold for `[auto]` items. |
| **related** | `FLW-RES`, `FLW-CSF`, `FLW-STM` |
| **example** | NG: scoring script that reports all findings regardless of convergence. OK: script that applies threshold 80 and bypasses it for auto-tagged items. |

---

### FLW-DEC

| Field | Value |
|---|---|
| **id** | `FLW-DEC` |
| **slug** | `double-eligibility-check` |
| **domain** | FLW |
| **applies_to** | command, agent (content-conditional: long-running inspection or review plugins) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Is eligibility checked both before starting the review and again immediately before posting or applying results, to guard against state changes during the review? |
| **fix** | Add a second eligibility check at the end of the pipeline; abort and discard results if the target state has changed (e.g., PR was closed, new commits arrived). |
| **related** | `FLW-PIV`, `FLW-REA` |
| **example** | NG: review that posts a comment without rechecking whether the PR is still open. OK: eligibility check before start → review → eligibility recheck → post comment. |

---

### FLW-BAC

| Field | Value |
|---|---|
| **id** | `FLW-BAC` |
| **slug** | `blind-ab-comparison` |
| **domain** | FLW |
| **applies_to** | agent (content-conditional: evaluation agents that compare two versions of the same artifact) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | When comparing two variants of an artifact, does the evaluator agent receive both without knowing which is variant A or B — preventing identity bias? |
| **fix** | Strip version labels before sending to the evaluator; use neutral labels ("version 1" and "version 2"); reveal identity only after the verdict is returned. |
| **related** | `FLW-RES` |
| **example** | NG: evaluator that receives "original" and "improved" labels. OK: evaluator that receives "option X" and "option Y" with labels assigned randomly. |

---

### FLW-STM

| Field | Value |
|---|---|
| **id** | `FLW-STM` |
| **slug** | `severity-tier-model` |
| **domain** | FLW |
| **applies_to** | command, agent (content-conditional: plugins using a severity classification scheme) |
| **severity** | Mandatory |
| **auto** | `[auto]` |
| **check** | Does the plugin use exactly three severity tiers — Mandatory, Recommended, Quality — with Mandatory failures treated as blockers? |
| **fix** | Remove any non-standard tiers (e.g., "Optional", "Critical"); reclassify items into the three-tier model; ensure Mandatory failures halt the improvement pipeline. |
| **related** | `FLW-CTF`, `FLW-AST` |
| **example** | NG: system with "Critical", "Major", "Minor", "Optional" tiers. OK: Mandatory / Recommended / Quality. |

---

### FLW-AST

| Field | Value |
|---|---|
| **id** | `FLW-AST` |
| **slug** | `automation-stance-tagging` |
| **domain** | FLW |
| **applies_to** | command, agent (content-conditional: plugins that manage a checklist of items) |
| **severity** | Mandatory |
| **auto** | `[auto]` |
| **check** | Is every checklist item tagged with exactly one automation stance — `[auto]` for deterministic machine-verifiable checks, or `[judgment]` for LLM/human assessment? |
| **fix** | Add the missing stance tag to any untagged item; downgrade any `[auto]` tag where a judgment step is required (e.g., FP filtering). |
| **related** | `FLW-STM`, `FLW-CTF` |
| **example** | NG: checklist item with no `[auto]` or `[judgment]` tag. NG: item tagged `[auto]` that requires semantic judgment to evaluate. |

---

### FLW-FSB

| Field | Value |
|---|---|
| **id** | `FLW-FSB` |
| **slug** | `finding-severity-bins` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Are findings grouped and displayed by severity tier when reported to the user — Mandatory issues separated from Recommended and Quality? |
| **fix** | Sort the output by severity (Mandatory first) and add a section header for each tier before listing its findings. |
| **related** | `FLW-STM` |
| **example** | NG: findings listed in discovery order mixing all severities. OK: "### Mandatory (2)\n...\n### Recommended (5)\n..." |

---

### FLW-WQR

| Field | Value |
|---|---|
| **id** | `FLW-WQR` |
| **slug** | `weighted-quality-rubric` |
| **domain** | FLW |
| **applies_to** | agent (content-conditional: evaluation agents producing a quality grade) |
| **severity** | Quality |
| **auto** | `[judgment]` |
| **check** | When the plugin produces a quality grade or score, is it based on a defined rubric with weighted dimensions rather than a holistic impression? |
| **fix** | Define the rubric dimensions and their weights explicitly in the agent prompt; compute the grade mechanically from per-dimension scores. |
| **related** | `FLW-RES`, `FLW-CTF` |
| **example** | NG: agent that assigns an A–F grade based on overall feel. OK: agent that scores conciseness (30%), specificity (40%), structure (30%) and computes a weighted total. |

---

### Improvement pipeline

---

### FLW-PSC

| Field | Value |
|---|---|
| **id** | `FLW-PSC` |
| **slug** | `post-session-capture` |
| **domain** | FLW |
| **applies_to** | command, agent (content-conditional: plugins that improve based on session history) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the plugin capture and integrate post-session signals (conversation history, user corrections, failed attempts) into its improvement proposals? |
| **fix** | Add a session-history analysis phase before generating proposals; extract correction patterns and failed-attempt signals to ground the improvements. |
| **related** | `FLW-SDP`, `CTX-CM` |
| **example** | NG: improvement plugin that only reads current code, ignoring session history. OK: plugin that mines past sessions for "don't do X" corrections before proposing. |

---

### FLW-PVE

| Field | Value |
|---|---|
| **id** | `FLW-PVE` |
| **slug** | `plan-validate-execute` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the plugin follow plan → validate plan → execute order, never writing files or calling APIs before the plan has been validated? |
| **fix** | Add an explicit validation phase between planning and execution; show the plan, confirm it passes checks, then execute. |
| **related** | `FLW-EPA`, `FLW-PIV`, `ARC-PNE` |
| **example** | NG: plugin that generates and immediately applies a patch without showing it first. OK: generate patch → show diff → user confirms → apply. |

---

### FLW-SDD

| Field | Value |
|---|---|
| **id** | `FLW-SDD` |
| **slug** | `symptom-driven-diagnosis` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | When the plugin improves existing artifacts, does it start from a specific observed symptom (test failure, lint error, user complaint) and diagnose the root cause before proposing a fix? |
| **fix** | Add a symptom-collection and root-cause-diagnosis phase at the start of the improvement flow; do not jump directly to generating patches. |
| **related** | `FLW-SDP`, `FLW-EPA` |
| **example** | NG: improvement command that reads files and immediately proposes changes. OK: command that first identifies the symptom, traces it to a root cause, then proposes a targeted fix. |

---

### FLW-EPA

| Field | Value |
|---|---|
| **id** | `FLW-EPA` |
| **slug** | `evaluate-propose-apply` |
| **domain** | FLW |
| **applies_to** | command, agent (content-conditional: improvement-class plugins) |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Does the improvement pipeline strictly follow Evaluate → Propose → Apply order, with no Apply step that skips a prior Evaluate or Propose phase? |
| **fix** | Enforce the three-phase structure; gate the Apply step on both a completed Evaluation and an approved Proposal. |
| **related** | `FLW-PVE`, `FLW-PIV`, `FLW-REA` |
| **example** | NG: plugin that applies a pre-defined fix template without first evaluating the current state. OK: inspect → find NG findings → propose patch → user approves → apply. |

---

### FLW-PIV

| Field | Value |
|---|---|
| **id** | `FLW-PIV` |
| **slug** | `pre-image-verification` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Before applying a patch, does the plugin verify that the file's current state matches the state inspected — guarding against concurrent edits that would make the patch invalid? |
| **fix** | Add a pre-apply check: read the target lines again and confirm they match the pre-image in the patch before writing. |
| **related** | `FLW-EPA`, `FLW-REA`, `FLW-DEC` |
| **example** | NG: patch applied blindly after a multi-minute review during which the file may have changed. OK: diff pre-image re-verified immediately before the write. |

---

### FLW-REA

| Field | Value |
|---|---|
| **id** | `FLW-REA` |
| **slug** | `reconcile-expected-actual` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | After applying a fix, does the plugin reconcile the expected effects (from `expected_effect`) against the actual file state changes — flagging any findings that did not resolve as expected? |
| **fix** | Add a post-apply verification step: re-inspect the items listed in `expected_effect`; report which resolved and which remain unresolved. |
| **related** | `FLW-EPA`, `FLW-PIV` |
| **example** | NG: plugin marks a finding as "fixed" without re-checking the file. OK: after patching, re-run the check for each item in `expected_effect` and report the result. |

---

### Scoring & ranking

---

### FLW-CSF

| Field | Value |
|---|---|
| **id** | `FLW-CSF` |
| **slug** | `convergence-scoring-formula` |
| **domain** | FLW |
| **applies_to** | command, agent (content-conditional: inspection-class plugins using multi-lens convergence) |
| **severity** | Mandatory |
| **auto** | `[auto]` |
| **check** | Does the scoring script implement the formula `(num_lenses_caught × 30) + (max(self_confidence) × 0.3)` with threshold 80, and bypass the threshold for `[auto]`-tagged items? |
| **fix** | Correct the formula; verify the threshold is 80; add the `[auto]` bypass branch. |
| **related** | `FLW-CTF`, `FLW-EER` |
| **example** | NG: `score = avg(self_confidence)`. OK: `score = (num_lenses * 30) + (max_confidence * 0.3); if item.auto: promote regardless`. |

---

### FLW-EER

| Field | Value |
|---|---|
| **id** | `FLW-EER` |
| **slug** | `expected-effect-ranking` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[auto]` |
| **check** | Are findings ranked by `expected_effect` count (descending) so that multi-fix findings — those whose fix resolves multiple checklist items — appear first? |
| **fix** | Sort the finding list by `len(expected_effect)` descending before presenting to the user. |
| **related** | `FLW-CSF`, `FLW-CTF` |
| **example** | NG: findings listed in detection order. OK: finding that fixes 3 items listed before a finding that fixes 1. |

---

### FLW-DSAS

| Field | Value |
|---|---|
| **id** | `FLW-DSAS` |
| **slug** | `deterministic-steps-as-scripts` |
| **domain** | FLW |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Are deterministic steps in the pipeline (JSON parsing, threshold filtering, file scoring, patch application) implemented as shell scripts rather than LLM prompts? |
| **fix** | Extract deterministic logic into named scripts (e.g., `smith-evaluate.sh`, `smith-rank.sh`); invoke them via tool calls rather than asking Claude to compute them. |
| **related** | `FLW-CSF`, `FLW-EER` |
| **example** | NG: "Now calculate the convergence score for each finding and rank them." (LLM prompt). OK: `smith-rank.sh` script that reads finding JSON and outputs sorted results. |

---

## CTX — Context & State (12 items)

---

### CTX-PD

| Field | Value |
|---|---|
| **id** | `CTX-PD` |
| **slug** | `progressive-disclosure` |
| **domain** | CTX |
| **applies_to** | skill |
| **severity** | Mandatory |
| **auto** | `[judgment]` |
| **check** | Does the skill follow the three-tier loading model — metadata in front matter (always present), body in SKILL.md (loaded on trigger), and detail in `references/` and `examples/` (loaded only when needed)? |
| **fix** | Move content only needed for edge cases from the SKILL.md body into `references/` files; keep the body under 500 lines. |
| **related** | `CTX-CS`, `CTX-SDW` |
| **example** | NG: SKILL.md body with 2,000 lines of reference tables. OK: SKILL.md body with core knowledge (~500 lines), `references/edge-cases.md` loaded on demand. |

---

### CTX-LMS

| Field | Value |
|---|---|
| **id** | `CTX-LMS` |
| **slug** | `local-md-state-file` |
| **domain** | CTX |
| **applies_to** | hook (content-conditional: plugin uses `.local.md` state files) |
| **severity** | Recommended |
| **auto** | `[auto]` |
| **check** | Do `.local.md` state files use the YAML front matter + markdown body pattern — structured data in the `---` block (with at least one key-value pair), free text in the body — and live under `.claude/`? |
| **fix** | Convert custom state formats to the `.local.md` pattern; move the file to `.claude/`; use front matter for key-value state and the body for task description or notes. |
| **related** | `SPC-FMS`, `CTX-FFL` |
| **example** | NG: plain JSON state file at project root. OK: `.claude/task.local.md` with `---\nenabled: true\niteration: 3\n---\n\n# Task\nFix linting errors.` |

---

### CTX-TWA

| Field | Value |
|---|---|
| **id** | `CTX-TWA` |
| **slug** | `todo-write-anchor` |
| **domain** | CTX |
| **applies_to** | command, agent |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | In multi-phase tasks where context may grow long, does the plugin use `TodoWrite` to externalize progress state so Claude cannot lose its place? |
| **fix** | Add `TodoWrite` calls at the start of each phase to mark the current step; update each item to `completed` as the phase finishes. |
| **related** | `CTX-LMS`, `CTX-FFL` |
| **example** | NG: 7-phase command that relies on conversation context to track current phase. OK: command that writes a todo list at start and updates each item on completion. |

---

### CTX-FFL

| Field | Value |
|---|---|
| **id** | `CTX-FFL` |
| **slug** | `filesystem-feedback-loop` |
| **domain** | CTX |
| **applies_to** | command, agent (content-conditional: iterative plugins that loop over multiple turns) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | In iterative plugins, does each iteration read prior-turn outputs from the filesystem (files, git history) rather than relying on conversation context alone? |
| **fix** | Write intermediate results to disk at the end of each iteration; read them at the start of the next to make progress visible to Claude independently of context window state. |
| **related** | `CTX-LMS`, `CTX-TWA` |
| **example** | NG: iterative plugin that recomputes everything from scratch each turn. OK: plugin that writes `results.json` each iteration and reads it to detect what changed. |

---

### CTX-CM

| Field | Value |
|---|---|
| **id** | `CTX-CM` |
| **slug** | `conversation-mining` |
| **domain** | CTX |
| **applies_to** | agent (content-conditional: plugins that generate rules from conversation history) |
| **severity** | Quality |
| **auto** | `[judgment]` |
| **check** | When the plugin generates rules from past conversations, does it extract explicit corrections ("don't do X"), expressions of dissatisfaction, user rollbacks, and recurring failure patterns — not just explicit instructions? |
| **fix** | Extend the mining prompt to include all four signal types: explicit corrections, dissatisfaction expressions, rollbacks of Claude's work, and recurring problems. |
| **related** | `FLW-PSC` |
| **example** | NG: miner that only extracts "don't do X" sentences. OK: miner that also extracts "why did you do X?" frustration signals and counts repeated failure patterns. |

---

### CTX-RRR

| Field | Value |
|---|---|
| **id** | `CTX-RRR` |
| **slug** | `runtime-rule-reload` |
| **domain** | CTX |
| **applies_to** | hook (content-conditional: plugin stores rules in an external file read by the hook at runtime) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the hook reload its rules from the external file on every invocation rather than caching them from session start, so that rule changes take effect immediately? |
| **fix** | Remove any session-level rule caching; read the rule file fresh on each hook invocation. |
| **related** | `CTX-SST`, `CTX-LMS` |
| **example** | NG: hook that loads rules into a variable at SessionStart and never re-reads. OK: hook that reads the rule file on each PreToolUse invocation. |

---

### CTX-CS

| Field | Value |
|---|---|
| **id** | `CTX-CS` |
| **slug** | `context-separation` |
| **domain** | CTX |
| **applies_to** | skill |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Is information that is never needed simultaneously (e.g., finance rules, sales rules, product rules) separated into different reference files rather than co-loaded in the SKILL.md body? |
| **fix** | Identify mutually exclusive contexts; move each to a separate `references/<context>.md` file; load only the relevant file when needed. |
| **related** | `CTX-PD`, `CTX-SDW` |
| **example** | NG: SKILL.md body with sections for "If working on a web project" and "If working on a mobile project" (never both needed). OK: `references/web.md` and `references/mobile.md` loaded selectively. |

---

### CTX-SST

| Field | Value |
|---|---|
| **id** | `CTX-SST` |
| **slug** | `session-snapshot-timing` |
| **domain** | CTX |
| **applies_to** | hook |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Is the plugin designed with the understanding that SessionStart hooks capture state at session open — and that settings or rule changes made mid-session will not be reflected until the next session? |
| **fix** | Move state that needs to be current on every invocation out of SessionStart into the per-tool hook; use SessionStart only for initialization that is stable for the session's lifetime. |
| **related** | `SPC-SSI`, `SPC-HI`, `CTX-RRR` |
| **example** | NG: plugin that expects a SessionStart hook to reflect a config change made mid-session. OK: plugin that uses PreToolUse to read config fresh each time. |

---

### CTX-CIR

| Field | Value |
|---|---|
| **id** | `CTX-CIR` |
| **slug** | `claude-md-inclusion-rules` |
| **domain** | CTX |
| **applies_to** | all (applies to CLAUDE.md files) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does CLAUDE.md include only information Claude cannot derive from the code — bash commands, non-default style rules, test runner preferences, architectural decisions, environment quirks — and exclude truisms, standard conventions, and detailed API docs? |
| **fix** | Apply the "would removing this line cause mistakes?" test to each line; delete lines that pass (removable without impact); move API docs to skill reference files. |
| **related** | `CTX-RHM`, `CTX-CMP` |
| **example** | NG: "Write clean, readable code." (truism). OK: "Run tests with `pytest -x --tb=short`; the default `pytest` invocation does not run integration tests." |

---

### CTX-RHM

| Field | Value |
|---|---|
| **id** | `CTX-RHM` |
| **slug** | `rule-hook-migration` |
| **domain** | CTX |
| **applies_to** | all (applies to CLAUDE.md files) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Have CLAUDE.md rules that Claude repeatedly ignores been identified and converted into hooks for unconditional enforcement? |
| **fix** | Identify rules that Claude violates more than once; move them from CLAUDE.md to a PreToolUse or PostToolUse hook; remove the CLAUDE.md version to avoid duplication. |
| **related** | `CTX-CIR`, `SPC-HAR` |
| **example** | NG: CLAUDE.md rule "Never run `npm install` without checking package.json first" that is ignored. OK: PreToolUse hook that blocks `npm install` and prompts the check. |

---

### CTX-CMP

| Field | Value |
|---|---|
| **id** | `CTX-CMP` |
| **slug** | `claude-md-placement` |
| **domain** | CTX |
| **applies_to** | all (applies to CLAUDE.md files) |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Is the CLAUDE.md file placed at the correct level — `~/.claude/CLAUDE.md` for personal cross-project rules, `./CLAUDE.md` (committed) for team project rules, `./CLAUDE.local.md` (gitignored) for local-only rules? |
| **fix** | Move the file to the level matching its intended scope; commit project-level rules; gitignore local-only rules. |
| **related** | `CTX-CIR`, `CTX-RHM` |
| **example** | NG: team project rule in `~/.claude/CLAUDE.md` (not shared). OK: team rule in `./CLAUDE.md` committed to git. |

---

### CTX-SDW

| Field | Value |
|---|---|
| **id** | `CTX-SDW` |
| **slug** | `skill-doc-wrapping` |
| **domain** | CTX |
| **applies_to** | skill |
| **severity** | Recommended |
| **auto** | `[judgment]` |
| **check** | Does the skill SKILL.md wrap existing documentation (link or embed excerpts) rather than duplicating it — so that the skill body stays lean and the source of truth remains in the original doc? |
| **fix** | Replace duplicated content with a reference or excerpt; link to the canonical source; load the full doc only on demand via `references/`. |
| **related** | `CTX-PD`, `CTX-CS` |
| **example** | NG: SKILL.md that copy-pastes 300 lines from an API reference. OK: SKILL.md that links to the API reference and includes only the 5 lines most relevant to the trigger context. |

---

