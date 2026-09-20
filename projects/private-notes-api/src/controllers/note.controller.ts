import type { Request, Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../types";
import { createNoteWithAttachment } from "../services/note.service";

const noteSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().max(5000).optional(),
});

// The one and only upload endpoint:
// POST /notes/upload  (multipart: title, [content], attachment)
export async function handleUpload(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ error: 'A file is required (field name "attachment")' });
    return;
  }

  const parsed = noteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { user } = req as unknown as AuthRequest;
  const result = await createNoteWithAttachment(user, {
    title: parsed.data.title,
    content: parsed.data.content,
    file: req.file,
  });

  if ("error" in result) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.status(201).json({ note: result.note });
}