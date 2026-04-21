# Audit Notes

> Per-file knowhow extraction. Each file is scanned at fine granularity with no domain-fitting bias. Findings accumulate here and are reconciled against `docs/taxonomy.md` after all 7 files are scanned.

## Next file to scan

`README.md` (file 6 of 7)

## Method

For each file, list every extractable knowhow unit:

- A unit is anything a plugin author could check or apply.
- Include table rows individually if each row encodes a distinct decision.
- Include "examples" sections if they encode a usage pattern.
- Include intro paragraphs if they state a principle.
- Mark each unit with: `NEW` (not in taxonomy) / `EXISTS:<ID>` (covered) / `SUBSUMED-BY:<ID>` (covered but should split) / `REFINES:<ID>` (covered but description outdated).

## File 1: docs/concepts.md

Scanned top-to-bottom. Every paragraph, bullet, and table row was considered as a potential unit.

### Covered by existing taxonomy

| Source location | Unit | Status |
|---|---|---|
| §Standard directory layout (table) | plugin directory layout | `EXISTS:ARC-SDL` |
| §Plugin Taxonomy §Archetype A | command+agent workflow plugin | `EXISTS:ARC-ACA` |
| §Plugin Taxonomy §Archetype B | skill-only knowledge plugin | `EXISTS:ARC-ASO` |
| §Plugin Taxonomy §Archetype C | hybrid toolkit plugin | `EXISTS:ARC-AH` |
| §Core Design Patterns §Three-layer separation | procedure / knowledge / execution split | `EXISTS:ARC-TLS` |
| §Core Design Patterns §Three roles of SKILL.md | auto-trigger / on-demand / long-form procedure | `EXISTS:SPC-STR` |
| §Core Design Patterns §Progressive disclosure | three-tier skill loading | `EXISTS:CTX-PD` |
| §Design Principles §Prompts are instructions | imperative voice for `.md` files | `EXISTS:PRM-IV` |
| §Design Principles §Emphasize critical phases | `**CRITICAL**` / `DO NOT SKIP` markers | `EXISTS:PRM-CPM` |
| §Design Principles §Convert "whatever you think is best" | explicit approval gate | `EXISTS:FLW-EAG` |
| §Design Principles §Ban false promises | forbid premature completion token | `EXISTS:FLW-LEB` |
| §Design Principles §Control output shape | output-shape directives | `EXISTS:PRM-OSD` |
| §Design Principles §Control output shape (ex. 1) | "no text besides these tool calls" | `EXISTS:PRM-SMC` |
| §Design Principles §Constrain scope | restate-the-scope directives | `EXISTS:PRM-SC` |
| §Design Principles §Cost optimization | Haiku / Sonnet / Opus / inherit tiering | `EXISTS:FLW-MTS` |
| §Design Principles §Parallel vs sequential | parallel / sequential / user-selectable | `EXISTS:FLW-PVS` |

### NEW candidates

| Source location | Unit | Proposed name | Notes |
|---|---|---|---|
| §What is a Plugin (last sentence of layout section) | "only `plugin.json` with `name` is required; everything else is optional" — the **minimum viable plugin** starting point | `minimum-viable-plugin` (ARC) | Distinct from `ARC-SDL` (full layout). This is the "start here, grow as needed" decision. A plugin author may ship a 2-file plugin. |
| §Standard directory layout table row `.mcp.json` | MCP server definitions file at plugin root | `mcp-server-file` (SPC) | Sits alongside `hooks.json` as a component-entry file. Not covered by any existing SPC item. |
| §Plugin Taxonomy intro paragraph | "Understanding which archetype you are building is **the first decision** when creating a new plugin" — procedural priority of the archetype choice | `archetype-first-decision` (ARC or FLW) | The three archetype items (`ARC-ACA/ASO/AH`) describe **what** each archetype is, not that archetype-selection **must come first**. Also flagged as a known gap in the doc's own TODO ("Document the decision heuristic"). |

### REFINES candidates (existing item is correct, but source adds detail worth folding in)

| Source location | Refinement | Target ID |
|---|---|---|
| §Progressive disclosure table | Quantitative sizes: metadata ≈100 words, body 1,500–2,000 words (hard cap 5,000), tier-3 unlimited. The `CTX-PD` description should carry these numbers. | `CTX-PD` |
| §Design Principles §Parallel vs sequential (bullet 3) | "User-selectable" sub-mode — some plugins (`pr-review-toolkit`) expose the parallel/sequential choice to the caller. Currently embedded implicitly; worth explicit mention in `FLW-PVS`. | `FLW-PVS` |
| §Design Principles §Cost optimization (row 4) | `inherit` as the **default** unless a specific reason exists. Currently embedded in the table row; worth promoting as an explicit "default = inherit" rule in `FLW-MTS`. | `FLW-MTS` |
| §Design Principles §Emphasize critical phases (last sentence) | "The stronger the phrasing, the more reliably Claude respects the phase boundary" — escalation heuristic. | `PRM-CPM` |

