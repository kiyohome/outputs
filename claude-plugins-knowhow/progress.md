# plugin-smith Design Progress Log

> Decision log and resumption guide for building plugin-smith, a meta-plugin for creating and improving Claude Code plugins.

## Scope

- Design documentation for plugin-smith lives in `claude-plugins-knowhow/`
- README.md is the entry point; `docs/` holds concept and reference documentation
- All file content is written in English (per `.claude/rules/interaction.md`)

## Sources

### Internal (migrated — originals deleted)
- `claude-plugins-knowhow.md` (1106 lines, 20 sections) → split into `docs/{concepts,components,patterns,case-studies}.md`
- `cc-best-practices-report.md` → absorbed into `README.md > Overview`
- `checklist-{prompt,skills,hooks,claude-md}.md` (4 files) → merged into `docs/checklists.md`

### External
- skill-smith: https://github.com/lovaizu/aiya-dev/tree/main/.claude/skills/skill-smith
  - Architecture: SKILL.md + references/{create,improve,evaluate,profile}-workflow.md + checklist.md + patterns.md + writing-guide.md + scripts/{validate,profile_stats}.sh
  - Mode-driven (Create/Improve/Evaluate/Profile), references externalized, deterministic validate/profile via scripts

## Confirmed Decisions

### 1. Plugin name
- Tentative: `plugin-smith` (mirrors skill-smith)

### 2. Directory layout

```
claude-plugins-knowhow/
├── README.md              # Overview / Usage / Architecture
├── progress.md            # This file
└── docs/
    ├── concepts.md        # Foundational concepts and design principles
    ├── components.md      # Command / agent / skill / hook design patterns
    ├── patterns.md        # Quality control, state management, security, advanced
    ├── case-studies.md    # Seven official plugin analyses (origin tracing)
    └── checklists.md      # Seven-category quality self-checks
```

### 3. Section ordering principle
- Each document follows: **overview-level → user-facing → developer-facing**
- Exact headings are optimized per document (no forced uniform template)

### 4. Two-mode design (final)

| Mode | Input | Purpose |
|---|---|---|
| **Create** | Natural language request | Generate a new plugin |
| **Improve** | Path (+ optional problem description) | Improve an existing plugin |

- Evaluate was absorbed as `Improve --report-only`
- Both modes are **proposal-driven**: plugin-smith leads with concrete recommendations, asks questions only for decisive ambiguities
- Default is **dry-run**: disk writes require user approval
- User approval points are limited to meaningful forks (structure proposal in Create, patch application in Improve)

#### Create flow
1. Receive intent → immediately propose structure (no interview)
2. Classify into archetype A/B/C per `docs/concepts.md`
3. Compose from `docs/components.md` patterns
4. Present 2–3 candidates in parallel with rationale
5. User approval (proceed / adjust / reject)
6. Scaffold → self-validate against `docs/checklists.md`

#### Improve flow
| Argument | Behavior |
|---|---|
| Path only | Full scan → prioritized improvement proposals → approval → apply |
| Path + problem description | Focused diagnosis → root-cause hypothesis → patch → approval → apply |
| `--report-only` | No mutations; scorecard output only |

### 5. Decision log

| Topic | Decision | Rationale |
|---|---|---|
| Working directory | Extend `claude-plugins-knowhow/` | Design docs for the plugin to be built |
| README placement | Directory root | Clear entry point |
| docs file count | 5 | Coverage verified; all source material mapped |
| case-studies scope | All 7 plugins | Origin tracing |
| Mode count | 2 (Create / Improve) | Shared diagnostic engine, simpler UX |
| Evaluate handling | Absorbed as `--report-only` flag | Same diagnostic engine, output differs |
| Improve dry-run | Default ON | Safety-first |
| Problem-targeted Improve | Argument, not separate mode | Avoid mode proliferation |
| Interruption / resume | TODO (stateless for v1) | Minimum viable first |

## File Migration Map (completed)

| Original | Destination | Status |
|---|---|---|
| `claude-plugins-knowhow.md` §1, §2, §9, §18 | `docs/concepts.md` | ✅ Done |
| `claude-plugins-knowhow.md` §3, §4, §6, §7 | `docs/components.md` | ✅ Done |
| `claude-plugins-knowhow.md` §5, §8, §10, §19 | `docs/patterns.md` | ✅ Done |
| `claude-plugins-knowhow.md` §11–17 | `docs/case-studies.md` | ✅ Done |
| `claude-plugins-knowhow.md` §20 | `docs/checklists.md` (merged) | ✅ Done |
| `checklist-prompt.md` | `docs/checklists.md` > Prompt | ✅ Done |
| `checklist-skills.md` | `docs/checklists.md` > Skill | ✅ Done |
| `checklist-hooks.md` | `docs/checklists.md` > Hook | ✅ Done |
| `checklist-claude-md.md` | `docs/checklists.md` > CLAUDE.md | ✅ Done |
| `cc-best-practices-report.md` | `README.md` > Overview | ✅ Done |

All originals deleted after migration.

## Open TODO

- [ ] Architecture diagram (mermaid or text) for README.md
- [ ] Interruption / resume state management design
- [ ] Improve mode: algorithm for problem-description-focused diagnosis
- [ ] Scorecard output format for `--report-only`
- [ ] Reporter / evaluator separation: how to implement in Improve mode
- [ ] Plugin name finalization (`plugin-smith` is a placeholder)
- [ ] Content review of all docs/*.md and README.md by the user (committed but not yet reviewed)

## Consistency Notes

| Concern | Resolution |
|---|---|
| checklists.md §20 vs existing 4 checklists overlap | Merged during writing; new 3 categories (Command/Agent/Plugin) derived fresh |
| README.Usage proposal-driven vs case-studies feature-dev interview-style | case-studies records historical observation; plugin-smith's own UX is defined in README |
| Plugin name `plugin-smith` is tentative | Used consistently across README and all docs; `grep -r plugin-smith` for bulk rename |

## Progress

- [x] Step 1-a: Directory layout confirmed
- [x] Step 1-b: Per-document heading formats confirmed
- [x] Step 1-c: README content strategy confirmed (proposal-driven Usage)
- [x] Step 2: Input mapping + consistency review
- [x] Step 3: File creation (refactor execution)
- [x] Step 3-post: Legacy file deletion
- [ ] Step 4: User content review of all new files
- [ ] Step 5: Begin plugin implementation (SKILL.md, commands/, agents/, etc.)

## How to Resume

1. Read `.claude/rules/*.md` (especially `interaction.md` for Default to English)
2. Read this file — focus on "Confirmed Decisions" and "Open TODO"
3. Continue from "Next Action" below

## Environment

- Branch: `claude/busy-mccarthy-JFl8r`
- PR: https://github.com/kiyohome/outputs/pull/2
- Working directory: `claude-plugins-knowhow/`

## Next Action

- **Step 4**: User reviews the content of all new files (README.md + docs/*.md). These were committed in bulk without individual review.
- After review, proceed to **Step 5**: begin plugin implementation — create the actual SKILL.md, commands/, agents/ structure that constitutes plugin-smith as a working plugin.
