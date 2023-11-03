// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private logger: LoggerService) {
    super();
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
