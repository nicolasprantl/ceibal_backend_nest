import { Module } from '@nestjs/common';
import { ThresholdController } from './threshold.controller';
import { ThresholdService } from './threshold.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ThresholdController],
    providers: [ThresholdService],
})
export class ThresholdModule {}
