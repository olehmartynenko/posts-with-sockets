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

  @Post()
  async createPost(
    @Body() body: { userId: string; content: string; title: string },
  ) {
    return this.writeAPI.send({ cmd: Commands.CREATE_POST }, body);
  }

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
