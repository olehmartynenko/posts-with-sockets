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
import { z } from 'zod';

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

  @UsePipes(new ZodValidationPipe({ body: CreateUserDto }))
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.writeAPI.send({ cmd: Commands.CREATE_USER }, body);
  }

  @UsePipes(
    new ZodValidationPipe({
      body: UserDto.partial(),
      param: z.coerce.number(),
    }),
  )
  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: Partial<UserDto>) {
    console.log('Received message', { userId: parseInt(id), ...body });
    return this.writeAPI.send(
      { cmd: Commands.UPDATE_USER },
      { id: parseInt(id), ...body },
    );
  }
}
