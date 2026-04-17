# CCS (Compressed Cognitive State)

> A bounded state representation that hands off Step-to-Step context with replacement semantics

CCS (Compressed Cognitive State) is a structured representation that AI agents use to hand off state between Steps. Both ACC (Agent Cognitive Compressor, the mechanism) and CCS (the bounded internal state it maintains) are terms defined in the paper *AI Agents Need Memory Control Over More Context* (Bousetouane, 2026). AIYA adopts CCS directly as the Step-to-Step handoff representation for Claude Code agent skills.

Traditional context management suffers from two problems:

| Approach | Problem |
|---|---|
| Transcript Replay | Context grows linearly; early mistakes are replayed, accumulating drift and hallucinations |
| Retrieval-based Memory | Semantic-similarity search does not match what Task control actually needs; stale or contradictory information leaks in |

CCS's answer:

- **Bounded state management** — replace, do not accumulate
- **Structure via schema** — state explicitly what must be kept
- **Separate artifact references from state commits** — retrieval only proposes candidates; actual state updates are strictly schema-controlled

## The 9 components

| Component | Role |
|---|---|
| episodic_trace | What just happened in the previous Step |
| semantic_gist | What we are fundamentally doing |
| focal_entities | What we are working on |
| relational_map | How they relate to each other |
| goal_orientation | What the end goal is |
| constraints | What must not be done |
| predictive_cue | What to do next |
| uncertainty_signal | What is still uncertain |
| retrieved_artifacts | Where information came from |

## Format

CCS is written in the form:

```
component_name:
  type(contents)
  type(contents)
  ...
```

| Part | Description |
|---|---|
| component_name | One of the nine CCS components |
| type | A predicate or type defined per Component |
| contents | The concrete value or content (free-form) |

The paper calls this a "TOON style token-oriented representation". It is lighter than JSON or YAML and optimized for token efficiency.

## Type vocabulary

`type` defines "what this represents" per Component.

| Principle | Description |
|---|---|
| Constrain types | Writing stays stable; the agent never hesitates |
| Predictable for readers | Fixed types yield consistent interpretation |
| Contents are free-form | Show the concrete shape via samples |
| Vocabulary is not frozen | Adjust as it gets used in practice |

| Component | What `type` means | Sample types (paper + extensions) |
|---|---|---|
| episodic_trace | Kind of action | observed, executed, received, completed, failed, logged, constraint |
| semantic_gist | Purpose of the work | implement, fix, investigate, refactor, migrate, diagnose, mitigate |
| focal_entities | Kind of target | file, function, class, interface, service, api, table, host, feature, signal |
| relational_map | Kind of relationship | depends, calls, implements, extends, before, after, timing, possible |
| goal_orientation | Kind of outcome | achieve, ensure, complete, deliver, verify, reduce, preserve |
| constraints | Kind of constraint | must, must_not, prefer, avoid, follow, no_restart, reload_allowed, safe_change |
| predictive_cue | Kind of next action | next, verify, generate, check, test, review, validate |
| uncertainty_signal | Kind of uncertainty | level, gap, assumption, pending, unverified |
| retrieved_artifacts | Kind of reference | doc, code, log, config, spec, guide, snippet |

## Management principles

| Principle | Description |
|---|---|
| One file per Task | Create exactly one CCS file per Task |
| New file per Step | Do not accumulate; always create the latest state fresh (replacement semantics) |
| No shared context | Task Agent and Step Agent do not share conversation context |
| CCS is the only bridge | The only handoff between Steps is the CCS |

## Size health

When a CCS starts to bloat, revisit Step design. CCS size is a **health indicator for Step design**.

| Symptom | Cause | Remedy |
|---|---|---|
| Too many focal_entities | The Step's scope is too broad | Split the Step |
| relational_map is tangled | Too many relationships in one pass | Narrow the scope |
| Lots of uncertainty_signal | Too much was left unresolved | Insert a Step whose job is to resolve it |

## Examples

### IT operations task

```
episodic_trace:
  observed(502 spikes after(enable(http2)))
  logged(nginx error upstream closed early)
  constraint(no restart during(business hours))

semantic_gist:
  mitigate(502) & diagnose(upstream instability)

focal_entities:
  host(vm ubuntu22 04)
  service(nginx)
  service(node upstream)
  feature(http2)
  signal(error 502)

relational_map:
  timing(502 spikes after(http2 enable))
  possible(upstream timeout 502)
  possible(upstream connection close 502)

goal_orientation:
  reduce(502 rate within(10min)) & preserve(service availability)

constraints:
  no_restart(nginx)
  reload_allowed(nginx)
  safe_change(minimal)
  avoid(speculation)

predictive_cue:
  check(upstream latency)
  check(node memory growth)
  validate(nginx timeouts)

uncertainty_signal:
  level(medium)
  gap(root cause not confirmed)

retrieved_artifacts:
  snippet(nginx error upstream prematurely closed)
  doc(recent change enable http2)
  doc(constraint note no restart)
```

### Development task

```
episodic_trace:
  completed(design review)
  received(approval from tech lead)
  failed(first test run due to missing mock)

semantic_gist:
  implement(user authentication module)

focal_entities:
  file(src/auth/login.ts)
  function(validateCredentials)
  function(generateToken)
  function(refreshToken)
  interface(UserCredentials)
  interface(AuthToken)

relational_map:
  calls(login -> validateCredentials)
  depends(validateCredentials -> bcrypt)
  implements(LoginService -> IAuthService)

goal_orientation:
  achieve(auth module implementation)
  ensure(test coverage 80%+)

constraints:
  must(use bcrypt for password hashing)
  must_not(store plain text password)
  follow(project coding standards)
  avoid(external api call in unit test)

predictive_cue:
  next(generate test cases for validateCredentials)
  verify(token expiry handling)

uncertainty_signal:
  level(low)
  gap(token expiry time not specified in design)

retrieved_artifacts:
  spec(auth-module-spec.md)
  guide(CODING_STANDARDS.md)
```

## Paper evaluation

The ACC paper reports the following results over a 50-turn multi-turn evaluation.

**Memory usage**

- Baseline (Transcript Replay): grows linearly with turn count
- Retrieval (Retrieval-based): stays flat, but drifts due to search errors
- ACC: stays flat and does not drift

**Task quality**

| Metric | Baseline | Retrieval | ACC |
|---|---|---|---|
| Relevance | Med | Med | High |
| Answer Quality | Med | Med | High |
| Instruction Following | Low | Med | High |
| Coherence | Low | Med | High |

**Hallucination / drift rate**

- Baseline: rises with turn count
- Retrieval: highly variable
- ACC: near zero and stable

## Related documents

- [architecture.md](architecture.md) — the Task/Context/Step/Action structure that produces and consumes CCS
- [traceability-chain.md](traceability-chain.md) — how to connect Chain elements (Goal / Approach / Delivery) into `goal_orientation` / `constraints` / `retrieved_artifacts`
- [aiya-jam.md](aiya-jam.md) — the package that stores and hands off CCS files

## Open questions

- [ ] Linkage between Chain elements and CCS (reference vs value copy)
- [ ] Physical location of CCS files
- [ ] CCS versioning (whether to keep the state before replacement)
- [ ] Extension policy for the type vocabulary

## References

- Bousetouane, F. (2026). *AI Agents Need Memory Control Over More Context*. arXiv:2601.11653v1
