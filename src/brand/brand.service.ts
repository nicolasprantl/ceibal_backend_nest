import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Brand, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandService {
    constructor(private prisma: PrismaService) {}

    async brand(id: Prisma.BrandWhereUniqueInput): Promise<Brand | null> {
        const brand = await this.prisma.brand.findUnique({
            where: id,
        });
        if (!brand) {
            throw new NotFoundException(`Brand with id ${id.id} not found`);
        }
        return brand;
    }

    async brands(): Promise<string[]> {
        const brands = await this.prisma.brand.findMany({
            select: {
                name: true,
            },
        });
        return brands.map((brand) => brand.name);
    }

    async createBrand(data: Prisma.BrandCreateInput): Promise<Brand> {
        const existingBrand = await this.prisma.brand.findUnique({
            where: { name: data.name },
        });

        if (existingBrand) {
            throw new ConflictException(
                `Brand with name ${data.name} already exists`,
            );
        }

        return this.prisma.brand.create({
            data,
        });
    }

    async updateBrand(params: {
        where: Prisma.BrandWhereUniqueInput;
        data: Prisma.BrandWhereUniqueInput;
    }): Promise<Brand> {
        const { where, data } = params;
        const brand = await this.prisma.brand.findUnique({ where });
        if (!brand) {
            throw new NotFoundException(`Brand with id ${where.id} not found`);
        }

        const existingBrand = await this.prisma.brand.findFirst({
            where: { name: data.name },
        });

        if (existingBrand && existingBrand.id !== where.id) {
            throw new ConflictException(
                `Brand with name ${data.name} already exists`,
            );
        }

        return this.prisma.brand.update({
            data,
            where,
        });
    }

    async deleteBrand(where: Prisma.BrandWhereUniqueInput): Promise<Brand> {
        const brand = await this.prisma.brand.findUnique({ where });
        if (!brand) {
            throw new NotFoundException(`Brand with id ${where.id} not found`);
        }
        return this.prisma.brand.delete({
            where,
        });
    }
}
