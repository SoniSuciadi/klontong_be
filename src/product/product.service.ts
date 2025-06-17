import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDetailDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.categories.findMany({
      select: {
        name: true,
      },
    });

    return categories.map((category) => category.name);
  }

  async getProductList(): Promise<{ name: string; price: number }[]> {
    const products = await this.prisma.products.findMany({
      select: {
        name: true,
        price: true,
        id: true,
        image: true,
      },
    });

    return products;
  }

  async getProductDetail(id: string): Promise<ProductDetailDto> {
    const product = await this.prisma.products.findUnique({
      where: { id },
      select: {
        name: true,
        description: true,
        price: true,
        category: {
          select: {
            name: true,
          },
        },
        height: true,
        width: true,
        weight: true,
        image: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        length: true,
        sku: true,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return {
      ...product,
      categoryName: product.category?.name,
    };
  }
}
