# Concepts

> Foundational concepts and design principles for Claude Code plugins, distilled from the official `anthropics/claude-plugins-official` repository.

## What is a Plugin

A Claude Code plugin is a self-contained bundle that extends Claude Code's behavior. A plugin may contain any combination of slash commands, subagents, skills, hooks, and MCP servers, packaged so that Claude Code can install, load, and invoke them uniformly.

### Standard directory layout

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # Metadata. Only `name` is required.
├── commands/                 # Slash commands (.md files).
├── agents/                   # Subagent definitions (.md files).
├── skills/                   # Skills, one subdirectory per skill.
│   └── skill-name/
│       ├── SKILL.md
│       ├── references/       # Detailed reference material.
│       ├── examples/         # Concrete examples.
│       └── scripts/          # Utility scripts.
├── hooks/
│   └── hooks.json            # Hook definitions.
├── hooks-handlers/           # Hook handler scripts.
├── .mcp.json                 # MCP server definitions.
├── scripts/                  # Shared utilities.
├── README.md
└── LICENSE
```

Only `plugin.json` with a `name` field is strictly required. Everything else is optional and added as the plugin grows.

## Plugin Taxonomy

The official plugins span three structural archetypes. Understanding which archetype you are building is the first decision when creating a new plugin.

### Archetype A: Command + Agent (workflow-oriented)

- Representative plugins: `feature-dev`, `code-review`, `pr-review-toolkit`.
- A slash command drives the procedure; subagents do the work in isolated contexts.
- Skills are typically absent.
- The user invokes the plugin explicitly via the slash command.

### Archetype B: Skill-only (knowledge provider)

- Representative plugins: `claude-code-setup`, `frontend-design`, `playground`.
- No commands, no agents.
- A knowledge base that Claude Code auto-triggers when the user's request matches the skill description.
- Selection is governed by the skill's description matching the user's phrasing.

### Archetype C: Hybrid (toolkit)

- Representative plugins: `plugin-dev`, `hookify`, `claude-md-management`.
- Combines commands, agents, and skills.
- Skills act as on-demand references that commands or agents load explicitly during specific phases.

### Component inventory of official plugins

| Plugin | commands | agents | skills | hooks | Role |
|---|---|---|---|---|---|
| feature-dev | 1 | 3 | 0 | 0 | 7-phase structured feature development |
| code-review | 1 | 0 | 0 | 0 | Automated PR code review |
| pr-review-toolkit | 1 | 6 | 0 | 0 | Six specialized review agents |
| commit-commands | 3 | 0 | 0 | 0 | Git workflow automation |
| ralph-loop | 3 | 0 | 0 | 1 | Self-referential iterative development loop |
| hookify | 4 | 1 | 1 | 1 | Dynamic hook-rule generation |
| security-guidance | 0 | 0 | 0 | 1 | Security pattern detection |
| code-simplifier | 0 | 1 | 0 | 0 | Autonomous code improvement |
| claude-code-setup | 0 | 0 | 1 | 0 | Environment optimization suggestions |
| claude-md-management | 1 | 0 | 1 | 0 | CLAUDE.md quality management |
| skill-creator | 0 | 0 | 1 | 0 | Skill creation, evaluation, optimization |
| plugin-dev | 1 | 3 | 7 | 0 | Plugin development toolkit |
| explanatory-output-style | 0 | 0 | 0 | 1 | Educational insight output style |
| learning-output-style | 0 | 0 | 0 | 1 | Interactive learning output style |
| playground | 0 | 0 | 1 | 0 | HTML playground generator |
| frontend-design | 0 | 0 | 1 | 0 | Frontend design knowledge |
| agent-sdk-dev | 1 | 2 | 0 | 0 | Agent SDK development |

## Core Design Patterns

### Three-layer separation

Plugin responsibilities decompose into three layers: procedure, knowledge, and execution.

| Layer | Owner | Location | Role |
|---|---|---|---|
| Procedure | Command | `commands/*.md` | What to do, in what order. Phase definitions, branching, user confirmation. |
| Knowledge | Skill | `skills/*/SKILL.md` | How to do it. Domain knowledge loaded on demand. |
| Execution | Agent | `agents/*.md` | Hands on the keyboard. Runs in an isolated context and returns a result. |

`plugin-dev` embodies this separation most cleanly:

```
create-plugin command (procedure: 8-phase workflow)
  Phase 2 → Skill tool loads plugin-structure skill (knowledge)
  Phase 5 → Skill tool loads hook-development skill (knowledge)
           → agent-creator agent runs (execution)
  Phase 6 → plugin-validator agent runs (execution)
```

### Three roles of SKILL.md

| Role | Mechanism | Example |
|---|---|---|
| Auto-triggered knowledge injection | Loaded when the description matches the user request | frontend-design, playground |
| On-demand reference | Explicitly loaded by a command or agent via the Skill tool | plugin-dev's 7 skills |
| Long-form procedure | SKILL.md itself is the entire workflow | skill-creator (exceptional) |

### Progressive disclosure

Skills implement a three-tier loading system that keeps the context window lean.

| Tier | Loaded when | Size guideline |
|---|---|---|
| Metadata (name + description) | Always present in the system prompt | ~100 words |
| SKILL.md body | When the skill is triggered | 1,500–2,000 words (hard cap 5,000) |
| `references/`, `examples/`, `scripts/` | Only when Claude decides it needs them | Unlimited |

This is the structural answer to context-window bloat. A monolithic command that inlines every procedural detail inflates the context for every invocation; a plugin that splits knowledge into skills loads only what the current phase needs.

## Design Principles

### Prompts are instructions to Claude, not explanations for humans

Every `.md` file inside a plugin (commands, agents, skills) is a prompt. Write it in the imperative, give Claude concrete steps, and avoid framing it as documentation for a reader.

### Emphasize critical phases

Claude tends to skip phases. Counter this with hard markers: `**CRITICAL**: This is one of the most important phases. DO NOT SKIP.` or `**DO NOT START WITHOUT USER APPROVAL**`. The stronger the phrasing, the more reliably Claude respects the phase boundary.

### Convert "whatever you think is best" into explicit approval

When the user delegates a decision, the plugin should still surface a concrete recommendation and obtain explicit confirmation before proceeding. Silent decisions accumulate into unreviewed divergence.

### Ban false promises for loop escape

Plugins that rely on a completion predicate (e.g., `ralph-loop`) must explicitly forbid Claude from emitting the completion token until the condition is actually true. Without this rule, Claude will synthesize a premature "done" to escape.

### Control output shape

Useful output directives:

- `Do not send any other text or messages besides these tool calls.` — used by `commit-commands` to force single-turn completion.
- `Keep your output brief. Avoid emojis. Link and cite relevant code.` — used by `code-review` for structured findings.

### Constrain scope

When a plugin is prone to over-reaching, restate the scope:

- `Only refine code that has been recently modified or touched in the current session, unless explicitly instructed otherwise.` (code-simplifier)
- `Do not check build signal or attempt to build or typecheck the app. These will run separately.` (code-review)

### Cost optimization: pick the right model tier

| Use case | Model | Rationale |
|---|---|---|
| Pre/post-processing | Haiku | Routine checks, filtering. |
| Analysis and review | Sonnet | Balance of judgment and speed. |
| Deep reasoning | Opus | Complex quality judgments. |
| Same as caller | `inherit` | Default unless there is a specific reason. |

### Parallel vs sequential

- Parallel: independent analysis tasks where separation of perspectives matters (e.g., reviewers with distinct lenses).
- Sequential: pipelines where the next step consumes the previous one's output (e.g., eligibility → review → scoring in `code-review`).
- User-selectable: some plugins (`pr-review-toolkit`) expose the choice.

## TODO

- Add an architecture diagram showing how smith's inspectors consult `concepts.md`, `components.md`, `patterns.md`, and `checklists.md`.
- Document the decision heuristic that maps user intent to archetype A/B/C.
