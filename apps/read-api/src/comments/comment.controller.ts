import { Controller, Inject } from '@nestjs/common';
import { BrokerService, Commands, CommentDto } from '@app/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CommentService } from './comment.service';

@Controller()
export class CommentController {
  constructor(
    @Inject(BrokerService) private readonly brokerService: BrokerService,
    @Inject(CommentService) private readonly commentService: CommentService,
  ) {}

  @MessagePattern({ cmd: Commands.GET_POST_COMMENTS })
  async getComments(
    @Ctx() context: RmqContext,
    @Payload() data: { postId: number },
  ): Promise<CommentDto[]> {
    this.brokerService.acknowledgeMessage(context);

    return this.commentService.getComments(data.postId);
  }
}
