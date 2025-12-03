export type Product = {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  price: string;
  stock: number;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CartItem = {
  id?: string;
  cartId?: string;
  productId: string;
  qty: number;
  price: string;
  product?: Product | null;
};
