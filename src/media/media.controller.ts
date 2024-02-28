import { Controller, Get, Res, Param } from '@nestjs/common';
import { MediaService } from './media.service';
import { Response } from 'express';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Get(':id')
    async getMediaById(@Param('id') id: string, @Res() res: Response) {
        const media = await this.mediaService.getMediaById(Number(id));
        if (!media || media.length === 0) {
            return res.status(404).json({ error: 'Media not found' });
        }
        const archive = await this.mediaService.createMediaZip(media);
        res.writeHead(200, {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="media.zip"`,
        });
        archive.pipe(res);
    }
}