# Day 03: Generic Keys

## Run

```bash
node --import tsx day-03/02-demo.ts
node --import tsx --test day-03/01-keyof-generics.test.ts
npm run typecheck
```

## What the Types Mean

In `getProperty<T, K>`, `T` is the object type and `K` is one of its keys.
`K extends keyof T` prevents callers from asking for a property that is not
on the object. The return type `T[K]` is the type of that specific property,
so reading `durationMinutes` returns a number while reading `title` returns a
string.

The test checks both the values at runtime and the type rules at compile time.
The `@ts-expect-error` lines make TypeScript report an error if an invalid key
or mismatched return type ever becomes accepted.

## Try Yourself

Add an `email` property to `lesson`, then request it with `getProperty`. What
type does TypeScript infer? Remove the property and see why the same call no
longer type-checks.
