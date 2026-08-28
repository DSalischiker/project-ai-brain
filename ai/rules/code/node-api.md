# Node / API

> Loaded for backend routes, services, request validation, and error shapes. Framework-agnostic
> — applies to route handlers, Express, Fastify, Hono, or Nest. Assumes `typescript.md`.

---

## Layering

```
handler   →  HTTP only: parse, validate, authorise, call, shape response
service   →  business logic. Knows nothing about HTTP
repository→  data access. Knows nothing about business rules
```

Each layer talks only to the one below it. Consequences:

- **A handler contains no business logic.** If it has an `if` about domain rules, that belongs
  in the service.
- **A service never sees a request or response object**, never reads a header, never sets a
  status code. It takes typed arguments and returns typed values or throws domain errors.
- **A repository never contains business rules.** No "only return active users unless admin" —
  that is a service decision.
- Skipping a layer is allowed when it would be pure pass-through, but say so. Do not build a
  repository that only wraps one query.

This layering is what makes the logic testable without HTTP and reusable from a server action,
a cron job, or a CLI.

---

## Every handler, in order

```ts
export async function POST(request: Request) {
  const session = await getSession()                    // 1. authenticate
  if (!session) return unauthorized()

  const input = CreateOrder.safeParse(await request.json())  // 2. validate
  if (!input.success) return badRequest(input.error.flatten())

  if (!can(session.user, 'order:create')) return forbidden() // 3. authorise

  try {
    const order = await orders.create(session.user.id, input.data)  // 4. delegate
    return Response.json(order, { status: 201 })                    // 5. shape
  } catch (e) {
    return handleError(e)                                           // 6. map errors
  }
}
```

**Authenticate before validate before authorise.** Never derive identity from the request
body — a `userId` in the payload is a claim, not a fact. Authorisation checks the *specific
resource*, not just a role: "is an editor" is not "may edit this document."

---

## Validation

Every input is parsed by a schema at the boundary: body, query params, path params, headers you
depend on, and webhook payloads. `typescript.md § Validate at the boundary`.

- Parse, do not just check. The parsed value is the typed one you use downstream.
- Strip unknown keys. Never spread a request body into a DB write — that is how a user sets
  their own `role`.
- Validate at the edge only. Re-validating in every service function is noise.
- Reject with 400 and a field-level error shape the client can render.

---

## Responses

One consistent shape across the API. Pick it once, put it in `ai/project.md`, never vary it.

| Status | When |
|---|---|
| 200 / 201 / 204 | Success / created / success with no body |
| 400 | Malformed or failed validation |
| 401 | Not authenticated |
| 403 | Authenticated, not permitted |
| 404 | Not found — **also** use for a resource the user may not know exists |
| 409 | Conflict: duplicate, version mismatch |
| 422 | Semantically invalid but well-formed, if the project distinguishes it from 400 |
| 429 | Rate limited. Include `Retry-After` |
| 500 | Unexpected. Never for an expected failure |

**Never return 200 with an error in the body.** Clients, caches, and monitoring all read the
status code.

Error responses carry a stable machine-readable `code`, a human-safe `message`, and field
errors where relevant. They never carry a stack trace, SQL, an internal path, or an upstream
provider's raw error.

---

## Errors

- Define domain error types (`NotFoundError`, `ConflictError`, `PermissionError`) in the
  service layer. One mapper turns them into HTTP at the edge.
- Log the full error server-side with a correlation id; return the safe version to the client.
  The id in the response is how you tie a user report to a log line.
- Never swallow. Never `catch { return null }` without a comment saying why null is correct.
- Distinguish expected failures (validation, not found, conflict) from bugs. Expected failures
  are not 500s and should not page anyone.

---

## Side effects and idempotency

- A `GET` never mutates. Ever.
- `PUT` and `DELETE` are idempotent — calling twice equals calling once.
- `POST` that creates should accept an idempotency key when a duplicate would cost the user
  money or send a duplicate message.
- **Never let a failed side effect leave inconsistent state.** Write to the DB in a
  transaction; send the email after it commits, not inside it.
- Long work goes to a queue or background job, not into the request. State the timeout budget.
- Retry only idempotent operations, with backoff and a cap.

---

## External calls

- Always a timeout. Always. A hung upstream call becomes your outage.
- Wrap third-party clients in a thin adapter so the vendor's shape does not leak through your
  services.
- Parse third-party responses with a schema. Their contract can change without telling you.
- Handle the degraded case explicitly: what does your endpoint return when the upstream is
  down? Decide it, do not discover it in production.
- Never log a request or response body containing credentials or personal data.

---

## Configuration

- Parse the environment once, at startup, in one module, with a schema. Fail loudly on a
  missing required variable — at boot, not at the first request that needs it.
- Import from that module. Never read `process.env` inline elsewhere.
- No secrets in code, fixtures, or logs. No secret in a client-exposed variable.
- Config differences between environments are values, never `if (isProd)` branches around
  logic.

---

## Forbidden

Business logic in a handler · trusting a client-supplied identity · spreading a request body
into a write · an external call with no timeout · returning 200 on failure · a stack trace or
SQL in a response · `console.log` as production logging where a logger exists · a service that
imports the HTTP framework · in-memory state used as a cache across requests in a serverless
runtime (instances are shared and recycled — it will be both stale and inconsistent).
