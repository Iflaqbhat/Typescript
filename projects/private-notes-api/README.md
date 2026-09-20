# Project 1 — Private Notes API

A **private** notes API with attachment upload. One feature endpoint only,
so you can fully understand the layering instead of drowning in routes.

- TypeScript + Express
- JWT stored in an **httpOnly cookie**
- Zod validation
- "local storage" (files on disk + JSON-file database)
- Layered: **controller → service → repository**

## How to read this project (where to start)

Read top-down, following one request's journey. Don't read files alphabetically.

### Step 0 — one request, start to finish

The easiest reading order is **bottom-up → top-down**:

1. **`index.ts`** — the entry point. Read the route table first
   (`app.post("/auth/register", ...)` etc.). This shows you *every entry* into
   the app and which controller each request hits.
2. **`controllers/auth.controller.ts` → `handleRegister`** — your first request
   (`POST /auth/register`). See how a controller validates input with zod,
   calls a service, then replies.
3. **`services/auth.service.ts` → `register`** — the business rule: "email taken?
   hash the password? create it." It calls the repository.
4. **`repositories/user.repository.ts` → `create`** — the data access: writes the
   user to `src/data/users.json`.

That's the whole flow for one request. Repeat for `POST /notes/upload` and you
now understand 80% of the app.

### Step 1 — the supporting cast

After the flow, read the helpers they lean on:

- **`utils.ts`** — jwt sign/verify, bcrypt hashing, file storage, the JSON
  read/write the repositories use.
- **`types.ts`** — the data shapes (`User`, `Note`, `Attachment`). These types
  are the contract connecting every layer.
- **`config.ts`** — settings (port, JWT secret, upload size).

### The one question to ask yourself at every file

> "What layer is this, and whose job is it?"

If a controller starts doing business logic, or a service starts writing files
nobody told it to — that's a layer violation. When it feels "wrong" you're
grasping the pattern.

## How to build this yourself, manually (in order)

If you want to recreate it by hand — do these steps *in this order*, and add to
the repo as each one works:

1. **Scaffold** — `package.json` (type: module, dev script with tsx),
   `tsconfig.json` (strict), `npm install` express, cookie-parser, zod, jwt,
   bcryptjs, multer + type packages. `npm run typecheck` must pass empty.
2. **Config + types** — `config.ts`, `types.ts`. Get `run dev` printing the
   server line with zero routes.
3. **JSON store** — `utils.ts` `readRows` / `writeRows` against `src/data/*.json`.
4. **Auth, bottom-up** — write `user.repository.ts` → `auth.service.ts` →
   `auth.controller.ts` → routes in `index.ts`. Wire `register` first; test it
   in the browser/curl. Then `login` (cookie + jwt helpers), then `logout`/`me`.
5. **Auth middleware** — `requireAuth` in `index.ts`; protect `/auth/me` and
   verify the 401 when logged out.
6. **Upload endpoint, bottom-up** — `note.repository.ts` → `note.service.ts`
   (allow-list types, save file) → `note.controller.ts` → mount multer +
   `upload.single("attachment")` on `POST /notes/upload`. Test with curl.
7. **Polish** — 404 + error middleware (incl. `LIMIT_FILE_SIZE`), the `run()`
   wrapper for async errors, README.

Rule of thumb for every feature you build later: **repository → service →
controller → route → test**. Bottom to top, test as you go.

## The layering (why the folders exist)

```
Request → express routes (index.ts)
        → controller    knows HTTP only: validate body, call service, reply
        → service       knows business rules: allowed file types, how notes are built
        → repository    knows data access only: read/write users.json & notes.json
```

| layer        | file                              | job                                                |
| ------------ | --------------------------------- | -------------------------------------------------- |
| Controller   | `controllers/*.controller.ts`     | parse + validate the request, choose status code   |
| Service      | `services/*.service.ts`           | business rules, coordinates repositories & storage |
| Repository   | `repositories/*.repository.ts`    | only talks to the data store (the JSON files)      |
| Helpers      | `utils.ts`                        | jwt, passwords, file storage, JSON read/write      |

Why bother? Swap the JSON files for Postgres later by rewriting **only the
repository layer** — controllers and services never know.

## Endpoints

| method | path             | auth | body                                                     |
| ------ | ---------------- | ---- | -------------------------------------------------------- |
| POST   | `/auth/register` | no   | `{ name, email, password }`                              |
| POST   | `/auth/login`    | no   | `{ email, password }`                                    |
| POST   | `/auth/logout`   | yes  | —                                                        |
| GET    | `/auth/me`       | yes  | —                                                        |
| POST   | `/notes/upload`  | yes  | multipart form: `title`, optional `content`, `attachment` |

Only these file types are accepted: png, jpg, webp, pdf, txt, doc. Max 10 MB.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
```

Try it end to end:

```bash
# register (sets the httpOnly cookie)
curl -c cookies.txt -X POST localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","email":"ada@x.io","password":"password123"}'

# upload a note with an attachment
curl -b cookies.txt -F 'title=Quiet note' \
  -F 'attachment=@some-file.txt;type=text/plain' \
  localhost:3000/notes/upload
```

Files land in `uploads/`, records in `src/data/notes.json`.