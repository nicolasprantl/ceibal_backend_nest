import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(private prisma: PrismaService) {}

  async getMediaById(
    id: number,
  ): Promise<{ data: Buffer; mimeType: string } | null> {
    try {
      const media = await this.prisma.media.findUnique({
        where: { evaluationId: id },
        select: { data: true, mimeType: true },
      });

      if (!media) {
        this.logger.error(`Media not found for ID: ${id}`);
        return null;
      }

      this.logger.debug(`Retrieved media for ID: ${id}`);

      return {
        data: media.data,
        mimeType: media.mimeType,
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving media for ID: ${id}: ${error.message}`,
      );
      return null;
    }
  }
}
