<template>
  <article class="card" :aria-labelledby="`p-${product.id}`">
    <img :src="imgSrc" :alt="product.name" class="card-media" @error="onImgError" />

    <div class="card-body">
      <div class="card-info">
        <h3 :id="`p-${product.id}`" class="title">{{ product.name }}</h3>
        <p class="desc">{{ product.description }}</p>
      </div>

      <div class="card-footer">
        <div>
          <div class="price">Rp {{ formattedPrice }}</div>
        </div>
        <div>
          <button
            class="btn btn-primary"
            @click="handleAdd"
            :aria-label="`Tambah ${product.name} ke keranjang`"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 7h12l-1 9H7L6 7z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 7V5a3 3 0 116 0v2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
            <span>Tambah</span>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import type { Product } from '../types';
import { useCartStore } from '../stores/cartStore';
import api from '../services/api';

/**
 * Normalize image input:
 * - if value is a full URL -> return it
 * - if value starts with '/' -> return as-is (public path)
 * - if value looks like a storage key/filename -> build public URL using env vars
 * - otherwise return fallback
 */
function normalizeImage(image: unknown): string {
  const fallback = '/placeholder.jpg';
  if (!image) return fallback;

  if (typeof image !== 'string') return fallback;
  const trimmed = image.trim();
  if (!trimmed) return fallback;

  // full absolute URL
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // starts with slash -> public file in frontend/public
  if (trimmed.startsWith('/')) return trimmed;

  // looks like data URI
  if (/^data:image\//i.test(trimmed)) return trimmed;

  // otherwise assume it's a storage key/filename -> build Supabase public URL
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
  const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'product-images';
  if (SUPABASE_URL) {
    // ensure no trailing slash
    const base = SUPABASE_URL.replace(/\/+$/, '');
    // path: /storage/v1/object/public/<bucket>/<key>
    return `${base}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(trimmed)}`;
  }

  // fallback if no env provided
  return fallback;
}

export default defineComponent({
  name: 'ProductCard',
  props: {
    product: { type: Object as () => Product, required: true }
  },
  setup(props) {
    const cart = useCartStore();
    const fallback = '/placeholder.jpg';
    const imgSrc = ref<string>(normalizeImage((props.product as any).image) || fallback);

    function onImgError(e: Event) {
      const t = e.target as HTMLImageElement;
      if (!t) return;
      const fallbackUrl = window.location.origin + '/placeholder.jpg';
      if (t.src !== fallbackUrl) t.src = fallbackUrl;
    }

    const formattedPrice = computed(() => {
      const v = Number(props.product.price);
      return Number.isNaN(v) ? props.product.price : v.toLocaleString('id-ID', { maximumFractionDigits: 0 });
    });

    async function handleAdd() {
      try {
        if (!cart.cartId) {
          const res = await api.post('/carts', {});
          cart.setCartId(res.data.id);
        }

        await api.post(`/carts/${cart.cartId}/items`, { productId: props.product.id, qty: 1 });

        cart.addLocalItem({
          productId: props.product.id,
          qty: 1,
          price: props.product.price,
          product: props.product
        });
      } catch (e) {
        console.error(e);
        alert('Gagal menambahkan item ke keranjang');
      }
    }

    return { imgSrc, onImgError, formattedPrice, handleAdd };
  }
});
</script>

<style scoped>
.card-media { border-bottom: 1px solid rgba(0,0,0,0.04); width:100%; height:260px; object-fit:cover; }
@media(max-width:720px){ .card-media { height:200px; } }
</style>
