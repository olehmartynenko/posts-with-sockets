import { Controller, Inject } from '@nestjs/common';
import { BrokerService, Commands, PostDto } from '@app/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(
    @Inject(BrokerService) private readonly brokerService: BrokerService,
    @Inject(PostService) private readonly postService: PostService,
  ) {}

  @MessagePattern({ cmd: Commands.GET_USER_POSTS })
  async getPosts(
    @Ctx() context: RmqContext,
    @Payload() data: { userId: number },
  ): Promise<PostDto[]> {
    this.brokerService.acknowledgeMessage(context);

    return this.postService.getPosts(data.userId);
  }
}
