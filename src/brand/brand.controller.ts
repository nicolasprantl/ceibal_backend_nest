import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brand')
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @Post()
    create(@Body() createBrandDto: CreateBrandDto) {
        return this.brandService.createBrand(createBrandDto);
    }

    @Get()
    findAll() {
        return this.brandService.brands();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.brandService.brand({ id: +id });
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
        return this.brandService.updateBrand({
            where: { id: +id },
            data: updateBrandDto,
        });
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.brandService.deleteBrand({ id: +id });
    }
}
