import { Injectable } from '@nestjs/common';
import {
  PrismaService,
  RedisCacheService,
  TTL,
  UserDto,
  UserFilterDto,
} from '@app/common';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: RedisCacheService,
  ) {}
  async getUsers(
    query: UserFilterDto & { cursor: number; pageSize: number },
  ): Promise<{ users: UserDto[]; cursor: number }> {
    const cachedUsers = await this.cacheService.get<UserDto[]>(
      `users-${JSON.stringify(query)}`,
    );

    if (cachedUsers) {
      return {
        users: cachedUsers,
        cursor: cachedUsers.length ? cachedUsers[cachedUsers.length - 1].id : 0,
      };
    }

    const users = await this.prisma.user.findMany({
      where: {
        email: {
          contains: query.email ?? '',
        },
        name: {
          contains: query.name ?? '',
        },
      },
      take: query.pageSize,
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor ? { id: query.cursor } : undefined,
    });

    this.cacheService.set(`users-${JSON.stringify(query)}`, users, TTL.USERS);

    return { users, cursor: users.length ? users[users.length - 1].id : 0 };
  }
}
