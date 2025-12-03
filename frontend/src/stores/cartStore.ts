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
    },

    // -----------------------------
    // New actions for drawer controls
    // -----------------------------

    /**
     * Tambah qty 1 pada item, jika tidak ada buat baru (qty=1)
     */
    increment(productId: string) {
      const it = this.items.find(i => i.productId === productId);
      if (it) {
        it.qty = it.qty + 1;
      } else {
        // kalau ingin membuat item baru saat increment dipanggil tanpa ada item:
        // this.items.push({ productId, qty: 1, price: '0', product: null });
      }
    },

    /**
     * Kurangi qty 1 pada item. Jika qty <= 0 maka hapus item.
     */
    decrement(productId: string) {
      const it = this.items.find(i => i.productId === productId);
      if (!it) return;
      it.qty = it.qty - 1;
      if (it.qty <= 0) {
        this.remove(productId);
      }
    },

    /**
     * Set qty langsung (mis. dari input number). Jika qty <= 0 hapus item.
     */
    setQty(productId: string, qty: number) {
      const it = this.items.find(i => i.productId === productId);
      if (!it) return;
      if (Number.isNaN(qty) || qty <= 0) {
        this.remove(productId);
      } else {
        it.qty = Math.floor(qty);
      }
    },

    /**
     * Hapus item dari cart
     */
    remove(productId: string) {
      this.items = this.items.filter(i => i.productId !== productId);
    }
  }
});
