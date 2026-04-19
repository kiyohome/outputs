# aiya-jam

> Let's jam — orchestrator

<!-- NOTE: This document is a skeleton. The content will be filled in in the next iteration. -->

The orchestrator package that puts Traceability Chain × Steering Gates and ACC into practice. The expert defines *what to build* as a Chain, and aiya-jam drives execution as an ACC Runner: Turns consume Chain content, hand off CCS, and surface Steering Gates to the expert. aiya-jam provides the workflow and skill definitions for that.

## Responsibilities

<!-- TODO: Nail down responsibilities: SKILL.md, workflow definitions, Chain management, CCS storage, etc. -->

Expected:

- **Traceability Chain creation and update** — templates for the 8 elements across Goal / Approach / Delivery
- **CCS handoff management** — store and reference CCS files between Turns
- **Turn execution direction** — the delegation interface the Runner uses to invoke a Turn
- **SKILL.md** — skill definitions that Claude Code reads
- **Workflow definitions** — declarative expression of the Turn sequence
- **Gate surface** — present G1 / G2 / G3 through existing chat infrastructure (Slack, Claude Code Channels); AIYA does not build a dedicated UI (see [Background](background.md) Scope)

## Quickstart

<!-- TODO -->

TODO

## Creating a new chain

<!-- TODO: Steps to open a new task and stand up a Chain -->

TODO

## Running a task

<!-- TODO: The Runner → Turn flow -->

TODO

## Components

<!-- TODO: Finalize the components -->

- [ ] SKILL.md placement and loading
- [ ] Workflow definition format (YAML / TypeScript / plain Markdown)
- [ ] Chain storage (file / DB / issue body)
- [ ] CCS storage

## Interfaces

<!-- TODO: Connections to aiya-pit / aiya-tape -->

- [ ] Connection to aiya-pit (does the Runner live outside pit or inside?)
- [ ] Connection to aiya-tape (should CCS creation events be recorded by tape?)

## Related documents

- [Traceability Chain × Steering Gates](tc-x-gates.md) — Chain definition and Steering Gates
- [ACC](acc.md) — Runner / Turn / CCS runtime
- [aiya-pit](aiya-pit.md) — execution environment
- [aiya-tape](aiya-tape.md) — auditor

## Open questions

- [ ] Chain management implementation (file-based / issue extension / custom DB)
- [ ] SKILL.md granularity (per Chain / per Turn kind)
- [ ] Choice of workflow definition language
- [ ] Runner implementation (Claude Code subagent / separate container / separate session)
- [ ] Gate surface concretization (which chat platform, how the gate prompt/response is modeled)
- [ ] Handling of parallel Turns
