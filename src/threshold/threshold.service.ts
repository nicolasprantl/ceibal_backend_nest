import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThresholdDto } from './dto/create-threshold.dto';
import { UpdateThresholdDto } from './dto/update-threshold.dto';

@Injectable()
export class ThresholdService {
    constructor(private prisma: PrismaService) {}

    private readonly logger = new Logger(ThresholdService.name);

    async getThresholds() {
        const thresholds = await this.prisma.threshold.findMany();

        this.logger.log(`Retrieved all devices. Count: ${thresholds.length}`);
        return thresholds;
    }

    async getThreshold(id: number) {
        this.logger.log(`Fetching threshold with ID: ${id}`);

        return this.prisma.threshold.findFirst({
            where: { id },
        });
    }

    async createThreshold(createThresholdDto: CreateThresholdDto) {
        const threshold = await this.prisma.threshold.create({
            data: createThresholdDto,
        });
        this.logger.log(`Threshold created with ID: ${threshold.id}`);
        return threshold;
    }

    async deleteThreshold(id: number) {
        this.logger.log(`Deleting threshold with ID: ${id}`);

        return this.prisma.threshold.delete({
            where: { id },
        });
    }

    async updateThreshold(id: number, updateThresholdDto: UpdateThresholdDto) {
        const threshold = await this.prisma.threshold.update({
            where: { id },
            data: updateThresholdDto,
        });
        this.logger.log(`Updated threshold with ID: ${id}`);
        return threshold;
    }
}
