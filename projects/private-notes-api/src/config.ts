import path from "node:path";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  cookieName: "token",
  uploadDir: path.join(process.cwd(), "uploads"),
  maxFileSizeBytes: 10 * 1024 * 1024, // 10 MB
};