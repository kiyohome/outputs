# Components

> Design patterns for the four component types that make up a Claude Code plugin: commands, agents, skills, and hooks. Derived from the official plugin repository.

## Commands

A slash command is a Markdown file under `commands/`. Its body is the instruction Claude executes when the user invokes the command.

### Write commands as instructions, not documentation

```markdown
<!-- GOOD: imperative, addressed to Claude -->
Review this code for security vulnerabilities including:
- SQL injection
- XSS attacks

<!-- BAD: addressed to a human reader -->
This command will review your code for security issues.
```

### Restrict tools with `allowed-tools`

Front-matter can limit which tools the command may call. This prevents Claude from drifting into adjacent work.

```yaml
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
---
```

`commit-commands` locks down to git-only; `code-review` locks down to `gh` CLI invocations. The principle is least privilege: if the command does not need Write access, do not grant it.

### "Single-message completion" pattern

Claude has a habit of adding explanatory prose around tool calls. Some commands must complete in a single turn with no extra text:

```markdown
You have the capability to call multiple tools in a single response.
You MUST do all of the above in a single message.
Do not use any other tools or do anything else.
Do not send any other text or messages besides these tool calls.
```

Used by `commit-commands` `/commit` and `/commit-push-pr`.

### Inline execution with `` !`command` ``

Backtick-prefixed commands execute at invocation time, and their output is embedded into the prompt. This lets a command build dynamic context before Claude sees the instructions.

```markdown
## Context
- Current git status: !`git status`
- Current git diff: !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`
```

### Argument expansion

```markdown
---
argument-hint: [pr-number] [priority] [assignee]
---

Review PR #$1 with priority $2. Assign to $3.
```

- `$ARGUMENTS` — the full argument string.
- `$1`, `$2`, `$3` — positional arguments.
- `@$1` — tell Claude to read that path as a file.
- `@${CLAUDE_PLUGIN_ROOT}/templates/report.md` — reference a file inside the plugin itself.

### Phase control pattern

Used by `feature-dev` and `plugin-dev`. A command declares multiple phases, each with:

- **Goal**: what this phase is for.
- **Actions**: concrete steps, including which subagents to dispatch.
- **User confirmation point**: explicit approval gates.

```markdown
## Phase 3: Clarifying Questions
**Goal**: Fill in gaps and resolve all ambiguities.
**CRITICAL**: This is one of the most important phases. DO NOT SKIP.

## Phase 5: Implementation
**DO NOT START WITHOUT USER APPROVAL**
```

Strong markers such as "DO NOT SKIP" and "DO NOT START WITHOUT APPROVAL" counter Claude's tendency to collapse phases.

## Agents

A subagent is a Markdown file under `agents/` with front-matter plus a persona/instruction body.

### Front matter

```markdown
---
name: code-reviewer
description: Use this agent when... <example>...</example>
model: sonnet
color: red
tools: ["Read", "Grep", "Glob"]
---

You are an expert code reviewer...
```

| Field | Required | Notes |
|---|---|---|
| `name` | yes | kebab-case, 3–50 characters. |
| `description` | yes | Trigger phrasing plus 2–4 `<example>` blocks. |
| `model` | yes | `inherit` / `sonnet` / `opus` / `haiku`. |
| `color` | yes | `blue` / `cyan` / `green` / `yellow` / `magenta` / `red`. |
| `tools` | no | Omit for full tool access; specify to restrict. |

### Trigger definition via `<example>` blocks

```markdown
description: Use this agent when... Examples:

