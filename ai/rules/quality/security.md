# Security & Secrets

> Loaded for auth, sessions, permissions, user input, uploads, env config, third-party calls,
> and dependency changes. Security defects differ from other bugs: they do not announce
> themselves, and the code works perfectly until it is exploited.

---

## Secrets

**Never in the repository.** Not in code, config, tests, fixtures, seeds, comments, commit
messages, or a commented-out line. Not "temporarily." Not in a branch you plan to rewrite.

- Read secrets from the environment, parsed once at startup with a schema
  (`code/node-api.md § Configuration`).
- **Client-exposed prefixes (`NEXT_PUBLIC_`, `VITE_`, `PUBLIC_`) are public.** Anything with
  that prefix ships to the browser and is readable by anyone. Only genuinely public values.
- Never log a secret, a token, a full request body, an `Authorization` header, or a session
  cookie.
- Keep `.env*` gitignored. Commit a `.env.example` with keys and empty values only.

**If you find a committed secret:** stop, tell the user immediately, and state that it must be
rotated — removing it from the code does not make it safe, because it is in git history and
possibly in logs and caches. Do not rewrite history or rotate credentials on your own
initiative.

---

## Authentication and authorisation

They are different, and conflating them is the most common serious bug in this area.

- **Authentication** — who is this? Verified server-side, from the session. **Never from a
  request body, a query param, a header the client controls, or a client-side check.**
- **Authorisation** — may *this* user do *this* to *this* resource? Checked per request, per
  resource. Having a role is not having permission to a specific row.

Rules:
- Every endpoint, server action, and route handler authenticates and authorises. There is no
  "internal" endpoint — if it is reachable, it is public.
- **A client-side check is UX, never a control.** Hiding a button does not protect the action
  behind it.
- Deny by default. A new route is protected unless explicitly made public.
- Check ownership on every read of a specific resource, not only on writes. Returning another
  tenant's record on a `GET` is a breach.
- **Return 404, not 403, for a resource the user should not know exists.** A 403 confirms it is
  there.
- Never trust an id from the client to identify the actor. Only to identify the target — and
  then authorise it.

---

## Input

Everything from outside is hostile until parsed: bodies, query and path params, headers,
cookies, webhooks, file contents, third-party responses, and anything from `localStorage`.

| Sink | Requirement |
|---|---|
| SQL | Parameterised queries or the ORM builder. **Never string concatenation** |
| HTML | Escape by default. `dangerouslySetInnerHTML` only on sanitised content |
| Shell | Avoid entirely. If unavoidable, pass an argument array, never a built string |
| File paths | Resolve and verify the result stays inside the intended directory |
| Redirect targets | Allow-list. Never redirect to a user-supplied absolute URL |
| Server-side fetch URLs | Allow-list the host — an open fetch is an SSRF into your own network |
| Template or expression evaluation | Never on user input |

Strip unknown keys when parsing. **Never spread a request body into a database write** — that
is how a user sets their own `role`, `is_admin`, or `balance`. Allow-list the writable fields
explicitly.

Validate size and type before processing: request bodies, arrays (a 100,000-element array is a
denial of service), pagination limits, and uploads.

---

## Data exposure

- **Select the fields you return.** Never send a whole DB row to a client — password hashes,
  internal flags, and other users' data leak that way.
- Serialise deliberately. A shared type between DB row and API response means every new column
  is automatically published.
- Error responses carry no stack trace, SQL, internal path, or upstream provider error.
- Never cache a per-user response in a shared cache. `code/nextjs-app-router.md § Caching` — this is
  the highest-severity mistake in that file.
- Log identifiers, not payloads. Never log personal data, tokens, or full bodies.

---

## Sessions and tokens

- Cookies: `httpOnly`, `secure`, `sameSite` set deliberately. Session tokens are never
  readable by JavaScript.
- Expire sessions. Rotate on privilege change. Invalidate server-side on sign-out.
- Verify token signature, expiry, issuer, and audience. **Never decode a JWT and trust the
  payload** without verifying the signature.
- State-changing form endpoints need CSRF protection unless the framework provides it — confirm
  which, do not assume.
- Rate-limit authentication, password reset, and anything that sends a message or costs money.
- Compare secrets and signatures with a constant-time comparison, never `===`.

---

## Dependencies

- Adding one is a decision, not an implementation detail. Say why in the PR: what it does, why
  hand-writing it is worse, how maintained it is.
- Prefer the platform. A 40-line utility beats a transitive dependency tree.
- Lockfile always committed. Never install without it.
- Never add a package to solve something the standard library does.
- Never disable integrity checking, certificate validation, or a security lint rule to make
  something build.

---

## Pre-PR checklist

Run when the diff touches anything in this file:

- [ ] No secret anywhere in the diff, including tests and fixtures
- [ ] Every new input parsed by a schema at the boundary
- [ ] Every new endpoint or action authenticates **and** authorises the specific resource
- [ ] No user value reaching SQL, shell, a file path, a redirect, or HTML unescaped
- [ ] No request body spread into a write
- [ ] Responses expose only intended fields
- [ ] No per-user data in a shared cache
- [ ] Errors leak no internals
- [ ] New dependency justified in the PR body
- [ ] Auth-adjacent changes have a test proving the **wrong** user is denied

---

## When you find a vulnerability

Report it plainly and immediately, with the concrete path from input to impact. Do not fix it
quietly inside an unrelated PR — the fix needs to be visible and reviewed on its own.

Do not write an exploit beyond the minimum needed to demonstrate that it is real.
