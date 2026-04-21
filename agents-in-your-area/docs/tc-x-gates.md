# Traceability Chain × Steering Gates

> Purpose-based quality assurance: link user situation to execution, and steer at each phase boundary

**Traceability Chain (TC)** keeps "what is this for, again?" answerable at every point between intent and execution. It is a single chain of eight elements grouped into three phases. **Steering Gates** sit between phases as expert judgment points — "did we get closer to the goal?" is answered here, not at the end. The expert does not just approve or reject; they redirect the work toward the goal.

```
Situation → Pain → Benefit → Acceptance Scenarios │ Testing → Technology → Design │ Steps
|_________________ Goal _________________|  G1    |______ Approach ______|  G2    | Delivery |  G3
```

Each element links to the next; when a link breaks, the process stops. The chain plus its Steering Gates is what makes drift **structurally detectable**. See the [AIYA README](../README.md) for the motivation.

## Phases

| Phase | | Elements | What the phase answers |
|---|---|---|---|
| **Goal** | 達成すべきこと | Situation, Pain, Benefit, Acceptance Scenarios | What are we trying to achieve, and how do we know when we've achieved it? |
| **Approach** | 達成する方法 | Testing, Technology, Design | How will we achieve it? |
| **Delivery** | 届ける | Steps | In what order do we execute? |

The order within Approach is intentional: Testing first, then Technology, then Design. Placing Testing first prevents the drift of entering technology selection or design before deciding how success will be confirmed. Approach is inherently the most drift-prone phase, so it is split into three to increase drift-detection points.

## Elements

Each element answers one question. The authoring schema for each is still open — see [Storage](#storage).

### Goal phase

| Element | Guiding question |
|---|---|
| **Situation** | What situation is the user in? |
| **Pain** | What is the user struggling with in that situation? |
| **Benefit** | How does it change when the user's problem is resolved? |
| **Acceptance Scenarios (AS)** | What state of the user counts as "resolved"? |

**Writing discipline for Pain and Benefit:** Pain describes an observable symptom the user experiences. Benefit describes the strategic impact when that symptom is gone — not the inverse of Pain, but the downstream consequence. "Users miss unread items" (Pain) vs "daily engagement drops" (Benefit) are distinct; "users can find unread items" would be the inverse of Pain and is not an acceptable Benefit.

### Approach phase

| Element | Question |
|---|---|
| **Testing** | How do we confirm it was solved? |
| **Technology** | What do we use to solve it? |
| **Design** | How do we implement it? |

### Delivery phase

| Element | Question |
|---|---|
| **Steps** | In what order do we proceed? |

## Steering Gates

Three Steering Gates sit at phase boundaries. Each gate has two checkpoints: a **Planning Gate** before work begins, and an **Output Gate** after work completes.

| Phase | Planning Gate (IN) | Output Gate (OUT) |
|---|---|---|
| **Goal** | Plan reviewed before research and drafting | **G1** — `goal.md` approved: Situation, Pain, Benefit, and Acceptance Scenarios confirmed |
| **Approach** | Plan reviewed before technical investigation | **G2** — `approach.md` approved: Testing strategy, Technology choice, and Design confirmed |
| **Delivery** | Steps reviewed before implementation | **G3** — `delivery.md` approved: Verification confirms Acceptance Scenarios are met |

G1 / G2 / G3 are shorthand for the Output Gates. Both checkpoints use the same commands (`/ty` to approve, `/gm` to redirect with feedback). The expert does not just approve or reject; they redirect the work toward the goal.

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

The Delivery phase's Steps are executed by [ACC](acc.md), a generic runtime for multi-Turn AI agents. A bounded state (CCS) is handed between Turns. Chain content lands in the Turn's CCS — for example, Goal-phase elements flow into `goal_orientation`; Approach-phase constraints flow into `constraints`; authored documents flow into `retrieved_artifacts`.

**Turn granularity:** 1 Step = 1 Turn is the design invariant. Each planned Step is realized in exactly one ACC Turn. When a Step cannot complete in a single Turn, the plan is updated (the Step is split or a corrective Step is added) before the next Turn runs — the plan and execution stay synchronized. CCS bloat is the health signal: if a Turn's CCS grows large, the Step scope is too broad.

TC × Steering Gates decides **what to build and whether we got there**. ACC decides **how state is carried while building it**. The two are orthogonal.

<!-- TODO: exact reference vs value-copy scheme for Chain → CCS -->

## Storage

**File format:** One file per phase, each opening with a Plan section.

```
.aiya/<issue-number>/
  goal.md       # Plan + Situation + Pain + Benefit + Acceptance Scenarios
  approach.md   # Plan + Testing + Technology + Design
  delivery.md   # Steps + Verification
  ccs/          # CCS files, one per Turn (lowercase)
    t001.md
    t002.md
    ...
  research/     # Intermediate artifacts: investigation outputs, spikes
                # Flat directory; file naming distinguishes types
                # e.g. research-auth-flow.md / spike-oauth.py
```

Each phase file opens with a **Plan** section reviewed at the Planning Gate before execution begins. The phase Chain elements follow, reviewed at the Output Gate on completion.

**Location:** `.aiya/<issue-number>/` inside the project repository. Chain files are committed to a branch and reviewed via pull request. The PR body references the directory only; no Chain content is written into the PR body itself.

**Lifecycle**

- **Creation** — `/hi` hears and files the issue; `/go <N>` creates `.aiya/<N>/` and the branch
- **Update** — plan changes (Step splits, gate redirects) are committed to the branch; the PR diff is the change history
- **Archival** — open (how completed Chains are preserved after merge)

## Related documents

- [AIYA README](../README.md) — why AIYA exists
- [ACC](acc.md) — the runtime that executes Delivery Steps
- [aiya-jam](aiya-jam.md) — the package that manages Chains

## Open questions

- [ ] Per-element authoring schema (what exactly to write per element)
- [ ] Chain → CCS linkage (reference vs value copy)
- [ ] Gate criteria (what exactly must hold for `/ty` to be appropriate)
- [ ] Archival (how completed Chains are preserved after merge)
- [ ] Authoring split between expert and AI, per element
