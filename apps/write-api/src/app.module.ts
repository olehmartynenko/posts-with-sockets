import { Module } from '@nestjs/common';
import { CommentModule } from './comments/comment.module';
import { UserModule } from './users/user.module';
import { PostModule } from './posts/post.module';

@Module({
  imports: [CommentModule, UserModule, PostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
