<template>
  <div>
    <h2 class="h-title" style="margin-bottom:12px">Cart</h2>
    <div v-if="!cart.cartId">Keranjang kosong</div>
    <div v-else>
      <table style="width:100%; background:var(--white); border-collapse:collapse;">
        <thead>
          <tr style="text-align:left">
            <th>Produk</th><th>Qty</th><th>Harga</th><th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="it in items" :key="it.productId" style="border-top:1px solid var(--gray-100)">
            <td>{{ it.product?.name || it.productId }}</td>
            <td>{{ it.qty }}</td>
            <td>Rp {{ Number(it.price).toFixed(0) }}</td>
            <td>Rp {{ (Number(it.price) * it.qty).toFixed(0) }}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center">
        <div><strong>Subtotal:</strong> Rp {{ subtotal.toFixed(0) }}</div>
        <div><button class="btn btn-primary">Checkout</button></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useCartStore } from '../stores/cartStore';
import api from '../services/api';
import type { CartItem } from '../types';

export default defineComponent({
  setup() {
    const cart = useCartStore();

    const items = computed<CartItem[]>(() => cart.items);
    const subtotal = computed(() => items.value.reduce((s, i) => s + Number(i.price) * i.qty, 0));

    onMounted(async () => {
      if (cart.cartId) {
        try {
          const res = await api.get(`/carts/${cart.cartId}`);
          const mapped = res.data.items.map((it: any) => ({ id: it.id, cartId: it.cartId, productId: it.productId, qty: it.qty, price: it.price, product: it.product }));
          cart.setItems(mapped);
        } catch (err) { console.error(err); }
      }
    });

    return { cart, items, subtotal };
  }
});
</script>
