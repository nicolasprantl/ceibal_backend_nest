import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Type } from '@prisma/client';
import { spawn } from 'child_process';
import * as tmp from 'tmp';
import * as fs from 'fs/promises';
import { EvaluationType } from '../enums/evaluation-type.enum';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(EvaluationService.name);

  async getEvaluations(pageQuery: string) {
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
    return this.prisma.evaluation.findFirst({
      where: { id },
      include: { device: true },
    });
  }

  async createEvaluation(deviceId: number, user: string, evaluationType: Type) {
    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
    });
    console.log('Device:', device);
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
    return this.prisma.evaluation.delete({
      where: { id },
    });
  }

  async updateEvaluation(id: number, data: any) {
    return this.prisma.evaluation.update({
      where: { id },
      data,
    });
  }

  async updateEvaluationResult(id: number, result: any) {
    return this.prisma.evaluation.update({
      where: { id },
      data: { result },
    });
  }

  private async runPythonScript(
    scriptPath: string,
    args: any,
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
        reject(err);
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          this.logger.error(`Python Script Error Output: ${error}`);
          reject(new Error(`Script failed with code ${code}: ${error}`));
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
      const { average_luminance_error, average_color_error } =
        parsedComparisonResult;

      await this.updateEvaluationResult(
        Number(evaluationId),
        parsedComparisonResult,
      );

      tmpFile.removeCallback();
      return {
        lab_format,
        filename,
        average_luminance_error,
        average_color_error,
      };
    } catch (error) {
      throw new Error(`Error during color evaluation: ${error.message}`);
    }
  }

  async createEvaluationWithImage(
    id: number,
    evaluationType: EvaluationType,
    imageData: Buffer,
  ) {
    const evaluation = await this.createEvaluation(id, 'user', evaluationType);
    const image = await this.prisma.media.create({
      data: {
        data: imageData,
        evaluationId: evaluation.id,
      },
    });

    return {
      imageId: image.id,
      evaluationId: evaluation.id,
    };
  }
}
