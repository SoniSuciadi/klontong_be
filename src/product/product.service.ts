import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product, ProductDetailDto } from './product.dto';
import { Prisma } from 'generated/prisma';
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

  async getProductList(
    cursor?: string,
    limit: number = 10,
    search?: string,
    category?: string,
  ): Promise<Product[]> {
    const categoryList = category?.split(',').filter((el) => !!el);

    const products = await this.prisma.$queryRaw<Product[]>`
      SELECT 
        p.id, 
        p.name, 
        p.price, 
        p.image, 
        p.category_id AS "categoryName"
      FROM products p
      WHERE p.name ILIKE ${`%${search || ''}%`}  
      ${categoryList?.length ? Prisma.sql`AND p.category_id IN (${Prisma.join(categoryList)})` : Prisma.empty}  
      ${cursor ? Prisma.sql`AND p.id < ${cursor}` : Prisma.empty}  
      ORDER BY p.id DESC 
      LIMIT ${limit};
    `;

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
        created_at: true,
        updated_at: true,
        length: true,
        sku: true,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return {
      ...product,
      categoryName: product.category.name,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      sku: product.sku || '',
    };
  }
  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    height: number;
    width: number;
    weight: number;
    image: string;
    length: number;
  }): Promise<Product> {
    try {
      const product = await this.prisma.products.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          category_id: data.categoryId,
          height: data.height,
          width: data.width,
          weight: data.weight,
          image: data.image,
          length: data.length,
        },
      });

      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Error creating product');
    }
  }
  async updateProduct(data: {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    categoryId?: string;
    height?: number;
    width?: number;
    weight?: number;
    image?: string;
    length?: number;
  }): Promise<Product> {
    try {
      const product = await this.prisma.products.update({
        where: {
          id: data.id,
        },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          category_id: data.categoryId,
          height: data.height,
          width: data.width,
          weight: data.weight,
          image: data.image,
          length: data.length,
        },
      });

      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Error updating product');
    }
  }
}