<example>
Context: User has just created a PR with new functionality.
user: "I've created the PR. Can you check if the tests are thorough?"
assistant: "I'll use the pr-test-analyzer agent to review the test coverage."
<commentary>
Since the user is asking about test thoroughness in a PR, use the Task tool to launch the agent.
</commentary>
</example>
```

Include both explicit-request examples ("review my PR") and proactive-dispatch examples (Claude chooses the agent without being named). The assistant line names the agent concretely; the commentary explains why the agent is appropriate.

### Model tiering

`code-review` uses a four-tier pipeline:

```
Haiku → eligibility, file listing, summary
Sonnet → main review (5 parallel reviewers)
Haiku → confidence scoring per finding
Haiku → re-eligibility check
```

Sonnet is spent only where judgment is required. Haiku handles the deterministic wrapping work.

`pr-review-toolkit` promotes `code-reviewer` and `code-simplifier` to Opus for deep judgment; the other four agents stay at `inherit`.

### Parallel dispatch

| Plugin | Phase | Agents | Count | Perspective split |
|---|---|---|---|---|
| feature-dev | Phase 2 | code-explorer | 2–3 | similar features / architecture / UX |
| feature-dev | Phase 4 | code-architect | 2–3 | minimal change / clean design / pragmatic |
| feature-dev | Phase 6 | code-reviewer | 3 | brevity–DRY / bugs–correctness / conventions |

`code-review` uses five parallel Sonnet reviewers:

| # | Lens |
|---|---|
| 1 | CLAUDE.md compliance |
| 2 | Shallow bug scan (changed lines only) |
| 3 | Bugs inferred from git blame and history |
| 4 | Cross-reference with past PR comments |
| 5 | Consistency with in-file comments |

### Separation of reporter and evaluator

The most important design principle in `code-review`: the Sonnet reviewer produces findings, and a **separate Haiku agent** scores them. When a single agent produces and grades its own findings, it is biased toward affirming them. Splitting the roles removes that bias structurally.

### Color assignment

| Plugin | Colors |
|---|---|
| feature-dev | explorer=yellow, architect=green, reviewer=red |
| pr-review-toolkit | one color per agent (6 distinct) |
| hookify | analyzer=yellow |
| plugin-dev | creator=magenta, validator=yellow, reviewer=cyan |

In tmux-based parallel workflows, colors make it obvious which agent is active.

### Representative specialized agents

- **silent-failure-hunter** (`pr-review-toolkit`): persona is "zero tolerance for silent failures". Detects empty catch blocks, log-and-continue patterns, implicit fallbacks. Each finding carries CRITICAL/HIGH/MEDIUM severity and a list of error types that might be hidden.
- **type-design-analyzer** (`pr-review-toolkit`): scores type encapsulation, invariant expressiveness, usefulness, and enforcement on 1–10 scales. Principle: "make invalid states unrepresentable". Anti-patterns (anemic domain models, exposed mutable internals) are enumerated explicitly.
- **code-simplifier** (Opus): operates only on recently modified code. Balances brevity against readability. Bans nested ternaries in favor of `switch`/`if-else`.

## Skills

A skill lives under `skills/<skill-name>/` with a `SKILL.md` and optional `references/`, `examples/`, and `scripts/` subdirectories.

### Front matter

```yaml
---
name: skill-name
description: This skill should be used when the user asks to "specific phrase 1",
  "specific phrase 2", "specific phrase 3". Include exact phrases users would say.
version: 0.1.0
---
```

- **Third person**: "This skill should be used when...". The description is injected into the system prompt, so first/second person does not make sense.
- **Concrete trigger phrases**: quote the exact words users will say.
- **Lean forward**: Claude tends to *under*-trigger skills. Write the description aggressively so that tangential but related requests still activate it.

### Body style

- **Imperative / infinitive**: "To create a hook, define...". The body is an execution-layer prompt.
- **Avoid second person**: do not write "You should...".
- **1,500–2,000 words**: beyond that, split into `references/`.
- **Explicitly mention `references/`** so Claude knows additional material exists:

```markdown
## Additional Resources

### Reference Files
- **`references/patterns.md`** — Common hook patterns (8+ proven patterns)
- **`references/advanced.md`** — Advanced use cases and techniques

