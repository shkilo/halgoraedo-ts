import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalRoutePrefix } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalRoutePrefix);
  await app.listen(process.env.PORT);
}
bootstrap();
