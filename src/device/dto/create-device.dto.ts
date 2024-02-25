import { IsString, IsEnum, IsOptional } from 'class-validator';
import { Category } from '../../enums/category.enum';

export class CreateDeviceDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly brand: string;

    @IsEnum(Category)
    readonly category: Category;

    @IsString()
    @IsOptional()
    readonly description?: string;

    @IsString()
    @IsOptional()
    readonly tender?: string;

    @IsString()
    readonly user: string;
}
