import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';
import { prepareEnvironment } from './prepare-environment';

async function bootstrap() {
  await prepareEnvironment();

  const server = express();
  server.use((req, _res, next) => {
    console.log('REQUEST', {
      path: req.path,
      contentType: req.headers['content-type'],
      contentLength: req.headers['content-length'],
      bodyAlreadyParsed: req.body !== undefined,
    });
    next();
  });
  server.use(express.json({ limit: '25mb' }));
  server.use(express.urlencoded({ limit: '25mb', extended: true }));

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
    {
      bodyParser: false,
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
