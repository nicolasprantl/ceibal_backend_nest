import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import {Type} from "../../entity/Type";

export class CreateEvaluationDto {
    @IsNumber()
    @IsNotEmpty()
    readonly deviceId: number;

    @IsString()
    @IsNotEmpty()
    readonly user: string;

    @IsEnum(Type)
    readonly evaluationType: Type;
}
