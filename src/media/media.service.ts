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
    ): Promise<{ id: number; data: Buffer; mimeType: string, name: string }[] | null> {
        try {
            const media = await this.prisma.media.findMany({
                where: { evaluationId: id },
                select: { id: true, data: true, mimeType: true, name: true },
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
                name: m.name,
            }));
        } catch (error) {
            this.logger.error(
                `Error retrieving media for ID: ${id}: ${error.message}`,
            );
            return null;
        }
    }

    async createMediaZip(
        media: { id: number; data: Buffer; mimeType: string, name: string }[],
    ): Promise<Readable> {
        const archive = archiver('zip');

        for (const file of media) {
            const { id, data, mimeType, name } = file;
            archive.append(data, {
                name: `media_${name}_${id}.${mimeType.split('/')[1]}`,
            });
        }

        archive.finalize();
        return archive;
    }
}
