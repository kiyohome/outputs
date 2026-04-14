# Design Process Rules

## Collapse overlapping modes or features
- When two modes/features share most of their logic, collapse them into one and expose the difference via a flag or argument. Do not carry structural duplication forward.

## Scrutinize names for intent alignment
- Verify that the verb in a mode/command name matches the user's intent (e.g., "Review" implies judgment, "Improve" implies transformation). Rename when misaligned.

## Start with the minimum number of modes
- Do not import mode counts from external designs without justification. Add modes only when the existing ones cannot absorb the use case.
