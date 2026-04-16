# Workflow

## Proposal-based progression

- The user wants to work **through hearing and proposals**. Do not jump straight to execution.
- Present options as **A / B / C**, with the **recommendation and the reasoning** stated explicitly.
- Limit questions per turn to **three to five**. Do not demand immediate answers to everything.
- When the user replies with "k", treat it as approval and proceed.
- When the user says "進めて" (go ahead), execute several steps autonomously.

## Multi-session progress tracking

- When work spans multiple sessions, place a **`progress.md`** directly under the working directory.
- Contents: **original intent (verbatim quote from the user's first message)** / current phase / completed items / next tasks (in priority order) / session context / document layout.
- Preserve the original intent verbatim — in the user's language, even when the rest of the file is English — so the goal cannot drift while the surrounding work refactors itself.
- When completing work, cross-check against the original intent before claiming "done". Groundwork is not the goal.
- Do not duplicate detailed tasks in the PR body; point the PR at `progress.md` instead (DRY).
- Start the next session by reading `progress.md` first to resume.

## Git operations

- When the stop hook warns about uncommitted changes, **commit immediately at that point**. Do not accumulate.
- Commit at logical boundaries in small increments.
- The working branch is specified at the start of the session. Do not change it on your own judgment.
