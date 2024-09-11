import { Injectable } from '@nestjs/common';
import {
  PrismaService,
  RedisCacheService,
  PostDto,
  CreatePostDto,
  TTL,
} from '@app/common';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: RedisCacheService,
  ) {}
  async createPost(postDto: CreatePostDto): Promise<PostDto> {
    const post = await this.prisma.post.create({
      data: postDto,
    });

    const cachedPosts = await this.cacheService.get<PostDto[]>(
      `posts:${postDto.userId}`,
    );

    if (cachedPosts) {
      await this.cacheService.set(
        `posts:${postDto.userId}`,
        [...cachedPosts, post],
        TTL.POSTS,
      );
    }

    return post;
  }

  async updatePost(id: number, postDto: Partial<PostDto>): Promise<PostDto> {
    const post = await this.prisma.post.update({
      where: { id },
      data: postDto,
    });

    const cachedPosts = await this.cacheService.get<PostDto[]>(
      `posts:${post.userId}`,
    );

    if (cachedPosts) {
      await this.cacheService.set(
        `posts:${post.userId}`,
        cachedPosts.map((p) => (p.id === id ? post : p)),
        TTL.POSTS,
      );
    }

    return post;
  }
}
