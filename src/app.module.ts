// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeviceModule } from './device/device.module';
import { MediaModule } from './media/media.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import {PingController} from "./ping.controller";
import {TypeOrmModule} from "./typeorm/typeorm.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule,
        DeviceModule,
        MediaModule,
        EvaluationModule,
    ],
    controllers: [PingController],
})
export class AppModule {}