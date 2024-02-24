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
import { UploadMediaDto } from './dto/upload-media.dto';
import { multerOptions } from '../config/multer.config';

@Controller('evaluations')
export class EvaluationController {
    constructor(private readonly evaluationService: EvaluationService) {}

    @Get()
    getEvaluations(@Query('page') page: string) {
        return this.evaluationService.getEvaluations(page);
    }

    @Get(':id')
    getEvaluation(@Param('id') id: string) {
        return this.evaluationService.getEvaluation(parseInt(id));
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
    deleteEvaluation(@Param('id') id: string) {
        return this.evaluationService.deleteEvaluation(parseInt(id));
    }

    @Post('/upload-media')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async uploadMedia(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadMediaDto: UploadMediaDto,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const isImage = file.mimetype.startsWith('image/');
        const isVideo = file.mimetype.startsWith('video/');

        if (!isImage && !isVideo) {
            throw new BadRequestException('Unsupported file type');
        }

        try {
            const result =
                await this.evaluationService.createEvaluationWithMedia(
                    Number(uploadMediaDto.id),
                    uploadMediaDto.evaluationType,
                    file.buffer,
                    file.mimetype,
                );
            return result;
        } catch (error) {
            throw new InternalServerErrorException(
                'An error occurred while processing the media',
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
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post(':id/noise-evaluation')
    async noiseEvaluation(
        @Param('id') evaluationId: number,
        @Body() colorEvaluationDto: ColorEvaluationDto,
    ) {
        try {
            return await this.evaluationService.noiseEvaluation(
                colorEvaluationDto.imageId,
                evaluationId,
            );
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post(':id/resolution-evaluation')
    async resolutionEvaluation(
        @Param('id') evaluationId: number,
        @Body() formData: any,
    ) {
        try {
            return await this.evaluationService.resolutionEvaluation(
                evaluationId,
                formData,
            );
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
