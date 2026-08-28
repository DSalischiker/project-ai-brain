# Changelog

Changes to the AI Brain template. Rationale is not here — it is in `ai/decisions/`.

## [0.1.0] — 2026-08-28

First version.

### Added

- `CLAUDE.md` — always-loaded index, non-negotiables, tier table, rule map.
- `AGENTS.md` — pointer for non-Claude tools.
- `.claude/skills/brain-router/` — task routing: tiers, classification, trigger tables,
  report format, pre-flight invariants.
- `ai/project.md` — per-project context template.
- **Rules** — `core/` (guardrails, conventions) · `prompting/` (prompt-improvement,
  interaction-gates) · `git/` (branching, commits, pull-requests) · `code/` (typescript,
  react, nextjs-app-router, node-api, data-layer) · `quality/` (testing, self-review,
  security) · `docs/` (documentation).
- **Templates** — execution-prompt, pull-request, adr, rule-file.
- **Checks** — index-integrity, router-coverage, size-budget, branch-name.
- **Decisions** — [0001](./ai/decisions/0001-brain-architecture.md) three-layer progressive
  disclosure · [0002](./ai/decisions/0002-tiered-routing.md) tiered routing.
