// ============================================================
// 04 · ARRAYS, TUPLES & UNIONS
// ============================================================

// ---- Arrays ---------------------------------------------------
// Two syntaxes — same thing. Both mean "array of string".
const cities: string[] = ["Berlin", "Tokyo", "Cairo"];
const scores: Array<number> = [92, 87, 78];

cities.push("Lagos");        // OK
// cities.push(9);           // ❌ number not allowed

// TS infers element type from real data:
const visitors = ["Ada", "Grace", "Alan"]; // string[]
const mixedNumbers = [1, 2, 3].map((n) => n * 2); // number[]

// ---- Tuples: fixed length + fixed position types -------------
// Great for "a small structured pair".
const point: [number, number] = [3, -1];
// point[0] = "x";            // ❌ position 0 must be number
// const bad: [number, number] = [1]; // ❌ missing second element
console.log("point:", point);

// Real-world use: returning a pair from a function
// NOTE: strict mode (`noUncheckedIndexedAccess`) makes array
// INDEXING return "number | undefined" — TS forces you to handle
// the "missing element" case. `?? 0` = "use 0 if undefined".
function splitRange(range: string): [number, number] {
  const [lo, hi] = range.split("-").map(Number);
  return [lo ?? 0, hi ?? 0];
}
console.log("range:", splitRange("10-20"));

// ---- Unions: "this type OR that type" --------------------------
type Status = "pending" | "running" | "done";   // literal union

let jobStatus: Status = "pending";
jobStatus = "running";      // OK
// jobStatus = "paused";    // ❌ "paused" not in the union

// Unions with mixed kinds — you must NARROW before using:
function stringify(input: string | number): string {
  if (typeof input === "string") {
    return `"${input}"`;           // narrowed to string
  }
  return input.toFixed(2);          // narrowed to number
}

console.log(stringify("hi"));       // "hi"
console.log(stringify(3.14159));    // 3.14

export {};