import { Module } from '@nestjs/common';
import { ProxyServiceService } from './proxy-service.service';
import { BrokerModule, Queues } from '@app/common';
import {
  CommentController,
  PostController,
  UserController,
} from './controllers';

@Module({
  imports: [
    BrokerModule.registerRmq(Queues.READ.key, Queues.READ.name),
    BrokerModule.registerRmq(Queues.WRITE.key, Queues.WRITE.name),
  ],
  controllers: [UserController, PostController, CommentController],
  providers: [ProxyServiceService],
})
export class ProxyServiceModule {}
