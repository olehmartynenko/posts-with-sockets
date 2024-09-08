import { Controller, Inject } from '@nestjs/common';
import { BrokerService, Commands, CreateUserDto, UserDto } from '@app/common';
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

  @MessagePattern({ cmd: Commands.CREATE_USER })
  async createUser(
    @Ctx() context: RmqContext,
    @Payload() userDto: CreateUserDto,
  ): Promise<UserDto> {
    this.brokerService.acknowledgeMessage(context);

    return this.userService.createUser(userDto);
  }

  @MessagePattern({ cmd: Commands.UPDATE_USER })
  async updateUser(
    @Ctx() context: RmqContext,
    @Payload() userDto: Partial<UserDto> & { userId: number },
  ): Promise<UserDto> {
    this.brokerService.acknowledgeMessage(context);

    return this.userService.updateUser(userDto);
  }
}
