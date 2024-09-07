import { NestFactory } from '@nestjs/core';
import { WriteApiModule } from './write-api.module';

async function bootstrap() {
  const app = await NestFactory.create(WriteApiModule);
  await app.listen(3000);
}
bootstrap();
