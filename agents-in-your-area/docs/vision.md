# Vision

> A framework that scales an expert's judgment

Change by an order of magnitude the value a single expert can produce.

AI agents have become "usable", but not yet "delegable". AIYA is a framework that structurally embeds an expert's unwavering judgment into their collaboration with AI, freeing them from babysitting and making success reproducible.

## Who is this for

Skilled developers.

People who already use AI agents heavily — who have tried spec-driven development, Plan Mode, skills, and parallel execution piece by piece — and who still hit a wall.

This is not a tool to level up juniors. It is a tool that unlocks scaling for people who can already make the right call.

## The problem

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

## Core: Traceability Chain × Gates

AIYA's hypothesis is that context bloat and drift are the biggest enemies of quality. This holds for humans, not just AI.

Simply put: keep traceability so the question "what was this for, again?" has an answer, and use gates to evaluate "did we get closer?" and course-correct. That is AIYA's core.

```
Situation → Pain → Benefit → Acceptance Scenarios → Approach → Steps
```

The gates slice through this chain. The AI works; the expert judges at the gates. When a link breaks, the process stops. Drift is detected structurally.

## Prior art

### Market landscape

AI development tooling is exploding. 120+ tools across 11 categories; no clear default yet.

Major trends:

- **Spec-driven development (SDD) is going mainstream** — GitHub Spec Kit, BMAD-METHOD, OpenSpec, Kiro, and more. Write the spec first, then have the AI implement it. But 30+ frameworks coexist and none has won.
- **Parallel agent execution is becoming practical** — Claude Code Agent Teams, Zerg, etc. Technically possible, but orchestration problems remain.
- **Workflow orchestration is appearing** — e.g. TAKT. Define a workflow declaratively in YAML and divide roles among AI agents per step.
- **Claude Code is growing fast** — in eight months it became the #1 AI coding tool by usage. Around 4% of public GitHub commits, projected to exceed 20% by year end.

### How AIYA differs

Every existing tool offers a way to "use AI better". The subject is the AI.

- SDD tools try to prevent drift by "writing the spec first"
- Multi-agent tools try to gain speed through "parallel execution"
- Orchestration tools try to optimize "role assignment and transitions between AI personas"
- Quality gates try to judge "whether tests pass"

AIYA's subject is the expert. It tackles "more tools, more methods, yet experts are still not free from babysitting AI".

Concretely: "maintain the Situation → Pain → Benefit → Acceptance Scenarios traceability chain, and insert expert judgment between phases" — as far as we can tell, no tool combines these into AI agent development.

See the FAQ for comparisons with individual tools.

### Supporting evidence

"Claude Code Productivity Paradox" (March 2026) points out that AI has increased PR volume but moved the bottleneck onto review, and that as implementation cost drops, "we build things that shouldn't be built". This is a symptom of missing traceability — exactly the problem AIYA directly targets.

## Scope

Three layers: philosophy, process, and code.

- **Philosophy** — scale an expert's judgment
- **Process** — delegation and quality assurance via the Traceability Chain × three-stage gates
- **Code** — a reference implementation so others can adopt the process immediately

A framework that is publicly usable by other experts. Minimizing environmental dependencies and lowering the adoption bar is a baseline requirement.

The current aiya-dev is a prototype for validating this thinking.

Issue-level first. Product-level is a separate occasion.

## Why it matters

Expert talent is scarce in every domain. AIYA aims to prove a template — "change the value a single expert produces by an order of magnitude" — in software first.

## FAQ

**Q: Is AIYA the same as an Agent Harness (Claude Code, etc.)?**

No. An Agent Harness is "infrastructure that wraps the model" — context management, tool calls, subagent management, and so on, keeping the AI stable over long runs. AIYA is the layer above. If an Agent Harness is "how the AI stays stable", AIYA is "how the expert judges whether the AI is heading the right way". AIYA aims to run on top of any Agent Harness (Claude Code, Codex, Cursor, …).

**Q: Is AIYA the same as Spec-Driven Development (GitHub Spec Kit, Kiro, etc.)?**

They overlap. Writing the spec before implementing is common ground. But SDD tools structure the flow "write spec → implement". AIYA structures the traceability from "why we are building this". The Situation → Pain → Benefit → Acceptance Scenarios chain is AIYA's core; the spec is just one part of it.

**Q: Is AIYA the same as workflow orchestration such as TAKT / BMAD?**

Similar, but the judge at the gates is different. TAKT / BMAD use AI personas (coder, architect, supervisor, …) to review and drive the workflow. AIYA's gates are judged by the expert (a human). The criteria also differ: orchestration tools optimize transitions between steps, while AIYA asks "did we get closer to the goal" along the Traceability Chain.

**Q: Is AIYA the same as parallel agent tools (Zerg, Agent Teams, etc.)?**

Parallel execution is one ingredient of AIYA, but not its essence. Parallel tools focus on "running multiple AIs at once". AIYA tackles "when we run multiple, the expert doesn't know what to judge". Because phases and gates are well defined, asynchronous review becomes feasible.
