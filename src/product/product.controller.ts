import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product, ProductDetailDto } from './product.dto';
import { Data } from 'src/common/types';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('categories')
  async getCategories(): Promise<Data<string[]>> {
    const categories = await this.productService.getCategories();
    return {
      message: 'Success getCategories',
      data: categories,
    };
  }

  @Get('detail/:id')
  async getProductDetail(
    @Param('id') id: string,
  ): Promise<Data<ProductDetailDto>> {
    const detail = await this.productService.getProductDetail(id);
    return {
      message: 'Success getProductDetail',
      data: detail,
    };
  }

  @Get('/')
  async getProductList(
    @Query('cursor') cursor?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ): Promise<Data<Product[]>> {
    const data = await this.productService.getProductList(
      cursor,
      12,
      search,
      category,
    );
    return {
      message: 'Success getProductList',
      data,
    };
  }
}
