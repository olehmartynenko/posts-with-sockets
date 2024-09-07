import { NestFactory } from '@nestjs/core';
import { ReadApiModule } from './read-api.module';

async function bootstrap() {
  const app = await NestFactory.create(ReadApiModule);
  await app.listen(3000);
}
bootstrap();
