# Checklists

> Self-check lists for plugin quality. These are the direct inputs to smith's inspection pipeline, and humans can apply them by hand as PR gates.

## How to Use

### When to apply

| Timing | Checklists to run |
|---|---|
| During a smith inspection | Run all applicable categories; prioritize Mandatory failures. |
| Before PR / release (by-hand gate) | Run everything; a Mandatory failure blocks the gate. |

### Severity tiers

- **Mandatory** — must be satisfied. A single failure is a blocker.
- **Recommended** — should be satisfied for most plugins. Failures are reported as quality debt.
- **Quality** — consistency and polish. Failures are nits.

### Automation stance

Each item is tagged `[auto]` (machine-verifiable) or `[judgment]` (requires Claude / human judgment). smith runs `[auto]` items in its pre-pass and synthesizes an opinion for `[judgment]` items; the latter require user confirmation before being acted on.

## Prompt

Cross-cutting quality checks for any instruction text authored inside a command, agent, skill, or hook prompt.

### 1. Conciseness
- [ ] **Does not re-state what Claude already knows.** General knowledge like "what a PDF is" is unnecessary. `[judgment]`
- [ ] **Every paragraph justifies its token cost.** `[judgment]`
- [ ] **No redundant openers or filler.** `[judgment]`

### 2. Specificity
- [ ] **States what, where, and how explicitly.** Replace `add tests for foo.py` with `write a test for foo.py covering the edge case where the user is logged out; avoid mocks`. `[judgment]`
- [ ] **References existing patterns.** For example, `look at HotDogWidget.php as a reference for how widgets are structured`. `[judgment]`
- [ ] **Names target files or directories.** Uses `@file` references or concrete paths. `[auto]`

### 3. Positive form
- [ ] **Written as "do X" rather than "don't do Y".** Replace `do not use markdown in your response` with `respond in smoothly flowing prose paragraphs`. `[judgment]`

### 4. Motivation
- [ ] **Includes the reason the instruction matters.** Claude 4 generalizes better when given rationale. `[judgment]`

### 5. Degree of freedom
- [ ] **Freedom level matches task.** High for open-ended work, medium for parameterized work, low for fragile procedures. `[judgment]`
- [ ] **Applies the narrow-bridge vs. open-field analogy from the official guide.** `[judgment]`

### 6. Verification
- [ ] **Defines success criteria:** tests, lint, typecheck, screenshots, or expected outputs so Claude can check its own work. `[judgment]`
- [ ] **Directs toward root-cause fixes, not error suppression.** `[judgment]`

### 7. Workflow structure
- [ ] **Multi-step tasks are numbered.** `[auto]`
- [ ] **Checklist pattern is used for complex workflows.** Claude can copy the checklist and track progress. `[auto]`
- [ ] **Feedback loops are defined.** Verify → fix → re-verify cycles. `[judgment]`

### 8. Terminology
- [ ] **Same term for the same concept throughout.** Do not mix "API endpoint", "URL", "route", "path". `[auto]`

## Skill

### 1. Metadata / front matter
- [ ] **Name follows conventions.** Lowercase, digits, hyphens only. ≤ 64 characters. No XML tags. `anthropic` / `claude` are reserved. `[auto]`
- [ ] **Name uses gerund form** such as `processing-pdfs`. Avoid vague names like `helper` or `utils`. `[judgment]`
- [ ] **Description is third person.** The description is injected into the system prompt, so first / second person is wrong. `[auto]`
- [ ] **Description states both "what" and "when".** This is the selection criterion when Claude chooses from many skills. `[judgment]`
- [ ] **Description is under 1024 characters.** `[auto]`
- [ ] **`disable-model-invocation` is set when appropriate.** Workflows with side effects (deploy, PR creation) should set it to `true`. `[judgment]`

### 2. Progressive disclosure
- [ ] **SKILL.md body is under 500 lines.** Split into additional files if exceeded. `[auto]`
- [ ] **Three-tier structure is followed.** Metadata → body → additional files. `[judgment]`
- [ ] **References stay one level deep.** SKILL.md → `references/foo.md` is fine; additional file → yet another file is not. `[auto]`
- [ ] **Mutually exclusive contexts are separated.** Information that is never needed simultaneously (e.g., `finance.md`, `sales.md`, `product.md`) lives in separate files. `[judgment]`
- [ ] **Reference files over 100 lines have a table of contents.** `[auto]`

### 3. Content
- [ ] **Does not explain things Claude already knows.** `[judgment]`
- [ ] **No time-dependent information.** Do not write "until August 2025, use the old API"; use an "old patterns" section. `[judgment]`
- [ ] **Consistent terminology.** `[auto]`
- [ ] **Examples are concrete in I/O shape.** `[judgment]`
- [ ] **Not too many choices.** Provide one default plus an escape hatch. `[judgment]`

