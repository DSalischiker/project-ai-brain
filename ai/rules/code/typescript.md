# TypeScript / JavaScript

> Loaded for any `.ts` `.tsx` `.js` `.jsx` file. Language-level rules only — React lives in
> `react.md`, framework specifics in `nextjs-app-router.md` and `node-api.md`.

---

## Typing discipline

**`any` is forbidden.** When you do not know a type:
- Unknown input from outside → `unknown`, then narrow with a type guard or a schema parse.
- Genuinely generic → a type parameter with a constraint.
- Third-party gap → declare the minimal shape you use, with a comment naming the package.
- Truly unavoidable → `// eslint-disable-next-line` with a one-line reason. If you cannot
  write the reason, it is avoidable.

**Never use `as` to silence an error.** A cast asserts you know better than the compiler; if
that is not literally true, the code is wrong. Legitimate uses: narrowing after a runtime check
the compiler cannot see, and `as const`. `as unknown as T` is always a bug.

**Non-null assertion `!` is forbidden** outside tests. Handle the null — the compiler flagged
it because it can happen.

Prefer inference for locals and returns. Annotate at boundaries: exported function signatures,
public types, and anything crossing a module or network edge. Over-annotating internals adds
noise the compiler already knows.

---

## Type design

- **`type` for unions, functions, mapped and utility types. `interface` for object shapes you
  expect to be extended or implemented.** Consistency inside a file matters more than the
  choice.
- **Make illegal states unrepresentable.** A discriminated union beats optional-field soup:

  ```ts
  // no — four states representable, two of them nonsense
  type Result = { loading: boolean; data?: User; error?: Error }

  // yes — exactly three states exist
  type Result =
    | { status: 'loading' }
    | { status: 'ok'; data: User }
    | { status: 'error'; error: Error }
  ```

- **Derive, do not duplicate.** `Pick`, `Omit`, `ReturnType`, `Awaited`, `keyof`, and
  `z.infer` keep types in sync with their source. A hand-copied shape drifts.
- **No enums.** Use `as const` objects or string literal unions — enums have runtime output and
  odd assignability. `const` enums break under `isolatedModules`.
- Name types for the domain concept, not the shape. `UserProfile`, not `UserObject`.
- Types used in more than one file live in a `types.ts` next to their domain, not in a global
  `types/` dump.

---

## Validate at the boundary

Anything entering the program from outside — HTTP body, query params, `localStorage`,
environment variables, webhook payload, third-party response, file contents — is `unknown`
until parsed by a schema (Zod or the project's equivalent).

```ts
const Body = z.object({ email: z.string().email(), age: z.number().int().min(0) })
const parsed = Body.safeParse(await request.json())
if (!parsed.success) return badRequest(parsed.error.flatten())
```

An interface asserting the shape of external data is a lie the compiler cannot catch. Parse
once at the edge, then trust the type inside. Do not re-validate in every function.

Environment variables get parsed once, at startup, in one module. Never read `process.env`
inline throughout the codebase.

---

## Functions

- Small and single-purpose. If you need "and" to describe it, split it.
- **Max 3 positional parameters.** Beyond that, take an options object — call sites become
  readable and the order stops mattering.
- **No boolean flag parameters.** `render(true)` is unreadable. Take an options object or split
  the function.
- Return early. Guard clauses over nested `if`.
- Pure where possible. A function that both computes and mutates is two functions.
- **No default exports** except where a framework requires them (Next.js pages, layouts, route
  handlers, config files). Named exports are refactorable and greppable.

---

## Async

- `async`/`await` throughout. No `.then()` chains, no mixing the two styles.
- **Never leave a promise unawaited** unless you deliberately fire-and-forget — and then
  attach a `.catch()`, or the rejection is unhandled.
- Independent awaits run in parallel:

  ```ts
  // no — sequential for no reason
  const user = await getUser(id)
  const orders = await getOrders(id)

  // yes
  const [user, orders] = await Promise.all([getUser(id), getOrders(id)])
  ```

- `Promise.all` rejects on the first failure. When you need every result regardless, use
  `Promise.allSettled` and handle each.
- **No `await` inside a loop** over independent items. Map to promises, then `Promise.all`. If
  the items are dependent, or you are rate-limited, keep the loop and comment why.
- Every external call gets a timeout. A hung fetch with no timeout hangs the request.

---

## Data handling

- Immutable by default: `map`, `filter`, `reduce`, spread. Never mutate a parameter, and never
  mutate an array you did not create (`sort` and `reverse` mutate — copy first).
- `const` unless reassignment is required. Never `var`.
- Optional chaining and `??` over manual guards. But `??` and `||` differ — `||` treats `0` and
  `''` as absent, which is a real bug source.
- `for...of` over `forEach` when you need `await`, `break`, or `continue`.
- Beware `Object.keys` losing types — use `as const` sources or a typed helper.

---

## Forbidden

`any` (per above) · `@ts-ignore` (use `@ts-expect-error` with a reason) · `eval` ·
`==` (always `===`, except `== null` to catch both null and undefined) · mutating module-level
state as a cache without an explanation · `delete` on an object in a hot path ·
`JSON.parse(JSON.stringify(x))` as a clone (use `structuredClone`) ·
`Array.prototype.includes` on a huge array in a loop (use a `Set`).
