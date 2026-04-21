# AIYA documentation polish — progress

## Original intent

> READMEのコミット履歴を参考に、docsの中の文書を同じように修正と更新してみて。目的はaiyaの実装に進むために設計とUXを固めることです

(Follow-up redirect from the user:)

> それは逆です、作る前に利用者をイメージして決めるんです。あるべき姿を先に考えるんです。

> 今は実装は不要、あるべき姿を書いて

## Current phase

**Design consolidation.** Planning-session decisions have been reflected into the docs (commit `b4a4265`). Remaining work is per-document **Open questions** hearings and two outstanding phase-flow designs (Approach, Delivery).

Branch: `claude/aiya-documentation-polish-LLxbp`

## Completed

- [x] README: Concepts section names all 8 TC elements; Quickstart filled in with curl one-liner + 5 slash commands
- [x] tc-x-gates.md: renamed Success Scenarios → **Acceptance Scenarios**; added Japanese phase subtitles (達成すべきこと / 達成する方法 / 届ける); Planning Gate + Output Gate (G1/G2/G3) structure; 1 Step = 1 Turn invariant articulated; Storage section resolved (`.aiya/<issue-number>/`)
- [x] tc-x-gates.md: added Pain/Benefit writing discipline — Benefit is strategic impact, not Pain's inverse
- [x] aiya-jam.md: full rewrite with conversational commands (`/hi /go /ty /gm /bb`), up.sh/dn.sh lifecycle, Chain directory layout, Quickstart
- [x] acc.md: CCS lowercase filename convention (`t001.md`, `t002.md`) documented; physical-location open question resolved

## Remaining tasks

### Design (blocks the remaining Open questions)

Goal-phase pattern is set. Approach and Delivery need the same treatment so the whole lifecycle is closed before individual Open questions can be answered with confidence.

- [ ] **Approach phase flow** — apply the Goal pattern (Plan section + Planning Gate → drafting → Output Gate G2). Decide: AI-drafted vs expert-authored per element; how Technology choice is recorded; how Design shape is recorded.
- [ ] **Delivery phase flow** — Steps authoring, Turn execution, Verification, PR → merge. Decide: who authors Steps (expert / AI); how Verification ties back to Acceptance Scenarios; what lands in the PR vs in `delivery.md`.

Recommended next tactical step: Approach phase flow (pattern already exists, low cost, closes the whole picture).

### Open questions — per document

**tc-x-gates.md**
- [ ] Per-element authoring schema (what exactly to write per element)
- [ ] Chain → CCS linkage (reference vs value copy)
- [ ] Gate criteria (what exactly must hold for `/ty` to be appropriate)
- [ ] Archival (how completed Chains are preserved after merge)
- [ ] Authoring split between expert and AI, per element

**acc.md**
- [ ] CCS versioning (whether to keep the state before replacement)
- [ ] Extension policy for the type vocabulary
- [ ] Runner implementation form (subagent / separate session / separate container)
- [ ] Async coordination for parallel Turns

**aiya-jam.md**
- [ ] SKILL.md placement and loading
- [ ] SKILL.md granularity (per phase / per Turn kind)
- [ ] Workflow definition language (YAML / TypeScript / plain Markdown)
- [ ] Parallel Turn handling
- [ ] Runner implementation form and location (inside / outside aiya-pit)
- [ ] Integration with aiya-pit (how Turns are launched in the sandbox)
- [ ] Integration with aiya-tape (whether CCS creation events are recorded)

**aiya-pit.md**
- [ ] CA cert distribution
- [ ] Base image selection
- [ ] In-container user privileges

**aiya-tape.md**
- [ ] Allowlist management
- [ ] Default dashboard presets
- [ ] Log retention
- [ ] Masking rules

**README**
- [ ] Contributing section (branch strategy, commit rules, review flow)

## Session context

- The user drove design via proposal-based hearing. Decisions crystallized in order: repo-scoped install model → conversational command names → phase-file structure → 8-element TC with Japanese definitions → 2-gate-per-phase (Planning + Output) → 1 Step = 1 Turn invariant maintained by plan updates → Acceptance Scenarios naming.
- Key constraint: the expert's judgment must be structurally embedded, not bolted on. Gates exist because drift is structurally detectable only when there is something concrete to compare against.
- Pain/Benefit discipline matters: Pain is observable symptom; Benefit is strategic downstream impact. Users often collapse them — the doc now enforces the distinction.
- Command naming: conversational phrases over functional labels (`/ty` not `/approve`, `/gm` not `/feedback`).

## Document layout

```
agents-in-your-area/
  README.md                  # entry point — why AIYA, Concepts, Quickstart, Architecture
  progress.md                # this file
  docs/
    background.md            # prior art, scope, comparisons, FAQ
    tc-x-gates.md            # Traceability Chain × Steering Gates
    acc.md                   # Agent Cognitive Compressor runtime
    aiya-jam.md              # orchestrator package
    aiya-pit.md              # sandbox package
    aiya-tape.md             # auditor package
```

## Next session entry point

1. Read this file.
2. Pick up **Approach phase flow design** — use Goal phase as the template.
3. Once Approach + Delivery flows are set, walk each Open questions list one document at a time.
