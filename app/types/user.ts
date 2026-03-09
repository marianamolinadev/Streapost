export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  company?: string | null;
  city?: string | null;
}

export type Writer = User;

export interface WritersResponse {
  users: User[];
  nextCursor: number | null;
}
