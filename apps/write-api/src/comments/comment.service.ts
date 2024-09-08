import { Injectable } from '@nestjs/common';
import {
  PrismaService,
  RedisCacheService,
  CommentDto,
  CreateCommentDto,
} from '@app/common';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: RedisCacheService,
  ) {}
  async createComment(commentDto: CreateCommentDto): Promise<CommentDto> {
    const comment = await this.prisma.comment.create({
      data: commentDto,
    });

    const cachedComments = await this.cacheService.get<CommentDto[]>(
      `comments:${comment.postId}`,
    );

    if (cachedComments) {
      await this.cacheService.set(
        `comments:${comment.postId}`,
        [...cachedComments, comment],
        60,
      );
    }

    return comment;
  }

  async updateComment(
    id: number,
    commentDto: Partial<CommentDto>,
  ): Promise<CommentDto> {
    const comment = await this.prisma.comment.update({
      where: { id },
      data: commentDto,
    });

    const cachedComments = await this.cacheService.get<CommentDto[]>(
      `comments:${comment.postId}`,
    );

    if (cachedComments) {
      await this.cacheService.set(
        `comments:${comment.postId}`,
        cachedComments.map((c) => (c.id === id ? comment : c)),
        60,
      );
    }

    return comment;
  }
}