### Out of scope

| Source location | Reason |
|---|---|
| §Component inventory table (17 plugins × 5 columns) | Reference data about existing plugins, not a knowhow unit. Useful as exemplars; not taxonomy entries. |
| "`plugin-dev` embodies this separation most cleanly" block + 4-line pseudo-trace | Exemplar for `ARC-TLS`, not an independent unit. |
| Three archetype "Representative plugins" bullets | Exemplars per archetype, not independent knowhow. |
| The doc's §TODO section | Meta-TODO for the doc itself, not plugin-authoring knowhow. |

### Summary

- **3 NEW candidates**: `minimum-viable-plugin`, `mcp-server-file`, `archetype-first-decision`.
- **4 REFINES candidates**: `CTX-PD` (tier sizes), `FLW-PVS` (user-selectable), `FLW-MTS` (inherit default), `PRM-CPM` (escalation heuristic).
- **16 units confirmed EXISTS** (no change).
- No `SUBSUMED-BY` (no item needs splitting based on this file alone).
- Decisions on adding NEW items are deferred to the reconciliation pass after all 7 files are scanned, in case later files change the picture.

## File 2: docs/components.md

Scanned top-to-bottom. Every `###` heading, table, code block, and bullet was considered.

### Covered by existing taxonomy

| Source location | Unit | Status |
|---|---|---|
| §Commands §Write commands as instructions | imperative voice for commands | `EXISTS:PRM-IV` |
| §Commands §Restrict tools with `allowed-tools` | allowed-tools front-matter | `EXISTS:SPC-ATR` |
| §Commands §"Single-message completion" pattern | no-prose single-turn directive | `EXISTS:PRM-SMC` |
| §Commands §Inline execution | `` !`cmd` `` inline shell embedding | `EXISTS:SPC-ICE` |
| §Commands §Argument expansion | `$ARGUMENTS`, `$1..n`, `@$1`, `@${CLAUDE_PLUGIN_ROOT}/…` | `EXISTS:SPC-AE` |
| §Commands §Phase control pattern | phase blocks with Goal / Actions / Approval | `EXISTS:FLW-PC` |
| §Agents §Front matter | name / description / model / color / tools | `EXISTS:SPC-AFM` |
| §Agents §Trigger definition via `<example>` | `<example>` blocks with `<commentary>` | `EXISTS:SPC-EBT` |
| §Agents §Model tiering | per-agent model tier + 4-tier pipeline | `EXISTS:FLW-MTP` |
| §Agents §Parallel dispatch | parallel perspective-split dispatch | `EXISTS:FLW-PPS` |
| §Agents §Separation of reporter and evaluator | reporter agent + separate evaluator agent | `EXISTS:FLW-RES` |
| §Agents §Color assignment | per-agent color convention | `EXISTS:SPC-CA` |
| §Skills §Front matter | name / description / version | `EXISTS:SPC-SFM` |
| §Skills §Body style | imperative / no 2nd person / 1500-2000 words | `EXISTS:PRM-SBS` |
| §Skills §Description optimization | 7-step test-set methodology | `EXISTS:SPC-DOM` |
| §Skills §Three roles a SKILL.md can play | auto-trigger / on-demand / long-form | `EXISTS:SPC-STR` |
| §Hooks §Events | 9-event roster | `EXISTS:SPC-HER` |
| §Hooks §Two hook types | prompt vs command | `EXISTS:SPC-THT` |
| §Hooks §`hooks.json` format | wrapper schema + matcher syntax | `EXISTS:SPC-HJF` |
| §Hooks §Use `${CLAUDE_PLUGIN_ROOT}` | portability variable | `EXISTS:SPC-PRV` |
| §Hooks §Representative hook patterns — SessionStart | context-inject on session start | `EXISTS:SPC-SSI` |
| §Hooks §Representative hook patterns — Stop-based loop | filesystem-as-feedback via Stop hook | `EXISTS:CTX-FFL` |
| §Hooks §Representative hook patterns — PreToolUse two-layer | static policy + dynamic rules | `EXISTS:SPC-PTL` |

### NEW candidates

