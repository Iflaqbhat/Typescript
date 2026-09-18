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
// figure it out, or when you want to LOOSEN/ENFORCE something.

// ---- INFERENCE (TS does the work) ---------------------------

let city = "Berlin";       // TS: city is string (inferred)
let year = 2026;           // TS: year is number

city = "Tokyo";            // OK
// city = 42;              // ❌ error (if uncommented): number is
                           //    not assignable to string

// ---- ANNOTATION (you tell TS) -------------------------------

let temperature: number = 21.5;   // spelled out, though inference
                                  // would give the same result

// Annotations matter when the value is NOT present yet:
let apiKey: string;               // TS can't infer — nothing here
apiKey = "sk-abc123";             // must be assigned before use

// Or when a value can be multiple things, and you want to narrow:
let id: string | number = "user-7";  // union — more on this today

// ---- WHY PREFER INFERENCE? ----------------------------------
// Less typing, fewer mistakes. Annotation mistypes cause bugs:
let mystery: string = 123 as unknown as string; // bypassing type checks — lies!

export {};