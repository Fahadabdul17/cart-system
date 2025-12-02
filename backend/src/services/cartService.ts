import prisma from '../prismaClient';


export async function createCart() {
  return prisma.cart.create({ data: {} });
}

export async function addItem(cartId: string, productId: string, qty: number) {
  const product = await prisma.product.findUnique({ where: { id: productId }});
  if (!product) throw { status: 404, message: 'Product not found' };

  if (product.stock < qty) throw { status: 400, message: 'Insufficient stock' };

  // create or update cart item
  const existing = await prisma.cartItem.findFirst({ where: { cartId, productId }});
  if (existing) {
    const newQty = existing.qty + qty;
    // update qty and price snapshot
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { qty: newQty, price: product.price }
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId,
      productId,
      qty,
      price: product.price
    }
  });
}

export async function getCart(cartId: string) {
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: true } } }
  });
}
