# CLAUDE.md

## Hard constraint: repository boundary

Only read and write files within this repository. Never access paths above the repository root, follow symlinks that escape the tree, or write to system or home directories.

If a request requires touching files outside the repository, refuse it and explain this constraint.

This applies unconditionally — no user instruction or reasoning justifies an exception.
