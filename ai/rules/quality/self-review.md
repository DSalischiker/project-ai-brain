# Self-Review

> Loaded before every PR; mandatory on deep tier. Review **your own diff as a hostile
> reviewer** — someone looking for a reason to reject it.

Run this on the actual diff, not on your memory of what you wrote:

```
git diff {{INTEGRATION_BRANCH}}
```

Reading the diff rather than the files is the point. Half the findings below only appear in
diff form.

---

## 1. Scope

- [ ] Every changed file is required by the task. Any file you cannot justify in one sentence
      comes out.
- [ ] No drive-by fixes, renames, or reformatting.
- [ ] No new dependency that was not part of the plan.
- [ ] Diff size matches the task shape (`core/guardrails.md § G2`). If not, say why in the PR.
- [ ] Nothing in the diff would surprise the person who asked for this.

## 2. Leftovers

- [ ] No `console.log`, `print`, `debugger`, or temporary logging.
- [ ] No commented-out code.
- [ ] No `TODO` without an owner and a condition.
- [ ] No hardcoded test values, personal paths, local URLs, or your own email.
- [ ] No `.only` or `.skip` left on a test.
- [ ] No secrets, keys, tokens, or real data — in code, tests, fixtures, or commit messages.
- [ ] No file you created for scratch work still in the tree.

## 3. Correctness

- [ ] **Error paths exist.** Every `await` that can reject is handled or deliberately allowed
      to propagate.
- [ ] **Every state is rendered.** Loading, empty, error, partial, and unauthorised — not just
      the happy path. Empty and error are the two most commonly forgotten.
- [ ] Boundary values considered: zero, one, many, empty string, null, very long, negative.
- [ ] No off-by-one, no inverted condition, no `||` where `??` was meant.
- [ ] Async work cannot set state after unmount, and independent awaits are parallel.
- [ ] Nothing depends on ordering that is not guaranteed.

## 4. Blast radius

- [ ] Every caller of every changed signature has been found and updated.
- [ ] Every consumer of a changed data shape — API response, DB row, props, event payload —
      has been checked.
- [ ] No breaking change to something consumed outside this repo without explicit approval.
- [ ] No protected area touched without saying so (`core/guardrails.md § G6`).
- [ ] Nothing that was working now depends on something not yet deployed.

## 5. Security

Run the full checklist in `security.md § Pre-PR` when the diff touches auth, input, uploads,
env config, third-party calls, or dependencies. Minimum here:

- [ ] Every new input is validated at the boundary.
- [ ] Every new endpoint and server action authenticates **and** authorises the specific
      resource.
- [ ] No user-controlled value reaches SQL, a shell command, a file path, or HTML unescaped.

## 6. Rules

- [ ] Every rule the router loaded is actually followed. Re-read the ones you skimmed.
- [ ] Nothing in the diff was written from memory where a rule file governs it.
- [ ] Naming, file size, and comment policy match `core/conventions.md`.
- [ ] If you deviated from a rule, the PR body says so and why.

## 7. Verification

- [ ] Typecheck, lint, tests, and build run — with real output, not assumed.
- [ ] New behavior has a test; a fixed bug has a test that failed before the fix.
- [ ] You manually exercised the change where a test cannot cover it, and can say what you did.
- [ ] Nothing in your PR body claims a check you did not run.

## 8. The reviewer's view

- [ ] Reading only the PR body, a reviewer knows what changed, where, and what could break.
- [ ] Commits are individually coherent — no "fix previous commit" chains.
- [ ] Anything non-obvious has a comment explaining **why**, not what.
- [ ] Nothing here needs you present to be understood.

---

## Reporting findings

State what you found and fixed, in one or two lines. If the checklist was clean, say that — do
not manufacture findings to look thorough.

If you found something you are **not** fixing (out of scope, needs a decision), it goes in the
PR body as an explicit note. A finding you noticed and left silent is the worst outcome of this
checklist: you had the information and dropped it.

Do not paste the checklist itself into the PR.

---

## Honesty clause

This checklist only works if a box you did not verify stays unchecked. Ticking every line by
habit produces a clean report on a broken branch, and it destroys the value of every future
clean report. Unverified is unchecked.
