import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async getMediaBufferById(id: number): Promise<Buffer | null> {
    try {
      const image = await this.prisma.media.findUnique({
        where: { evaluationId: id },
        select: { data: true },
      });

      if (!image) {
        console.error('Image register not found id:', id);
        return null;
      }

      console.log('Retrieved media:', image);
      return image.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
}
