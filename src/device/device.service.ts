import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(private prisma: PrismaService) {}

  async create(createDeviceDto: CreateDeviceDto) {
    const device = await this.prisma.device.create({
      data: createDeviceDto,
    });
    this.logger.log(`Device created with ID: ${device.id}`);
    return device;
  }

  async findAll() {
    const devices = await this.prisma.device.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    this.logger.log(`Retrieved all devices. Count: ${devices.length}`);
    return devices;
  }

  async findOne(id: number) {
    const device = await this.prisma.device.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        evaluations: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    if (!device) {
      this.logger.error(`Device with ID ${id} not found`);
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
    this.logger.debug(`Retrieved device with ID: ${id}`);
    return device;
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto) {
    const device = await this.prisma.device.update({
      where: { id },
      data: updateDeviceDto,
    });
    this.logger.log(`Updated device with ID: ${id}`);
    return device;
  }

  async remove(id: number) {
    await this.prisma.device.delete({
      where: { id },
    });
    this.logger.log(`Removed device with ID: ${id}`);
  }
}
