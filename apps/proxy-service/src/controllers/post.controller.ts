import {
  Commands,
  CreatePostDto,
  PostDto,
  Queues,
  ZodValidationPipe,
} from '@app/common';
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
import { z } from 'zod';

@Controller('posts')
export class PostController {
  constructor(
    @Inject(Queues.WRITE.key)
    private readonly writeAPI: ClientProxy,
    @Inject(Queues.READ.key)
    private readonly readAPI: ClientProxy,
  ) {}

  @Get('/:userId')
  async getPosts(@Param('userId') userId: number) {
    return this.readAPI.send({ cmd: Commands.GET_USER_POSTS }, { userId });
  }

  @UsePipes(new ZodValidationPipe({ body: CreatePostDto }))
  @Post()
  async createPost(@Body() body: CreatePostDto) {
    return this.writeAPI.send({ cmd: Commands.CREATE_POST }, body);
  }

  @UsePipes(
    new ZodValidationPipe({
      body: PostDto.partial(),
      param: z.coerce.number(),
    }),
  )
  @Patch('/:postId')
  async updatePost(
    @Param('postId') postId: number,
    @Body() body: Partial<PostDto>,
  ) {
    return this.writeAPI.send(
      { cmd: Commands.UPDATE_POST },
      { postId, ...body },
    );
  }
}
