# Conventions

> **Always loaded.** Cross-cutting conventions that apply to every file in every language.
> Language- and framework-specific rules live in `ai/rules/code/` and are loaded on trigger.

---

## Naming

| Thing | Convention | Example |
|---|---|---|
| Directories | `kebab-case` | `user-settings/` |
| Files (non-component) | `kebab-case` | `format-currency.ts` |
| React components | `PascalCase` file matching export | `UserCard.tsx` |
| Hooks | `use` prefix, `camelCase` file | `use-active-user.ts` |
| Types & interfaces | `PascalCase`, no `I` prefix | `UserProfile` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRIES` |
| Functions & variables | `camelCase` | `resolveUserRole` |
| Booleans | `is` / `has` / `can` / `should` prefix | `isLoading`, `canEdit` |
| Event handlers | `handle` for definitions, `on` for props | `handleSubmit`, `onSubmit` |
| Async functions | verb naming, no `Async` suffix | `fetchUser`, not `fetchUserAsync` |

Name for what a thing **is**, not how it is implemented. `activeUsers` not `filteredArray`.
Never abbreviate unless the abbreviation is more common than the word (`id`, `url`, `api`).

Forbidden as names, in whole or in part: `data`, `info`, `item`, `temp`, `obj`, `val`,
`stuff`, `helper`, `utils` (as a module holding unrelated things), `manager`, `handler` (as a
class name), `new`/`old` (as prefixes on real code), `v2`.

---

## File size

| Kind | Target | Hard ceiling |
|---|---|---|
| Rule file (`ai/rules/**`) | ≤ 150 lines | 200 — the checks fail above this |
| `CLAUDE.md` | ≤ 140 lines | 160 |
| Component | ≤ 200 lines | 300 |
| Module / service | ≤ 250 lines | 400 |
| Test file | no limit | — |

A file over its ceiling is a signal, not a crime. The correct response is to split along a
real seam — a distinct responsibility — not to slice it at line 200. If no seam exists, say
so and leave it.

Never split a file just to satisfy a number. Two files with a circular dependency are worse
than one long file.

---

## Comments

Comments explain **why**, never **what**. The code already says what.

**Write a comment when:** the reasoning is non-obvious, a workaround exists for an external
bug (link it), a constraint comes from outside the code (a vendor limit, a legal rule), or
an obvious-looking simplification is actually wrong.

**Do not write:** a comment restating the next line, a section banner (`// ---- helpers ----`),
a changelog (`// added 2026-08-28`, `// was: foo`), a TODO without an owner and a condition,
or commented-out code. Delete commented-out code — git remembers it.

Match the comment density of the surrounding file. A file with no comments does not want your
five.

---

## Edit workflow

1. **Read before writing.** Never edit a file you have not read in this session. Never
   pattern-match from a similar file elsewhere.
2. **Smallest correct diff.** Change the lines the task requires. Leave whitespace,
   formatting and import order alone unless they are the task.
3. **One concern per commit.** A refactor and a behavior change never share a commit, even
   when they touch the same lines. Split them, refactor first.
4. **Verify after editing**, per `guardrails.md § G8`.
5. **Never revert or discard the user's uncommitted work.** If a change conflicts with
   something in the working tree, stop and ask.

---

## Imports & module boundaries

- Order: external packages → internal aliases → relative → types → styles. One blank line
  between groups. If a formatter enforces an order, the formatter wins.
- Prefer the project's path alias over deep relative chains. `../../../lib/x` is a smell.
- **No barrel file re-exporting an entire directory.** They break tree-shaking and create
  import cycles. Export the specific thing from the specific file.
- No circular imports. If two modules need each other, a third thing is hiding between them.
- Import types with `import type` so they erase at build time.

---

## Error handling

- Never swallow an error. No empty `catch`, no `catch { return null }` without a comment
  explaining why null is the correct answer.
- Catch only what you can act on. Rethrow or let it propagate otherwise.
- Error messages state what failed and what the caller can do. Include the identifier that
  makes it findable; never include secrets, tokens, or full request bodies.
- Fail fast at boundaries, degrade gracefully in UI. A malformed API response should throw at
  the parse step, not render as `undefined` three components deep.

---

## Dead code

Delete it. Unused exports, unreachable branches, feature flags whose feature shipped,
abandoned experiments. Do not comment it out, do not rename it `_old`, do not keep it "just
in case". Git is the just-in-case.

Exception: code kept deliberately for an upcoming, already-approved change — which must carry
a comment naming that change.

---

## Copy & user-facing strings

- Sentence case for labels, buttons, headings, and menu items. Not Title Case.
- No em dash (`—`) in UI copy. Use a colon, a comma, or two sentences.
- Be specific in errors: what happened, and what the user can do next. Never "Something went
  wrong" alone.
- No placeholder copy in a PR. `Lorem ipsum` and `TODO: copy` do not ship.
- Never hardcode a string that already exists in a constants or i18n file.
