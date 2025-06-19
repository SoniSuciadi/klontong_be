import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from '@nestjs/class-validator';

export type ProductDetailDto = {
  id: string;
  sku: string;
  name: string;
  description: string;
  weight: number;
  width: number;
  length: number;
  height: number;
  image: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  categoryName: string;
};

export type Product = {
  name: string;
  price: number;
  id: string;
  image: string;
};

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsNumber()
  @IsPositive()
  height: number;

  @IsNumber()
  @IsPositive()
  width: number;

  @IsNumber()
  @IsPositive()
  weight: number;

  @IsNumber()
  @IsPositive()
  length: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
