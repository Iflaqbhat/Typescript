# Day 02: Parse Only When Needed

This is an AI-assisted learning example, not a production dataset loader or a
claim that the learner independently implemented it.

## Run

```bash
node --import tsx day-02/02-demo.ts
node --import tsx --test day-02/01-lazy-loading.test.ts
npm run typecheck
```

The demo starts with three available rows and zero parsed rows. Asking for
example 1 parses one row, not all three. Indices start at zero.

## What Happens

1. `rows` contains JSON strings: text that describes training examples.
2. `createLazyDataset` keeps those strings without converting them into objects.
3. `get(1)` selects the second string and passes it to `parseExample`.
4. `parseExample` converts the text into an object and checks its fields.

The parser argument is a function passed into another function. The demo uses
it to count how often parsing happens; the first test checks that count.

## Limits

All raw strings remain in memory. This is not streaming from disk. Repeated
requests parse the same row again because there is no cache. Invalid data is
reported only when requested; the Cua fix also preserved validation at startup,
so this example demonstrates only the on-demand parsing idea. No memory saving
has been measured here.

## Try Yourself

Before running the demo, predict the two parsing counts. Then request a second
example and explain why the count increases. Read the first test and explain
which assertion would catch accidentally parsing every row during construction.
