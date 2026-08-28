# Commits

> Loaded whenever you write a commit message. A commit is a unit of review, not a save point.

---

## Format — Conventional Commits

```
<type>(<scope>): <subject>

<body — optional>

<footer — optional>
```

**Subject line:**
- imperative mood — "add", not "added" or "adds"
- lowercase after the colon, no trailing period
- ≤ 72 characters
- states the change, not the file — `fix(auth): reject expired refresh tokens`, not
  `fix(auth): update auth-service.ts`

**Types:** `feat` `fix` `refactor` `perf` `test` `docs` `chore` `build` `ci` `style` `revert`

Types map to branch types, with two differences: a `feature/` branch produces `feat` commits,
and one branch may legitimately produce commits of several types (a `feat` plus the `test`
that covers it).

**Scope** is the area, lowercase, one word or hyphenated: `auth`, `billing`, `user-settings`,
`api`, `db`, `brain`. Omit it only when the change is genuinely global.

**Breaking changes:** `feat(api)!: ...` plus a `BREAKING CHANGE:` footer explaining what
breaks and what callers must do.

---

## Body

Include one when the *why* is not obvious from the subject. Wrap at 72 characters.

The body answers: why was this necessary, and what did you choose not to do? It does not
restate the diff — the reviewer can read the diff.

```
fix(checkout): round line totals before summing

Summing floats then rounding produced a one-cent discrepancy against
the payment provider on carts with 3+ items. Rounding per line matches
the provider's own calculation.

Refs #482
```

Skip the body for genuinely self-evident changes. A mandatory body produces filler.

---

## Granularity

One concern per commit. A commit should be revertable alone without breaking the build.

**Split these apart:**
- A refactor and a behavior change, even in the same lines. Refactor first, in its own commit.
- A dependency upgrade and the code changes it forced.
- Formatting and logic. Never mix them — formatting hides logic in the diff.
- Two unrelated fixes that happened to be found together.

**Keep together:** a change and the test that covers it; a rename and every call site; a type
change and the code it type-checks against. Splitting these produces commits that do not
build.

---

## Never commit

- Secrets, keys, tokens, `.env` files, credentials, private URLs
- `node_modules`, build output, `.DS_Store`, editor config not shared by the team
- Commented-out code, debug statements, `console.log` left from development
- Generated files that a build step produces, unless the project deliberately commits them
  (lockfiles, and any generated artifact `ai/project.md` names)
- Large binaries without checking whether the project uses LFS
- A merge commit you created accidentally by pulling without `--rebase` on a clean branch

Before committing, review what you staged. `git add .` after a long session stages things you
did not intend — check `git status` and `git diff --staged`, every time.

---

## Bad messages

| Bad | Why |
|---|---|
| `update` / `fix` / `changes` / `wip` | Says nothing |
| `fix bug` | Which bug |
| `address PR feedback` | Which feedback; the PR may outlive the reference |
| `refactor UserService` | What about it, and why |
| `final version` / `it works now` | Not a description of a change |
| `feat: add stuff for the new thing` | Vague scope, vague subject |
| A message describing the file changed rather than the behavior changed | Reviewers care about behavior |

If you cannot write a specific subject line, the commit probably contains more than one
concern. Split it — the message gets easy once each commit does one thing.

---

## Attribution

Follow the project's convention in `ai/project.md § Git`. If the project requires a
co-author trailer for agent-authored commits, it is stated there; do not add one otherwise.

Never claim a human author for work you did.

---

## Amending

- Amend only your own most recent commit, only if unpushed.
- Never amend a pushed commit without approval — it requires a force-push, which
  `branching.md § Rebase and force-push` gates.
- Prefer a new commit. Ugly-but-honest history beats a rewrite that loses someone's work.
