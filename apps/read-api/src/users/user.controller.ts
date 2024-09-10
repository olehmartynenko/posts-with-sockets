import { Controller, Inject } from '@nestjs/common';
import { BrokerService, Commands, UserDto, UserFilterDto } from '@app/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    @Inject(BrokerService) private readonly brokerService: BrokerService,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  @MessagePattern({ cmd: Commands.GET_USERS })
  async getUsers(
    @Ctx() context: RmqContext,
    @Payload()
    data: { query: UserFilterDto & { cursor: number; pageSize: number } },
  ): Promise<{ users: UserDto[]; cursor: number }> {
    this.brokerService.acknowledgeMessage(context);

    return this.userService.getUsers(data.query);
  }
}
