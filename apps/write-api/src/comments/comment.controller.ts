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

  @MessagePattern({ cmd: Commands.CREATE_COMMENT })
  async createComment(
    @Payload() commentDto: CommentDto,
    @Ctx() context: RmqContext,
  ): Promise<CommentDto> {
    this.brokerService.acknowledgeMessage(context);

    return this.commentService.createComment(commentDto);
  }

  @MessagePattern({ cmd: Commands.UPDATE_COMMENT })
  async updateComment(
    @Payload()
    { id, commentDto }: { id: number; commentDto: Partial<CommentDto> },
    @Ctx() context: RmqContext,
  ): Promise<CommentDto> {
    this.brokerService.acknowledgeMessage(context);

    return this.commentService.updateComment(id, commentDto);
  }
}
