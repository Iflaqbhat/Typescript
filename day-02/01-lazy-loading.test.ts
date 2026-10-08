import assert from "node:assert/strict";
import test from "node:test";
import { createLazyDataset, parseExample } from "./01-lazy-loading.js";

const rows = [
  '{"prompt":"First","answer":"1"}',
  '{"prompt":"Second","answer":"2"}',
  '{"prompt":"Third","answer":"3"}',
];

test("construction parses nothing; each request parses only its row", () => {
  const calls: string[] = [];
  const dataset = createLazyDataset(rows, (row) => {
    calls.push(row);
    return parseExample(row);
  });
  assert.equal(dataset.length, 3);
  assert.deepEqual(calls, []);
  assert.deepEqual(dataset.get(2), { prompt: "Third", answer: "3" });
  assert.deepEqual(calls, [rows[2]]);
  dataset.get(0);
  assert.deepEqual(calls, [rows[2], rows[0]]);
});

test("invalid indices never call the parser", () => {
  const dataset = createLazyDataset(rows, () => {
    assert.fail("Parser must not run for an invalid index");
  });
  for (const index of [-1, 3, 0.5, NaN, Infinity]) {
    assert.throws(() => dataset.get(index), RangeError);
  }
  assert.throws(() => createLazyDataset([]).get(0), RangeError);
});

test("malformed rows fail when requested, not during construction", () => {
  const dataset = createLazyDataset([rows[0]!, "not JSON"]);
  assert.deepEqual(dataset.get(0), { prompt: "First", answer: "1" });
  assert.throws(() => dataset.get(1), SyntaxError);
});

test("valid JSON must still have the expected fields", () => {
  for (const row of ["null", "[]", "{}", '{"prompt":42,"answer":"1"}']) {
    assert.throws(() => parseExample(row), TypeError);
  }
});

test("changing the input array does not change the dataset", () => {
  const input = [...rows];
  const dataset = createLazyDataset(input);
  input[0] = "not JSON";
  input.push("not JSON");
  assert.equal(dataset.length, 3);
  assert.deepEqual(dataset.get(0), { prompt: "First", answer: "1" });
});