| Source location | Unit | Proposed name | Notes |
|---|---|---|---|
| §Skills §Front matter — third bullet | "Claude tends to *under*-trigger skills. Write the description aggressively so tangential requests still activate it." | `lean-forward-description` (PRM) | A **principle** about drafting bias, distinct from `SPC-DOM` (which is the test-set **process**). |
| §Agents §Representative specialized agents — silent-failure-hunter + type-design-analyzer | Enumerate anti-patterns explicitly in the agent body ("empty catch blocks, log-and-continue, implicit fallbacks" / "anemic domain models, exposed mutable internals"). | `anti-pattern-enumeration` (PRM) | Cross-agent authoring pattern. Also flagged as a known gap in the file's own TODO: "Collect bad examples, not just good ones." |

### REFINES candidates

| Source location | Refinement | Target ID |
|---|---|---|
| §Commands §Argument expansion | `@$1` tells Claude to read the argument as a file; `@${CLAUDE_PLUGIN_ROOT}/templates/report.md` references plugin-internal files. These `@`-forms deserve explicit mention (not just positional `$n`). | `SPC-AE` |
| §Agents §Front matter (name row) | `name` must be kebab-case, 3–50 characters. | `SPC-AFM` |
| §Agents §Front matter (tools row) | `tools` omitted = full access; specified = restricted. Maps the "opt-in restrict" semantics. | `SPC-AFM` |
| §Agents §Trigger definition | Include both **explicit-request** examples ("review my PR") and **proactive-dispatch** examples (Claude chooses without being named). | `SPC-EBT` |
| §Skills §Body style | Write an explicit `## Additional Resources` section listing `references/` and `scripts/` so Claude knows they exist. Tier-3 resources are invisible unless signposted. | `PRM-SBS` |
| §Hooks §Two hook types | `prompt` type is the **preferred** default; `command` type is for deterministic/speed/external-tool cases. | `SPC-THT` |
| §Hooks §`hooks.json` format | `hooks` wrapper is **required** (differs from `settings.json`). Multiple hooks per matcher run **in parallel with no ordering guarantee**. | `SPC-HJF` |
| §Hooks §Use `${CLAUDE_PLUGIN_ROOT}` | Hard-coded absolute paths are **forbidden**. The variable is also available inside hook scripts as an **environment variable** (not just inside `hooks.json`). | `SPC-PRV` |
| §Commands §Phase control pattern | Phase blocks follow a **template** — `**Goal**`, `**Actions**`, `**User confirmation point**` / `**CRITICAL**` / `**DO NOT START WITHOUT USER APPROVAL**`. The template itself is the transferable pattern. | `FLW-PC` |
| §Agents §Model tiering | Selective **Opus promotion** for judgment-heavy agents (`code-reviewer`, `code-simplifier`) while keeping peers at `inherit`. | `FLW-MTP` or `FLW-MTS` |

### Out of scope

| Source location | Reason |
|---|---|
| §Agents §Representative specialized agents — full bullets | Exemplars of `SPC-AFM`, `FLW-PPS`, `FLW-MTP`, `PRM-SC`, and the NEW-candidate `anti-pattern-enumeration`. Keep as case-study material, not standalone items. |
| §Commands §Restrict tools — examples of `commit-commands` / `code-review` locking down | Exemplars of `SPC-ATR`. |
| §Hooks §Events — per-event "Use" column phrasing | Descriptive commentary within `SPC-HER`, not separate items. |
| §TODO section | Meta-TODO for the doc itself. The three TODOs there (`.mcp.json` patterns / component-choice heuristic / bad-example collection) are all known gaps — `.mcp.json` aligns with the file-1 NEW candidate `mcp-server-file`; bad-example collection aligns with the NEW candidate `anti-pattern-enumeration`; component-choice heuristic is a new known gap (no candidate yet). |

### Summary

- **23 units confirmed EXISTS** (no change).
- **2 NEW candidates**: `lean-forward-description`, `anti-pattern-enumeration`.
- **10 REFINES candidates** across `SPC-AE`, `SPC-AFM`, `SPC-EBT`, `PRM-SBS`, `SPC-THT`, `SPC-HJF`, `SPC-PRV`, `FLW-PC`, `FLW-MTP/MTS`.
- **Known gap surfaced (no candidate yet)**: "when to choose command vs agent vs skill for a given responsibility."
- Reconciliation deferred to post-scan pass.

## File 3: docs/patterns.md

Scanned top-to-bottom with no domain bias. All major sections, tables, and code snippets covered.

### Covered by existing taxonomy

