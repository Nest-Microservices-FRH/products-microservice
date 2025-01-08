import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { Product } from './entities/product.entity';
import { ProductFindAllResponse } from './interfaces';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

  @Post()
    create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.create(createProductDto);
    }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<ProductFindAllResponse> {
      return this.productsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
      return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
      return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
      return this.productsService.remove(+id);
  }
}
