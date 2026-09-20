# Project 1 — Private Notes API

A **private** notes API with attachment upload. One feature endpoint only,
so you can fully understand the layering instead of drowning in routes.

- TypeScript + Express
- JWT stored in an **httpOnly cookie**
- Zod validation
- "local storage" (files on disk + JSON-file database)
- Layered: **controller → service → repository**

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