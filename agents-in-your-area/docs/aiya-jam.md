# aiya-jam

> Let's jam — orchestrator

<!-- NOTE: This document is a skeleton. Quickstart and Architecture will be filled in as decisions land. -->

The orchestrator package that puts Traceability Chain × Steering Gates and ACC into practice. The expert defines *what to build* as a Chain, and aiya-jam drives execution as an ACC Runner: Turns consume Chain content, hand off CCS, and surface Steering Gates to the expert. aiya-jam ships as a Claude Code plugin — SKILL.md plus workflow definitions.

## Responsibilities

- **Chain authoring** — templates for the 8 elements across Goal / Approach / Delivery
- **Steering Gate surface** — present G1 / G2 / G3 through existing chat infrastructure (Slack, Claude Code Channels); AIYA does not build a dedicated UI (see [Background](background.md) Scope)
- **Runner** — the ACC Runner that drives the Turn sequence
- **Turn dispatch** — the delegation interface the Runner uses to invoke each Turn
- **CCS handoff** — store and reference CCS files between Turns
- **SKILL.md** — skill definitions that Claude Code loads
- **Workflow definitions** — declarative expression of the Turn sequence

## Quickstart

<!-- TODO: Install the plugin, stand up a Chain for a new task, run a Turn. -->

```
# TODO
```

## Architecture

Open design decisions for the plugin, storage, and integration with the other packages.

**Plugin shape** (Claude Code plugin)

- [ ] SKILL.md placement and loading
- [ ] SKILL.md granularity (per Chain / per Turn kind)
- [ ] Slash commands / hooks exposed to the expert

**Workflow definitions**

- [ ] Definition language (YAML / TypeScript / plain Markdown)
- [ ] Parallel Turn handling

**Storage**

- [ ] Chain storage (file / DB / issue body) — see also [Traceability Chain × Steering Gates](tc-x-gates.md) Storage
- [ ] CCS storage (physical location, versioning)

**Runner**

- [ ] Implementation form (Claude Code subagent / separate session / separate container)
- [ ] Where the Runner runs (outside aiya-pit / inside aiya-pit)

**Integration**

- [ ] Connection to [aiya-pit](aiya-pit.md) — how Turns are launched inside the sandbox
- [ ] Connection to [aiya-tape](aiya-tape.md) — whether CCS creation events are recorded
- [ ] Steering Gate surface (which chat platform, how the gate prompt/response is modeled)

## Related documents

- [Traceability Chain × Steering Gates](tc-x-gates.md) — Chain definition and Steering Gates
- [ACC](acc.md) — Runner / Turn / CCS runtime
- [aiya-pit](aiya-pit.md) — execution environment
- [aiya-tape](aiya-tape.md) — auditor

## Open questions

See Architecture above. Each bullet under Architecture is tracked as an open decision until it is chosen and documented.
