---
description: Hear and file a new issue (situation, pain, benefit, hypotheses)
---

# /hi — Hear and file a new issue

**Goal**: Turn a raw user description into a filed GitHub issue with a clear title and initial goal context (situation, pain, benefit, hypotheses).

**End state**: A GitHub issue exists. The user knows its number and can reference it with `/go <N>`.

## Steps

### 1. Read the description

Take `$ARGUMENTS` as the user's initial description. Do not assume anything not stated in it.

### 2. Clarify if needed

If any of the following is missing or ambiguous, ask — one question at a time, maximum 3 total:

- **Situation**: What is the user doing when this occurs?
- **Pain**: What observable symptom do they experience? (Not a wish — a symptom.)
- **Benefit**: What changes strategically when the symptom is gone? (Not the inverse of Pain — the downstream consequence.)

If enough context exists for all three, skip to step 3.

### 3. Draft the issue

Write:

- **Title** — one line, action-oriented, ≤ 72 characters
- **Situation** — one paragraph; what the user is doing when the problem arises
- **Pain** — one paragraph; the observable symptom
- **Benefit** — one paragraph; the strategic impact when the symptom is gone
- **Hypotheses** — bullet list of initial ideas (omit the section entirely if none were mentioned)

Pain and Benefit must be distinct. "Can do X" as Benefit when Pain is "cannot do X" is the inverse, not a consequence — rewrite it.

### 4. File the issue

```
gh issue create --title "<title>" --body "<body>"
```

### 5. Confirm

Report in one line: `Filed as issue #N.`
