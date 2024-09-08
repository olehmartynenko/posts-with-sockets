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
import { Observable } from 'rxjs';
import { z } from 'zod';

@Controller('comments')
export class CommentController {
  constructor(
    @Inject(Queues.WRITE.key)
    private readonly writeAPI: ClientProxy,
    @Inject(Queues.READ.key)
    private readonly readAPI: ClientProxy,
  ) {}

  @UsePipes(new ZodValidationPipe({ param: z.coerce.number() }))
  @Get('/:postId')
  async getComments(
    @Param('postId') postId: number,
  ): Promise<Observable<CommentDto>> {
    return this.readAPI.send({ cmd: Commands.GET_POST_COMMENTS }, { postId });
  }

  @UsePipes(new ZodValidationPipe({ body: CreateCommentDto }))
  @Post()
  async createComment(
    @Body() body: CreateCommentDto,
  ): Promise<Observable<CommentDto>> {
    return this.writeAPI.send({ cmd: Commands.CREATE_COMMENT }, body);
  }

  @UsePipes(
    new ZodValidationPipe({
      body: CommentDto.partial(),
      param: z.coerce.number(),
    }),
  )
  @Patch('/:id')
  async updateComment(
    @Param('id') id: number,
    @Body() body: Partial<CommentDto>,
  ): Promise<Observable<CommentDto>> {
    return this.writeAPI.send(
      { cmd: Commands.UPDATE_COMMENT },
      { id, ...body },
    );
  }
}
