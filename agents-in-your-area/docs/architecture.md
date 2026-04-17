# Architecture

> AIYA's work-unit hierarchy and agent placement

This document defines the work units that drive a Traceability Chain and the responsibilities of the agents that run on top of them. CCS ([ccs.md](ccs.md)) is the Step-to-Step handoff within this structure.

## Work unit hierarchy

```mermaid
---
config:
  class:
    hideEmptyMembersBox: true
---
classDiagram
    direction LR
    Task --> "*" Context
    Context --> "*" Step
    Step --> "*" Action

    note for Context "Work area that isolates CCS"
```

| Level | Term | Description |
|---|---|---|
| 1 | Task | The goal to achieve |
| 2 | Context | Work area that isolates CCS. Example: Planning / Implementation |
| 3 | Step | Work flow that makes up a Context |
| 4 | Action | Concrete operation that makes up a Step |

## Overall structure

```mermaid
flowchart TB
    TA["Task Agent (no execution)"]

    subgraph Planning["Planning Context"]
        P1["Step 1: Step Agent"]
        Pdots["..."]
        PN["Step N: Step Agent"]
        POut["Output: Implementation Steps + CCS_I0"]
        P1 --> Pdots --> PN --> POut
    end

    subgraph Impl["Implementation Context"]
        I1["Step 1: Step Agent"]
        Idots["..."]
        IN["Step N: Step Agent"]
        IOut["Completion and quality check"]
        I1 --> Idots --> IN --> IOut
    end

    TA --> P1
    TA --> I1
    POut -.->|handoff| I1
```

## Task Agent

**Important: the Task Agent does not do the actual work.**

This constraint is essential for protecting plan quality. Allowing execution has been shown in practice to degrade planning.

| Responsibility | Description |
|---|---|
| Overall Task progress | Controls the Planning Context and the Implementation Context |
| Step management | Decides which Steps run in what order |
| Delegation to Step Agents | Delegates each Step's execution to the appropriate Step Agent |
| Completion judgment | Judges the completion of each Step and of the whole |
| CCS validation | Validates CCS content when needed |

## Planning Context

```
Each Step:
  Input:
    - CCS_P{N-1}
    - Step instructions

  Step Agent:
    - Load CCS_P{N-1} (the only handoff)
    - Pull what it needs from CCS_P{N-1}
    - Run Actions
    - Create a fresh CCS_PN

  Output:
    - CCS_PN

Final Output:
  - Implementation Steps
  - CCS_I0
```

## Implementation Context

```
Each Step:
  Input:
    - CCS_I{N-1}
    - Step instructions (from Implementation Steps)

  Step Agent:
    - Load CCS_I{N-1} (the only handoff)
    - Pull needed information and artifacts from CCS_I{N-1}
    - Run Actions
    - Create a fresh CCS_IN
    - Record artifacts and information in CCS_IN

  Output:
    - CCS_IN
    - Artifacts (code, tests, etc.)
```

## Example: implementation task

Using "implement the auth module" as an example, here is the Task/Context/Step flow. Per-Step Actions are omitted from the diagram to keep it readable and are listed in prose below.

```mermaid
flowchart LR
    Task["Task: implement auth module"]

    subgraph Planning["Planning Context"]
        P1["P1. Collect and analyze input"]
        P2["P2. Design Implementation Steps"]
        P1 --> P2
    end

    subgraph Impl["Implementation Context"]
        I1["I1. Design test cases"]
        I2["I2. Generate test code"]
        I3["I3. Generate test data"]
        I4["I4. Generate production code"]
        I5["I5. Run tests and fix"]
        I1 --> I2 --> I3 --> I4 --> I5
    end

    Task --> P1
    P2 --> I1
```

**Actions and CCS transitions per Step:**

- **P1. Collect and analyze input** — search design docs, search developer guides, survey existing code / `CCS_P0 → CCS_P1`
- **P2. Design Implementation Steps** — identify target, decompose into Steps, write Step instructions / `CCS_P1 → CCS_P2`
- **I1. Design test cases** — enumerate happy-path and edge cases, produce the case list / `CCS_I0 → CCS_I1`
- **I2. Generate test code** — implement tests from the case list / `CCS_I1 → CCS_I2`
- **I3. Generate test data** — produce the test data each case needs / `CCS_I2 → CCS_I3`
- **I4. Generate production code** — implement production code that passes the tests / `CCS_I3 → CCS_I4`
- **I5. Run tests and fix** — execute tests, fix on failure / `CCS_I4 → CCS_I5`

## Gate placement

[vision.md](vision.md) / [traceability-chain.md](traceability-chain.md) place gates between the Chain's three phases (Goal / Approach / Delivery). Mapping those onto the work-unit hierarchy:

- **G1 — Goal gate**: before the Task starts executing. Commits the Goal phase (Situation / Pain / Benefit / Success Scenarios).
- **G2 — Approach gate**: at the Planning Context boundary. Commits the Approach phase (Testing / Technology / Design) produced by Planning.
- **G3 — Delivery gate**: at the Implementation Context boundary (on completion). Judges whether the Success Scenarios were met.

## Chain ↔ Task mapping

Working hypothesis based on the 3-phase Chain (to be confirmed after Tier 1 decisions land):

| Chain phase | Chain elements | Work-unit mapping |
|---|---|---|
| **Goal** | Situation / Pain / Benefit / Success Scenarios | Task-level input (expert-authored, G1 commits) |
| **Approach** | Testing / Technology / Design | Planning Context output (AI-drafted, G2 commits) |
| **Delivery** | Steps | Implementation Context's Step sequence (AI-executed, G3 commits on completion) |

**Naming note**: the Chain element "Steps" and the work-unit level "Step" share the same word at different granularities. The Chain's Steps is the ordered plan (the Delivery content); a work-unit Step is one handoff of CCS inside the Implementation Context. This is listed as an open question below.

## Related documents

- [vision.md](vision.md) — why this structure is necessary
- [traceability-chain.md](traceability-chain.md) — the Chain side of the spec
- [ccs.md](ccs.md) — Step-to-Step handoff representation
- [aiya-jam.md](aiya-jam.md) — the package that implements this structure

## Open questions

- [ ] Exact correspondence between Chain (8 elements / 3 phases) and Task/Context/Step/Action
- [ ] Resolve the "Step" naming collision between Chain element and work-unit level
- [ ] Gate criteria (what the expert checks at G1/G2/G3) and rejection fallbacks
- [ ] Implementation form of Task Agent / Step Agent (subagent / separate session / separate container)
- [ ] Async review scheme for parallel Step Agents
