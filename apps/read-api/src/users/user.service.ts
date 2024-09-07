import { Injectable } from '@nestjs/common';
import { PrismaService, RedisCacheService, UserDto } from '@app/common';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: RedisCacheService,
  ) {}
  async getUsers(): Promise<UserDto[]> {
    const cachedUsers = await this.cacheService.get<UserDto[]>('users');

    if (cachedUsers) {
      return cachedUsers;
    }

    const users = await this.prisma.user.findMany();

    this.cacheService.set('users', users, 60);

    return users;
  }
}
