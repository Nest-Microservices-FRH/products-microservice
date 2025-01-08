import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common';
import { ProductFindAllResponse } from './interfaces';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(ProductsService.name);

    onModuleInit(): void {
        this.$connect();
        this.logger.log('Connected to the database');
    }

    create(createProductDto: CreateProductDto): Promise<Product> {
        return this.product.create({
            data: createProductDto,
        });
    }

    async findAll(
        paginationDto: PaginationDto,
    ): Promise<ProductFindAllResponse> {
        const { limit, page } = paginationDto;

        const totalPage = await this.product.count();
        const lastPage = Math.ceil(totalPage / limit);

        return {
            data: await this.product.findMany({
                take: limit,
                skip: (page - 1) * limit,
            }),
            meta: {
                total: totalPage,
                page,
                lastPage,
            },
        };
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException(`Product #${id} not found`);
        }

        return product;
    }

    async update(
        id: number,
        updateProductDto: UpdateProductDto,
    ): Promise<Product> {
        if (Object.keys(updateProductDto).length === 0) {
            throw new NotFoundException('Update data cannot be empty');
        }

        this.findOne(id);

        return this.product.update({
            where: { id },
            data : updateProductDto,
        });
    }

    async remove(id: number): Promise<Product> {
        const product = await this.findOne(id);
        await this.product.delete({
            where: { id },
        });

        return product;
    }
}
