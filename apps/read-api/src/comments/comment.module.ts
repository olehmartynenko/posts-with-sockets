import { Module } from '@nestjs/common';
import { PrismaModule, RedisCacheModule, BrokerModule } from '@app/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [BrokerModule, PrismaModule, RedisCacheModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
