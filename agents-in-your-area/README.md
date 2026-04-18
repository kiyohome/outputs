# AIYA

> Agents In Your Area — a framework that scales an expert's judgment

AIYA is a framework that structurally embeds an expert's unwavering judgment into their collaboration with AI. AI agents have become "usable" — but not yet "delegable". AIYA closes that gap.

Skilled developers have tried spec-driven development, Plan Mode, skills, and parallel execution piece by piece, yet still can't simultaneously achieve "freedom from babysitting" and "reproducible success" when working with AI. AIYA attacks that wall structurally. See [Vision](docs/vision.md) for the full picture.

## Core concepts

AIYA stands on two orthogonal mechanisms.

| Concept | What it guards | One-liner | Details |
|---|---|---|---|
| **Traceability Chain × Gates** | Purpose | An 8-element chain from user situation to execution, with expert-judged gates between phases — drift becomes structurally detectable | [Traceability Chain × Gates](docs/tc-x-gates.md) |
| **ACC (Agent Cognitive Compressor)** | Context | A generic runtime that suppresses context bloat and drift by handing a bounded state (CCS) between Turns — replacement semantics, not accumulation | [ACC](docs/acc.md) |

## Quickstart

<!-- TODO: Install steps and a minimal run example -->

```
# TODO
```

## Documentation index

**Read first (for everyone)**
- [Vision](docs/vision.md) — why AIYA exists
- [Traceability Chain × Gates](docs/tc-x-gates.md) — purpose-based quality assurance
- [ACC](docs/acc.md) — context control for multi-Turn agents

**For users**
- [aiya-jam](docs/aiya-jam.md) — task management (SKILL.md, workflows)
- [aiya-pit](docs/aiya-pit.md) — sandbox
- [aiya-tape](docs/aiya-tape.md) — auditing and visualization

## Monorepo layout

| Package | Idea | Contents | Docs |
|---|---|---|---|
| **aiya** | Full AIYA experience (integration) | CLI + docker-compose | — |
| **aiya-pit** | Go wild in here (sandbox) | Dockerfile, CA certificate, network restrictions | [aiya-pit](docs/aiya-pit.md) |
| **aiya-tape** | The tape is rolling (audit) | Go proxy, OpenObserve setup | [aiya-tape](docs/aiya-tape.md) |
| **aiya-jam** | Let's jam (task management) | SKILL.md, workflow definitions | [aiya-jam](docs/aiya-jam.md) |

pit (mosh pit), tape (recording tape), jam (jam session). All one-syllable, all music.

## System architecture

```mermaid
flowchart TB
    CLI["aiya CLI (Bash + tmux)"]

    subgraph Host["Host (WSL2/Ubuntu)"]
        subgraph DockerNet["Docker Network"]
            CC["CC Container × N"]
            Proxy["aiya-proxy (Go + goproxy)"]
            O2["OpenObserve"]
            CC --> Proxy
            Proxy --> O2
        end
    end

    CLI --> CC
```

**aiya-proxy responsibilities:**
- API gateway
- HTTPS MITM
- Domain allow/deny
- Masking

**OpenObserve responsibilities:**
- Log storage
- Dashboards
- Built-in MCP
- SQL queries

## Security model

Two layers: **early detection** + **runtime enforcement**.

**Layer 1: PreToolUse Hooks (early detection)**

Claude Code's hook mechanism. Rules are evaluated before tool execution and suspicious operations are flagged. Detection only; bypassable.

**Layer 2: Docker + Proxy (runtime enforcement)**

This is where actual restrictions are enforced.

Filesystem restrictions (Docker):
- Only the working directory is mounted (bind mount)
- The host filesystem is inaccessible

Network restrictions (Docker network):
- Docker's `internal` network setting physically cuts off the CC container from external access
- The CC container can only reach aiya-proxy
- Only aiya-proxy attaches to the external network, and it controls outbound traffic via an allowlist

## Contributing

<!-- TODO: Contribution guide, branch strategy, commit rules -->

TODO
