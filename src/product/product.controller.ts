import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto, Product, ProductDetailDto } from './product.dto';
import { Data } from 'src/common/types';
import { ImagekitService } from 'src/imagekit/imagekit.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly imagekitService: ImagekitService,
  ) {}

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
  @Post()
  @UseInterceptors(FileInterceptor('image')) // Handles image file upload
  async createProduct(
    @Body() createProductDto: ProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    let imageUrl = createProductDto.imageUrl;

    if (image) {
      imageUrl = await this.imagekitService.uploadImage(image); // Upload the image
    }

    return this.productService.createProduct({
      ...createProductDto,
      image: imageUrl || '',
    });
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Body() updateProductDto: ProductDto,
    @UploadedFile() image: Express.Multer.File,
    @Param('id') id: string,
  ) {
    let imageUrl = updateProductDto.imageUrl;
    if (image) {
      imageUrl = await this.imagekitService.uploadImage(image);
    }

    return this.productService.updateProduct({
      ...updateProductDto,
      image: imageUrl,
      id,
    });
  }
}
