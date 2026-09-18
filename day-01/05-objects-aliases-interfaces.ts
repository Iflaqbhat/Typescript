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

export {};