### Utility Scripts
- **`scripts/validate-hook-schema.sh`** — Validate hooks.json structure
```

### Description optimization (skill-creator methodology)

1. Create 20 test queries: 10 should-trigger and 10 should-not-trigger.
2. Make the should-not-trigger queries "close but wrong" — obviously unrelated queries are useless as tests.
3. Split 60% train / 40% test.
4. Run each query three times to get a reliable trigger rate.
5. Use extended thinking to generate description-improvement candidates.
6. Evaluate on both train and test, but select by test score (avoid overfitting).
7. Iterate up to five rounds.

Quality criteria for test queries:

- Concrete and detailed (include file paths, personal context, company names, URLs).
- Varied length (short to long).
- Casual phrasing, abbreviations, typos.
- No obviously unrelated queries — they do not test selection.

### Three roles a SKILL.md can play

| Role | When | Example |
|---|---|---|
| Auto-triggered knowledge injection | The skill's description matches Claude's intent resolution | frontend-design, playground |
| On-demand reference | A command or agent loads it explicitly via the Skill tool | plugin-dev's 7 skills |
| Long-form workflow | The SKILL.md body *is* the entire procedure | skill-creator (exceptional) |

## Hooks

Hooks execute at specific lifecycle events. They are defined in `hooks/hooks.json`.

### Events

| Event | Timing | Use |
|---|---|---|
| PreToolUse | Before a tool runs | Validate, rewrite, block. |
| PostToolUse | After a tool runs | Feed back, log. |
| Stop | When an agent wants to stop | Completeness check. |
| SubagentStop | When a subagent wants to stop | Task verification. |
| SessionStart | Session start | Context loading. |
| SessionEnd | Session end | Cleanup. |
| UserPromptSubmit | User input received | Context injection, validation. |
| PreCompact | Before context compaction | Save critical information. |
| Notification | On a notification | React. |

### Two hook types

**`prompt` type (preferred)**:

```json
{
  "type": "prompt",
  "prompt": "Validate if this tool use is appropriate: $TOOL_INPUT",
  "timeout": 30
}
```

- LLM-based, context-aware judgment.
- Flexible.
- Handles edge cases.

**`command` type**:

```json
{
  "type": "command",
  "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh",
  "timeout": 60
}
```

- Deterministic.
- Fast.
- Integrates with external tools.

### `hooks.json` format

```json
{
  "description": "Brief explanation (optional)",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ${CLAUDE_PLUGIN_ROOT}/hooks/security_reminder_hook.py"
          }
        ]
      }
    ]
  }
}
```

- `description` is optional.
- The `hooks` wrapper is required (this differs from `settings.json`).
- `matcher` is a tool-name pattern: `*` for all tools, `|` for OR, regex supported.
- Multiple hooks run in parallel with no ordering guarantee.

### Use `${CLAUDE_PLUGIN_ROOT}` for portability

Every plugin-internal path must use this variable:

```json
"command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
```

Hard-coded absolute paths are forbidden. The variable is also available inside hook scripts as an environment variable.

### Representative hook patterns

- **SessionStart context injection** (`explanatory-output-style`): a Bash script emits JSON that adds text to the system prompt on session start. Changes the output style without touching any plugin code.
- **Stop-based loop control** (`ralph-loop`): a Stop hook reads `.claude/ralph-loop.local.md`, increments an iteration counter, and re-injects the prompt unless the completion promise is detected. Claude "sees" prior iterations via files and git history.
- **PreToolUse two-layer design**: `security-guidance` hardcodes nine patterns in Python (static, deterministic); `hookify` reads `.local.md` rules dynamically (extensible). Both are PreToolUse, but the first is a fixed policy and the second is a user-authored rule set.

## TODO

- Document `.mcp.json` design patterns (not yet extracted from the sources).
- Add explicit guidance for when to choose a command vs. an agent vs. a skill for a given responsibility.
- Collect bad examples, not just good ones, so `plugin-smith improve` has concrete anti-patterns to match against.
