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
import { Observable } from 'rxjs';
import { z } from 'zod';
import { BroadcastGateway } from '../broadcast/broadcast.gateway';

@Controller('posts')
export class PostController {
  constructor(
    @Inject(Queues.WRITE.key)
    private readonly writeAPI: ClientProxy,
    @Inject(Queues.READ.key)
    private readonly readAPI: ClientProxy,
    @Inject(BroadcastGateway)
    private readonly broadcastGateway: BroadcastGateway,
  ) {}

  @UsePipes(new ZodValidationPipe({ param: z.coerce.number() }))
  @Get('/:userId')
  async getPosts(
    @Param('userId') userId: number,
  ): Promise<Observable<PostDto>> {
    return this.readAPI.send({ cmd: Commands.GET_USER_POSTS }, { userId });
  }

  @UsePipes(new ZodValidationPipe({ body: CreatePostDto }))
  @Post()
  async createPost(@Body() body: CreatePostDto): Promise<Observable<PostDto>> {
    const createdPost = await this.writeAPI
      .send({ cmd: Commands.CREATE_POST }, body)
      .toPromise();

    this.broadcastGateway.broadcastEvent('postCreated', createdPost);

    return createdPost;
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
  ): Promise<Observable<PostDto>> {
    const updatedPost = await this.writeAPI
      .send({ cmd: Commands.UPDATE_POST }, { postId, ...body })
      .toPromise();

    this.broadcastGateway.broadcastEvent('postUpdated', updatedPost);

    return updatedPost;
  }
}
