import { Controller, Get, Res, Param } from '@nestjs/common';
import { MediaService } from './media.service';
import { Response } from 'express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':id')
  async getMediaById(@Param('id') id: string, @Res() res: Response) {
    const media = await this.mediaService.getMediaById(Number(id));

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    const { data, mimeType } = media;

    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="media${
        mimeType.split('/')[1]
      }"`,
      'Content-Length': data.length,
    });
    res.end(data);
  }
}
