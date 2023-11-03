import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);
  app.enableCors();

  await app.listen(process.env.PORT || 8080);
  logger.log(`Aplicación iniciada en el puerto ${await app.getUrl()}`);
}
bootstrap();
