# Day 04: Discriminated Unions

An API request can be waiting, loading, successful, or unsuccessful. Only a
successful request has data. Only an unsuccessful request needs an error message.

`RequestState<T>` describes these possibilities as separate object shapes. The
shared `status` field is the discriminator: checking it tells TypeScript which
shape you have. Inside the success case, `state.data` exists and has type `T`.

The `never` check catches forgotten cases. If you add another status to the union
without handling it in the switch, type-checking fails.

## Run

```bash
node --import tsx day-04/02-demo.ts
node --import tsx --test day-04/01-discriminated-unions.test.ts
npm run typecheck
```

The runtime tests check descriptions, formatter calls, and valid results such as
zero or false. The compile-time tests check that data cannot be read before
narrowing and that each state requires the correct fields.

## Try Yourself

Add `{ status: "cancelled" }` to `RequestState<T>`. Run the type checker before
changing the switch. Why does the `assertNever` call fail? Then add the missing
case and a test for its description.
