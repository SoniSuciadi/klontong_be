import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDetailDto } from './product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('categories')
  async getCategories(): Promise<string[]> {
    return this.productService.getCategories();
  }

  @Get('list')
  async getProductList(): Promise<{ name: string; price: number }[]> {
    return this.productService.getProductList();
  }

  @Get('detail/:id')
  async getProductDetail(@Param('id') id: string): Promise<ProductDetailDto> {
    return this.productService.getProductDetail(id);
  }
}
