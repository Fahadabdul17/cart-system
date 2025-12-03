import prisma from '../prismaClient';
import { CreateProductInput } from '../dtos/productDto';

export async function listProducts() {
  return prisma.product.findMany();
}

export async function createProduct(input: CreateProductInput) {
  // Convert price string to Decimal via Prisma auto conversion (string allowed)
  return prisma.product.create({
    data: {
      sku: input.sku,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock
    }
  });
}