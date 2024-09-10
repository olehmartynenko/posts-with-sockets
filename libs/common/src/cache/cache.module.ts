import { Module } from '@nestjs/common';
import { RedisCacheService } from './cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        url: `redis://${config.get('REDIS_HOST')}:${config.get('REDIS_PORT')}`,
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
