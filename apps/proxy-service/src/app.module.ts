import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BrokerModule, PrismaModule, Queues } from '@app/common';
import {
  CommentController,
  PostController,
  UserController,
} from './controllers';
import { LogMiddleware } from './middlewares/log.middleware';
import { BroadcastGateway } from './broadcast/broadcast.gateway';

@Module({
  imports: [
    BrokerModule.registerRmq(Queues.READ.key, Queues.READ.name),
    BrokerModule.registerRmq(Queues.WRITE.key, Queues.WRITE.name),
    PrismaModule,
  ],
  controllers: [UserController, PostController, CommentController],
  providers: [BroadcastGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
