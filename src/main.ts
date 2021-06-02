import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { defaultPORT, globalRoutePrefix } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalRoutePrefix);
  await app.listen(process.env.PORT ? process.env.PORT : defaultPORT);
}
bootstrap();
