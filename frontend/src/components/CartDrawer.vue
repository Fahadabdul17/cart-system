<template>
  <div class="drawer-overlay" @click.self="close" @keydown.esc.window="close" role="dialog" aria-modal="true">
    <aside class="drawer" ref="drawerRef" tabindex="-1">
      <div class="drawer-header">
        <div style="display:flex;align-items:center;gap:10px">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 7h12l-1 9H7L6 7z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 7V5a3 3 0 116 0v2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <strong>Keranjang Belanja</strong>
        </div>
        <div>
          <button @click="close" aria-label="Tutup keranjang" style="background:transparent;border:0;font-size:18px;cursor:pointer">✕</button>
        </div>
      </div>

      <div v-if="items.length === 0" class="empty">
        <div style="font-size:42px; opacity:0.12">👜</div>
        <div class="text-muted" style="margin-top:12px">Keranjang masih kosong</div>
      </div>

      <div v-else>
        <ul style="list-style:none;padding:0;margin:18px 0">
          <li v-for="it in items" :key="it.productId" style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--gray-100);">
            <img
              :src="normalizeImageForItem(it)"
              :alt="it.product?.name || it.productId"
              style="width:64px;height:64px;object-fit:cover;border-radius:6px"
              @error="onImgError"
            />

            <div style="flex:1">
              <div style="font-weight:700">{{ it.product?.name || it.productId }}</div>
              <div class="text-muted" style="margin-top:6px">Qty: {{ it.qty }}</div>
            </div>

            <div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between">
              <div style="font-weight:800">Rp {{ Number(it.price).toLocaleString('id-ID', { maximumFractionDigits:0 }) }}</div>
            </div>
          </li>
        </ul>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:12px;border-top:1px solid var(--gray-100)">
          <div><strong>Subtotal</strong></div>
          <div style="font-weight:800">Rp {{ subtotal.toLocaleString('id-ID', { maximumFractionDigits:0 }) }}</div>
        </div>

        <div style="margin-top:16px; display:flex; gap:10px;">
          <button class="btn" @click="close">Lanjutkan Belanja</button>
          <button class="btn btn-primary" @click="checkout">Checkout</button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue';
import type { CartItem } from '../types';
import { useCartStore } from '../stores/cartStore';

/* same normalizer used in ProductCard (kept local here)
   optionally you can extract to utils/shared file */
function normalizeImageValue(image: unknown): string {
  const fallback = '/placeholder.jpg';
  if (!image) return fallback;
  if (typeof image !== 'string') return fallback;
  const s = image.trim();
  if (!s) return fallback;
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith('/')) return s;
  if (/^data:image\//i.test(s)) return s;

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
  const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'product-images';
  if (SUPABASE_URL) {
    const base = SUPABASE_URL.replace(/\/+$/, '');
    return `${base}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(s)}`;
  }
  return fallback;
}

export default defineComponent({
  emits: ['close'],
  setup(_, { emit }) {
    const cart = useCartStore();
    const items = computed<CartItem[]>(() => cart.items);
    const subtotal = computed(() => items.value.reduce((s, i) => s + Number(i.price) * i.qty, 0));
    const drawerRef = ref<HTMLElement | null>(null);

    onMounted(() => setTimeout(() => drawerRef.value?.focus(), 50));

    function close() { emit('close'); }
    function checkout() { alert('Checkout belum diimplementasikan'); }

    function onImgError(e: Event) {
      const t = e.target as HTMLImageElement;
      if (!t) return;
      const fallback = window.location.origin + '/placeholder.jpg';
      if (t.src !== fallback) t.src = fallback;
    }

    function normalizeImageForItem(it: CartItem) {
      // prefer product.image if present and valid, else fallback
      if (it.product && (it.product as any).image) {
        return normalizeImageValue((it.product as any).image);
      }
      // if store item had an `image` field directly (rare) use it
      if ((it as any).image) {
        return normalizeImageValue((it as any).image);
      }
      return '/placeholder.jpg';
    }

    return { items, subtotal, close, checkout, drawerRef, onImgError, normalizeImageForItem };
  }
});
</script>

<style scoped>
.drawer-overlay { position:fixed; inset:0; background: rgba(7,12,18,0.48); z-index:80; display:flex; justify-content:flex-end; }
.drawer { width:420px; max-width:95vw; background:var(--surface); height:100vh; box-shadow:-12px 0 32px rgba(7,12,18,0.12); padding:18px; overflow:auto; position:relative; }
.empty { text-align:center; padding:60px 12px; color:var(--muted); }
</style>
