import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common';
import { ProductFindAllResponse } from './interfaces';
import { RpcException } from '@nestjs/microservices';

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

        const totalPage = await this.product.count({
            where: {
                available: true,
            },
        });
        const lastPage = Math.ceil(totalPage / limit);

        return {
            data: await this.product.findMany({
                take : limit,
                skip : (page - 1) * limit,
                where: {
                    available: true,
                },
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
            where: {
                id,
                available: true,
            },
        });

        if (!product) {
            throw new RpcException({
                message: `Product #${id} not found`,
                status : HttpStatus.BAD_REQUEST,
            });
        }

        return product;
    }

    async update(
        id: number,
        updateProductDto: UpdateProductDto,
    ): Promise<Product> {
        const { id: _, ...data } = updateProductDto;

        if (Object.keys(data).length === 0) {
            throw new RpcException('Update data cannot be empty');
        }

        await this.findOne(id);

        return this.product.update({
            where: { id },
            data,
        });
    }

    async remove(id: number): Promise<Product> {
        await this.findOne(id);

        const product = await this.product.update({
            where: { id },
            data : {
                available: false,
            },
        });

        return product;
    }

    async validateProducts(ids: number[]) {
        ids = Array.from(new Set(ids)); // Remove duplicate ids and convert to array

        const products = await this.product.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        if (products.length !== ids.length) {
            throw new RpcException({
                message: 'Some products are not found',
                status : HttpStatus.BAD_REQUEST,
            });
        }

        return products;
    }
}
