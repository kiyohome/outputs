# Progress

> Record of work intent, completed items, and next steps. Start here when resuming.

## How to resume

Read in this order at the start of a new session:

1. **`.claude/rules/`** — project-wide rules (read first, always)
2. **This file** — current completion state and next tasks
3. **PR #1**: https://github.com/kiyohome/outputs/pull/1
4. The document being worked on (starting from the top-priority task below)

## Current phase

**Requirements phase**. First step of the requirements → UX → design sequence.

The focus is pinning down how AIYA's Traceability Chain and CCS should actually work. Documentation refactoring is done; from here, each document's content gets filled in.

## Completed

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

- Format for each of the 6 Chain elements (Situation / Pain / Benefit / Acceptance Scenarios / Approach / Steps)
- Physical layout (single file vs per-element split vs hybrid)
- Granularity (is 1 issue = 1 Chain the right unit?)
- Chain versioning (how to keep change history)
- Authoring split (which elements the expert writes vs which the AI drafts)

### 2. Chain-to-CCS linkage

- (a) Path reference: `retrieved_artifacts: spec(chains/issue-123/benefit.md)`
- (b) ID reference: something like `BNF-123-01`
- (c) Value copy: inline Chain content into `goal_orientation` / `constraints` at CCS creation time

Pick one.

### 3. Concretize the three-stage gates

[vision.md](docs/vision.md) mentions them but doesn't define them:

- Placement: Task start / Context boundaries / Step completion
- Judge, criteria, and fallback target for each gate
- UI (CLI dialogue / web UI / PR review)

### 4. Resolve the "Step" naming collision

Chain's "Steps" (the action list after Approach) and ACC's "Step" (the work unit inside a Context) use the same word for different things. Rename one or introduce an explicit distinction.

### 5. Chain ↔ Task/Context/Step/Action mapping

Open item in [architecture.md § Chain ↔ Task mapping](docs/architecture.md). Working hypothesis:

- Situation / Pain / Benefit / Acceptance Scenarios → Task-level context
- Approach → basis for Context splitting
- Steps → Step sequence inside the Implementation Context

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
- Working branch: `claude/traceability-chain-docs-VTFb8`

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
