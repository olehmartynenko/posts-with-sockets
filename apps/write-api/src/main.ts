import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BrokerService, Queues } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const brokerService = app.get(BrokerService);

  app.connectMicroservice(brokerService.getRmqOptions(Queues.WRITE.name));
  app.startAllMicroservices();
}
bootstrap();
