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
import { Observable } from 'rxjs';
import { z } from 'zod';
import { BroadcastGateway } from '../broadcast/broadcast.gateway';

@Controller('users')
export class UserController {
  constructor(
    @Inject(Queues.WRITE.key)
    private readonly writeAPI: ClientProxy,
    @Inject(Queues.READ.key)
    private readonly readAPI: ClientProxy,
    @Inject(BroadcastGateway)
    private readonly broadcastGateway: BroadcastGateway,
  ) {}

  @Get()
  async getUsers(): Promise<Observable<UserDto[]>> {
    return this.readAPI.send({ cmd: Commands.GET_USERS }, {});
  }

  @UsePipes(new ZodValidationPipe({ body: CreateUserDto }))
  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<Observable<UserDto>> {
    const createdUser = await this.writeAPI
      .send({ cmd: Commands.CREATE_USER }, body)
      .toPromise();

    this.broadcastGateway.broadcastEvent('userCreated', createdUser);

    return createdUser;
  }

  @UsePipes(
    new ZodValidationPipe({
      body: UserDto.partial(),
      param: z.coerce.number(),
    }),
  )
  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: Partial<UserDto>,
  ): Promise<Observable<UserDto>> {
    const updatedUser = await this.writeAPI
      .send({ cmd: Commands.UPDATE_USER }, { id: parseInt(id), ...body })
      .toPromise();

    this.broadcastGateway.broadcastEvent('userUpdated', updatedUser);

    return updatedUser;
  }
}
