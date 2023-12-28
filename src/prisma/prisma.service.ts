import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
    Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(PrismaService.name);

    constructor(private configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get<string>('DATABASE_URL'),
                },
            },
        });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Conexión a la base de datos establecida.');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Conexión a la base de datos cerrada.');
    }
}
