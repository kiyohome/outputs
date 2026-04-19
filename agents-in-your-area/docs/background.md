# Background

> Strategic context: prior art, scope, and FAQ

This document is the strategic backdrop for AIYA. The everyday "why / who / what you get" framing lives at the top of the [README](../README.md) so that it stays visible at the entry point. This file focuses on how AIYA sits in the wider landscape and what it does (and does not) try to be.

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

Concretely: "maintain the Situation → Pain → Benefit → Success Scenarios traceability chain, and insert expert judgment between phases" — as far as we can tell, no tool combines these into AI agent development.

See the FAQ below for comparisons with individual tools.

### Supporting evidence

"Claude Code Productivity Paradox" (March 2026) points out that AI has increased PR volume but moved the bottleneck onto review, and that as implementation cost drops, "we build things that shouldn't be built". This is a symptom of missing traceability — exactly the problem AIYA directly targets.

## Scope

Three layers: philosophy, process, and code.

- **Philosophy** — scale an expert's judgment
- **Process** — delegation and quality assurance via Traceability Chain × Steering Gates
- **Code** — a reference implementation so others can adopt the process immediately

AIYA focuses on the process layer. It does not build a UI layer. The CLI is the engine; existing chat infrastructure (Slack, Claude Code Channels, and similar) serves as both dashboard and remote control. The industry is already investing in UI layers, so AIYA sits on top as the process layer.

A framework that is publicly usable by other experts. Minimizing environmental dependencies and lowering the adoption bar is a baseline requirement.

The current aiya-dev is a prototype for validating this thinking.

Issue-level first. Product-level is a separate occasion.

## Why it matters

Expert talent is scarce in every domain. AIYA aims to prove a template — "change the value a single expert produces by an order of magnitude" — in software first.

## FAQ

**Q: Is AIYA the same as an Agent Harness (Claude Code, etc.)?**

No. An Agent Harness is "infrastructure that wraps the model" — context management, tool calls, subagent management, and so on, keeping the AI stable over long runs. AIYA is the layer above. If an Agent Harness is "how the AI stays stable", AIYA is "how the expert judges whether the AI is heading the right way". AIYA aims to run on top of any Agent Harness (Claude Code, Codex, Cursor, …).

**Q: Is AIYA the same as Spec-Driven Development (GitHub Spec Kit, Kiro, etc.)?**

They overlap. Writing the spec before implementing is common ground. But SDD tools structure the flow "write spec → implement". AIYA structures the traceability from "why we are building this". The Situation → Pain → Benefit → Success Scenarios chain is AIYA's core; the spec is just one part of it.

**Q: Is AIYA the same as workflow orchestration such as TAKT / BMAD?**

Similar, but the judge at the gates is different. TAKT / BMAD use AI personas (coder, architect, supervisor, …) to review and drive the workflow. AIYA's gates are judged by the expert (a human). The criteria also differ: orchestration tools optimize transitions between steps, while AIYA asks "did we get closer to the goal" along the Traceability Chain.

**Q: Is AIYA the same as parallel agent tools (Zerg, Agent Teams, etc.)?**

Parallel execution is one ingredient of AIYA, but not its essence. Parallel tools focus on "running multiple AIs at once". AIYA tackles "when we run multiple, the expert doesn't know what to judge". Because phases and gates are well defined, asynchronous review becomes feasible.

## Related documents

- [README](../README.md) — entry point and the always-conscious framing (who / problem / what you get)
- [Traceability Chain × Steering Gates](tc-x-gates.md) — the chain and Steering Gates referenced above
- [ACC](acc.md) — the runtime that executes Delivery Steps
