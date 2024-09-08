import { Module } from '@nestjs/common';
import { PrismaModule, RedisCacheModule, BrokerModule } from '@app/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [BrokerModule, PrismaModule, RedisCacheModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
