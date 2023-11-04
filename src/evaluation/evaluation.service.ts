import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Type } from '@prisma/client';
import { spawn } from 'child_process';
import * as tmp from 'tmp';
import * as fs from 'fs/promises';
import { EvaluationType } from '../enums/evaluation-type.enum';
import { PythonScriptError } from '../exception/PythonScriptError';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(EvaluationService.name);

  async getEvaluations(pageQuery: string) {
    this.logger.log(`Fetching evaluations with page query: ${pageQuery}`);

    const page = Number(pageQuery) - 1;
    const recordsPerPage = 10;
    if (page === -1 || Number.isNaN(page)) {
      return this.prisma.evaluation.findMany();
    }
    return this.prisma.evaluation.findMany({
      skip: recordsPerPage * page,
      take: recordsPerPage,
    });
  }

  async getEvaluation(id: number) {
    this.logger.log(`Fetching evaluation with ID: ${id}`);

    return this.prisma.evaluation.findFirst({
      where: { id },
      include: { device: true },
    });
  }

  async createEvaluation(deviceId: number, user: string, evaluationType: Type) {
    this.logger.log(
      `Creating evaluation for device ID: ${deviceId}, User: ${user}, Type: ${evaluationType}`,
    );

    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
    });
    this.logger.debug(`Device: ${JSON.stringify(device)}`);
    if (!device) {
      throw new Error('Device not found');
    }

    const evaluationData = {
      user,
      result: {},
      type: evaluationType,
      device: {
        connect: { id: deviceId },
      },
    };

    return this.prisma.evaluation.create({
      data: evaluationData,
    });
  }

  async deleteEvaluation(id: number) {
    this.logger.log(`Deleting evaluation with ID: ${id}`);

    return this.prisma.evaluation.delete({
      where: { id },
    });
  }

  async updateEvaluation(id: number, data: any) {
    this.logger.log(`Updating evaluation with ID: ${id}`);

    return this.prisma.evaluation.update({
      where: { id },
      data,
    });
  }

  async updateEvaluationResult(id: number, result: any) {
    this.logger.log(`Updating evaluation result for ID: ${id}`);

    return this.prisma.evaluation.update({
      where: { id },
      data: { result },
    });
  }

  private async runPythonScript(
    scriptPath: string,
    args: any[],
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [scriptPath, ...args]);

      let result = '';
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      let error = '';
      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('error', (err) => {
        this.logger.error('Error spawning Python script:', err);
        reject(
          new PythonScriptError(
            'Error spawning Python script',
            null,
            err.message,
          ),
        );
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          this.logger.error(`Python Script Error Output: ${error}`);
          reject(new PythonScriptError('Script failed', code, error));
        } else {
          resolve(result);
        }
      });
    });
  }

  async colorEvaluation(
    imageId: number,
    coordinates: { x: number; y: number }[],
    evaluationId: number,
  ): Promise<any> {
    this.logger.log(
      `Starting color evaluation for image ID: ${imageId} and evaluation ID: ${evaluationId}`,
    );

    const pythonColorScriptPath =
      process.env.PYTHON_COLOR_SCRIPT_PATH || 'src/scripts/get_colors.py';
    const pythonCompareScriptPath =
      process.env.PYTHON_COMPARE_SCRIPT_PATH || 'src/scripts/color_compare.py';
    let tmpFile: tmp.FileResult | null = null;

    try {
      const imageBuffer = await this.prisma.media.findUnique({
        where: { id: imageId },
        select: { data: true },
      });

      if (!imageBuffer) {
        throw new Error('Image buffer is null');
      }

      tmpFile = tmp.fileSync({ postfix: '.jpeg' });
      await fs.writeFile(tmpFile.name, imageBuffer.data);

      const formattedCoordinates = coordinates
        .map((coordinate) => [coordinate.x.toString(), coordinate.y.toString()])
        .flat();

      const result = await this.runPythonScript(pythonColorScriptPath, [
        tmpFile.name,
        formattedCoordinates,
      ]);

      const parsedResult = JSON.parse(result);
      const { lab_format, filename } = parsedResult;
      const comparisonResult = await this.runPythonScript(
        pythonCompareScriptPath,
        [filename],
      );
      const parsedComparisonResult = JSON.parse(comparisonResult);
      const { desvio_grises, desvio_color } = parsedComparisonResult;
      this.logger.debug(
        `Evaluation result: luminancia ${desvio_grises}, color ${desvio_color} and evaluation ID: ${evaluationId}`,
      );
      await this.updateEvaluationResult(
        Number(evaluationId),
        parsedComparisonResult,
      );

      tmpFile.removeCallback();
      return {
        lab_format,
        filename,
        desvio_grises,
        desvio_color,
      };
    } catch (error) {
      throw new Error(`Error during color evaluation: ${error.message}`);
    }
  }

  async noiseEvaluation(videoId: number, evaluationId: number): Promise<any> {
    this.logger.log(
      `Starting noise evaluation for video ID: ${videoId} and evaluation ID: ${evaluationId}`,
    );

    const pythonNoiseScriptPath =
      process.env.PYTHON_NOISE_SCRIPT_PATH || 'src/scripts/noise.py';
    let tmpFile: tmp.FileResult | null = null;

    try {
      const videoBuffer = await this.prisma.media.findUnique({
        where: { id: videoId },
        select: { data: true },
      });

      if (!videoBuffer) {
        throw new Error('Video buffer is null');
      }

      tmpFile = tmp.fileSync({ postfix: '.mp4' });
      await fs.writeFile(tmpFile.name, videoBuffer.data);

      const result = await this.runPythonScript(pythonNoiseScriptPath, [
        tmpFile.name,
      ]);

      const parsedResult = JSON.parse(result);
      const { nivel_de_ruido, luminancia } = parsedResult;
      await this.updateEvaluationResult(Number(evaluationId), parsedResult);
      this.logger.debug(
        `Evaluation result: ruido ${nivel_de_ruido}, luminancia ${luminancia} and evaluation ID: ${evaluationId}`,
      );
      tmpFile.removeCallback();
      return { nivel_de_ruido, luminancia };
    } catch (error) {
      if (tmpFile) {
        tmpFile.removeCallback();
      }
      throw new Error(`Error during noise evaluation: ${error.message}`);
    }
  }

  async createEvaluationWithMedia(
    id: number,
    evaluationType: EvaluationType,
    imageData: Buffer,
    type: string,
  ) {
    this.logger.log(
      `Creating evaluation with media type ${type} for device ID: ${id} and evaluation type: ${evaluationType}`,
    );

    const evaluation = await this.createEvaluation(id, 'user', evaluationType);
    this.logger.log(`Evaluation created with ID: ${evaluation.id}`);

    const image = await this.prisma.media.create({
      data: {
        data: imageData,
        evaluationId: evaluation.id,
        mimeType: type,
      },
    });
    this.logger.log(`Image media created with ID: ${image.id}`);

    return {
      imageId: image.id,
      evaluationId: evaluation.id,
    };
  }
}
