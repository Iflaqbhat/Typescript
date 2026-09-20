import type { Note } from "../types";
import { readRows, writeRows } from "../utils";

const FILE = "notes.json";

export async function create(note: Note): Promise<Note> {
  const notes = await readRows<Note>(FILE);
  notes.push(note);
  await writeRows(FILE, notes);
  return note;
}