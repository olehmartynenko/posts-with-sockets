import { Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  PrismaService,
  RedisCacheService,
  TTL,
  UserDto,
} from '@app/common';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: RedisCacheService,
  ) {}
  async createUser(userDto: CreateUserDto): Promise<UserDto> {
    const user = await this.prisma.user.create({
      data: userDto,
    });

    const cachedUsersKeys = await this.cacheService.listKeys('users-*');

    if (cachedUsersKeys) {
      for (const key of cachedUsersKeys) {
        // Here we can just invalidate the cache for all users because we only know if the new user matches the filter
        // However we dont know where the user should be placed in terms of pagination
        await this.cacheService.delete(key);
      }
    }

    return user;
  }

  async updateUser(
    userDto: Partial<UserDto> & { userId: number },
  ): Promise<UserDto> {
    const user = await this.prisma.user.update({
      where: { id: userDto.id },
      data: userDto,
    });

    const cachedUsersKeys = await this.cacheService.listKeys('users-*');

    if (cachedUsersKeys) {
      for (const key of cachedUsersKeys) {
        const query = JSON.parse(key.replace('users-', ''));

        // If the user does not match previous filter, invalidate the cache
        if (query.email && !user.email.includes(query.email)) {
          this.cacheService.delete(key);
          continue;
        }

        // If the user does not match previous filter, invalidate the cache
        if (query.name && !user.name.includes(query.name)) {
          this.cacheService.delete(key);
          continue;
        }

        const cachedUsers = (await this.cacheService.get<UserDto[]>(key)) ?? [];

        // If the user didnt match current filter, but now match, invalidate the cache
        // This is because we dont know where the user should be placed in terms of pagination
        if (!cachedUsers.find((cachedUser) => cachedUser.id === user.id)) {
          this.cacheService.delete(key);
          continue;
        }

        await this.cacheService.set<UserDto[]>(
          key,
          cachedUsers.map((cachedUser) =>
            cachedUser.id === user.id ? user : cachedUser,
          ),
          TTL.USERS,
        );
      }
    }

    return user;
  }
}
