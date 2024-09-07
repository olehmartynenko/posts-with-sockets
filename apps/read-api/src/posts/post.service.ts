import { Injectable } from '@nestjs/common';
import { PrismaService, RedisCacheService, PostDto } from '@app/common';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: RedisCacheService,
  ) {}
  async getPosts(userId: number): Promise<PostDto[]> {
    const cachedPosts = await this.cacheService.get<PostDto[]>(
      `posts:${userId}`,
    );

    if (cachedPosts) {
      return cachedPosts;
    }

    const posts = await this.prisma.post.findMany();

    this.cacheService.set('posts', posts, 60);

    return posts;
  }
}
