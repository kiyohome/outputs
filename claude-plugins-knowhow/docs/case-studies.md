# Case Studies

> Deep dives into seven official plugins. These are the empirical observations from which the patterns in `concepts.md`, `components.md`, and `patterns.md` were extracted. When a pattern feels abstract, trace it back here.

**TODO**:
- Add case studies for `plugin-dev`, `skill-creator`, `commit-commands`, and `security-guidance`. They are referenced heavily elsewhere but have no dedicated section here yet.
- Each case study should end with a "patterns demonstrated" list pointing back to `concepts.md` / `components.md` / `patterns.md` for traceability.

## feature-dev

**Role**: Structured seven-phase feature development.

### Layout

```
feature-dev/
├── .claude-plugin/plugin.json
├── commands/feature-dev.md
├── agents/
│   ├── code-explorer.md        # Sonnet, yellow
│   ├── code-architect.md       # Sonnet, green
│   └── code-reviewer.md        # Sonnet, red
├── README.md
└── LICENSE
```

### Seven-phase workflow

| Phase | Goal | Actions |
|---|---|---|
| 1. Discovery | Understand what to build | Confirm requirements, ask the user about unknowns. |
| 2. Codebase Exploration | Understand existing code | Dispatch 2–3 parallel `code-explorer` agents, then read the critical files yourself. |
| 3. Clarifying Questions | Resolve ambiguity | **CRITICAL: DO NOT SKIP.** Ask about edge cases, backward compatibility, etc. |
| 4. Architecture Design | Draft designs | Dispatch 2–3 parallel `code-architect` agents, then present with comparison and recommendation. |
| 5. Implementation | Build | **DO NOT START WITHOUT APPROVAL.** Track progress with `TodoWrite`. |
| 6. Quality Review | Review | Dispatch 3 parallel `code-reviewer` agents; report only confidence ≥ 80. |
| 7. Summary | Wrap up | List changed files, decisions, next steps. |

### User approval points

- Phase 3: answers to clarifying questions.
- Phase 4: choice of design.
- Phase 6: response to review findings (fix now / fix later / ship as is).

### Agent design notes

- **code-explorer**: tools restricted to `Glob, Grep, LS, Read, NotebookRead, WebFetch, TodoWrite, WebSearch, KillShell, BashOutput`. Its output must include a list of 5–10 "must-read" files.
- **code-architect**: commits to a single approach rather than hedging. Outputs a blueprint with file paths, function names, and concrete steps.
- **code-reviewer**: reports only confidence ≥ 80, split into Critical (90–100) and Important (80–89). When there is nothing to say, reports "meets standards" succinctly.

## code-review

**Role**: Automated PR code review.

### Pipeline

```
1. Haiku: eligibility check (closed / draft / automated PR / already reviewed → abort)
2. Haiku: list CLAUDE.md file paths
3. Haiku: fetch PR summary
4. Sonnet × 5: parallel code review
   #1 CLAUDE.md compliance
   #2 Shallow bug scan of changed lines
   #3 Bugs inferred from git blame / history
   #4 Cross-reference with past PR comments
   #5 Consistency with in-file comments
5. Haiku × N: confidence score (0–100) per finding
6. Filter: drop anything below 80
7. Haiku: re-run eligibility check
8. gh pr comment: post result
```

### `gh` CLI usage

GitHub operations go through `gh`, not web fetches:

```yaml
allowed-tools: Bash(gh issue view:*), Bash(gh search:*), Bash(gh pr comment:*),
               Bash(gh pr diff:*), Bash(gh pr view:*), Bash(gh pr list:*)
```

## pr-review-toolkit

**Role**: Six specialized review agents with selective dispatch.

### The six agents

| Agent | Model | Color | Specialty |
|---|---|---|---|
| comment-analyzer | inherit | green | Comment accuracy, completeness, long-term maintenance. |
| pr-test-analyzer | inherit | cyan | Test coverage quality and gaps. |
| silent-failure-hunter | inherit | yellow | Silent failures and inappropriate error handling. |
| type-design-analyzer | inherit | pink | Type design and invariant expressiveness (1–10 scoring). |
| code-reviewer | opus | green | Project guideline compliance, bug detection. |
| code-simplifier | opus | — | Code simplification and readability. |

