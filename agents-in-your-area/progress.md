# Progress

> Record of work intent, completed items, and next steps. Start here when resuming.

## How to resume

Read in this order at the start of a new session:

1. **`.claude/rules/`** — project-wide rules (read first, always)
2. **This file** — current completion state and next tasks
3. **PR #1** (merged): https://github.com/kiyohome/outputs/pull/1
4. Latest sync branch: `claude/aiya-documentation-polish-LLxbp` (8-element / 3-phase chain, not yet PR'd)
5. The document being worked on (starting from the top-priority task below)

## Original intent

From the first message of the session (preserved verbatim so the intent is not lost):

> aiyaのトレーサビリティチェイン、ccsの実現方法を考えたい
> トレーサビリティチェインによりいくつかドキュメントが必要かと。ドキュメントの種類、フォーマット、管理方法が必要では？
> 要件、UX、設計を順に考えましょう
> 私にヒアリングしながら提案ベースで進めて

**Honest status**: PR #1 delivered the groundwork (monorepo layout, doc skeletons, rules, progress tracking). The original design question — how Chain documents should be *typed / formatted / managed*, and how Chain and CCS actually hook together — is still **open**. "Next tasks" below is the real entry point.

## Current phase

**Requirements phase**. First step of the requirements → UX → design sequence.

The focus is pinning down how AIYA's Traceability Chain and CCS should actually work. Documentation refactoring is done; from here, each document's content gets filled in.

## Completed

### Latest sync: 8-element / 3-phase Chain (branch pushed, no PR yet)

- [x] Replace `vision.md` with the latest 8-element chain: `Situation → Pain → Benefit → Success Scenarios → Testing → Technology → Design → Steps`, organized into Goal / Approach / Delivery phases
- [x] Document the rationale for ordering within Approach (Testing first, to prevent drift into tech/design without a confirmation plan)
- [x] Add Scope statement: AIYA focuses on the process layer; UI layer uses existing chat infrastructure (Slack, Claude Code Channels)
- [x] Rename `Acceptance Scenarios` → `Success Scenarios` across all docs
- [x] Update `README.md` Core concepts table with the 8-element chain
- [x] Rewrite `traceability-chain.md` to an 8-element / 3-phase structure with Approach ordering rationale
- [x] Update `architecture.md` Chain ↔ Task mapping and Gate placement to reflect 3 phases
- [x] Fix factual error in `ccs.md` (CCS is a paper term, not AIYA's renaming of ACC)
- [x] Update `aiya-jam.md` gate-surface expectation to existing chat infra (no dedicated UI)

### PR #1: monorepo refactor

- [x] Reorganize `agents-in-your-area/` into a monorepo layout (`README.md` + `docs/`)
- [x] Map, split, and deduplicate the four existing documents (vision / acc-agent-architecture / aiya-pit / aiya-tape)
- [x] Classify documents into types (4 Concept + 3 Package)
- [x] Optimize heading structure per file (common template dropped in favor of a flat `##` structure)
- [x] Convert ASCII diagrams to mermaid (both diagrams in `architecture.md`, the system diagram in `README.md`)
- [x] Create skeletons for `traceability-chain.md` and `aiya-jam.md`
- [x] Translate `README.md` and all `docs/*.md` body text to English (follow-up on language.md)

### `.claude/rules/` setup

- [x] `rules.md` — meta rules (confirmation before writing, process improvement)
- [x] `language.md` — English as the default output language
- [x] `documentation.md` — structure, headings, OSS conventions, bilingual docs
- [x] `workflow.md` — proposal-based progression, progress.md pattern, git operations
- [x] `diagrams.md` — mermaid preferred, syntax safety, smartphone visibility
- [x] Translate all five rule files to English

## Next tasks (by priority)

Grouped by implementation-readiness tier. Within each tier, items are roughly ordered by dependency.

### Tier 1 — Implementation-blocking decisions

Each item picks a concrete option (ADR-sized). Together they define enough for aiya-jam to begin.

#### 1. Resolve the "Step" naming collision

Chain's **Steps** (Delivery phase, an ordered action list) and the work-unit **Step** (one CCS handoff inside a Context, AIYA-original) share the same word. Deciding schema keys, filesystem paths, and APIs without resolving this first risks a global rename later. Rename one side or introduce an explicit prefix (e.g., `PlanStep` / `RunStep`).

#### 2. Chain storage & format

- Schema for each of the 8 elements (Situation / Pain / Benefit / Success Scenarios / Testing / Technology / Design / Steps)
- Physical layout: (a) single file / (b) per-element split / (c) hybrid per-phase
- Storage location: under `aiya-jam/chains/<issue-id>/` / inside the issue repository / elsewhere

#### 3. Chain ↔ CCS linkage + CCS storage

- Linkage strategy: (a) Path reference `retrieved_artifacts: spec(chains/issue-123/success-scenarios.md)` / (b) ID reference `SCN-123-01` / (c) Value copy into `goal_orientation` / `constraints` at CCS creation
- CCS file physical location
- CCS versioning (keep pre-replacement state vs replace-only)

#### 4. Gate surface & criteria

- Chat platform: Slack / Claude Code Channels / other (per UI-less scope in `vision.md`)
- Prompt / response modeling (how gate questions and expert answers are structured)
- G1 / G2 / G3 concrete pass criteria
- Rejection fallback targets (which Chain elements to revisit)
- Expert identity / authentication at the gate

#### 5. Workflow & Agent shape

- Workflow definition language: YAML / TypeScript / plain Markdown
- SKILL.md **granularity** (per Task / per Step kind / per Context) *and* **placement / loading**
- Task Agent / Step Agent implementation form: Claude Code subagent / separate session / separate container

#### 6. aiya-jam integration boundaries

- Does the Task Agent live inside aiya-pit or outside?
- Should CCS creation events be recorded by aiya-tape?

#### 7. Parallel Step Agent async review scheme

Split out of the Chain ↔ work-unit mapping item — the mapping hypothesis is mostly resolved (see Tier 2), but parallel-execution review is an open design question that drives the Task Agent's state machine.

#### 8. Exception semantics

- Step Agent failure mid-Context: does CCS roll back, or does the next Step see a `failed` episodic_trace and continue?
- Can a G2-committed Approach be reopened from within Implementation?

### Tier 2 — Process / lifecycle

#### 9. Chain ↔ Task/Context/Step/Action mapping (confirm hypothesis)

[architecture.md § Chain ↔ Task mapping](docs/architecture.md) already states a working hypothesis aligned with the 3-phase Chain:

- Goal → Task-level input (expert-authored, G1 commits)
- Approach → Planning Context output (AI-drafted, G2 commits)
- Delivery → Implementation Context's Step sequence (AI-executed, G3 judges on completion)

Confirm or adjust once Tier 1 decisions land.

#### 10. Chain lifecycle

- Creation trigger (at issue filing / at planning / other)
- Update handling (how to handle a Chain that changes mid-implementation)
- Archival of completed Chains
- Chain versioning (change history)
- Granularity — is 1 issue = 1 Chain the right unit?
- Authoring split per element: working hypothesis is expert → Goal, AI drafts Approach (reviewed at G2), AI generates Delivery (reviewed at G3)

#### 11. CCS type vocabulary extension policy

Low priority — `ccs.md` already states "vocabulary is not frozen". Formalize only when contention appears in practice.

### Tier 3 — Content / docs

#### 12. Chain worked example

TODO in `docs/traceability-chain.md` § Example — one end-to-end issue walked through all 8 elements.

#### 13. Common pitfalls

TODO in `docs/traceability-chain.md` § Common pitfalls.

#### 14. Quickstart sections

Still TODO in:

- `README.md`
- `docs/aiya-pit.md`
- `docs/aiya-tape.md`
- `docs/aiya-jam.md`

#### 15. Contributing guide

`README.md` § Contributing is TODO — branch strategy, commit conventions.

#### 16. aiya-pit open questions

- CA certificate distribution (shared volume / init container / entrypoint script)
- Base image (ubuntu:24.04 / node:lts / custom)
- In-container user privileges (root vs non-root)

#### 17. aiya-tape open questions

- Proxy allow/deny list management (config file / env vars / API)
- Default dashboard presets (what initial templates show)
- Log retention configuration
- Masking rule management (regex / pattern match)

## Session context (for resuming)

- The user prefers **hearing-and-proposal-based** progression — don't just execute
- **Monorepo** setup (packages: aiya / aiya-pit / aiya-tape / aiya-jam)
- Order is **requirements → UX → design**
- Documents are in **English** (full translation done in PR #1)
- **Fact-check external claims before asserting** — the ACC paper (Bousetouane 2026, arXiv:2601.11653) defines ACC, CCS, Turn, CCM, Schema, State replacement, but does NOT define the Task/Context/Step/Action hierarchy (that is AIYA-original)
- Working branch: `claude/aiya-documentation-polish-LLxbp`

## Documentation layout (current)

```
agents-in-your-area/
├── README.md                   # Monorepo overview
├── progress.md                 # This file
└── docs/
    ├── vision.md               # Why (migrated from aiya-vision.md)
    ├── traceability-chain.md   # Chain spec (skeleton, many TODOs)
    ├── ccs.md                  # CCS spec (extracted from existing)
    ├── architecture.md         # Work units + agent placement
    ├── aiya-pit.md             # Sandbox
    ├── aiya-tape.md            # Audit proxy
    └── aiya-jam.md             # Task management (skeleton, many TODOs)
```
