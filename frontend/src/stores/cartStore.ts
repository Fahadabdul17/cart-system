import { defineStore } from 'pinia';
import type { CartItem, Product } from '../types';

type State = {
  cartId: string | null;
  items: CartItem[];
};

export const useCartStore = defineStore('cart', {
  state: (): State => ({
    cartId: null,
    items: []
  }),
  getters: {
    total: (state) => state.items.reduce((s, i) => s + Number(i.price) * i.qty, 0),
    totalItems: (state) => state.items.reduce((s, i) => s + i.qty, 0)
  },
  actions: {
    setCartId(id: string) {
      this.cartId = id;
    },

    /**
     * Add or update an item locally.
     * Accepts optional `product` snapshot so UI (drawer) can show image immediately.
     */
    addLocalItem(item: { productId: string; qty: number; price: string; product?: Product | null }) {
      const found = this.items.find(i => i.productId === item.productId);
      if (found) {
        found.qty += item.qty;
        if (!found.product && item.product) found.product = item.product;
      } else {
        const cartItem: CartItem = {
          productId: item.productId,
          qty: item.qty,
          price: item.price,
          product: item.product || null
        };
        this.items.push(cartItem);
      }
    },

    setItems(items: CartItem[]) {
      this.items = items;
    },

    clear() {
      this.cartId = null;
      this.items = [];
    }
  }
});
