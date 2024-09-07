import { z } from 'zod';
import { CommentDto } from './comment.dto';

export const CreateCommentDto = CommentDto.omit({ id: true });

export type CreateCommentDto = z.infer<typeof CreateCommentDto>;
