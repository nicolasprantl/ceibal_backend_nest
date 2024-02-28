import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ThresholdService } from './threshold.service';
import { CreateThresholdDto } from './dto/create-threshold.dto';
import { UpdateThresholdDto } from './dto/update-threshold.dto';

@Controller('thresholds')
export class ThresholdController {
    constructor(private readonly thresholdService: ThresholdService) {}

    @Post()
    create(@Body() createDeviceDto: CreateThresholdDto) {
        return this.thresholdService.createThreshold(createDeviceDto);
    }

    @Get()
    findAll() {
        return this.thresholdService.getThresholds();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.thresholdService.getThreshold(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateThresholdDto: UpdateThresholdDto,
    ) {
        return this.thresholdService.updateThreshold(+id, updateThresholdDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.thresholdService.deleteThreshold(+id);
    }
}
