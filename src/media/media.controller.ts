import { Controller, Get, Res, Param } from '@nestjs/common';
import { MediaService } from './media.service';
import { Response } from 'express';

@Controller('images')
export class MediaController {
  constructor(private readonly imageService: MediaService) {}

  @Get(':id')
  async getImageById(@Param('id') id: string, @Res() res: Response) {
    const mediaBuffer = await this.imageService.getMediaBufferById(Number(id));

    if (!mediaBuffer) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.writeHead(200, {
      'Content-Type': 'media/jpeg',
      'Content-Length': mediaBuffer.length,
    });
    res.end(mediaBuffer);
  }
}
