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

    async findOne(id: number): Promise<Product | null> {
        const product = await this.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException(`Product #${id} not found`);
        }

        return product;
    }

    update(id: number, updateProductDto: UpdateProductDto) {
        return `This action updates a #${id} product`;
    }

    remove(id: number) {
        return `This action removes a #${id} product`;
    }
}
