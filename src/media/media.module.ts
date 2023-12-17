import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '../entity/Media';

@Module({
    imports: [TypeOrmModule.forFeature([Media])],
    controllers: [MediaController],
    providers: [MediaService],
    exports: [TypeOrmModule],
})
export class MediaModule {}