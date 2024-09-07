import { z } from 'zod';

export const UserDto = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

export type UserDto = z.infer<typeof UserDto>;