### 4. Workflows and feedback loops
- [ ] **Compound tasks are broken into numbered steps.** `[auto]`
- [ ] **Checklist pattern for complex tasks.** `[auto]`
- [ ] **Feedback loops present.** `[judgment]`
- [ ] **Conditional branches are clear.** "Creating new content? → creation workflow. Editing existing? → editing workflow." `[judgment]`

### 5. Code and scripts (if applicable)
- [ ] **Scripts handle errors explicitly; do not punt to Claude.** `[judgment]`
- [ ] **No magic numbers.** Constants have documented rationale. `[auto]`
- [ ] **Dependencies are listed in SKILL.md and verified available.** `[auto]`
- [ ] **Script execution intent is clear.** Distinguish "run this" from "read this as reference". `[judgment]`
- [ ] **No Windows-style paths.** Use forward slashes. `[auto]`
- [ ] **Generates verifiable intermediate outputs.** Plan-validate-execute pattern. `[judgment]`

### 6. CC-specific options (if applicable)
- [ ] **`context: fork` is used appropriately.** `[judgment]`
- [ ] **`agent` field is correct.** Explore / Plan / general-purpose / custom. `[judgment]`
- [ ] **`allowed-tools` is set when needed.** `[auto]`
- [ ] **Hooks defined in front matter also pass the Hook checklist.** `[judgment]`

### 7. Evaluation and iteration
- [ ] **Evaluation scenarios were created first.** "Build evaluations BEFORE writing extensive documentation." At least three scenarios. `[judgment]`
- [ ] **Tested with real tasks, not just synthetic ones.** `[judgment]`
- [ ] **Claude's exploration path was observed.** Checked for unexpected file read order, oversights, excessive dependencies, ignored files. `[judgment]`
- [ ] **Tested with all target models** (Haiku / Sonnet / Opus). `[judgment]`

## Hook

### 1. Is a hook even the right mechanism?
- [ ] **The action must happen every time with zero exceptions.** If it only needs to happen sometimes, a CLAUDE.md rule is sufficient. `[judgment]`

### 2. Event selection
- [ ] **Correct event chosen** for the intent (PreToolUse for blocking, PostToolUse for feedback, UserPromptSubmit for input pre-processing, Stop / SubagentStop for completion, SessionStart / SessionEnd for lifecycle, PreCompact for compaction, Notification for permissions). `[judgment]`
- [ ] **Matcher is set correctly.** Exact, regex, wildcard, or MCP prefix. `[auto]`

### 3. I/O design
- [ ] **Exit codes are correct:** `0` for success, `2` for blocking, anything else for non-blocking error. `[auto]`
- [ ] **Structured JSON output (when used) is well-formed.** `[auto]`
- [ ] **stdout / stderr usage is correct.** Claude only sees stderr from exit code 2 (except UserPromptSubmit). `[judgment]`

### 4. Security (mandatory)
- [ ] **Validates and sanitizes input** from stdin JSON. `[judgment]`
- [ ] **Shell variables are quoted.** `[auto]`
- [ ] **Blocks path traversal** by checking for `..`. `[auto]`
- [ ] **Uses absolute paths** via `$CLAUDE_PROJECT_DIR`. `[auto]`
- [ ] **Skips sensitive files** (`.env`, `.git/`, private keys). `[judgment]`

### 5. Execution
- [ ] **Timeout is configured** (default 60 s). `[auto]`
- [ ] **Idempotent.** Running the same hook multiple times does not accumulate side effects. `[judgment]`
- [ ] **No race conditions in parallel execution.** Matching hooks run in parallel. `[judgment]`
- [ ] **Session-start snapshot behavior understood.** Setting changes are not reflected mid-session. `[judgment]`

### 6. Type selection
- [ ] **Command vs. prompt type is correct.** Command for deterministic, prompt for LLM-based judgment. `[judgment]`

### 7. Hooks in skill front matter (if applicable)
- [ ] **Scoped to the skill's lifecycle.** `[judgment]`
- [ ] **Stop → SubagentStop conversion is understood.** `[judgment]`

## CLAUDE.md

### 1. Content inclusion
- [ ] **Includes what should be included:** bash commands Claude cannot guess, non-default code style rules, test runner preferences, repo etiquette, project-specific architectural decisions, environment quirks, non-obvious gotchas. `[judgment]`
- [ ] **Excludes what should be excluded:** anything derivable from code, standard language conventions, detailed API documentation (link instead), information that changes frequently, long explanations, file-by-file descriptions, truisms like "write clean code". `[judgment]`

