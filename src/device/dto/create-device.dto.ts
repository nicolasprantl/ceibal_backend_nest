import { IsString, IsEnum, IsOptional } from 'class-validator';
import {Category} from "../../entity/Category";

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
}
