import {
  Commands,
  CreateUserDto,
  Queues,
  UserDto,
  ZodValidationPipe,
} from '@app/common';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
export class UserController {
  constructor(
    @Inject(Queues.WRITE.key)
    private readonly writeAPI: ClientProxy,
    @Inject(Queues.READ.key)
    private readonly readAPI: ClientProxy,
  ) {}

  @Get()
  async getUsers() {
    return this.readAPI.send({ cmd: Commands.GET_USERS }, {});
  }

  @UsePipes(new ZodValidationPipe(CreateUserDto))
  @Post()
  async createUser(@Body() body: { name: string; email: string }) {
    return this.writeAPI.send({ cmd: Commands.CREATE_USER }, body);
  }

  @UsePipes(new ZodValidationPipe(UserDto.partial()))
  @Patch('/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() body: { name: string; email: string },
  ) {
    return this.writeAPI.send(
      { cmd: Commands.UPDATE_USER },
      { userId, ...body },
    );
  }
}
