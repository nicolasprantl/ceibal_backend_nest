import { IsEnum, IsNotEmpty } from 'class-validator';
import { EvaluationType } from '../../enums/evaluation-type.enum';

export class UploadImageDto {
  @IsNotEmpty()
  id: string;

  @IsEnum(EvaluationType)
  evaluationType: EvaluationType;
}
