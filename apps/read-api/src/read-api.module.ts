import { Module } from '@nestjs/common';
import { ReadApiController } from './read-api.controller';
import { ReadApiService } from './read-api.service';

@Module({
  imports: [],
  controllers: [ReadApiController],
  providers: [ReadApiService],
})
export class ReadApiModule {}
