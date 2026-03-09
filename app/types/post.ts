import type { User } from './user';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  user?: User;
}

export interface PostsResponse {
  posts: Post[];
  nextCursor: number | null;
}
