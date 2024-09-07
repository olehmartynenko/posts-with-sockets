import { z } from 'zod';
import { PostDto } from './post.dto';

export const CreatePostDto = PostDto.omit({ id: true });

export type CreatePostDto = z.infer<typeof CreatePostDto>;
