import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { DeviceModule } from './device/device.module';
import { MediaModule } from './media/media.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { PingController } from './ping.controller';
import { BrandModule } from './brand/brand.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        DeviceModule,
        MediaModule,
        EvaluationModule,
        BrandModule,
    ],
    controllers: [PingController],
})
export class AppModule {}
