import { Module } from '@nestjs/common';
import { ProxyServiceController } from './proxy-service.controller';
import { ProxyServiceService } from './proxy-service.service';

@Module({
  imports: [],
  controllers: [ProxyServiceController],
  providers: [ProxyServiceService],
})
export class ProxyServiceModule {}
