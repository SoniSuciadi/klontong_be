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
