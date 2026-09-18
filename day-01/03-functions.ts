// ============================================================
// 03 · FUNCTIONS — types in, types out
// ============================================================

// ---- Parameter types + return type --------------------------
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("Ada"));   // "Hello, Ada!"
// greet(42);                // ❌ number not assignable to string

// ---- Inferred return type (prefer this) ----------------------
function add(a: number, b: number) {
  return a + b;               // TS infers : number
}

// ---- Optional parameters (?) ---------------------------------
// `age?` means it may be absent → type is number | undefined
function describe(name: string, age?: number): string {
  if (age === undefined) return `${name} (age unknown)`;
  return `${name}, ${age} years old`;
}

console.log(describe("Grace"));      // age omitted — OK
console.log(describe("Grace", 89));  // age provided — OK

// ---- Default parameters --------------------------------------
// Provide the value when the caller omits it — no `?` needed.
function multiply(a: number, b: number = 1): number {
  return a * b;
}

console.log(multiply(5));       // 5 (b defaults to 1)
console.log(multiply(5, 3));    // 15

// ---- Rest parameters ------------------------------------------
// Any number of args → always an array.
function sumAll(...nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}

console.log(sumAll(1, 2, 3, 4));  // 10

// ---- Void: "I don't return anything" --------------------------
function log(msg: string): void {
  console.log("[log]", msg);
}

export {};