| Source location | Unit | Status |
|---|---|---|
| §Quality Control §Confidence scoring | 0–100 confidence scale + 80 threshold | `EXISTS:FLW-CTF` |
| §Quality Control §Explicit enumeration of false positives | 7-item false-positive checklist | `EXISTS:PRM-FPE` |
| §Quality Control §Double eligibility check (§Quality Control) | pre-review + post-review eligibility check | `EXISTS:FLW-DEC` |
| §Quality Control §Output format discipline | brevity, no emoji, link+cite, full SHA | `EXISTS:PRM-OFD` |
| §Quality Control §Separation of reporter and evaluator | Sonnet reports, Haiku scores | `EXISTS:FLW-RES` |
| §State Management §`.local.md` pattern | YAML front matter + Markdown body in `.claude/` | `EXISTS:CTX-LMS` |
| §State Management §Reading and writing front matter | `sed`/`awk` shell recipes | `EXISTS:SPC-FMS` |
| §State Management §`TodoWrite` for progress tracking | todo list as externalized progress anchor | `EXISTS:CTX-TWA` |
| §Security §Fixed patterns vs dynamic rules | static policy vs dynamic user rules | `EXISTS:SPC-PTL` |
| §Security §Hook script input validation | `set -euo pipefail`, quote vars, exit codes, JSON | `EXISTS:SPC-HIV` |
| §Advanced Patterns §Conversation pattern mining | extract rules from conversation history | `EXISTS:CTX-CM` |
| §Advanced Patterns §Self-referential loop | re-inject prompt; prior work via files+git | `EXISTS:CTX-FFL` |
| §Advanced Patterns §Blind A/B comparison | blind evaluator + analyst two-stage | `EXISTS:FLW-BAC` |
| §Advanced Patterns §Double eligibility in long-running reviews | second mention / canonical here | `EXISTS:FLW-DEC` |
| §Advanced Patterns §Code delegation | delegate learning-critical code to user | `EXISTS:PRM-CD` |
| §Advanced Patterns §`clean_gone` for git worktrees | bulk-clean gone branches + worktrees | `EXISTS:SPC-CGW` |

### NEW candidates

None identified. Every extractable unit is covered by an existing taxonomy item. The §TODO in the file calls for "anti-patterns paired with each pattern" — that aligns with the `anti-pattern-enumeration` candidate surfaced in File 2.

### REFINES candidates

| Source location | Refinement | Target ID |
|---|---|---|
| §Confidence scoring — closing sentence | "The shared threshold is 80" — a cross-plugin standard, not just a guideline. Worth stating the constant explicitly in the item. | `FLW-CTF` |
| §False positives — closing sentence | "Stating what *not* to report raises precision more reliably than tuning the threshold" — the **reason** to enumerate negatives, worth surfacing as the governing principle. | `PRM-FPE` |
| §Output format discipline — bullet 3 | "Full git SHA required (no short SHAs, no shell expansion)" — specific enough to be a checkable rule, not just implied by "link and cite". | `PRM-OFD` |
| §Security intro sentence | "Hooks run with user-level privileges and no sandbox." — The no-sandbox precondition shapes all hook-script design decisions; should be explicit in the item. | `SPC-HIV` |
| §Self-referential loop — para 2 | "deterministically bad in an undeterministic world" — the underlying design philosophy: design loop failures to be predictable so prompt tuning can improve them systematically. | `CTX-FFL` |
| §Blind A/B comparison — para 2 | Two-stage structure: `comparator` agent (blind verdict) → `analyzer` agent (explains why). The architecture detail is not captured in the current item. | `FLW-BAC` |
| §Code delegation | "Only 5–10 lines of genuinely important code per interaction" — a concrete quantity that makes the pattern checkable. | `PRM-CD` |
| §Representative security patterns | Concrete detector list (9 in security-guidance, 5 in hookify) — useful as a **reference list** for anyone building a security hook, even if not a standalone item. Link from `SPC-SDS`. | `SPC-SDS` |

### Out of scope

| Source location | Reason |
|---|---|
| §Security §Representative security patterns | Exemplar lists for `SPC-SDS` and `SPC-PTL`. Useful references, not independent knowhow items. |
| §TODO section | Meta-TODO for the doc + `plugin-smith` roadmap. Not plugin-authoring knowhow. |

### Summary

- **16 units confirmed EXISTS** (no change to taxonomy).
- **0 NEW candidates**.
- **8 REFINES candidates** across `FLW-CTF`, `PRM-FPE`, `PRM-OFD`, `SPC-HIV`, `CTX-FFL`, `FLW-BAC`, `PRM-CD`, `SPC-SDS`.
- Reconciliation deferred to post-scan pass.

## File 4: docs/case-studies.md

Original taxonomy dismissed this file as "concrete examples of the patterns below." Re-scan confirms **that treatment dropped several independent knowhow units**. Each case study contains both exemplar material and distinct authoring patterns not captured by existing taxonomy items.

### Covered by existing taxonomy (exemplar material)

