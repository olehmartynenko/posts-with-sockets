import { z } from 'zod';

export const PostDto = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  userId: z.number(),
});

export type PostDto = z.infer<typeof PostDto>;
