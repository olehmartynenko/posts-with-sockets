import { z } from 'zod';

export const userFilterDtoSchema = z.object({
  email: z.string().optional(),
  name: z.string().optional(),
});

export type UserFilterDto = z.infer<typeof userFilterDtoSchema>;
