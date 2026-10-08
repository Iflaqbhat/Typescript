import { createLazyDataset, parseExample } from "./01-lazy-loading.js";

const rows = [
  '{"prompt":"2 + 2?","answer":"4"}',
  '{"prompt":"3 + 3?","answer":"6"}',
  '{"prompt":"4 + 4?","answer":"8"}',
];

let parsed = 0;
const dataset = createLazyDataset(rows, (row) => {
  parsed += 1;
  return parseExample(row);
});

console.log("Available rows:", dataset.length);
console.log("Rows parsed at startup:", parsed);
console.log("Requested example:", dataset.get(1));
console.log("Rows parsed after one request:", parsed);
