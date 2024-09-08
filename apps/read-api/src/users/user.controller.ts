import { Controller, Inject } from '@nestjs/common';
import { BrokerService, Commands, UserDto } from '@app/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    @Inject(BrokerService) private readonly brokerService: BrokerService,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  @MessagePattern({ cmd: Commands.GET_USERS })
  async getUsers(@Ctx() context: RmqContext): Promise<UserDto[]> {
    this.brokerService.acknowledgeMessage(context);

    return this.userService.getUsers();
  }
}
