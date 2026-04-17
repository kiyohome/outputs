# Traceability Chain

> An 8-element chain from user situation to executable steps, organized into three phases, so that drift is structurally detectable

The Traceability Chain keeps "what is this for, again?" answerable at every point between intent and execution. It is a single chain with eight elements, grouped into three phases, with gates (expert judgment points) placed between phases.

```
Situation → Pain → Benefit → Success Scenarios │ Testing → Technology → Design │ Steps
|______________ Goal ______________|           |______ Approach ______|       | Delivery |
```

Each element is linked to the next; when a link breaks, the process stops. That is why the chain is managed as explicit documentation. See [vision.md](vision.md) for the full motivation.

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
- **Authoring split** — which elements the expert writes and which the AI drafts. Working hypothesis: the expert owns the Goal phase; the Approach phase is AI-drafted and expert-reviewed at the gate; the Delivery phase is AI-generated from the approved Approach.
- **Update** — how to handle a Chain that changes mid-implementation
- **Archival** — how completed Chains are preserved

TODO

## Gates

<!-- TODO: Placement and criteria for the gates -->

Gates sit at phase boundaries. Working hypothesis:

- **G1 — Goal gate** (after Success Scenarios): commit to "what we are building, and what counts as success"
- **G2 — Approach gate** (after Design): commit to "how we will build it, including how we will confirm"
- **G3 — Delivery gate** (after Steps / on completion): judge "did we get closer to the goal"

For each gate:
- Who judges — the expert (see [vision.md](vision.md))
- UI — existing chat infrastructure (Slack, Claude Code Channels), not a dedicated UI
- What is judged — TODO
- Where to fall back on rejection — TODO

## Link to CCS

<!-- TODO: How to connect Chain and CCS -->

**Open**: how CCS should reference Chain elements. Candidates:
- (a) Path reference: `retrieved_artifacts: spec(chains/issue-123/success-scenarios.md)`
- (b) ID reference: something like `SCN-123-01`
- (c) Value copy: at CCS creation time, inline the relevant Chain content into `goal_orientation` / `constraints`

See [ccs.md](ccs.md) for the CCS spec.

## Example

<!-- TODO: One worked example based on a real issue -->

```
TODO
```

## Common pitfalls

<!-- TODO: Frequent failure patterns -->

TODO

## Related documents

- [vision.md](vision.md) — the thinking behind Chains
- [ccs.md](ccs.md) — state representation during Step execution
- [architecture.md](architecture.md) — how Chains map to Task/Context/Step/Action
- [aiya-jam.md](aiya-jam.md) — the package that manages Chains

## Open questions

- [ ] Format definition for each of the 8 elements
- [ ] Physical layout (split files vs consolidated)
- [ ] CCS linkage method
- [ ] Gate criteria and rejection fallbacks
- [ ] Mapping between Chain and the work-unit hierarchy (Task/Context/Step/Action, AIYA-original)
- [ ] Chain versioning (how to keep change history)
- [ ] Granularity (is 1 issue = 1 Chain the right unit?)
- [ ] Authoring split between expert and AI, per element
