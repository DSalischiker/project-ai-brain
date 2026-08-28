# Data Layer

> Loaded for schema, migrations, queries, Supabase, RLS, and seed data. **Any schema change is
> deep tier** — data is the one thing you cannot roll back with a revert.

---

## Schema

- Name tables for the entity, plural, `snake_case`: `users`, `order_items`.
- Columns `snake_case`. Timestamps `created_at` / `updated_at`, always timezone-aware.
- Every table has a primary key. Prefer UUID when ids are ever exposed to a client —
  sequential integers leak volume and invite enumeration.
- **Constraints in the database, not only in application code.** `NOT NULL`, `UNIQUE`, foreign
  keys, and `CHECK` constraints are the only guarantees that survive a bad migration, a second
  service, or a manual query.
- Choose the `ON DELETE` behavior deliberately for every foreign key: `CASCADE`, `RESTRICT`, or
  `SET NULL`. The default is rarely what you want.
- Store money as integer minor units or `NUMERIC`. Never a float.
- Store enums as text with a `CHECK` constraint, or a native enum if the project already does.
  Do not store them as integers — nobody can read the table.
- Nullable means "genuinely optional." Do not use `NULL` for "unknown yet" when a status column
  is the honest model.

---

## Indexes

Index every foreign key, every column you filter or sort by in a real query, and the leading
columns of composite lookups (order matters — `(tenant_id, created_at)` serves a filter on
`tenant_id` alone, the reverse does not).

Do not index everything. Each index costs write throughput and storage. Add one when a query
needs it, and say which query in the migration comment.

---

## Migrations

1. **Forward-only, immutable.** Never edit an applied migration. Fix it with a new one.
2. **Reversible or explicitly not.** Write the down migration, or state in the file why it
   cannot be reversed.
3. **One concern per migration.** A rename and a new table are two migrations.
4. **Destructive operations need explicit approval in the current turn.** Dropping a column or
   table, deleting rows, changing a type in a way that loses precision.
5. **Expand, migrate, contract** for anything with live traffic:
   - add the new nullable column
   - backfill in batches, then start writing both
   - switch reads
   - only later, in a separate release, drop the old column
6. **A new `NOT NULL` column needs a default or a backfill** — otherwise the migration fails on
   a non-empty table.
7. **Never lock a large table** with an unqualified `ALTER` in a transaction during traffic.
   Batch it.
8. Test on a copy with realistic volume. A migration that runs in 40 ms on an empty dev DB can
   take an hour in production.

---

## Queries

- **Query in the repository layer.** No SQL and no ORM calls in a handler, a component, or a
  service. `node-api.md § Layering`.
- **Select the columns you need.** `SELECT *` breaks when a column is added and ships data you
  do not use.
- **Never build SQL by string concatenation.** Parameterised queries or the ORM's builder,
  always — including in a "safe, internal-only" script.
- **No N+1.** Fetch related rows in one query with a join or a batched `IN`. A query inside a
  loop over results is the single most common performance bug here.
- Paginate every list endpoint. Always a limit, even when today's table has 12 rows. Prefer
  cursor pagination for large or live-updating sets.
- Filter and aggregate in the database, not in application code. `WHERE` beats fetching
  everything and calling `.filter()`.
- **Wrap multi-write operations in a transaction.** Two writes that must both succeed and are
  not in one transaction will, eventually, half-fail.
- Do not do anything slow inside a transaction — no HTTP calls, no email sending. Commit first.

---

## Supabase

Everything above applies. Additionally:

**Row Level Security is the authorisation boundary, not a nice-to-have.**

- **Enable RLS on every table.** A table without RLS and with the anon key is a public table.
  This is the most common Supabase incident and it is silent — everything works, and everything
  is readable.
- Write an explicit policy per operation (`select`, `insert`, `update`, `delete`). A permissive
  `using (true)` policy needs a written justification.
- **Test policies as an unauthenticated user and as a different user**, not only as yourself.
  A policy that passes for its author proves nothing.
- `auth.uid()` inside the policy is the trustworthy identity. A user id from the client is not.

**Keys:**
- The `anon` key is public and belongs in the browser. It is safe *only* because RLS constrains
  it.
- The **`service_role` key bypasses RLS entirely.** Server-side only, never in a
  client-exposed environment variable, never in a component that could become a client
  component. Treat any exposure as a full data breach requiring rotation.
- When using the service role, you have opted out of RLS — so the code must do the
  authorisation check itself, explicitly.

**Client instances:** create the server client per request (it carries the user's session);
never share one server client across requests. Follow the SSR pattern for the project's
framework rather than improvising cookie handling.

Prefer database functions or triggers over application code for invariants that must hold no
matter who writes. Prefer generated types from the schema over hand-written row types.

---

## Seeds and fixtures

- Deterministic and idempotent — running twice produces the same state.
- Realistic edge cases: empty strings, very long values, unicode, nulls where allowed.
- **Never real user data.** Not anonymised production data either, unless the project has a
  documented process for it.
- No real credentials, even for test accounts that "only exist locally."

---

## Forbidden

A table without RLS in Supabase · `service_role` key anywhere reachable by a browser · string-
concatenated SQL · `SELECT *` in application code · a query in a loop · an unpaginated list
endpoint · editing an applied migration · a destructive migration without approval in the
current turn · multi-write logic outside a transaction · HTTP calls inside a transaction ·
`NULL` used to encode a business state that deserves a column.
