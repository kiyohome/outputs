# Traceability Chain

> A 6-element chain from intent to execution that makes drift structurally detectable

<!-- NOTE: This document is a skeleton. The content will be filled in in the next iteration. -->

The Traceability Chain is a 6-element chain that keeps "why are we doing this again?" structurally traceable.

```
Situation → Pain → Benefit → Acceptance Scenarios → Approach → Steps
```

Each element is linked to the next; when a link breaks, the process stops. That is why the chain is managed as explicit documentation.

Context bloat and drift are the biggest enemies of quality. Spec-driven development aligns with intent at the moment the spec is written, but "why we are building this" fades as implementation proceeds. The Chain keeps the distance between intent and execution measurable at any time. See [vision.md](vision.md) for the fuller motivation.

## The 6 elements

<!-- TODO: Nail down the definition of each element. Today they only have one-liner descriptions inherited from vision.md. -->

| Element | Question | What to write (TODO) |
|---|---|---|
| **Situation** | What is the current state? | TODO |
| **Pain** | What hurts? | TODO |
| **Benefit** | What do we gain when it's solved? | TODO |
| **Acceptance Scenarios** | How do we know it's solved? | TODO |
| **Approach** | How will we solve it (strategy)? | TODO |
| **Steps** | Concrete actions | TODO |

## Format

<!-- TODO: Schema for each element. Decide between YAML / Markdown frontmatter / plain Markdown. -->

**Open**: which format to use. Candidates:
- (a) A single file with sections per element
- (b) One file per element
- (c) Hybrid (the "why" side consolidated, the "how" side split)

## Physical layout

<!-- TODO: File path, directory structure, naming conventions -->

**Open**: where to store Chains. Candidates:
- Under `aiya-jam/chains/<issue-id>/`
- Inside the issue repository itself
- Managed elsewhere

## Lifecycle

<!-- TODO: Creation → update → archival -->

- **Creation** — when and by whom a Chain is stood up (at issue filing / at planning / ...)
- **Authoring split** — which elements the expert writes and which the AI drafts
- **Update** — how to handle a Chain that changes mid-implementation
- **Archival** — how completed Chains are preserved

TODO

## Gates

<!-- TODO: Placement and criteria for the three-stage gates -->

**Open**: vision.md mentions "three-stage gates" but the placement and criteria are undefined.

Working hypothesis:
- Gate 1: commit to Situation → Pain → Benefit (approval of "what we are building this for")
- Gate 2: commit to Acceptance Scenarios → Approach (approval of "how we will build it")
- Gate 3: acceptance at the completion of Steps (judgment of "did we get closer to the goal")

For each gate:
- Who judges
- What is judged
- Where to fall back on rejection

All TODO.

## Link to CCS

<!-- TODO: How to connect Chain and CCS -->

**Open**: how CCS should reference Chain elements. Candidates:
- (a) Path reference: `retrieved_artifacts: spec(chains/issue-123/benefit.md)`
- (b) ID reference: something like `BNF-123-01`
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

- [ ] Format definition for each element
- [ ] Physical layout (split files vs consolidated)
- [ ] CCS linkage method
- [ ] Concretize the three-stage gates
- [ ] Mapping between Chain and the ACC hierarchy (Task/Context/Step/Action)
- [ ] Chain versioning (how to keep change history)
- [ ] Granularity (is 1 issue = 1 Chain the right unit?)
