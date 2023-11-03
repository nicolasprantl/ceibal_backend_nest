// src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LoggerService } from '../logger/logger.service';

@Module({
  providers: [PrismaService, LoggerService],
  exports: [PrismaService],
})
export class PrismaModule {}
