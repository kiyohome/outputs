# Progress

> Record of work intent, completed items, and next steps. Start here when resuming.

## How to resume

Read in this order at the start of a new session:

1. **`.claude/rules/`** — project-wide rules (read first, always)
2. **This file** — current completion state and next tasks
3. **PR #1**: https://github.com/kiyohome/outputs/pull/1
4. The document being worked on (starting from the top-priority task below)

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

### PR #2: sync latest vision (8-element / 3-phase Chain)

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

### 1. Nail down Traceability Chain requirements ★top priority

Fill in the TODOs in `docs/traceability-chain.md`. Hearing points:

- Format for each of the 8 Chain elements (Situation / Pain / Benefit / Success Scenarios / Testing / Technology / Design / Steps)
- Physical layout (single file vs per-element split vs hybrid — the hybrid option aligns naturally with the 3 phases)
- Granularity (is 1 issue = 1 Chain the right unit?)
- Chain versioning (how to keep change history)
- Authoring split per element: working hypothesis is expert → Goal, AI drafts Approach (expert reviews at G2), AI generates Delivery (expert reviews at G3)

### 2. Chain-to-CCS linkage

- (a) Path reference: `retrieved_artifacts: spec(chains/issue-123/benefit.md)`
- (b) ID reference: something like `BNF-123-01`
- (c) Value copy: inline Chain content into `goal_orientation` / `constraints` at CCS creation time

Pick one.

### 3. Concretize the three gates (G1 / G2 / G3)

[vision.md](docs/vision.md) places the gates between phases. Working hypothesis now in `traceability-chain.md` and `architecture.md`:

- G1 (Goal gate) — before Planning starts. Commits Situation / Pain / Benefit / Success Scenarios.
- G2 (Approach gate) — at Planning → Implementation boundary. Commits Testing / Technology / Design.
- G3 (Delivery gate) — at Implementation completion. Judges whether Success Scenarios are met.

Still to define:
- Concrete criteria per gate
- Rejection fallback targets
- Gate surface (which chat platform, how prompts and responses are modeled — per the UI-less scope in `vision.md`)

### 4. Resolve the "Step" naming collision

Chain's "Steps" (the action list after Approach) and ACC's "Step" (the work unit inside a Context) use the same word for different things. Rename one or introduce an explicit distinction.

### 5. Chain ↔ Task/Context/Step/Action mapping

Open item in [architecture.md § Chain ↔ Task mapping](docs/architecture.md). Working hypothesis now aligned with the 3-phase Chain:

- Goal (Situation / Pain / Benefit / Success Scenarios) → Task-level input
- Approach (Testing / Technology / Design) → Planning Context output
- Delivery (Steps) → Implementation Context's Step sequence

### 6. aiya-jam implementation shape

TODOs in [aiya-jam.md](docs/aiya-jam.md):

- SKILL.md granularity (per Task / per Step kind / per Context)
- Workflow definition language (YAML / TypeScript / plain Markdown)
- Chain storage (file / DB / issue body)
- CCS storage
- Task Agent implementation (Claude Code subagent / separate container / separate session)

### 7. Quickstart sections

Quickstart is still TODO in all of:

- `README.md`
- `docs/aiya-pit.md`
- `docs/aiya-tape.md`
- `docs/aiya-jam.md`

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
