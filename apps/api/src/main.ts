import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { prepareEnvironment } from './prepare-environment';

async function bootstrap() {
  await prepareEnvironment();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  app.useBodyParser('json', { limit: '25mb' });
  app.useBodyParser('urlencoded', { limit: '25mb', extended: true });

  app.use(
    (
      req: {
        path: string;
        headers: Record<string, unknown>;
        body?: unknown;
      },
      _res: unknown,
      next: () => void
    ) => {
      console.log('REQUEST', {
        path: req.path,
        contentType: req.headers['content-type'],
        contentLength: req.headers['content-length'],
        bodyAlreadyParsed: req.body !== undefined,
      });
      next();
    }
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });
  const port = Number(process.env.PORT ?? 8080);
  await app.listen(port, '0.0.0.0');
  console.log(`API listening on 0.0.0.0:${port}`);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
