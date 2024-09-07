import { z } from 'zod';
import { UserDto } from './user.dto';

export const CreateUserDto = UserDto.omit({ id: true });

export type CreateUserDto = z.infer<typeof CreateUserDto>;
