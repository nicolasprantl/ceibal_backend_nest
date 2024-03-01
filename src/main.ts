import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { seedDatabase as seedDatabase } from '../prisma/seed';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    const configService = app.get(ConfigService);
    const port = configService.get('PORT') || 8081;

    await seedDatabase();

    await app.listen(port);
    logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
