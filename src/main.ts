import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { defaultPORT, globalRoutePrefix } from './common/constants';
import * as Sentry from '@sentry/node';
import { SentryExceptionInterceptor } from './common/interceptors/sentry.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalRoutePrefix);

  // Sentry.init({
  //   dsn: process.env.SENTRY_DSN,
  //   tracesSampleRate: 1.0,
  // });
  // app.useGlobalInterceptors(new SentryExceptionInterceptor());
  // app.use(Sentry.Handlers.requestHandler());
  // app.use(Sentry.Handlers.tracingHandler());

  await app.listen(process.env.PORT ? process.env.PORT : defaultPORT);
}
bootstrap();
