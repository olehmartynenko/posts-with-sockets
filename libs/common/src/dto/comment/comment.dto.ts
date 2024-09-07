import { z } from 'zod';

export const CommentDto = z.object({
  id: z.number(),
  content: z.string(),
  postId: z.number(),
  userId: z.number(),
});

export type CommentDto = z.infer<typeof CommentDto>;
