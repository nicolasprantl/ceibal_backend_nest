import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { DeviceModule } from './device/device.module';
import { MediaModule } from './media/media.module';
import { EvaluationModule } from './evaluation/evaluation.module';

@Module({
  imports: [PrismaModule, DeviceModule, MediaModule, EvaluationModule],
})
export class AppModule {}
