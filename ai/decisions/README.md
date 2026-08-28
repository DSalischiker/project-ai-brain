# Decisions

Architecture Decision Records. One file per decision, numbered sequentially:
`NNNN-short-title.md`.

**This directory exists so rule files do not have to carry their own history.** A rule states
the current rule; the reasoning, the alternatives, and the record of having changed course live
here. That split is what keeps rule files cheap to load — an agent reading
`ai/rules/code/react.md` should not pay tokens for why a convention changed in March.

Rules for writing them: `ai/rules/docs/documentation.md § ADRs`.
Template: `ai/templates/adr.md`.

An ADR is immutable once merged. A decision that changes gets a new ADR that supersedes the
old one, with both linked in each direction.

## Index

| # | Decision | Status |
|---|---|---|
| [0001](./0001-brain-architecture.md) | Three-layer progressive disclosure for agent instructions | Accepted |
| [0002](./0002-tiered-routing.md) | Tier tasks fast / standard / deep instead of routing everything fully | Accepted |
