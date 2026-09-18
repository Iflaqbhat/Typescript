# Why TypeScript at all? (If JavaScript already works...)

JavaScript runs everywhere and has no types. So why add a **type system** on top?

## The problem with plain JS

In JavaScript, errors only appear **when the code runs** (`undefined is not a function`,
typos in object properties, wrong argument counts...). By then your users may have
already seen the crash. Worse, nothing tells you the *shape* of your data — you just
have to trust it.

```js
// Pure JS — compiles and ships. Blows up on user #3.
function sendInvoice(user) {
  return fetch(`/invoices/${user.email}`); // user.email, we *hope*...
}
// If someone passes a user object without `email` → crash at runtime.
```

## What TypeScript adds

1. **Compile-time checks** — mistakes are caught *before* the code ever runs.
   `npm run typecheck` is your safety net.
2. **The types ARE documentation.** `function sendInvoice(user: User)` tells you
   exactly what `user` looks like — no reading 100 lines to find out.
3. **Refactoring is fearless.** Rename a field in a type and the compiler finds
   every place that breaks.
4. **Autocomplete everywhere.** Your editor knows `.email` exists on `User` —
   it suggests it and flags typos as you type.

## Why it matters for BACKEND specifically

Backend code lives on "interfaces":
- HTTP request/response bodies (`express Request/Response` typing)
- Database rows (types = your schema in code)
- API contracts between services
- JSON from `fetch` — which is `unknown` until you tell TS its shape

Getting these *wrong* is exactly the class of bug that ships to production.

## The price you pay (be honest about it)

- TS doesn't run in Node/browsers — it must be **compiled** (we use `tsx` to skip
  the build step in dev, `tsc` to check).
- A little setup (`tsconfig.json`, `@types/...`).
- A learning curve.

## The verdict

For anything non-trivial, **the safety and self-documentation are worth the
overhead** — and it's the default choice in modern Node/React/Next projects.
You're learning it for backend where it pays off the most.