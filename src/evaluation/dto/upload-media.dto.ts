import { IsEnum, IsNotEmpty } from 'class-validator';
import {Type} from "../../entity/Type";

export class UploadMediaDto {
    @IsNotEmpty()
    id: string;

    @IsEnum(Type)
    evaluationType: Type;
}
