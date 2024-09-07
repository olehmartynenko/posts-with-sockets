import { NestFactory } from '@nestjs/core';
import { ProxyServiceModule } from './proxy-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProxyServiceModule);
  await app.listen(3000);
}
bootstrap();
