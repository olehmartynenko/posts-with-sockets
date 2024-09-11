import { Controller, Inject } from '@nestjs/common';
import { BrokerService, Commands, CreatePostDto, PostDto } from '@app/common';
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

  @MessagePattern({ cmd: Commands.CREATE_POST })
  async createPost(
    @Ctx() context: RmqContext,
    @Payload() data: CreatePostDto,
  ): Promise<PostDto> {
    this.brokerService.acknowledgeMessage(context);

    return this.postService.createPost(data);
  }

  @MessagePattern({ cmd: Commands.UPDATE_POST })
  async updatePost(
    @Ctx() context: RmqContext,
    @Payload() data: { id: number; postDto: Partial<PostDto> },
  ): Promise<PostDto> {
    this.brokerService.acknowledgeMessage(context);

    return this.postService.updatePost(data.id, data.postDto);
  }
}
