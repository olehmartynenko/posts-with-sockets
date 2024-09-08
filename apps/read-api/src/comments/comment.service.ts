import { Injectable } from '@nestjs/common';
import { PrismaService, RedisCacheService, CommentDto } from '@app/common';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: RedisCacheService,
  ) {}
  async getComments(postId: number): Promise<CommentDto[]> {
    const cachedComments = await this.cacheService.get<CommentDto[]>(
      `comments:${postId}`,
    );

    if (cachedComments) {
      return cachedComments;
    }

    const comments = await this.prisma.comment.findMany();

    this.cacheService.set(`comments:${postId}`, comments, 30);

    return comments;
  }
}
