import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerService } from './logger/logger.service';
import { DeviceModule } from './device/device.module';
import { ImageModule } from './image/image.module';
import { EvaluationModule } from './evaluation/evaluation.module';

@Module({
  imports: [PrismaModule, DeviceModule, ImageModule, EvaluationModule],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule {}
