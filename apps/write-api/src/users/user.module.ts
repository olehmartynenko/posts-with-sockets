import { Module } from '@nestjs/common';
import { PrismaModule, RedisCacheModule, BrokerModule } from '@app/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [BrokerModule, PrismaModule, RedisCacheModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
