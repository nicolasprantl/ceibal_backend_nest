import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../entity/Device';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DeviceService {
    private readonly logger = new Logger(DeviceService.name);

    constructor(
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>,
    ) {}

    async create(createDeviceDto: CreateDeviceDto) {
        const device = this.deviceRepository.create(createDeviceDto);
        const savedDevice = await this.deviceRepository.save(device);
        this.logger.log(`Device created with ID: ${savedDevice.id}`);
        return savedDevice;
    }

    async findAll() {
        const devices = await this.deviceRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });
        this.logger.log(`Retrieved all devices. Count: ${devices.length}`);
        return devices;
    }

    async findOne(id: number) {
        const device = await this.deviceRepository.createQueryBuilder('device')
            .leftJoinAndSelect('device.evaluations', 'evaluation')
            .where('device.id = :id', { id })
            .orderBy('evaluation.createdAt', 'DESC')
            .getOne();

        if (!device) {
            this.logger.error(`Device with ID ${id} not found`);
            throw new NotFoundException(`Device with ID ${id} not found`);
        }
        this.logger.debug(`Retrieved device with ID: ${id}`);
        return device;
    }

    async update(id: number, updateDeviceDto: UpdateDeviceDto) {
        const device = await this.deviceRepository.preload({
            id: Number(id),
            ...updateDeviceDto,
        });
        if (!device) {
            this.logger.error(`Device with ID ${id} not found`);
            throw new NotFoundException(`Device with ID ${id} not found`);
        }
        await this.deviceRepository.save(device);
        this.logger.log(`Updated device with ID: ${id}`);
        return device;
    }

    async remove(id: number) {
        const device = await this.deviceRepository.findOne({ where: { id } });
        if (!device) {
            this.logger.error(`Device with ID ${id} not found`);
            throw new NotFoundException(`Device with ID ${id} not found`);
        }
        await this.deviceRepository.remove(device);
        this.logger.log(`Removed device with ID: ${id}`);
    }
}