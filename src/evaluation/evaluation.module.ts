import { Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluation } from '../entity/Evaluation';
import { DeviceModule } from '../device/device.module';
import {MediaModule} from "../media/media.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Evaluation]),
        DeviceModule,
        MediaModule,
    ],
    controllers: [EvaluationController],
    providers: [EvaluationService],
})
export class EvaluationModule {}