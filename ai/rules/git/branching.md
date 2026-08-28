# Branching

> Loaded when creating a branch or deciding where work belongs. Single source of truth for
> branch names — never generate one from memory or copy the shape of an existing branch.

---

## Model

```
main                    protected. Production. Never a push, merge, or PR target.
{{INTEGRATION_BRANCH}}  default integration branch. Everything targets this.
<type>/<scope>-<desc>   short-lived work branches. One objective each.
```

`main` is written to only by a release process a human runs. If any action you are about to
take would push to, merge into, or target `main` — stop and ask. This includes `git push
origin main`, `gh pr create --base main`, and any merge whose target you did not verify.

---

## Format

```
<type>/<scope>-<description>
```

- lowercase only
- hyphens only — no underscores, spaces, dots, or slashes beyond the type separator
- English only
- 3–6 words total in the `<scope>-<description>` block
- `<scope>` names the area (feature, module, page); `<description>` names the intent

---

## Types

| Type | Use for |
|---|---|
| `feature/` | New user-visible behavior or capability |
| `fix/` | Correcting broken behavior |
| `hotfix/` | Urgent production fix |
| `refactor/` | Internal change, no behavior change |
| `perf/` | Performance work with no product change |
| `chore/` | Maintenance, config, dependencies, housekeeping |
| `docs/` | Documentation only |
| `test/` | Tests or coverage only |
| `build/` | Build, CI/CD, tooling, packaging |
| `data/` | Schema, migrations, seeds |
| `brain/` | Changes to `ai/**`, `.claude/**`, or `CLAUDE.md` |
| `release/` | Release preparation |

Choosing between them:
- Does a user notice? → `feature/` or `fix/`. Not `refactor/`.
- Behavior identical after the change? → `refactor/`. If you are unsure whether behavior
  changed, it is not a refactor.
- Urgent, on top of production? → `hotfix/`, and say why it cannot wait.
- Unclear → `chore/` for maintenance, `refactor/` for internal code.

---

## Validation

A name is valid only if it matches the format, uses an allowed type, is lowercase, uses only
hyphens, has 3–6 words in the scope block, and names both an area and an intent.

Rejected outright: `misc`, `stuff`, `changes`, `updates`, `wip`, `temp`, `test` (as a
description), `fixes`, `improvements`, `new`, a bare ticket number with no words, anything
that would read identically on a different task.

| Bad | Why | Good |
|---|---|---|
| `feature/updates` | No area, no intent | `feature/billing-invoice-export` |
| `fix/bug` | Names nothing | `fix/checkout-total-rounding` |
| `refactor/Dashboard_Cleanup` | Case, underscore, vague | `refactor/dashboard-data-mapping` |
| `feature/add-a-new-settings-page-for-users` | Too long | `feature/settings-user-profile-page` |
| `chore/JIRA-4821` | Ticket only | `chore/JIRA-4821-upgrade-eslint` (ticket + words is fine) |

Invalid name? Regenerate before creating. Do not create it and rename later — the remote and
any PR will already reference the bad name.

---

## Lifecycle

1. **Branch from a current `{{INTEGRATION_BRANCH}}`.** Pull first. Branching from a stale base
   produces a diff full of other people's changes.
2. **One objective per branch.** The objective is fixed at creation.
3. **Stay on it.** No switching branches mid-task, no second branch, no committing to a branch
   you did not create for this work.
4. **End at a PR** targeting `{{INTEGRATION_BRANCH}}`, in review state. See
   `pull-requests.md`.
5. **You do not merge or delete.** Both require explicit approval —
   `prompting/interaction-gates.md § Gate 3`.

### Reusing an existing branch

Only when **all** of these hold: it is not `main` or `{{INTEGRATION_BRANCH}}`; it is not
merged or abandoned; its PR is not approved-and-awaiting-merge; and the new work belongs to
the **same objective**.

Any failure → create a new branch instead. Reusing a branch for adjacent work is how one PR
becomes unreviewable, and it is more common than it sounds: "just one more small thing" is
almost always a new objective.

---

## Rebase and force-push

- Prefer merging `{{INTEGRATION_BRANCH}}` into your branch to resolve conflicts. It is
  recoverable and the history is honest.
- Rebase only on a branch nobody else has pulled.
- **Never force-push without explicit approval in the current turn.** Not `--force`, not
  `--force-with-lease`. If you believe a force-push is required, explain why and ask.
- Never rewrite a commit that exists on `{{INTEGRATION_BRANCH}}` or `main`.
