import { Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  PrismaService,
  RedisCacheService,
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

    const cachedUsers = await this.cacheService.get<UserDto[]>('users');

    if (cachedUsers) {
      await this.cacheService.set<UserDto[]>(
        'users',
        [...cachedUsers, user],
        60,
      );
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

    const cachedUsers = await this.cacheService.get<UserDto[]>('users');

    if (cachedUsers) {
      await this.cacheService.set<UserDto[]>(
        'users',
        cachedUsers.map((u) => (u.id === userDto.id ? user : u)),
        60,
      );
    }

    return user;
  }
}
