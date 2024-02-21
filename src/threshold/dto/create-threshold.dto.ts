import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateThresholdDto {
    @IsString()
    readonly name: string;

    @IsObject()
    readonly config: Record<string, any>;
}
