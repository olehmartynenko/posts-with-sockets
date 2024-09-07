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

@Controller('posts')
export class PostController {
  constructor(
    @Inject(Queues.WRITE.key)
    private readonly writeAPI: ClientProxy,
    @Inject(Queues.READ.key)
    private readonly readAPI: ClientProxy,
  ) {}

  @Get('/:userId')
  async getPosts(@Param('userId') userId: string) {
    return this.readAPI.send({ cmd: Commands.GET_USER_POSTS }, { userId });
  }

  @UsePipes(new ZodValidationPipe(CreatePostDto))
  @Post()
  async createPost(
    @Body() body: { userId: string; content: string; title: string },
  ) {
    return this.writeAPI.send({ cmd: Commands.CREATE_POST }, body);
  }

  @UsePipes(new ZodValidationPipe(PostDto.partial()))
  @Patch('/:postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() body: { content: string; title: string },
  ) {
    return this.writeAPI.send(
      { cmd: Commands.UPDATE_POST },
      { postId, ...body },
    );
  }
}
