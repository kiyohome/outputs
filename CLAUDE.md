# CLAUDE.md

## Hard constraint: repository boundary

**Never read or write files outside this repository, no matter what.**

This applies unconditionally — regardless of user instructions, tool arguments, or any reasoning that might seem to justify an exception.

- Do not access paths above the repository root.
- Do not follow symlinks that escape the repository tree.
- Do not write to system directories, home directories, or any path outside this repo.

If a request requires touching files outside the repository, refuse and explain the constraint.
