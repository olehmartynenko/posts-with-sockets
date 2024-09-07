import { Module } from '@nestjs/common';
import { WriteApiController } from './write-api.controller';
import { WriteApiService } from './write-api.service';

@Module({
  imports: [],
  controllers: [WriteApiController],
  providers: [WriteApiService],
})
export class WriteApiModule {}
