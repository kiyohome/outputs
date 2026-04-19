# Traceability Chain × Steering Gates

> Purpose-based quality assurance: link user situation to execution, and steer at each phase boundary

**Traceability Chain (TC)** keeps "what is this for, again?" answerable at every point between intent and execution. It is a single chain of eight elements grouped into three phases. **Steering Gates** sit between phases as expert judgment points — "did we get closer to the goal?" is answered here, not at the end. The expert does not just approve or reject; they redirect the work toward the goal.

```
Situation → Pain → Benefit → Success Scenarios │ Testing → Technology → Design │ Steps
|______________ Goal ______________|  G1       |______ Approach ______|  G2     | Delivery |  G3
```

Each element links to the next; when a link breaks, the process stops. The chain plus its gates is what makes drift **structurally detectable**. See the [AIYA README](../README.md) for the motivation.

## The three phases

| Phase | Elements | What the phase answers |
|---|---|---|
| **Goal** | Situation, Pain, Benefit, Success Scenarios | What are we trying to achieve, and how do we know when we've achieved it? |
| **Approach** | Testing, Technology, Design | How will we achieve it? |
| **Delivery** | Steps | In what order do we execute? |

The order within Approach is intentional: Testing first, then Technology, then Design. Placing Testing first prevents the drift of entering technology selection or design before deciding how success will be confirmed. Approach is inherently the most drift-prone phase, so it is split into three to increase drift-detection points.

## The 8 elements

<!-- TODO: Fill in the writing format (schema) for each element. For now, only the question each element answers is defined. -->

### Goal phase

| Element | Question | What to write (TODO) |
|---|---|---|
| **Situation** | What situation is the user in? | TODO |
| **Pain** | What is the user struggling with in that situation? | TODO |
| **Benefit** | How does it change when the user's problem is resolved? | TODO |
| **Success Scenarios** | What state of the user counts as "resolved"? | TODO |

### Approach phase

| Element | Question | What to write (TODO) |
|---|---|---|
| **Testing** | How do we confirm it was solved? | TODO |
| **Technology** | What do we use to solve it? | TODO |
| **Design** | How do we implement it? | TODO |

### Delivery phase

| Element | Question | What to write (TODO) |
|---|---|---|
| **Steps** | In what order do we proceed? | TODO |

## Steering Gates

Three Steering Gates sit at phase boundaries. The expert judges at each one whether the work is heading toward the goal — and redirects when it is not.

| Gate | Placement | What the gate commits |
|---|---|---|
| **G1 — Goal gate** | after Success Scenarios, before Approach | "what we are building, and what counts as success" |
| **G2 — Approach gate** | after Design, before Delivery | "how we will build it, including how we will confirm" |
| **G3 — Delivery gate** | on completion of Steps | "did we get closer to the goal" |

**Authoring split** (working hypothesis):

| Phase | Authored by | Committed at |
|---|---|---|
| Goal | Expert | G1 |
| Approach | AI-drafted, expert-reviewed | G2 |
| Delivery | AI-generated from the approved Approach, executed by AI | G3 |

**Who judges** — the expert (see the [AIYA README](../README.md)).

**Surface** — existing chat infrastructure (Slack, Claude Code Channels, etc.). AIYA does not build a dedicated UI.

<!-- TODO: exact gate criteria, rejection fallbacks -->

## How Delivery Steps run

The Delivery phase's Steps are executed by [ACC](acc.md), a generic runtime for multi-Turn AI agents. Each Step is realized as one or more ACC Turns, and a bounded state (CCS) is handed between them. Chain content lands in the Turn's CCS — for example, Goal-phase elements flow into `goal_orientation`; Approach-phase constraints flow into `constraints`; authored documents flow into `retrieved_artifacts`.

TC × Steering Gates decides **what to build and whether we got there**. ACC decides **how state is carried while building it**. The two are orthogonal.

<!-- TODO: exact reference vs value-copy scheme for Chain → CCS -->

## Format

<!-- TODO: Schema for each element. Decide between YAML / Markdown frontmatter / plain Markdown. -->

**Open**: which format to use. Candidates:
- (a) A single file with sections per element
- (b) One file per element
- (c) Hybrid (Goal consolidated, Approach split per element, Delivery consolidated)

## Physical layout

<!-- TODO: File path, directory structure, naming conventions -->

**Open**: where to store Chains. Candidates:
- Under `aiya-jam/chains/<issue-id>/`
- Inside the issue repository itself
- Managed elsewhere

## Lifecycle

<!-- TODO: Creation → update → archival -->

- **Creation** — when and by whom a Chain is stood up (at issue filing / at planning / ...)
- **Update** — how to handle a Chain that changes mid-implementation
- **Archival** — how completed Chains are preserved

## Example

<!-- TODO: One worked example based on a real issue -->

```
TODO
```

## Common pitfalls

<!-- TODO: Frequent failure patterns -->

TODO

## Related documents

- [AIYA README](../README.md) — why AIYA exists
- [ACC](acc.md) — the runtime that executes Delivery Steps
- [aiya-jam](aiya-jam.md) — the package that manages Chains

## Open questions

- [ ] Format definition for each of the 8 elements
- [ ] Physical layout (split files vs consolidated)
- [ ] Chain → CCS linkage (reference vs value copy)
- [ ] Gate criteria and rejection fallbacks
- [ ] Chain versioning (how to keep change history)
- [ ] Granularity (is 1 issue = 1 Chain the right unit?)
- [ ] Authoring split between expert and AI, per element
