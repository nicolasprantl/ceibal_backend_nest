import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  async getImageBufferById(id: number): Promise<Buffer | null> {
    try {
      const image = await this.prisma.image.findUnique({
        where: { evaluationId: id },
        select: { data: true },
      });

      if (!image) {
        console.error('Image register not found id:', id);
        return null;
      }

      console.log('Retrieved image:', image);
      return image.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
}
