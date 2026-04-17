# aiya-jam

> Let's jam — task management

<!-- NOTE: This document is a skeleton. The content will be filled in in the next iteration. -->

The task-management package that puts Traceability Chain and CCS into practice. The expert defines *what to build* as a Chain, then flows Task → Context → Step while CCS gets handed off between Steps. aiya-jam provides the workflow and skill definitions for that.

## Responsibilities

<!-- TODO: Nail down responsibilities: SKILL.md, workflow definitions, Chain management, CCS storage, etc. -->

Expected:

- **Traceability Chain creation and update** — templates for the 8 elements across Goal / Approach / Delivery, plus gates between phases
- **CCS handoff management** — store and reference CCS files between Steps
- **Step execution direction** — the delegation interface for Step Agents
- **SKILL.md** — skill definitions that Claude Code reads
- **Workflow definitions** — declarative expression of the Planning → Implementation flow
- **Gate surface** — present gates through existing chat infrastructure (Slack, Claude Code Channels); AIYA does not build a dedicated UI (see [vision.md](vision.md) Scope)

## Quickstart

<!-- TODO -->

TODO

## Creating a new chain

<!-- TODO: Steps to open a new task and stand up a Chain -->

TODO

## Running a task

<!-- TODO: The Task Agent → Step Agent flow -->

TODO

## Components

<!-- TODO: Finalize the components -->

- [ ] SKILL.md placement and loading
- [ ] Workflow definition format (YAML / TypeScript / plain Markdown)
- [ ] Chain storage (file / DB / issue body)
- [ ] CCS storage

## Interfaces

<!-- TODO: Connections to aiya-pit / aiya-tape -->

- [ ] Connection to aiya-pit (does the Task Agent live outside pit or inside?)
- [ ] Connection to aiya-tape (should CCS creation events be recorded by tape?)

## Related documents

- [traceability-chain.md](traceability-chain.md) — Chain definition
- [ccs.md](ccs.md) — CCS definition
- [architecture.md](architecture.md) — Task/Context/Step/Action structure
- [aiya-pit.md](aiya-pit.md) — execution environment
- [aiya-tape.md](aiya-tape.md) — auditing

## Open questions

- [ ] Chain management implementation (file-based / issue extension / custom DB)
- [ ] SKILL.md granularity (per Task / per Step kind / per Context)
- [ ] Choice of workflow definition language
- [ ] Task Agent implementation (Claude Code subagent / separate container / separate session)
- [ ] Gate surface concretization (which chat platform, how the gate prompt/response is modeled)
- [ ] Handling of parallel Steps
