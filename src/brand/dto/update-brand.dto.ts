import { IsString } from 'class-validator';

export class UpdateBrandDto {
    @IsString()
    readonly name: string;
}
