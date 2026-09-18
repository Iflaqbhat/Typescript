// ============================================================
// 05 · OBJECTS — type aliases & interfaces
// ============================================================

// ---- Type aliases: give a name to any shape of type -----------
type User = {
  id: number;
  name: string;
  email: string;
};

const userOne: User = {
  id: 1,
  name: "Ada Lovelace",
  email: "ada@analytical.engine",
};
// Missing field? ❌ · Extra field? ❌ — TS is strict about the shape.

// ---- Interfaces: same idea, different syntax ------------------
interface Article {
  title: string;
  body: string;
  published: boolean;
}

// Interfaces can be EXTENDED — aliases can combine with `&`:
interface DraftArticle extends Article {
  author: User;
}

const draft: DraftArticle = {
  title: "Notes on a treatise",
  body: "Hmm...",
  published: false,
  author: userOne,
};

// ---- Optional + readonly fields -------------------------------
type Config = {
  host: string;
  port: number;
  timeoutMs?: number;     // optional — may be absent
  readonly apiKey: string; // readonly — cannot reassign
};

// ---- Same rules apply to function params -----------------------
function publish(article: Article, at: Date = new Date()): void {
  console.log(`Published "${article.title}" at ${at.toISOString()}`);
}
publish({ title: "Hello", body: "world", published: true });

// ---- Objects in arrays are everywhere ---------------------------
const users: User[] = [
  userOne,
  { id: 2, name: "Grace Hopper", email: "grace@navy.mil" },
];
console.log(users.map((u) => u.name).join(", "));

// ============================================================
// DEEP DIVE: type vs interface — when to use which?
// ============================================================
// For plain objects, both are interchangeable.
// The difference is in what each CAN DO:
//
//                        |  interface  |    type
//  ─────────────────────┼─────────────┼────────────
//  object shape          |    yes      |    yes
//  union (A | B)         |    NO       |    yes
//  tuple ([A,B])         |    NO       |    yes
//  primitive alias       |    NO       |    yes
//  extends / merges      |    yes      |    NO*
//  intersection (&)      |    NO       |    yes
//
//  *type uses `&` instead of extends; but `extends` on interfaces
//   can compose multiple parents more cleanly than `&`.

// ---- 1. interface can EXTEND, type uses intersection (&) -------

interface Person {
  name: string;
  age: number;
}

// interface way — explicit extends keyword, can list many parents
interface Employee extends Person {
  role: string;
}

// type way — intersection `&` combines both
type EmployeeT = Person & { role: string };

const emp: Employee = { name: "Grace", age: 89, role: "engineer" };
console.log("emp →", emp.name, emp.role);

// ---- 2. interface MERGES; type gives duplicate identifier ------

interface Window {
  width: number;
}
// A second declaration of the SAME name:
interface Window {
  height: number;
}
// Both fields are now available:
const size: Window = { width: 1024, height: 768 };   // ✅ merged
console.log("window size →", size.width, "x", size.height);
// NOTE: You CANNOT do the same with type — it errors.
// This "declaration merging" is rarely needed in app code,
// but is essential when augmenting third-party library types
// (e.g., adding a field to Express Request).

// ---- 3. type can represent MORE than objects --------------------
// An interface can ONLY name objects, classes, and enums.

type ID = string | number;                    // union (interface can't)
type Pair = [number, number];                 // tuple
type Callback = (data: string) => Promise<void>; // function shape

const id: ID = "abc123";                     // ✅ union works
const pair: Pair = [1, 2];                    // ✅ tuple works
console.log("id type →", typeof id, "| pair →", pair);

// ---- RULE OF THUMB -----------------------------------------------
//   → interface: for object shapes you'll extend or merge
//                (rare in application code, common in libraries)
//   → type:      for everything else (unions, tuples, primitives,
//                computed types, intersections)
//
// For your own application types — just pick one and be consistent.
// Most modern TS codebases prefer type by default.

export {};