# Patterns

> Cross-cutting patterns that are not tied to a single component type: quality control, state management, security, and advanced techniques. These are the building blocks that `plugin-smith improve` matches against, and that `plugin-smith create` composes into new plugins.

## Quality Control

### Confidence scoring and threshold filtering

Findings are scored on a 0–100 scale and only those at or above a threshold are reported.

| Score | Meaning |
|---|---|
| 0 | False positive. Would be caught by a cursory review. Pre-existing issue. |
| 25 | Somewhat confident. Might be real but not verified. Stylistic; not in CLAUDE.md. |
| 50 | Medium confidence. Real but minor. Not important relative to the PR. |
| 75 | High confidence. Double-checked. Actually impacts correctness. Existing approach is insufficient. |
| 100 | Absolutely certain. Happens frequently. Evidence directly supports it. |

**The shared threshold is 80.** Both `feature-dev`'s `code-reviewer` and the `code-review` plugin use it. Anything below 80 is dropped.

### Explicit enumeration of false positives

`code-review` includes an explicit "these are false positives" list in its command:

- Pre-existing issues (present before the change).
- Issues that lint / typecheck / CI will catch.
- Strict stylistic nitpicks.
- Issues mentioned in CLAUDE.md but already lint-ignored in code.
- Intentional feature changes.
- Problems on lines that were not changed.
- Generic code quality issues (unless explicitly specified in CLAUDE.md).

Stating what *not* to report raises precision more reliably than tuning the threshold.

### Double eligibility check

`code-review` runs the same eligibility check both before starting the review and immediately before posting the comment:

```
Phase 1: Haiku eligibility check (closed? draft? automated PR? already reviewed?)
Phase 2–5: Review execution
Phase 6: Haiku re-eligibility check (PR state may have changed during review)
Phase 7: gh pr comment posts the result
```

This is defensive design against state drift during long-running reviews.

### Output format discipline

`code-review` mandates a rigid output format:

```markdown
### Code review

Found 3 issues:

1. <brief description> (CLAUDE.md says "<...>")
<link to file with full sha1 + line range>

2. <brief description> (bug due to <file and code snippet>)
<link to file with full sha1 + line range>
```

- Brevity.
- No emojis.
- Every finding must link and cite the code.
- Full git SHA is required (no short SHAs, no shell expansion).
- Line ranges include one line of context on each side (e.g., `L4-L7`).

### Separation of reporter and evaluator

Covered in detail under Components > Agents. Restated here because it belongs to the quality-control pattern family: a reviewer that also scores its own findings has a pro-finding bias. Splitting the roles (Sonnet reports, Haiku scores) removes it structurally.

## State Management

### `.local.md` pattern: YAML front matter + Markdown body

```markdown
---
enabled: true
iteration: 3
max_iterations: 10
completion_promise: "All tests passing"
---

# Task Description

Fix all the linting errors in the project.
```

- Lives in `.claude/`.
- `.local.md` extension is gitignored by convention.
- Front matter = structured data (settings, state).
- Body = free text (prompt, description).
- Hook scripts read and write it with `sed` / `awk`.

Examples in the wild:

- `ralph-loop`: loop state (iteration count, completion condition).
- `hookify`: rule definitions (pattern, action).
- `plugin-settings`: plugin settings (enabled/disabled, mode).

### Reading and writing front matter from shell

```bash
# Extract front matter.
FRONTMATTER=$(sed -n '/^---$/,/^---$/{ /^---$/d; p; }' "$STATE_FILE")

# Read a field.
ENABLED=$(echo "$FRONTMATTER" | grep '^enabled:' | sed 's/enabled: *//' | sed 's/^"\(.*\)"$/\1/')

# Extract body (everything after the second ---).
BODY=$(awk '/^---$/{i++; next} i>=2' "$FILE")
```

### `TodoWrite` for progress tracking

`feature-dev` uses the built-in `TodoWrite` tool throughout all phases. As the context grows, the todo list remains a stable anchor for "where are we?" — Claude cannot lose its place because the state is externalized.

## Security

Hooks run with user-level privileges and no sandbox. Treat every hook like privileged code.

### Fixed patterns vs dynamic rules

| Plugin | Style | Character |
|---|---|---|
| security-guidance | Python script with nine hardcoded patterns | Static, deterministic |
| hookify | Python script reads `.local.md` rules at runtime | Dynamic, extensible |

Both are PreToolUse. The separation of fixed policy (built into the plugin) from dynamic user rules (authored externally) is itself a design choice worth copying.