### Selective dispatch

Rather than always running all six, the plugin picks based on what changed:

- Test files changed → `pr-test-analyzer`.
- Comments / docs added → `comment-analyzer`.
- Error handling changed → `silent-failure-hunter`.
- Types added or changed → `type-design-analyzer`.
- Always → `code-reviewer`.
- After review passes → `code-simplifier` as a finishing pass.

### Sequential vs. parallel

Default is sequential: run one, see the result, then move to the next. An `all parallel` option exists for bulk execution when the user does not need step-by-step feedback.

## hookify

**Role**: Dynamic hook-rule generation from conversation history.

### Layout

```
hookify/
├── commands/
│   ├── hookify.md            # Create a rule (explicit with args, or mine from conversation).
│   ├── list.md               # List rules.
│   ├── configure.md          # Enable / disable rules.
│   └── help.md
├── agents/
│   └── conversation-analyzer.md
├── skills/
│   └── writing-rules/SKILL.md
├── hooks/hooks.json          # Handlers for every event.
└── examples/                  # Sample rules.
```

### Rule file format

```markdown
---
name: warn-dangerous-rm
enabled: true
event: bash
pattern: rm\s+-rf
action: warn
---

⚠️ **Dangerous rm command detected**
Please verify the path is correct.
```

Advanced conditions:

```markdown
---
name: warn-env-edits
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.env$
  - field: new_text
    operator: contains
    pattern: API_KEY
---
```

### Immediate reflection

Rule files are loaded dynamically by the hook at runtime. Edits take effect immediately — no Claude Code restart.

## claude-md-management

**Role**: Continuous improvement of `CLAUDE.md` files.

### `revise-claude-md` command

Post-session learning capture:

1. Look back over the session and identify context that was missing.
2. Decide whether it belongs in `CLAUDE.md` or `.claude.local.md`.
3. Draft as concise one-liners.
4. Present the diff and apply after user approval.

Excluded from the draft: verbose explanations, obvious information, one-shot fixes.

### `claude-md-improver` skill: A–F grading

| Criterion | Points | What it checks |
|---|---|---|
| Commands / workflows | 20 | Build / test / deploy commands are present. |
| Architectural clarity | 20 | Can a reader grasp the codebase structure? |
| Non-obvious patterns | 15 | Gotchas and quirks are documented. |
| Conciseness | 15 | No verbose explanations or obvious information. |
| Freshness | 15 | Reflects the current codebase. |
| Actionability | 15 | Instructions can be copied and run as-is. |

## ralph-loop

**Role**: Self-referential iterative development loop driven by a Stop hook.

### Mechanism

```
User: /ralph-loop "Fix linting errors" --max-iterations 10 --completion-promise "FIXED"

1. setup-ralph-loop.sh creates .claude/.ralph-loop.local.md
2. Claude executes the task.
3. Claude attempts to stop.
4. The Stop hook fires.
5. The hook reads .local.md and increments the iteration counter.
6. Max iterations not reached and promise not emitted → re-inject the prompt.
7. Claude "sees" its previous work through files.
8. Repeat.
9. When <promise>FIXED</promise> is output, or max iterations is reached, exit.
```

### Suitable for

- Tasks with a clear success criterion.
- Tasks that benefit from iteration and refinement.
- Greenfield projects.

### Not suitable for

- Tasks requiring human judgment or design decisions.
- One-shot operations.
- Tasks with unclear success criteria.

## claude-code-setup

**Role**: Environment optimization suggestions.

### Categories

| Category | Best for |
|---|---|
| Hooks | Auto-format, lint, block edits to protected files. |
| Subagents | Code review, security audit, API documentation. |
| Skills | Frequent workflows, template application. |
| Plugins | Bundles of related skills, team standardization. |
| MCP Servers | External service integrations (DB, API, browser). |

### Recommendation framework

Analyze the codebase for signals (package.json, framework, test configuration, etc.) and surface one or two high-impact recommendations per category. The plugin does not install anything; it proposes.

