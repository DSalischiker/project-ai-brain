# Pull Requests

> Loaded when opening, filling, or updating a PR. The PR is the deliverable — it is where a
> reviewer decides, and it must let them decide without reading every line.

---

## Preconditions

Do not open a PR until all of these hold:

1. Target is `{{INTEGRATION_BRANCH}}`. Never `main`.
2. Verification per `core/guardrails.md § G8` has been run, with real output.
3. Self-review per `quality/self-review.md` has been run.
4. Every commit follows `commits.md`.
5. The branch contains only work for its stated objective.

Then open it in **review** state, never merged. Merge is a separate, user-approved step —
`prompting/interaction-gates.md § Gate 3`.

---

## Title

Same shape as a commit subject: `<type>(<scope>): <subject>`, imperative, ≤ 72 chars.

It describes the whole branch, not the last commit. If no single subject covers the branch,
the branch does too much.

---

## Body

Use `ai/templates/pull-request.md`. Every section is filled from **real data**, gathered
before you write:

```
git diff {{INTEGRATION_BRANCH}} --stat        # scale
git diff {{INTEGRATION_BRANCH}} --name-only   # what actually changed
git log {{INTEGRATION_BRANCH}}..HEAD --oneline
```

Plus the task's stated goal and scope, and the actual output of your verification commands.

### Non-negotiable

- **No placeholders.** No `TODO`, no leftover template comments, no unfilled `{{...}}`.
- **No fabricated verification.** Only list a check you ran. If you did not run the e2e suite,
  it is not in the list — write "not run" and why.
- **File list derived from the diff**, not from memory of what you intended to change. These
  differ more often than you would expect, and the difference is usually the interesting part.
- **No vague verbs alone.** "Improves", "enhances", "updates", "optimizes" — each must be
  followed by what specifically changed and how it is measurable.

### Review summary

Three to five lines at the top, written **last**, because it compresses the finished body.

It must let a reviewer decide whether to look closer, answering: what changed, where, what
could break, and what was verified. No jargon a reviewer outside the feature would not know.

---

## Risk

State a level and justify it from the changed paths, highest-wins:

| Level | Paths / conditions |
|---|---|
| **High** | Auth, permissions, payments, applied migrations, deploy config, anything with data-loss potential, breaking API change |
| **Medium** | Shared components with 3+ consumers, API response shapes, state management, new dependency |
| **Low** | Feature-local code, copy, styling, tests, docs |

Derive it from paths, not from how confident you feel. A one-line change in an auth guard is
High. Say what specifically could break, and what you checked to show it did not.

---

## Size

| Diff | Action |
|---|---|
| < 400 lines changed | Fine |
| 400–800 | Note why in the body |
| > 800 | Explain why it cannot be split, or split it |

Excluded from the count: lockfiles, generated files, and mechanical renames — but say so.

Large PRs are not forbidden; unexplained large PRs are. A reviewer facing 2,000 unexplained
lines approves without reading, which is worse than no review.

---

## Reviewer comments

- Address every comment, or reply saying why not. Never silently skip one.
- Push a new commit; do not amend and force-push over review history.
- Disagreeing is fine — state the reason once, concretely. If the reviewer holds their
  position, implement their version; it is their call.
- Never resolve someone else's comment thread.

---

## Updating an open PR

When you push more commits, update the body to match. A PR body describing an earlier state of
the branch is worse than no body — the reviewer trusts it and reviews the wrong thing.

Re-run verification. Re-check the risk level: added paths can raise it.

---

## Drafts

Open a draft when you want early feedback on direction, or when work depends on something
unfinished. Say what feedback you want. Mark it ready only when every precondition above
holds.
