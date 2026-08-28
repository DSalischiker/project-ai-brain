# Testing

> Loaded when a change adds or alters behavior. A test's purpose is to fail when the behavior
> breaks — a test that cannot fail is worse than no test, because it buys false confidence and
> still costs maintenance.

---

## What to test

**Always:**
- Business logic and calculations, especially anything about money, dates, or permissions
- Every branch of a state machine or a discriminated union
- Boundary conditions: zero, one, many, empty, maximum, negative
- Error paths — what happens when the call fails, not just when it succeeds
- Bugs you fix. **Write the failing test first**, then fix it. That is the only proof the bug
  is actually gone and stays gone
- Authorisation: that the wrong user is denied, not only that the right user is allowed

**Do not test:**
- Framework behavior — that `useState` updates, that the router routes
- Third-party libraries
- Types the compiler already guarantees
- Trivial getters, pass-throughs, or constants
- Implementation details: internal function names, call counts, private state
- Exact markup or class names, unless the class *is* the contract

**Judgment call:** simple presentational components. Test them when they contain conditional
rendering worth stating; skip them when they only render props.

---

## Levels

| Level | Tests | Use for |
|---|---|---|
| **Unit** | One function or module, dependencies stubbed | Logic, calculations, transforms, edge cases |
| **Integration** | Several units together, real DB or a close fake | Handlers end-to-end, queries, data flow |
| **Component** | Rendered UI, user-facing interactions | Interactive components, forms, conditional states |
| **E2E** | The running app through a browser | A handful of critical journeys only |

Weight toward unit and integration. E2E tests are slow, flaky, and expensive to maintain —
cover the paths whose failure would be an incident (sign in, checkout, the core action of the
product) and stop there. An E2E suite nobody trusts gets skipped, and then it is pure cost.

---

## How to write one

**Test behavior through the public interface.** If a test needs access to internals, either the
API is wrong or the test is testing the wrong layer.

```
Arrange — the minimal setup this case needs
Act     — one action
Assert  — the observable outcome
```

- **One reason to fail per test.** Ten assertions about ten concerns is ten tests.
- **Name the case, not the function.** `rejects an order when stock is insufficient`, not
  `test createOrder 3`. The name should tell you what broke from the failure output alone.
- **Assert the outcome, not the mechanism.** That the order was rejected — not that
  `checkStock` was called twice.
- **No logic in tests.** No loops building assertions, no conditionals, no clever helpers. A
  test with a bug in it is undetectable.
- **Independent and order-agnostic.** No shared mutable state, no test that depends on another
  having run. Clean up what you create.
- **Deterministic.** Inject the clock, seed the randomness, never assert on real time or real
  network.

Query UI by what a user perceives — role, label, visible text. Not by test id unless nothing
else identifies the element, and not by class name.

---

## Mocking

Mock the minimum: things that are slow, external, non-deterministic, or that cost money.

Do **not** mock the thing you are testing, your own modules just to make a test easier, or so
much that the test only proves your mocks agree with each other. When a test needs five mocks,
the unit has too many dependencies — that is a design signal, not a mocking problem.

Prefer a real in-memory implementation over a mock when one is available. Prefer a test
database over mocking the repository.

---

## Coverage

Coverage measures which lines ran, not whether behavior is correct. A 100 %-covered function
with no assertions is fully covered and completely untested.

Use it to **find untested branches**, never as a target. Do not add a test to move a number.
If the project sets a threshold, meet it with real tests or say why a file is legitimately
uncovered.

---

## When a test fails

**Understand the failure before changing anything.** Then, in order of preference:

1. The test is right and the code is broken → fix the code.
2. The behavior intentionally changed → update the test, and say so in the PR body. An updated
   assertion is a behavior change and reviewers must see it.
3. The test is genuinely wrong → fix the test, and explain what it was asserting incorrectly.

**Never** delete a failing test, comment it out, skip it, add a retry, or loosen an assertion
to green the build. If a test must be skipped, it needs an issue reference and a reason in the
skip itself. A silently-skipped test is a lie in the CI output.

Flaky tests are bugs. Fix the flake or delete the test — never leave it retrying.

---

## Test files

Colocate: `order-service.test.ts` beside `order-service.ts`, unless the project puts them
elsewhere. Mirror the source structure either way.

No line limit — clarity beats brevity in tests. But repeated setup belongs in a factory or
builder, not copy-pasted, and a factory should let each test override just the field it cares
about.
