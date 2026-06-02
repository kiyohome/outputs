# smith

> A meta-plugin for Claude Code that **applies best practices** to build a high-quality, reproducible Claude Code artifact — by default a plugin combining a custom slash command, a skill, and subagent(s).

**Status**: design-documentation stage. The plugin is not yet implemented; this directory holds the specification the implementation will follow. The authoritative spec is [`smith-design.md`](./smith-design.md).

## What smith is

Claude Code plugin/skill/subagent design know-how is scattered across official repos and varies widely in quality. Authors reverse-engineer patterns by hand, and there is no systematic way to turn a rough idea into an artifact that is both **reproducible** and **high quality**.

smith is a **builder**. Given a rough draft of what you want, it elicits the real intent, then designs and implements a proper artifact grounded in canonical patterns (定石), verifying against an evaluation suite throughout.

Two value axes drive everything:

- **A — Reproducibility**: the built artifact behaves the same way every run (same trigger, same files touched, byte-stable script output).
- **B — Quality**: the built artifact produces better results than the no-artifact baseline.

### What it is not

- **Not a checker.** It does not grade an existing artifact or emit a scorecard. (Claude Code's harness already does format/syntax validation — smith does not duplicate it.)
- **Not a converter.** It does not transform one artifact into another; it builds the right one.
- **Not an installer or registry.**

## Where smith sits

smith is the middle of a skill-creator–flanked pipeline:

| Stage | Owner | Does |
|---|---|---|
| Create draft | **skill-creator** (or an AI) | rough, throwaway draft that makes intent legible |
| **Build** | **smith** | apply best practices → reproducible (A) + high quality (B) artifact |
| Compare revisions | **skill-creator** (optional) | blind A/B comparison between two built versions |

The draft is an intent-elicitation seed and is **discarded** — smith keeps the intent, drops the draft's structure, and re-derives the right structure from scratch.

## Flow

smith runs six phases (`Phase > Step > Action`). Hearing is proposal-based: smith leads with a concrete recommendation and its rationale, rather than interviewing from a blank slate.

1. **Background** — the problem the artifact solves.
2. **Goal** — goal + success criteria + how they'll be verified.
3. **Constraints** — target models, tools, side-effects, non-goals.
4. **Propose UX + author evaluations** — usage, ≥3 scenarios, output examples; then author the eval suite and capture the no-artifact baseline. *(Nothing in Phase 5 starts until evals exist.)*
5. **Build by applying best practices** — the main event:
   - 5-1 turn the goal into structure (roles + parts + flow)
   - 5-2 confirm parts & interfaces
   - 5-3 build per-part work instructions
   - 5-4 optimize parts one by one

   Every step addresses **both** reproducibility and quality. Structure steps (5-1, 5-2) have the highest leverage on both; the evaluation suite runs continuously as a feedback loop.
6. **Verify & improve** — the final gate: a reproducibility test (same behavior across repeated runs) and a quality test (beats the baseline).

## Best practices smith carries

Three layers of canonical patterns, each loaded only by the phase that needs it:

1. **Structure/role patterns** (design) — role assignment (driver/knowledge/execution), three-layer separation, reporter/evaluator separation, parallel-vs-sequential dispatch, model placement.
2. **Prompt-composition patterns** (implementation) — output contracts, role leads, long-context ordering, example envelopes, and a scoped **XML** policy (XML only for mixed-content prompts, never on skill `name`/`description` or simple procedures).
3. **Concrete-writing patterns** (polish) — calibrated emphasis (prefer "Use this tool when…" over "CRITICAL: You MUST…" on current Opus models), positive form, explicit scope, third-person skill descriptions, consistent terminology.

These are **sources of Actions, applied selectively** — Mandatory items always apply; Recommended/Quality items apply only when a failing eval scenario needs them, and skipped items are logged, not silently dropped.

## Shared principles

- **Proposal-driven** — smith leads with concrete recommendations + rationale.
- **Evaluations first** — criteria are authored at Phase 4 and run continuously, not invented at the end.
- **Minimal, meaningful approval gates** — intent confirmation, design selection, before any write, and per-finding at verify.
- **Dry-run by default** — nothing is written without explicit confirmation.
- **Self-applicable** — smith can be run to build/improve itself.

## Architecture (planned)

A plugin combining a driver skill + knowledge skills + execution subagents. All fan-out originates in the orchestrator; subagents never dispatch subagents.

```
smith/
├── .claude-plugin/plugin.json
├── skills/
│   ├── smith/                   # entry skill (disable-model-invocation) — the /smith command + orchestrator
│   ├── smith-requirements/      # Phase 1–4 knowledge: hearing, strip-to-intent, eval authoring
│   ├── smith-structure-patterns/# Phase 5-1/5-2 knowledge: structure/role patterns
│   └── smith-prompt-patterns/   # Phase 5-3/5-4 knowledge: composition + writing patterns, XML policy
└── agents/
    ├── smith-architect.md       # Opus — 5-1 competing structural designs (parallel)
    ├── smith-writer.md          # Sonnet — 5-3/5-4 per-part prompt writing
    └── smith-verifier.md        # Opus — Phase 6 A test + B test (reports, does not fix)
```

The knowledge skills wrap the corresponding pattern libraries; the design docs in this directory are the single source of truth. See [`smith-design.md`](./smith-design.md) for the authoritative specification, and `docs/` for the underlying knowhow (concepts, components, patterns, case-studies, taxonomy, checklist-items).

## Distribution & development

smith is built and distributed in **[`lovaizu/ccpm`](https://github.com/lovaizu/ccpm)** (the lovaizu plugin marketplace), as a plugin subdirectory `ccpm/smith/` with a `marketplace.json` at the ccpm root. The docs here are the spec; the plugin lives in ccpm.

- **Develop / run:** `claude --plugin-dir <path>/ccpm/smith`, then `/reload-plugins` after edits. Invoke `/smith:<skill>`; check `/agents`.
- **Validate:** `claude plugin validate`.
- **Install (users):** `/plugin marketplace add lovaizu/ccpm` → `/plugin install smith@ccpm`.

See [`smith-design.md` § Deployment & development round-trip](./smith-design.md) for the full layout and round-trip.