| Source location | Unit | Status |
|---|---|---|
| §feature-dev §Layout | directory layout | `EXISTS:ARC-SDL` (exemplar) |
| §feature-dev §Seven-phase workflow | phase blocks with Goal / Actions / CRITICAL markers | `EXISTS:FLW-PC` + `EXISTS:PRM-CPM` (exemplar) |
| §feature-dev §User approval points | approval gates at multiple phases | `EXISTS:FLW-EAG` (exemplar) |
| §feature-dev §Agent design notes — code-explorer (tools) | restricted read-only tool set | `EXISTS:SPC-ATR` (exemplar) |
| §feature-dev §Agent design notes — code-reviewer | confidence ≥ 80 filter, Critical/Important bins | `EXISTS:FLW-CTF` (exemplar) |
| §code-review §Pipeline | Haiku/Sonnet 4-tier pipeline + double eligibility | `EXISTS:FLW-MTP` + `EXISTS:FLW-DEC` (exemplar) |
| §code-review §`gh` CLI usage | `allowed-tools` restricted to `gh pr/issue/search` | `EXISTS:SPC-ATR` (exemplar) |
| §pr-review-toolkit §The six agents | per-agent model / color / specialty | `EXISTS:SPC-AFM` + `EXISTS:SPC-CA` + `EXISTS:FLW-MTP` (exemplar) |
| §pr-review-toolkit §Sequential vs. parallel | default sequential, `all parallel` opt-in | `EXISTS:FLW-PVS` (exemplar) |
| §hookify §Layout | command + agent + skill + hook bundle | `EXISTS:ARC-AH` (exemplar) |
| §claude-md-management §`revise-claude-md` §Excluded items | verbose / obvious / one-shot filtering | `EXISTS:PRM-OFD` (exemplar) |
| §ralph-loop §Mechanism | 9-step self-referential loop via Stop hook + `.local.md` | `EXISTS:CTX-FFL` + `EXISTS:CTX-LMS` + `EXISTS:FLW-LEB` (exemplar) |

### NEW candidates

Case-studies.md surfaces knowhow that concepts/components/patterns did not cover. Strength tagged as **strong** / **medium** / **weak**.

| Source location | Unit | Proposed name | Strength | Notes |
|---|---|---|---|---|
| §claude-code-setup §Categories | 5-row mapping of Hooks / Subagents / Skills / Plugins / MCP Servers to "Best for" use cases | `component-choice-heuristic` (ARC) | **strong** | Directly resolves the known gap surfaced in File 2 ("when to choose command vs agent vs skill"). Extends it to the full 5-component surface. |
| §pr-review-toolkit §Selective dispatch | Conditionally dispatch 1–2 of N agents based on file-change signals (test files → pr-test-analyzer, etc.) | `selective-dispatch` (FLW) | **strong** | Distinct from `FLW-PPS` (run all in parallel with different lenses) and `FLW-PC` (sequential pipeline). The mechanism is **signal-gated agent selection**. |
| §claude-code-setup §Recommendation framework | "Analyze codebase signals (package.json, framework, test config) → surface 1–2 high-impact recommendations per category." | `signal-driven-proposal` (FLW) | **medium** | A recipe for recommendation/advisory plugins. |
| §claude-code-setup §Recommendation framework (last sentence) | "The plugin does not install anything; it proposes." | `propose-not-execute` (ARC or PRM) | **medium** | An authoring stance: advisory plugins must surface options, not auto-apply. Complements `FLW-EAG` (approval gate for execution). |
| §claude-md-management §`revise-claude-md` | 4-step retrospective: look back → categorize (CLAUDE.md vs `.claude.local.md`) → one-liner draft → diff + approval | `post-session-capture` (FLW) | **medium** | Specific command workflow for distilling learnings back into persistent config. Not a one-off; several plugins could adopt this shape. |
| §hookify §Immediate reflection | "Rule files are loaded dynamically by the hook at runtime. Edits take effect immediately — no Claude Code restart." | `runtime-rule-reload` (CTX or SPC) | **medium** | A design affordance of the hook-reads-`.local.md`-per-event pattern. Distinct from `SPC-PTL` (static-vs-dynamic choice) — this is the **hot-reload** property that follows. |
| §ralph-loop §Suitable for / §Not suitable for | 3+3 bullets of when-to-use / when-not-to-use | `applicability-criteria` (meta/doc) | **medium** | An authoring convention: every template/archetype plugin should publish its suitability envelope. Also a documentation pattern. |
| §feature-dev §Agent design notes — code-architect | "Commits to a single approach rather than hedging. Outputs a blueprint with file paths, function names, and concrete steps." | `single-approach-commitment` (PRM) | **medium** | An authoring rule for design/architect agents: force commitment, no "either A or B" hedging. |
| §feature-dev §Agent design notes — code-reviewer | "When there is nothing to say, reports 'meets standards' succinctly." | `null-result-protocol` (PRM) | **weak** | An output convention for evaluator agents: empty result must be stated, not produce silence or filler. |
| §hookify §Rule file format | Schema: `name`/`enabled`/`event`/`pattern`/`action` front matter + message body; advanced `conditions` with `field`/`operator`/`pattern`. | `hook-rule-schema` (SPC) | **weak** | Very specific to rule-based hook plugins. Candidate if more than one plugin family adopts this schema; otherwise treat as exemplar. |
| §claude-md-management §`claude-md-improver` skill | 6-criterion weighted rubric (Commands 20 / Clarity 20 / Patterns 15 / Conciseness 15 / Freshness 15 / Actionability 15 = 100) | `weighted-quality-rubric` (FLW) | **weak** | Speculative generalization. Distinct from `FLW-CTF` (single 0–100 confidence). Pattern is: **multi-criterion rubric with weights**. Include only if another plugin uses the same shape. |

