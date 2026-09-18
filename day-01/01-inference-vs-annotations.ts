// ============================================================
// 01 · THE CORE IDEA: inference vs annotations
// ============================================================
// TypeScript starts with JavaScript (no types) and adds a type
// system. Two ways types get attached to your data:
//
//   INFERENCE  → TS figures the type out from the value you wrote.
//   ANNOTATION → YOU write the type explicitly with a colon // :
//
// Rule of thumb: prefer inference. Only annotate when TS can't
// figure it out, or when you want to ENFORCE something.

// ---- INFERENCE (TS does the work) ---------------------------

let city = "Berlin";       // TS: city is string (inferred)
let year = 2026;           // TS: year is number

console.log("city   → inferred as", typeof city);
console.log("year   → inferred as", typeof year);

city = "Tokyo";            // OK
// city = 42;              // ❌ error (if uncommented): number is
                           //    not assignable to string
console.log("city   → reassigned to", city);

// Inference follows your code everywhere:
const uppercase = city.toUpperCase();         // string
const future = year + 100;                     // number
console.log("uppercase →", uppercase, "| future →", future);

// Even function returns are inferred (more in topic 3):
function double(n: number) {
  return n * 2;               // inferred return type: number
}
console.log("double(21) →", double(21));

// ---- ANNOTATION (you tell TS) -------------------------------

let temperature: number = 21.5;   // spelled out, though inference
                                  // would give the same result

// Annotations are REQUIRED when the value is NOT present yet:
let apiKey: string;               // TS can't infer — nothing here
apiKey = "sk-abc123";             // must be assigned before use
console.log("apiKey  →", apiKey);

// Or when you want to ENFORCE a contract, e.g. a union:
let id: string | number = "user-7";
id = 42;                          // allowed — both are in the union
id = "user-9";                    // allowed
// id = true;                     // ❌ boolean is NOT in the union
console.log("id      →", id);

// ---- WHY PREFER INFERENCE? ----------------------------------
// Less typing, fewer mistakes. Annotation mistypes cause bugs:
// let mystery: string = 123 as unknown as string; // lies to the compiler

// Annotations help most at FUNCTION BOUNDARIES (inputs/outputs)
// and PUBLIC data shapes — not on every local variable.
export {};