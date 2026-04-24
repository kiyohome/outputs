# smith

> smith is a craftsperson tool for Claude Code setups: it inspects files, drafts improvements, applies them after approval, and verifies the result.

**Status**: design-documentation stage. The plugin itself is not yet implemented; this repository holds the specification that the implementation at `agents-in-your-area/.claude/plugins/smith/` will follow.

## What smith does

<!-- identity, loop, two-layer model, target scope, dogfooding, defaults -->

## Usage

### Invocation

<!-- /smith [<scope>] syntax; scope forms; dry-run default -->

### Pipeline

<!-- mermaid diagram + narrative for the 10 steps -->

### Exception flows

<!-- target unidentifiable / all rejected / self-inspection / write error / loop cap -->

## Architecture

### Components

<!-- table: /smith, 3 inspectors, smith-knowhow skill, 3 scripts -->

### Key decisions

<!-- Opus for inspectors; inspector combines inspect+draft+patch; scripts for deterministic steps; 3 parallel lenses; architecture lens singleton; /smith = inherit; no auto-rollback -->

### `smith-knowhow` layout

<!-- tree -->

## References

<!-- docs/design.md; docs/concepts|components|patterns|case-studies|checklists|taxonomy; progress.md -->

## TODO

<!-- test strategy; dogfooding targets; [auto] channel separation -->
