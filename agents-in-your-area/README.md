# AIYA

> Agents In Your Area — a framework that scales an expert's judgment

Change by an order of magnitude the value a single expert can produce.

AI agents have become "usable", but not yet "delegable". AIYA is a framework that structurally embeds an expert's unwavering judgment into their collaboration with AI, freeing them from babysitting and making success reproducible.

## Who is this for

Skilled developers.

People who already use AI agents heavily — who have tried spec-driven development, Plan Mode, skills, and parallel execution piece by piece — and who still hit a wall.

This is not a tool to level up juniors. It is a tool that unlocks scaling for people who can already make the right call.

## Problem

Core pain: **an expert's unwavering judgment is not being put to use in AI collaboration.**

What makes an expert an expert is not wavering: not losing sight of the goal, having a stable decision axis, not being blown around by tech trends. But in AI collaboration, there is no mechanism to put that steadiness to work.

### Babysitting never ends

As of 2026, spec-driven development is starting to spread. Write the spec first, plan before implementation. Experts are trying it.

AI still drifts mid-implementation. There is no mechanism to detect the widening distance between the spec and the output, so the expert ends up constantly asking "is this still okay?" More tools, more methods — and yet babysitting has only changed shape, not disappeared.

### Success isn't reproducible

Spec-driven, planning first, skills — each practice exists. On good days, the results are dramatic. But you cannot tell why it worked, so the next day you cannot reproduce it. There is no consistent process that explains the gap between success and failure.

## What you get

An expert's unwavering judgment becomes structurally part of the AI's work process.

**No babysitting** — instead of babysitting, you can focus on making the right call at the right moment. The Traceability Chain detects drift, and gates place expert judgment exactly when it is needed. Success stops being a personal hunch and becomes a reproducible process.

**Scale as one** — the value one expert can produce changes by an order of magnitude. AI does the work; the expert focuses on "what to build" and "did we get closer to the goal". Because the phases are clearly demarcated, multiple workers can be reviewed asynchronously.

For deeper background — prior art, scope, comparisons with existing tools, and FAQ — see [Background](docs/background.md).

## Concepts

AIYA stands on two orthogonal mechanisms. One guards **purpose**; the other guards **context**.

### Traceability Chain × Steering Gates — guards purpose

An 8-element chain from user situation to execution, with expert-judged Steering Gates between phases. Drift becomes structurally detectable. See [Traceability Chain × Steering Gates](docs/tc-x-gates.md).

### ACC (Agent Cognitive Compressor) — guards context

A generic runtime that suppresses context bloat and drift by handing a bounded state (CCS) between Turns — replacement semantics, not accumulation. See [ACC](docs/acc.md).

## Quickstart

<!-- TODO: Install steps and a minimal run example -->

```
# TODO
```

## Packages

AIYA is composed of three packages.

- [**aiya-jam**](docs/aiya-jam.md) — orchestrator (SKILL.md, workflow definitions)
- [**aiya-pit**](docs/aiya-pit.md) — sandbox (Dockerfile, CA cert, network restrictions)
- [**aiya-tape**](docs/aiya-tape.md) — auditor (Go + OpenObserve)

jam (jam session), pit (mosh pit), tape (recording tape). All one-syllable, all music.

## Architecture

```mermaid
flowchart LR
    Expert["Expert"]
    API["External APIs (LLM, etc.)"]

    subgraph AIYA["AIYA"]
      Jam["aiya-jam (orchestrator)"]
      subgraph Pit["aiya-pit (sandbox)"]
        Agent["AI Agent"]
      end
      subgraph Tape["aiya-tape (auditor)"]
        Proxy["proxy"]
        O2["OpenObserve"]
      end
    end

    Expert --> Jam
    Jam --> Agent
    Agent --> Proxy
    Proxy --> API
    Proxy --> O2
    Expert --> O2
```

The expert opens a task through aiya-jam, authoring the Chain and answering gates as they appear. Jam dispatches Turns to an AI Agent running inside aiya-pit. All outbound traffic from the Agent is routed through aiya-tape, which enforces the allowlist and records every request into OpenObserve; the expert reviews what happened via OpenObserve's dashboards or MCP.

**Stack**

| Package | Underlying tech |
|---|---|
| [**aiya-jam**](docs/aiya-jam.md) | Claude Code plugin (SKILL.md, workflow definitions) |
| [**aiya-pit**](docs/aiya-pit.md) | Docker (container image, internal network, CA cert) |
| [**aiya-tape**](docs/aiya-tape.md) | aiya-proxy (Go + goproxy), OpenObserve |

**Data**

- **Chain** — authored via aiya-jam; defines what to build and how success is judged
- **CCS** — bounded state handed between ACC Turns; managed by aiya-jam
- **Artifacts** — code, tests, and logs produced inside the aiya-pit worktree
- **Audit trail** — every outbound HTTPS request/response recorded by aiya-tape

## Security

**Threat model** — we assume the AI agent inside aiya-pit may make mistakes or be attacked. The layers below cap the blast radius.

**Layer 1 — Early detection**

Claude Code's `PreToolUse` hook evaluates rules before each tool call and flags suspicious operations. Detection only; bypassable, so it never stands alone.

**Layer 2 — Runtime enforcement**

- **Filesystem** (aiya-pit) — only the working directory is bind-mounted; the host filesystem is inaccessible
- **Network** (aiya-pit) — Docker's internal network cuts the agent off from direct egress; the only reachable peer is aiya-tape's proxy
- **Egress allowlist** (aiya-tape) — the proxy drops traffic to domains outside the allowlist
- **Recording hygiene** (aiya-tape) — the MITM CA private key is regenerated per container start; `Authorization` headers and API keys are masked before the request/response lands in OpenObserve

See [aiya-pit](docs/aiya-pit.md) and [aiya-tape](docs/aiya-tape.md) for implementation details.

## Contributing

<!-- TODO: Contribution guide, branch strategy, commit rules -->

TODO
