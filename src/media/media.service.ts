import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../entity/Media';

@Injectable()
export class MediaService {
    private readonly logger = new Logger(MediaService.name);

    constructor(
        @InjectRepository(Media)
        private mediaRepository: Repository<Media>,
    ) {}

    async getMediaById(
        id: number,
    ): Promise<{ data: Buffer; mimeType: string } | null> {
        try {
            const media = await this.mediaRepository.findOne({
                where: { id },
                select: ['data', 'mimeType'],
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