### REFINES candidates

| Source location | Refinement | Target ID |
|---|---|---|
| §code-review §`gh` CLI usage | The applied form of `SPC-ATR`: when an external service has a CLI (`gh`, `git`, `aws`), prefer `allowed-tools: Bash(gh pr view:*)` over generic Bash or WebFetch access. | `SPC-ATR` |
| §pr-review-toolkit §Sequential vs. parallel | Already flagged in File 1. Case-studies adds the concrete wording: "Default sequential + `all parallel` opt-in." | `FLW-PVS` |
| §feature-dev §User approval points (3 bullets) | Multi-gate approval: a single command can have 2–3 discrete approval points (clarifying answers / design choice / review-response decision), not just one at Phase 5. | `FLW-EAG` |
| §feature-dev §Agent design notes — code-explorer (output) | "Output must include a list of 5–10 must-read files" — explicit output-contract for exploration agents. Could fold into `PRM-OSD` as the "explorer output contract" example. | `PRM-OSD` |
| §ralph-loop §Mechanism (9 steps) | Promote to the canonical exemplar of `CTX-FFL`. Already cross-referenced, but the 9-step trace is the clearest expression of the mechanism. | `CTX-FFL` |

### Out of scope

| Source location | Reason |
|---|---|
| §feature-dev §Layout code block | Exemplar of `ARC-SDL` — directory layout for a specific plugin. |
| §code-review §Pipeline code block | Exemplar of `FLW-MTP` + `FLW-PC`. |
| §hookify §Layout code block | Exemplar of `ARC-SDL` + `ARC-AH`. |
| §pr-review-toolkit §The six agents table (full rows) | Exemplar data. Useful as linked reference, not taxonomy entry. |
| §TODO | Meta-TODO about adding more case studies. Not plugin-authoring knowhow. |

### Summary

- **12 units confirmed EXISTS** as exemplars.
- **2 strong NEW candidates**: `component-choice-heuristic` (ARC), `selective-dispatch` (FLW).
- **5 medium NEW candidates**: `signal-driven-proposal`, `propose-not-execute`, `post-session-capture`, `runtime-rule-reload`, `applicability-criteria`, `single-approach-commitment`.
- **3 weak NEW candidates**: `null-result-protocol`, `hook-rule-schema`, `weighted-quality-rubric`.
- **5 REFINES candidates**: `SPC-ATR`, `FLW-PVS`, `FLW-EAG`, `PRM-OSD`, `CTX-FFL`.
- The original "case-studies = exemplars only" decision was wrong — at minimum the 2 strong candidates should become taxonomy entries.

## File 5: docs/checklists.md

Richest file for NEW knowhow. The §Prompt section articulates general prompt-authoring quality rules not captured in the narrative docs. The §CLAUDE.md section covers an entire area absent from the taxonomy (noted as "orphan" in the previous session). The §Skill / §Hook sections surface several SPC and CTX gaps.

### §How to Use — meta-structure items

| Source | Unit | Status |
|---|---|---|
| §Severity tiers | Mandatory / Recommended / Quality with definitions | **NEW** — `severity-tier-model` (FLW). Not in taxonomy. How triage works is knowhow for both smith authors and plugin authors. |
| §Automation stance | `[auto]` / `[judgment]` tagging | **NEW** — `automation-stance-tagging` (FLW). Defines the machine-vs-judgment distinction that governs smith's Improve mode. |
| §When to apply table | 3-timing model (Create / Improve / PR gate) | SUBSUMED by `severity-tier-model` + smith's mode design. Not a standalone item. |

### §Prompt — general prompt-authoring quality (NEW-heavy section)

