import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Readable } from 'stream';
import * as archiver from 'archiver';

@Injectable()
export class MediaService {
    private readonly logger = new Logger(MediaService.name);

    constructor(private prisma: PrismaService) {}

    async getMediaById(
        id: number,
    ): Promise<{ id: number; data: Buffer; mimeType: string }[] | null> {
        try {
            const media = await this.prisma.media.findMany({
                where: { evaluationId: id },
                select: { id: true, data: true, mimeType: true },
            });

            if (!media || media.length === 0) {
                this.logger.error(`Media not found for ID: ${id}`);
                return null;
            }

            this.logger.debug(`Retrieved media for ID: ${id}`);

            return media.map((m) => ({
                id: m.id,
                data: m.data,
                mimeType: m.mimeType,
            }));
        } catch (error) {
            this.logger.error(
                `Error retrieving media for ID: ${id}: ${error.message}`,
            );
            return null;
        }
    }

    async createMediaZip(
        media: { id: number; data: Buffer; mimeType: string }[],
    ): Promise<Readable> {
        const archive = archiver('zip');

        for (const file of media) {
            const { id, data, mimeType } = file;
            archive.append(data, {
                name: `media_${id}.${mimeType.split('/')[1]}`,
            });
        }

        archive.finalize();
        return archive;
    }
}
