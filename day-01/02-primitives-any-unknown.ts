// ============================================================
// 02 · PRIMITIVES & the `any` / `unknown` trap
// ============================================================

// ---- The three primitives you'll write all day --------------
let name: string = "Ada";          // text
let age: number = 36;              // integers, floats, Infinity
let isActive: boolean = true;      // true / false

// Other JS ancestors that show up in TS:
let nothing: null = null;          // explicit "no value"
let undef: undefined = undefined;  // "not set yet" (auto)

// ---- `any` — the escape hatch, and it's a trap ---------------
// `any` turns OFF type checking for that value. TS gives you
// no protection, even if you make a mistake:

let payload: any = "hello";
payload = 42;                        // allowed? yes
try {
  payload.missingMethod(12);         // compiles fine → crashes at runtime
} catch (err) {
  console.log("💥 runtime crash caught:", (err as Error).message);
}

// ---- `unknown` — the SAFE escape hatch ----------------------
// Represents "I don't know what this is yet" but keeps the
// compiler ON. You must PROVE the type before using it:

let data: unknown = JSON.parse('{"user": "ada"}');

// data.user;          // ❌ error: data is unknown
if (typeof data === "object" && data !== null && "user" in data) {
  const user = (data as { user: string }).user; // narrowing via cast
  console.log("user is:", user);
}

// ---- NEVER, one case you'll see soon ------------------------
function fail(): never {
  throw new Error("this function never returns");
}

export {};