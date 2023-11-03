import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) {}

  async create(createDeviceDto: CreateDeviceDto) {
    return this.prisma.device.create({
      data: createDeviceDto,
    });
  }

  async findAll() {
    return this.prisma.device.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
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
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
    return device;
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return this.prisma.device.update({
      where: { id },
      data: updateDeviceDto,
    });
  }

  async remove(id: number) {
    return this.prisma.device.delete({
      where: { id },
    });
  }
}
