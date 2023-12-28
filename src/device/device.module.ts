import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../entity/Device';

@Module({
    imports: [
        TypeOrmModule.forFeature([Device]),
    ],
    controllers: [DeviceController],
    providers: [DeviceService],
    exports: [TypeOrmModule],
})
export class DeviceModule {}