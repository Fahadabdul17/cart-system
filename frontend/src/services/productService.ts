import api from './api';
import type { Product } from '../types';

export async function listProducts(): Promise<Product[]> {
  const res = await api.get('/products');
  return res.data as Product[];
}

export async function createProduct(payload: Partial<Product>) {
  const res = await api.post('/products', payload);
  return res.data as Product;
}
