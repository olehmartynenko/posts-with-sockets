import { Commands, Queues } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('comments')
export class CommentController {
  constructor(
    @Inject(Queues.WRITE.key)
    private readonly writeAPI: ClientProxy,
    @Inject(Queues.READ.key)
    private readonly readAPI: ClientProxy,
  ) {}

  @Get('/:postId')
  async getComments(@Param('postId') postId: string) {
    return this.readAPI.send({ cmd: Commands.GET_POST_COMMENTS }, { postId });
  }

  @Post('/:postId')
  async createComment(
    @Param('postId') postId: string,
    @Body() body: { userId: string; content: string },
  ) {
    return this.writeAPI.send(
      { cmd: Commands.CREATE_COMMENT },
      { postId, ...body },
    );
  }

  @Patch('/:commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() body: { content: string },
  ) {
    return this.writeAPI.send(
      { cmd: Commands.UPDATE_COMMENT },
      { commentId, ...body },
    );
  }
}
