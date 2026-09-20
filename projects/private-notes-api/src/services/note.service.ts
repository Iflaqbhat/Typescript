import { randomUUID } from "node:crypto";
import type { Attachment, Note, User } from "../types";
import { create } from "../repositories/note.repository";
import { isAllowedType, saveUpload } from "../utils";

// Service = business rules: validate type, store file,
// build the Note and persist it. No express here.

export async function createNoteWithAttachment(
  owner: User,
  input: { title: string; content?: string; file: Express.Multer.File },
): Promise<{ note: Note } | { error: string }> {
  if (!isAllowedType(input.file.mimetype)) {
    return { error: `File type not allowed: ${input.file.mimetype}` };
  }

  const fileName = await saveUpload(input.file.buffer, input.file.mimetype);

  const attachment: Attachment = {
    id: randomUUID(),
    fileName,
    originalName: input.file.originalname,
    mimeType: input.file.mimetype,
    sizeBytes: input.file.size,
    uploadedAt: new Date().toISOString(),
  };

  const note: Note = {
    id: randomUUID(),
    title: input.title,
    content: input.content ?? "",
    ownerId: owner.id,
    attachment,
    createdAt: new Date().toISOString(),
  };

  await create(note);
  return { note };
}