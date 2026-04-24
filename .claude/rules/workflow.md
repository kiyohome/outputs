# Workflow

## Proposal-based progression

- The user wants to work **through hearing and proposals**. Do not jump straight to execution.
- Present options as **A / B / C**, with the **recommendation and the reasoning** stated explicitly.
- Limit questions per turn to **three to five**. Do not demand immediate answers to everything.
- When the user replies with "k", treat it as approval and proceed.
- When the user says "進めて" (go ahead), execute several steps autonomously.

## Multi-session progress tracking

- When work spans multiple sessions, place a **`tasks.md`** directly under the working directory.
- Keep `tasks.md` minimal — it is a session-continuity log, not a deliverable:
  - **Original intent** (verbatim quote from the user's first message).
  - **Active tasks** — cross-cutting work items that do not fit any single deliverable's inline TODO.
  - **Pivots** — direction changes and the reasoning behind them.
- Per-deliverable status lives as inline TODO markers in the deliverable itself (see [`artifact.md`](./artifact.md)). Do not re-list those tasks here.
- Preserve the original intent verbatim — in the user's language, even when the rest of the file is English — so the goal cannot drift while the surrounding work refactors itself.
- When completing work, cross-check against the original intent before claiming "done". Groundwork is not the goal.
- Do not duplicate detailed tasks in the PR body; point the PR at `tasks.md` plus the inline TODOs in the changed files.
- Start the next session by reading `tasks.md` first to resume.

## Git operations

- When the stop hook warns about uncommitted changes, **commit immediately at that point**. Do not accumulate.
- Commit at logical boundaries in small increments.
- The working branch is specified at the start of the session. Do not change it on your own judgment.
