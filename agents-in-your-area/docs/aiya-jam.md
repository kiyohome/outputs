# aiya-jam

> Let's jam — orchestrator

The orchestrator package that puts Traceability Chain × Steering Gates and ACC into practice. aiya-jam ships as a Claude Code plugin installed into the project repository — slash commands, SKILL.md, and a docker-compose stack.

## Responsibilities

- **Chain authoring** — guides the expert through the 8 elements via hearing and commits them as files under `.aiya/<issue-number>/`
- **Steering Gate surface** — presents Planning Gates and Output Gates through Claude Code's slash commands
- **Runner** — the ACC Runner that drives the Turn sequence
- **Turn dispatch** — the delegation interface the Runner uses to invoke each Turn inside aiya-pit
- **CCS handoff** — stores and references CCS files between Turns
- **SKILL.md** — skill definitions that Claude Code loads

## Commands

Expert interaction is five slash commands plus two shell scripts. Commands follow conversational phrasing, not functional labels.

```
"Hi, I've got a new one"     →  /hi
"Go, 42, let's do this"      →  /go 42
"Ty, looks great!"           →  /ty
"Gm, one more thing..."      →  /gm
"Bb, see you later"          →  /bb
```

| Command | When | Action |
|---|---|---|
| `/hi` | Task start | Hear and file a new issue (title, facts, hypotheses) |
| `/go <N>` | After issue exists | Begin or resume work on issue N |
| `/ty` | At any gate | Approve — proceed to next phase |
| `/gm` | At any gate | Good, more — redirect with feedback via PR review comments |
| `/bb` | Anytime | Bye-bye — pause and save state |

Environment lifecycle (shell scripts, not slash commands):

| Script | Action |
|---|---|
| `.aiya/up.sh` | Start the sandbox (aiya-pit) and auditor (aiya-tape) stack |
| `.aiya/dn.sh` | Stop everything |

## Quickstart

**Setup (team lead, once per repo):**

```bash
cd my-project
curl -sSL https://get.aiya.dev | sh
git add .aiya && git commit -m "add AIYA" && git push
```

This generates `.aiya/up.sh`, `.aiya/dn.sh`, `docker-compose.yml`, and SKILL.md. Everything lives in the repository — team members get it on clone.

**Use (every team member):**

```bash
git clone <repo> && cd <repo>
.aiya/up.sh
```

`up.sh` starts aiya-tape and a pool of Claude Code instances inside aiya-pit.

**Start a task:**

```
/hi               ← hear and file a new issue
/go 42            ← start work on issue 42
```

**Answer a gate when it appears:**

```
/ty               ← approve — proceed to next phase
/gm               ← good, more — redirect with feedback
```

**Stop:**

```bash
.aiya/dn.sh
```

## Chain directory

Each issue gets a directory under `.aiya/`:

```
.aiya/<issue-number>/
  meta.yaml           # phase, status, last Turn number
  goal.md             # Plan + Situation + Pain + Benefit + Acceptance Scenarios
  approach.md         # Plan + Testing + Technology + Design
  delivery.md         # Steps + Verification
  ccs/
    t001.md
    t002.md
    ...
  research/           # Intermediate artifacts: investigation outputs, spikes
                      # Flat directory; naming convention distinguishes types
                      # e.g. research-auth-flow.md / spike-oauth.py
```

Each phase file (`goal.md`, `approach.md`, `delivery.md`) opens with a **Plan** section:

- The Planning Gate reviews the Plan section before execution begins
- The Output Gate (G1 / G2 / G3) reviews the full file after execution

**Pain vs Benefit writing discipline** (enforced via SKILL.md):
- **Pain** — an observable symptom the user experiences
- **Benefit** — the strategic impact when that symptom is gone; not the inverse of Pain

## Architecture

Open design decisions.

**Plugin shape**

- [ ] SKILL.md placement and loading
- [ ] SKILL.md granularity (per phase / per Turn kind)

**Workflow definitions**

- [ ] Definition language (YAML / TypeScript / plain Markdown)
- [ ] Parallel Turn handling

**Runner**

- [ ] Implementation form (Claude Code subagent / separate session / separate container)
- [ ] Where the Runner runs (outside aiya-pit / inside aiya-pit)

**Integration**

- [ ] Connection to [aiya-pit](aiya-pit.md) — how Turns are launched inside the sandbox
- [ ] Connection to [aiya-tape](aiya-tape.md) — whether CCS creation events are recorded

## Related documents

- [Traceability Chain × Steering Gates](tc-x-gates.md) — Chain definition and Steering Gates
- [ACC](acc.md) — Runner / Turn / CCS runtime
- [aiya-pit](aiya-pit.md) — execution environment
- [aiya-tape](aiya-tape.md) — auditor

## Open questions

See Architecture above. Each bullet under Architecture is tracked as an open decision until it is chosen and documented.
