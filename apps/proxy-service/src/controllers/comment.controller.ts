import { Commands, Queues, ZodValidationPipe } from '@app/common';
import { CommentDto, CreateCommentDto } from '@app/common';
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

  @UsePipes(new ZodValidationPipe(CreateCommentDto))
  @Post()
  async createComment(@Body() body: CreateCommentDto) {
    return this.writeAPI.send({ cmd: Commands.CREATE_COMMENT }, body);
  }

  @UsePipes(new ZodValidationPipe(CommentDto.partial()))
  @Patch('/:commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() body: Partial<CommentDto>,
  ) {
    return this.writeAPI.send(
      { cmd: Commands.UPDATE_COMMENT },
      { commentId, ...body },
    );
  }
}
