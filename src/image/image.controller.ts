import { Controller, Get, Res, Param } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get(':id')
  async getImageById(@Param('id') id: string, @Res() res: Response) {
    const imageBuffer = await this.imageService.getImageBufferById(Number(id));

    if (!imageBuffer) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': imageBuffer.length,
    });
    res.end(imageBuffer);
  }
}
