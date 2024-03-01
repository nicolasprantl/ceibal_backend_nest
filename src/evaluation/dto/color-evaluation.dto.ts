import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CoordinateDto {
    @IsInt()
    @IsNotEmpty()
    x: number;

    @IsInt()
    @IsNotEmpty()
    y: number;
}

export class ColorEvaluationDto {
    @IsInt()
    @IsNotEmpty()
    imageId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CoordinateDto)
    coordinates: CoordinateDto[];

    readonly user: string;
}
