# Prompt Improvement

> Loaded when a request is vague, underspecified, self-contradictory, or when the user asks
> for help shaping a prompt or spec. Run this **before** routing — an unclear request routes
> to the wrong rules.

Your job here is not to make the request longer. It is to find the small number of unknowns
that would change what you build, and resolve only those.

---

## 1. Is improvement even needed?

Ask one question of yourself: **would two competent developers reading this request build
materially different things?**

- **No** → skip this file entirely. Route the task and get to work. Interrogating a clear
  request is its own failure mode; it wastes the user's turn and reads as stalling.
- **Yes** → continue.

"Fix the typo in the header" needs nothing. "Improve the dashboard" needs this whole file.

---

## 2. The seven gaps

Check the request against each. Most vague requests are missing exactly one or two — name
them rather than asking a generic "can you clarify?"

| Gap | The question it leaves open | Symptom in the request |
|---|---|---|
| **Outcome** | What is true after this that is not true now? | Names an activity ("refactor X") but no end state |
| **Scope** | Which files, screens, or flows are in — and which are out? | "the app", "everywhere", "all the forms" |
| **Trigger** | What made this necessary now? | No bug report, no user complaint, no deadline named |
| **Constraint** | What must not change? | Silent on backward compatibility, performance, existing API |
| **Shape** | Is there a preferred approach, or is that yours to pick? | Names a goal that has 3+ reasonable implementations |
| **Done** | How will we both know it worked? | No acceptance criteria, no way to verify |
| **Prior art** | Does something similar already exist here? | Asks for something the codebase may already do |

**Resolve gaps from the codebase before asking the user.** Prior art, existing constraints,
current behavior and file locations are usually discoverable. Asking the user a question you
could have answered by reading the repo is a waste of their turn.

Only unresolvable gaps — intent, priority, preference, business rules — become questions.

---

## 3. Ask well

Batch every remaining question into **one** interaction, never a sequence. Use structured
multiple-choice (`AskUserQuestion`) rather than open prose whenever the answer space is
discrete, which it usually is.

**A good question:**
- Offers 2–4 concrete options, each describing what would actually happen.
- Marks your recommendation and puts it first.
- Is answerable in one click by someone who has not read the code.
- Changes what you build depending on the answer.

**A bad question:**
- "Let me know if you have any preferences!" — no options, no decision.
- "Should I use approach A or B?" with no explanation of the trade-off.
- Asks about something conventional where a sensible default exists.
- Asks four questions when three have obvious answers.

**Cap: four questions.** If you have more than four, you have not tried hard enough to
resolve them yourself, or the task should be split.

**Never block on a question you can proceed past.** Do all the independent work, state your
assumption in one line, and flag it. Only a question whose wrong answer makes the work unsafe
or worthless justifies stopping with nothing delivered.

---

## 4. Restate before building

Once gaps are closed, restate the task in this shape. This is the contract, and it is what
the routing report and the PR are both checked against.

```
Goal:        [one sentence — the end state, not the activity]
In scope:    [enumerated files, areas, or behaviors]
Out of scope:[what a reasonable reader might assume is included, but isn't]
Constraints: [what must not change]
Done when:   [verifiable conditions — a command that passes, a behavior observable in the UI]
Assumptions: [each with what changes if it is wrong]
```

Rules for the restatement:
- **Shorter than the conversation that produced it.** If it is longer, you are padding.
- **No invented requirements.** Every line traces to something the user said or something you
  flagged as an assumption. Do not add "and also add loading states" because it seemed nice.
- **`Out of scope` is the most valuable line.** It is where scope creep is prevented and where
  the user most often catches a misunderstanding.
- **`Done when` must be checkable by someone else.** "Works correctly" is not a condition.

For a deep-tier task, this restatement feeds directly into
`ai/templates/execution-prompt.md`.

---

## 5. When the user asks you to write a prompt

Sometimes the ask is literally "help me write a prompt for this." Then the deliverable is the
prompt itself, and:

1. Run §2 and §3 as normal.
2. Produce the prompt from `ai/templates/execution-prompt.md`.
3. Hand it over **without executing it.** Drafting and executing are separate turns, and the
   approval gate sits between them — see `interaction-gates.md § Gate 2`.
4. Mark every unresolved placeholder as `{{TODO: ...}}`. Never quietly invent a value to make
   the template look complete; a plausible-looking fabricated constraint is worse than a
   visible hole.

---

## 6. When the request contradicts the codebase

If the request assumes something untrue — a file that does not exist, a library not
installed, a behavior that already works differently — say so in one or two sentences, state
what is actually there, and offer the nearest thing that is real.

Then keep going. Do not stop the task over a wrong premise you can work around; do not
silently build on the false premise either.

If the user reaffirms the request after you have raised the concern, that is their decision.
Acknowledge it once and build the full thing as specified.