### 2. Conciseness
- [ ] **"Would removing this line cause Claude to make mistakes?" test applied to each line.** `[judgment]`
- [ ] **Task-specific content is moved to skills.** `[judgment]`
- [ ] **No signs of instructions being ignored.** When CLAUDE.md rules are ignored, the file is usually too long. `[judgment]`

### 3. Instruction effectiveness
- [ ] **Important instructions carry emphasis markers** (`IMPORTANT`, `YOU MUST`). `[auto]`
- [ ] **Claude does not repeatedly ask questions already answered in CLAUDE.md.** `[judgment]`
- [ ] **Claude does not act against CLAUDE.md.** `[judgment]`
- [ ] **Rules that should be hooks have been identified.** If Claude keeps ignoring a rule, convert it to a hook. `[judgment]`

### 4. Placement
- [ ] **Placement matches purpose:** `~/.claude/CLAUDE.md` for personal, `./CLAUDE.md` for project (commit to git), `./CLAUDE.local.md` for local-only, parent / child directories for monorepo layouts. `[judgment]`
- [ ] **`@import` syntax used where appropriate.** `[auto]`
- [ ] **Committed to git for team sharing.** `[auto]`

### 5. Continuous improvement
- [ ] **Started from a `/init` baseline.** `[judgment]`
- [ ] **The `#` key is used for immediate additions during coding.** `[judgment]`
- [ ] **CLAUDE.md is reviewed when problems occur.** `[judgment]`
- [ ] **Pruned regularly.** `[judgment]`

## Command

Newly derived from `components.md > Commands` and cross-referenced with the overall design principles. Not present in the existing checklist set.

- [ ] **Written as instructions to Claude, not as human documentation.** `[judgment]`
- [ ] **`allowed-tools` restricts to the minimum necessary toolset.** `[auto]`
- [ ] **Uses `` !`command` `` inline execution when dynamic context is needed.** `[judgment]`
- [ ] **Uses `$ARGUMENTS` / `$1` / `$2` / `@$1` for argument handling.** `[auto]`
- [ ] **Phase-control patterns label critical phases** (`DO NOT SKIP`, `DO NOT START WITHOUT APPROVAL`). `[judgment]`
- [ ] **User approval points are explicit.** `[judgment]`
- [ ] **Single-message completion pattern is applied when appropriate.** `[judgment]`
- [ ] **Uses `${CLAUDE_PLUGIN_ROOT}` for all plugin-internal file references.** `[auto]`

## Agent

Newly derived from `components.md > Agents`. Not present in the existing checklist set.

- [ ] **`name` is kebab-case, 3–50 characters.** `[auto]`
- [ ] **`description` contains 2–4 `<example>` blocks.** `[auto]`
- [ ] **Examples include both explicit-request and proactive-dispatch cases.** `[judgment]`
- [ ] **`model` is chosen deliberately** (`inherit` is the default; Opus only when deep judgment is needed; Haiku for routine wrapping). `[judgment]`
- [ ] **`tools` is restricted to the minimum necessary set** or omitted only when full access is genuinely required. `[judgment]`
- [ ] **If the agent reports findings, a separate agent evaluates them.** Reporter and evaluator are not the same role. `[judgment]`
- [ ] **Findings are filtered by confidence score (threshold ≥ 80).** `[judgment]`
- [ ] **`color` is set and distinct from sibling agents in the same plugin.** `[auto]`

## Plugin (overall)

Newly derived. Verifies the plugin as a whole rather than any single component.

- [ ] **`.claude-plugin/plugin.json` is present and has a `name` field.** `[auto]`
- [ ] **Directory layout follows the standard from `concepts.md`.** `[auto]`
- [ ] **Archetype (A command+agent / B skill-only / C hybrid) is identified and matches intent.** `[judgment]`
- [ ] **Three-layer separation (procedure / knowledge / execution) is respected.** Commands are procedures, skills are knowledge, agents are execution. `[judgment]`
- [ ] **No hard-coded paths; everything uses `${CLAUDE_PLUGIN_ROOT}`.** `[auto]`
- [ ] **Wiring is sound:** commands that reference skills do so via the Skill tool; commands that dispatch agents name them explicitly. `[judgment]`
- [ ] **Security posture:** all hook scripts validate input; no hook touches `.env`, `.git/`, or private keys without an explicit guard. `[judgment]`
- [ ] **README.md exists and explains the plugin's purpose in the first paragraph.** `[auto]`
- [ ] **LICENSE is present.** `[auto]`

## TODO

- Cross-check this file against the original `claude-plugins-knowhow.md` §20 when it is removed, and dedupe any items that were duplicated during the migration.
- Add automation notes for the `[auto]` items: the exact shell / Python check that smith's `[auto]` pre-pass will run.
- Extend the Plugin (overall) category with a "MCP integration sanity check" once `.mcp.json` design patterns are documented in `components.md`.
