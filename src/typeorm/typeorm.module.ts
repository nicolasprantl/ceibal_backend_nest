import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../entity/Device';
import { Evaluation } from '../entity/Evaluation';
import { Media } from '../entity/Media';
import { Brand } from '../entity/Brand';
import { Connection } from 'typeorm';

@Module({
    imports: [
        NestTypeOrmModule.forRoot({
            type: 'mysql',
            host: '34.16.109.81',
            port: 3306,
            username: 'root',
            password: 'Ceibal2023.',
            database: 'ceibal',
            synchronize: true,
            logging: true,
            entities: [Device, Evaluation, Media, Brand],
        }),
        NestTypeOrmModule.forFeature([Device, Evaluation, Media, Brand]),
    ],
    exports: [NestTypeOrmModule],
})
export class TypeOrmModule implements OnModuleInit {
    constructor(private connection: Connection) {}

    async onModuleInit() {
        const isConnected = this.connection.isConnected;
        console.log(`Database connection established: ${isConnected}`);
    }
}