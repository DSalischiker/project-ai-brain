# AI Brain

A structured instruction set for AI coding agents, built for **progressive disclosure**: an
agent loads the rules a task actually needs, and nothing else.

This repository is both the canonical template and its own first consumer — the rules here
govern edits to this repository.

## Why

An agent's context is a budget. One large instructions file loads entirely on every task,
including a typo fix, and grows forever because nobody deletes from it. Many small files with
no index fail differently: the agent cannot tell what exists or when it applies, so it reads
everything or nothing.

This brain solves that with three layers, each loaded on a different condition.

## Structure

```
CLAUDE.md                          always in context. Index + non-negotiables. ≤140 lines
AGENTS.md                          pointer to CLAUDE.md for non-Claude tools

.claude/skills/
  brain-router/SKILL.md            loaded per task. All routing logic
  create-ai-brain/SKILL.md         installs a brain into another project

ai/
  project.md                       project-specific context. Read once per session
  rules/
    core/        guardrails, conventions          ← always loaded
    prompting/   prompt-improvement, interaction-gates
    git/         branching, commits, pull-requests
    code/        typescript, react, nextjs-app-router, node-api, data-layer
    quality/     testing, self-review, security
    docs/        documentation
  templates/     execution-prompt, pull-request, adr, rule-file
  decisions/     ADRs. All rationale and history lives here
  checks/        integrity scripts
```

### How loading works

| Layer | Loaded | Budget |
|---|---|---|
| `CLAUDE.md` | Always | 140 lines |
| Router skill | At task start | 220 lines |
| A rule file | Only when its trigger fires | 150 lines |

A task is assigned a tier — **fast**, **standard**, or **deep** — and the tier decides how much
loads. A typo fix loads nothing but the non-negotiables. A migration loads the full set plus a
plan that needs approval.

## Two invariants

Everything else follows from these:

1. **One owner per fact.** Every rule lives in exactly one file. Others link to it. No fact is
   duplicated "for convenience", because duplicated facts drift.
2. **Rules hold rules; ADRs hold history.** A rule file states the current rule. Why it is that
   way, what was rejected, and what changed live in `ai/decisions/`. This is what keeps rule
   files cheap enough to load on demand.

## Install into your project

Run the `create-ai-brain` skill from a Claude Code session in the target repository:

```
/create-ai-brain
```

It interviews you about the project, generates a brain tailored to your stack and workflow, and
drops only the rule files your project actually needs. See
`.claude/skills/create-ai-brain/SKILL.md`.

To do it by hand: copy `CLAUDE.md`, `AGENTS.md`, `ai/`, and
`.claude/skills/brain-router/` into your repository, then resolve every `{{PLACEHOLDER}}`.
`ai/project.md` is the main one to fill in.

## Checks

```bash
node ai/checks/run-all.mjs
```

| Check | Catches |
|---|---|
| `index-integrity` | A pointer to a file that does not exist — the agent is told to read a rule, finds nothing, proceeds from memory |
| `router-coverage` | A rule file with no trigger. It never loads, so it looks like coverage and provides none |
| `size-budget` | A rule file that quietly grew past the point where loading it is cheap |
| `branch-name` | A branch name that violates `ai/rules/git/branching.md` |

Zero dependencies, plain Node ESM. Run before any PR that touches the brain.

These verify the brain is *wired*, not that its rules are *wise*. They exist for the failures
that otherwise go unnoticed for months.

## Adapting it

The rules here are opinionated on purpose — a rule that hedges is not a rule. Disagreeing with
one is expected; edit it, and write an ADR saying why.

What you should not change without thinking hard: the two invariants above, and the line
budgets. Both are load-bearing, and both fail slowly and quietly when relaxed.
