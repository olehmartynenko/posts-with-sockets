import {
  Commands,
  CreateUserDto,
  Queues,
  UserDto,
  UserFilterDto,
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
  Query,
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

  @UsePipes(
    new ZodValidationPipe({
      query: z.object({
        cursor: z.coerce.number(),
        pageSize: z.coerce.number(),
        email: z.string().optional(),
        name: z.string().optional(),
      }),
    }),
  )
  @Get()
  async getUsers(
    @Query() query: UserFilterDto & { cursor: number; pageSize: number },
  ): Promise<Observable<{ users: UserDto[]; cursor: number }>> {
    return this.readAPI.send({ cmd: Commands.GET_USERS }, { query });
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
