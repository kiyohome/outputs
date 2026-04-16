# plugin-smith

> A meta-plugin for Claude Code that creates and improves other Claude Code plugins.

**Status**: design-documentation stage. The plugin itself is not yet implemented; this directory contains the specification that the implementation will follow.

## Overview

Claude Code plugins are powerful but their design know-how is scattered across the official `anthropics/claude-plugins-official` repository and various independent projects. Quality varies widely. Developers building new plugins have to reverse-engineer the patterns from multiple examples, and developers improving existing plugins have no systematic way to audit them against what "good" looks like.

`plugin-smith` is a meta-plugin whose job is to **create new plugins and improve existing ones**. It is inspired by `skill-smith` (which targets individual skills) and extends the same mode-driven architecture up one level to target whole plugins.

### What it is built from

- **Observed design patterns** from official plugins — the three-layer separation of procedure / knowledge / execution, confidence-scored quality control, progressive disclosure in skills, the separation of reporter and evaluator. See [`docs/concepts.md`](./docs/concepts.md) and [`docs/patterns.md`](./docs/patterns.md).
- **Component-level design recipes** for commands, agents, skills, and hooks. See [`docs/components.md`](./docs/components.md).
- **Case studies** of seven official plugins that serve as traceable sources for the abstractions above. See [`docs/case-studies.md`](./docs/case-studies.md).
- **Quality checklists** covering Prompt, Skill, Hook, CLAUDE.md, Command, Agent, and Plugin-overall categories. See [`docs/checklists.md`](./docs/checklists.md).

### What it is not

- Not an installer or registry.
- Not a runtime profiler (that is `skill-smith`'s Profile mode; for plugins the analogue is left for later).
- Not a review tool in the sense of passing judgment on a plugin for external consumption — though `--report-only` mode produces a scorecard, the main orientation is *improvement*, not *evaluation*.

## Usage

`plugin-smith` exposes two modes. Both are **proposal-driven**: the plugin leads with a concrete recommendation drawn from its own knowledge base and asks for confirmation, rather than interviewing the user to elicit requirements.

### Create

Purpose: generate a new plugin from a one-sentence intent.

```
/plugin-smith create "a plugin that reviews my SQL migrations"
```

Flow:

1. Classify the intent as archetype A (command + agent), B (skill-only), or C (hybrid), per [`docs/concepts.md > Plugin Taxonomy`](./docs/concepts.md#plugin-taxonomy).
2. Compose a concrete structure from [`docs/components.md`](./docs/components.md) — which commands, which agents, which skills, what front matter, what tool restrictions.
3. Present **two or three candidate structures in parallel**, each with rationale and trade-offs. This mirrors the parallel-dispatch pattern from [`docs/components.md > Agents`](./docs/components.md#agents).
4. Wait for user approval (`proceed` / `adjust` / `reject`). This is the only routine confirmation point.
5. Scaffold the plugin on disk.
6. Self-validate against [`docs/checklists.md`](./docs/checklists.md) and report any Mandatory failures.

Claude asks clarifying questions only when the intent is missing a decisive piece of information that would change the proposal itself. Otherwise it proceeds with sensible defaults drawn from the knowledge base.

### Improve

Purpose: diagnose and improve an existing plugin, optionally targeted at a specific problem.

```
# Broad sweep:
/plugin-smith improve ~/.claude/plugins/my-plugin

# Focused on a specific issue:
/plugin-smith improve ~/.claude/plugins/my-plugin "hook crashes when editing .env files"

# Scorecard only, no changes:
/plugin-smith improve ~/.claude/plugins/my-plugin --report-only
```

Flow:

| Invocation | Behavior |
|---|---|
| Path only | Full scan. Runs every applicable checklist from `docs/checklists.md`. Presents findings sorted by severity (Critical / Important / Nice-to-have). |
| Path + problem description | Focused scan. Starts from the named symptom, uses [`docs/patterns.md`](./docs/patterns.md) to match anti-patterns near the affected area, hypothesizes the root cause, then proposes a patch. |
| `--report-only` | No mutations. Emits a scorecard with Mandatory pass/fail + Recommended counts. This is the "Evaluate" mode absorbed as a flag. |

In all cases Improve defaults to **dry run**: patches are proposed and shown, but disk writes wait for user approval (`apply all` / `apply selected` / `reject`). After approval, the plugin re-validates and reports a before/after diff.

### Shared principles

- **Proposal-driven.** The plugin holds the expertise; it leads with concrete recommendations instead of asking the user to specify details up front.
- **Minimal approval points.** Approval is requested at the meaningful forks (structure proposal, patch application), not at every intermediate step.
- **Dry-run by default.** Nothing is written without explicit confirmation.
- **Self-applicable.** `plugin-smith` can be run against itself.

## Architecture

### Component layout (planned)

`plugin-smith` follows archetype C (hybrid) from [`docs/concepts.md`](./docs/concepts.md):

```
plugin-smith/
├── .claude-plugin/plugin.json
├── commands/
│   └── plugin-smith.md        # Entry command dispatching to create / improve.
├── agents/
│   ├── plugin-proposer.md     # Dispatched in parallel for the Create mode candidate structures.
│   ├── plugin-diagnoser.md    # Runs the scan in Improve mode.
│   └── plugin-evaluator.md    # Scores findings. Kept separate from the diagnoser on purpose.
├── skills/
│   ├── concepts/              # Wraps docs/concepts.md as an on-demand reference.
│   ├── components/            # Wraps docs/components.md.
│   ├── patterns/              # Wraps docs/patterns.md.
│   └── checklists/            # Wraps docs/checklists.md.
└── README.md
```

The `skills/` subdirectories are thin wrappers around the corresponding `docs/*.md` files in this repository. The design docs are the single source of truth; the skills simply expose them through the progressive-disclosure mechanism at runtime.

### Mode → doc dependency

| Mode | Primary docs consulted |
|---|---|
| Create | `concepts.md` (archetype classification) → `components.md` (composition) → `checklists.md` (self-validation) |
| Improve (path only) | `components.md` + `patterns.md` (matching) → `checklists.md` (scoring) |
| Improve (with problem description) | `patterns.md` (anti-pattern match near the symptom) → `components.md` (patch synthesis) |
| Improve (`--report-only`) | `checklists.md` only |

`case-studies.md` is not loaded at runtime. It exists so that any claim in the other docs can be traced back to its empirical source, which is useful for human maintainers but not for the plugin's execution path.

### Design principles built into the plugin itself

The plugin must exemplify the patterns it recommends. Specifically:

- **Three-layer separation.** The entry command drives the procedure. Skills supply knowledge. Agents execute in isolation.
- **Reporter / evaluator separation.** Improve uses a diagnoser agent to report findings and a separate evaluator agent to score them, avoiding the self-affirmation bias documented in `docs/patterns.md > Quality Control`.
- **Confidence threshold of 80.** Consistent with `code-review` and `feature-dev`.
- **`${CLAUDE_PLUGIN_ROOT}` everywhere.** No hard-coded paths.
- **`allowed-tools` on the entry command.** Least privilege.
- **User approval points only at meaningful forks.** Structure proposal in Create, patch application in Improve. Nothing else.

### Open design questions

See the TODO section of each `docs/*.md` file for document-specific open items. The cross-cutting ones are tracked in [`progress.md`](./progress.md) and include: the architecture diagram format, state management for interruption and resume, the algorithm for problem-description-focused diagnosis, the scorecard output format, and finalization of the plugin name (`plugin-smith` is a placeholder).