### Representative security patterns

`security-guidance` detects at minimum:

- Command injection.
- XSS.
- `eval` usage.
- Dangerous HTML.
- Pickle deserialization.
- `os.system` calls.
- Plus three more internal patterns.

`hookify` ships rules for:

- `rm\s+-rf` — dangerous deletion.
- `chmod\s+777` — overly permissive modes.
- `sudo\s+` — privilege escalation.
- `\.env$` — editing environment files.
- `eval\(` — `eval` usage.

### Hook script input validation

Every hook script must validate the JSON data piped in on stdin. Do not trust the caller, even though the caller is Claude Code.

```bash
set -euo pipefail

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name')

# Validate tool name format.
if [[ ! "$tool_name" =~ ^[a-zA-Z0-9_]+$ ]]; then
  echo '{"decision": "deny", "reason": "Invalid tool name"}' >&2
  exit 2
fi

# Detect path traversal.
file_path=$(echo "$input" | jq -r '.tool_input.file_path')
if [[ "$file_path" == *".."* ]]; then
  echo '{"decision": "deny", "reason": "Path traversal detected"}' >&2
  exit 2
fi
```

Conventions:

- `set -euo pipefail` is mandatory.
- Quote every variable expansion.
- `exit 0` means success; `exit 2` means block.
- Emit structured JSON for decisions.

## Advanced Patterns

### Conversation pattern mining (hookify)

`hookify` ships a `conversation-analyzer` agent that walks back through past conversations and extracts:

- Explicit correction requests ("don't do X", "stop doing Y").
- Expressions of dissatisfaction ("why did you do X?", "I didn't ask for that").
- User corrections and rollbacks of Claude's work.
- Recurring problems.

The agent then synthesizes hook rules automatically. **Rules grow out of the history of mistakes.** The plugin is not just a rule runner; it learns from the developer's frustration.

### Self-referential loop (ralph-loop)

"Self-referential" here does not mean reflection over output. The mechanism is:

1. The same prompt is re-injected on each iteration.
2. Claude's prior work persists as files and git history.
3. On the next iteration, Claude "sees" what it did last time by reading those files.
4. The feedback channel is not introspection over output; it is the filesystem.

The underlying philosophy: "deterministically bad in an undeterministic world". Each iteration fails in a predictable way, and because the failures are predictable, prompt tuning can systematically improve them.

### Blind A/B comparison (skill-creator)

When `skill-creator` compares two versions of a skill, it hands both to an evaluator agent *without telling it which is which*. The evaluator cannot favor version A over version B based on identity, only on observable quality. This removes both human bias and Claude's own bias toward previously-seen variants.

The architecture is two stages: a `comparator` agent that makes the blind verdict, followed by an `analyzer` agent that explains why the winning version won.

### Double eligibility in long-running reviews

`code-review` checks eligibility both before starting the review and immediately before posting the result. Over the course of the review, the PR may be closed, merged, or receive new commits. Checking twice prevents posting stale feedback.

### Code delegation (learning-output-style)

`learning-output-style` decides which pieces of code are worth asking the user to write by hand:

**Delegate to the user**:

- Business logic with multiple reasonable approaches.
- Error handling strategy.
- Algorithm choice.
- Data structure decisions.

**Do not delegate**:

- Boilerplate.
- Obvious implementations.
- Configuration code.
- Simple CRUD.

Only 5–10 lines of the genuinely important code are asked of the user per interaction.

### `clean_gone` for git worktrees (commit-commands)

Parallel development with git worktrees accumulates "gone" branches. `commit-commands` bulk-cleans them:

```bash
git branch -v | grep '\[gone\]' | sed 's/^[+* ]//' | awk '{print $1}' | while read branch; do
  # Remove any worktree attached to this branch first.
  worktree=$(git worktree list | grep "\\[$branch\\]" | awk '{print $1}')
  if [ ! -z "$worktree" ] && [ "$worktree" != "$(git rev-parse --show-toplevel)" ]; then
    git worktree remove --force "$worktree"
  fi
  git branch -D "$branch"
done
```

The `+` prefix (worktree-attached branches) is handled; this is the detail that distinguishes a correct implementation.

## TODO

- Quantify how often each pattern appears across the official plugins, so `plugin-smith` can weight them when proposing candidate designs.
- Collect anti-patterns paired with each pattern, as the Improve mode needs them as matching targets.
- Document the boundary between "quality control" and "evaluation" — the line blurs when Improve's `--report-only` runs the same checks as a dedicated Evaluate mode would.