The narrative docs captured some prompt-authoring principles (PRM-IV through PRM-SC) but the §Prompt checklist surfaces 8 orthogonal rules that are absent from the taxonomy.

| Checklist item | Proposed name | Domain | Strength |
|---|---|---|---|
| §1 Conciseness — "does not re-state what Claude already knows"; "every paragraph justifies its token cost" | `context-window-frugality` | PRM | **strong** |
| §2 Specificity — state what/where/how; reference existing patterns; name target files | `instruction-specificity` | PRM | **strong** |
| §3 Positive form — "do X" not "don't do Y" | `positive-instruction-form` | PRM | **strong** |
| §4 Motivation — include the reason; Claude 4 generalizes better with rationale | `instruction-rationale` | PRM | **strong** |
| §5 Degree of freedom — match freedom level to task (high/medium/low; narrow-bridge vs. open-field) | `instruction-freedom-level` | PRM | **strong** |
| §6 Verification — define success criteria (tests / lint / typecheck / screenshots); root-cause over suppression | `verifiable-success-criteria` | PRM | **strong** |
| §7 Workflow structure — number steps; use checklist for complex tasks; define verify→fix→re-verify | `multi-step-structuring` | PRM | **medium** |
| §8 Terminology — same term for the same concept throughout | `terminology-consistency` | PRM | **medium** |

### §Skill — gaps in SPC and CTX

| Source | Unit | Status |
|---|---|---|
| §1 Metadata — name conventions (lowercase, ≤64 chars, no XML, reserved words `anthropic`/`claude`) | REFINES:`SPC-SFM` — more constraints than currently documented |
| §1 Metadata — gerund form (`processing-pdfs`) | REFINES:`SPC-SFM` |
| §1 Metadata — description ≤ 1024 characters | REFINES:`SPC-SFM` |
| §1 Metadata — `disable-model-invocation` for side-effect workflows | **NEW** — `disable-model-invocation` (SPC). Field not covered anywhere. |
| §2 Progressive disclosure — references stay one level deep | REFINES:`CTX-PD` |
| §2 Progressive disclosure — mutually exclusive contexts in separate files | **NEW** — `context-separation` (CTX). Distinct from tier depth; about segmenting by audience/context. |
| §2 Progressive disclosure — reference files >100 lines have ToC | **NEW** — `reference-toc-threshold` (SPC). Concrete navigability rule. |
| §3 Content — no time-dependent information | **NEW** — `time-independent-content` (PRM). Maintenance rule: no dated claims like "until August 2025". |
| §3 Content — one default plus an escape hatch | **NEW** — `default-plus-escape` (PRM). Limiting the cognitive load of choices. |
| §5 Code/scripts — "generates verifiable intermediate outputs (plan-validate-execute)" | **NEW** — `plan-validate-execute` (FLW). Three-stage safety pattern for scripts. |
| §6 CC-specific — `context: fork` field | **NEW** — `skill-fork-context` (SPC). Front-matter field not documented elsewhere. |
| §6 CC-specific — `agent` field (Explore/Plan/general-purpose/custom) | **NEW** — `skill-agent-field` (SPC). Front-matter field not documented elsewhere. |
| §7 Evaluation — "build evaluations BEFORE writing extensive docs" | REFINES:`SPC-DOM` — test-first sequencing |
| §7 Evaluation — observe Claude's exploration path (file order, oversights, ignored files) | REFINES:`SPC-DOM` — behavioral observation |
| §7 Evaluation — test with all target models (Haiku/Sonnet/Opus) | REFINES:`SPC-DOM` |

### §Hook — SPC gaps

| Source | Unit | Status |
|---|---|---|
| §1 Is a hook the right mechanism? | **NEW** — `hook-applicability-rule` (SPC). "Must happen every time with zero exceptions → hook; sometimes → CLAUDE.md rule." Decision gate before hook authoring. **strong** |
| §2 Event selection — correct event for intent | EXISTS:`SPC-HER` (event roster covers this) |
| §3 I/O design — exit codes: 0 success / 2 block / other non-blocking error | REFINES:`SPC-HIV` |
| §3 I/O design — "Claude only sees stderr from exit code 2, except UserPromptSubmit" | **NEW** — `hook-stderr-visibility` (SPC). Behavioral gotcha not documented anywhere. |
| §5 Execution — idempotency | **NEW** — `hook-idempotency` (SPC). Hooks may run multiple times; side effects must not accumulate. |
| §5 Execution — no race conditions (matching hooks run in parallel) | REFINES:`SPC-HJF` (parallel execution already noted there) |
| §5 Execution — session-start snapshot: setting changes not reflected mid-session | **NEW** — `session-snapshot-timing` (CTX). Behavioral constraint: hooks/settings loaded once at session start. |
| §6 Type selection — command for deterministic, prompt for judgment | EXISTS:`SPC-THT` |
| §7 Hooks in skill front matter — scoped to skill lifecycle | EXISTS:`SPC-SFM` (hooks field) |

