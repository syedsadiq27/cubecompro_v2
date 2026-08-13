import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyMigrations } from './apply-migrations';

async function bootstrap() {
  await applyMigrations();
  const app = await NestFactory.create(AppModule);
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
