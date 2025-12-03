<template>
  <div>
    <h2 class="h-title" style="margin-bottom:16px">Produk Pilihan</h2>
    <div v-if="loading">Loading…</div>
    <div v-else class="products-grid">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import { listProducts } from '../services/productService';
import type { Product } from '../types';

export default defineComponent({
  components: { ProductCard },
  setup() {
    const products = ref<Product[]>([]);
    const loading = ref(true);

    onMounted(async () => {
      try {
        products.value = await listProducts();
      } catch (err) {
        console.error(err);
      } finally {
        loading.value = false;
      }
    });

    return { products, loading };
  }
});
</script>
