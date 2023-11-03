import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ColorEvaluationDto } from './dto/color-evaluation.dto';
import { UploadImageDto } from './dto/upload-image.dto';
import { multerOptions } from '../config/multer.config';

@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Get()
  getEvaluations(@Query('page') page: string) {
    return this.evaluationService.getEvaluations(page);
  }

  @Get(':id')
  getEvaluation(@Param('id') id: number) {
    return this.evaluationService.getEvaluation(id);
  }

  @Post()
  createEvaluation(@Body() createEvaluationDto: CreateEvaluationDto) {
    return this.evaluationService.createEvaluation(
      createEvaluationDto.deviceId,
      createEvaluationDto.user,
      createEvaluationDto.evaluationType,
    );
  }

  @Delete(':id')
  deleteEvaluation(@Param('id') id: number) {
    return this.evaluationService.deleteEvaluation(id);
  }

  @Post('/upload-image')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadImageDto: UploadImageDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const result = await this.evaluationService.createEvaluationWithImage(
        Number(uploadImageDto.id),
        uploadImageDto.evaluationType,
        file.buffer,
      );
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while processing the image',
      );
    }
  }

  @Post(':id/color-evaluation')
  async colorEvaluation(
    @Param('id') evaluationId: number,
    @Body() colorEvaluationDto: ColorEvaluationDto,
  ) {
    try {
      return await this.evaluationService.colorEvaluation(
        colorEvaluationDto.imageId,
        colorEvaluationDto.coordinates,
        evaluationId,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
