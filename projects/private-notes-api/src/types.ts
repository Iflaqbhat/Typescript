export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export type SafeUser = Omit<User, "passwordHash">;

export interface Attachment {
  id: string;
  fileName: string; // name on disk (randomized)
  originalName: string; // name the client sent
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  attachment: Attachment;
  createdAt: string;
}

// Request that has passed the auth middleware
export interface AuthRequest {
  user: User;
}