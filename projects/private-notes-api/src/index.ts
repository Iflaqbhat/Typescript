import type { NextFunction, Request, Response } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import { config } from "./config";
import { verifyToken } from "./utils";
import { findById } from "./repositories/user.repository";
import { handleLogin, handleLogout, handleMe, handleRegister } from "./controllers/auth.controller";
import { handleUpload } from "./controllers/note.controller";

const app = express();

app.use(express.json());
app.use(cookieParser());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSizeBytes },
});

// Express 4 does not catch errors from async handlers —
// this tiny wrapper forwards them to the error middleware.
const run = (fn: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    void fn(req, res).catch(next);
  };

// Auth middleware: reads JWT from httpOnly cookie, loads the user.
async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.[config.cookieName];
  const userId = token ? verifyToken(token) : null;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const user = await findById(userId);
  if (!user) {
    res.status(401).json({ error: "Account not found" });
    return;
  }

  (req as unknown as { user: unknown }).user = user;
  next();
}

// ---- Routes ----------------------------------------------------
app.post("/auth/register", run(handleRegister));
app.post("/auth/login", run(handleLogin));
app.post("/auth/logout", requireAuth, run(handleLogout));
app.get("/auth/me", requireAuth, run(handleMe));

// The single upload endpoint (multipart form: title, [content], attachment)
app.post("/notes/upload", requireAuth, upload.single("attachment"), run(handleUpload));

// ---- 404 + error handler ----------------------------------------
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "LIMIT_FILE_SIZE") {
    res.status(413).json({ error: "File too large (max 10 MB)" });
    return;
  }
  console.error("[error]", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(config.port, () => {
  console.log(`Private Notes API → http://localhost:${config.port}`);
});