### §CLAUDE.md — orphan section (new territory for taxonomy)

This entire section has no corresponding taxonomy items. The narrative docs (concepts / components / patterns) do not cover CLAUDE.md management at all.

| Source | Unit | Status |
|---|---|---|
| §1 Content inclusion — include: non-guessable bash, code style, test runner, etiquette, arch decisions, gotchas | **NEW** — `claude-md-inclusion-rules` (CTX). What belongs vs. does not belong. **strong** |
| §1 Content inclusion — exclude: derivable code, standard conventions, detailed API docs, frequent-change info, truisms | Subsumed by `claude-md-inclusion-rules` |
| §2 Conciseness — "would removing this line cause Claude to make mistakes?" test | **NEW** — `necessity-test` (PRM or CTX). A specific pruning heuristic. |
| §3 Instruction effectiveness — "rules that should be hooks have been identified" | **NEW** — `rule-to-hook-migration` (CTX). When a CLAUDE.md rule is repeatedly ignored, convert it to a hook. **strong** |
| §3 Instruction effectiveness — important instructions carry `IMPORTANT`/`YOU MUST` emphasis | EXISTS:`PRM-CPM` (critical-phase markers cover this) |
| §4 Placement — global `~/.claude/CLAUDE.md` / project `./CLAUDE.md` / local `./CLAUDE.local.md` / monorepo parent-child / `@import` syntax | **NEW** — `claude-md-placement` (CTX). Full placement taxonomy not captured anywhere. **strong** |
| §4 Placement — `@import` syntax | Subsumed by `claude-md-placement` |
| §5 Continuous improvement — `/init` baseline | Workflow tooling note; defer to smith design. |
| §5 Continuous improvement — `#` key for immediate additions | Workflow tooling note; defer. |

### §Command, §Agent, §Plugin (overall) — derivation checks

These sections are explicitly "newly derived from components.md". Each item traces back to an existing taxonomy item and is checked correctly.

| Section | Maps to |
|---|---|
| Command: imperative voice, allowed-tools, inline exec, args, phase labels, approval, single-message, plugin-root-var | `PRM-IV`, `SPC-ATR`, `SPC-ICE`, `SPC-AE`, `FLW-PC`, `FLW-EAG`, `PRM-SMC`, `SPC-PRV` — all `EXISTS` |
| Agent: name constraints, example blocks, model choice, tools, reporter/evaluator, confidence, color | `SPC-AFM`, `SPC-EBT`, `FLW-MTS`, `SPC-ATR`, `FLW-RES`, `FLW-CTF`, `SPC-CA` — all `EXISTS` |
| Plugin overall: plugin.json, directory layout, archetype, three-layer, no hard paths, wiring, security, README, LICENSE | `ARC-SDL`, `ARC-ACA/ASO/AH`, `ARC-TLS`, `SPC-PRV`, `SPC-HIV` — all `EXISTS` |

### Summary

- **Many EXISTS** confirmed across Command / Agent / Plugin sections.
- **NEW candidates — strong (10)**: `severity-tier-model`, `context-window-frugality`, `instruction-specificity`, `positive-instruction-form`, `instruction-rationale`, `instruction-freedom-level`, `verifiable-success-criteria`, `hook-applicability-rule`, `claude-md-inclusion-rules`, `rule-to-hook-migration`, `claude-md-placement`.
- **NEW candidates — medium (8)**: `automation-stance-tagging`, `multi-step-structuring`, `terminology-consistency`, `disable-model-invocation`, `context-separation`, `hook-idempotency`, `session-snapshot-timing`, `necessity-test`.
- **NEW candidates — weak (6)**: `reference-toc-threshold`, `time-independent-content`, `default-plus-escape`, `plan-validate-execute`, `skill-fork-context`, `skill-agent-field`, `hook-stderr-visibility`.
- **REFINES candidates**: `SPC-SFM` (name constraints + description length), `CTX-PD` (one-level-deep, size constants), `SPC-DOM` (test-first + behavioral obs + multi-model), `SPC-HIV` (exit codes), `SPC-HJF` (parallel race conditions), `PRM-CPM` (emphasis markers).
- **The §CLAUDE.md section is entirely uncovered by the existing taxonomy** — at least 3 strong items.

## File 6: README.md

(pending)

## File 7: smith-design.md

(pending)

## Reconciliation summary

(pending — to be filled after all 7 files scanned)
