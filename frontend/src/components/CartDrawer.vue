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
          <li v-for="it in items" :key="it.productId" class="cart-item">
            <img
              :src="normalizeImageForItem(it)"
              :alt="it.product?.name || it.productId"
              class="cart-img"
              @error="onImgError"
            />

            <div class="cart-mid">
              <div style="font-weight:700">{{ it.product?.name || it.productId }}</div>

              <!-- qty controls -->
              <div class="qty-row">
                <button class="qty-btn" @click="decrement(it.productId)" :aria-label="`Kurangi ${it.product?.name || it.productId}`">−</button>
                <div class="qty-value">{{ it.qty }}</div>
                <button class="qty-btn" @click="increment(it.productId)" :aria-label="`Tambah ${it.product?.name || it.productId}`">+</button>

                <button class="remove-btn" @click="remove(it.productId)" :aria-label="`Hapus ${it.product?.name || it.productId}`">Hapus</button>
              </div>

              <div class="text-muted" style="margin-top:6px">Per Unit Rp {{ Number(it.price).toLocaleString('id-ID', { maximumFractionDigits:0 }) }}</div>
            </div>

            <div class="cart-right">
              <div style="font-weight:800">Rp {{ (Number(it.price) * it.qty).toLocaleString('id-ID', { maximumFractionDigits:0 }) }}</div>
            </div>
          </li>
        </ul>

        <div class="subtotal-row">
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
    const subtotal = computed(() => cart.items.reduce((s, i) => s + Number(i.price) * i.qty, 0));
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
      if (it.product && (it.product as any).image) {
        return normalizeImageValue((it.product as any).image);
      }
      if ((it as any).image) {
        return normalizeImageValue((it as any).image);
      }
      return '/placeholder.jpg';
    }

    // actions: increment, decrement, remove
    function increment(productId: string) {
      cart.increment(productId);
    }
    function decrement(productId: string) {
      cart.decrement(productId);
    }
    function remove(productId: string) {
      cart.remove(productId);
    }

    return { items, subtotal, close, checkout, drawerRef, onImgError, normalizeImageForItem, increment, decrement, remove };
  }
});
</script>

<style scoped>
.drawer-overlay { position:fixed; inset:0; background: rgba(7,12,18,0.48); z-index:80; display:flex; justify-content:flex-end; }
.drawer { width:420px; max-width:95vw; background:var(--surface); height:100vh; box-shadow:-12px 0 32px rgba(7,12,18,0.12); padding:18px; overflow:auto; position:relative; }
.empty { text-align:center; padding:60px 12px; color:var(--muted); }

.cart-item { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid var(--gray-100); align-items:flex-start; }
.cart-img { width:64px; height:64px; object-fit:cover; border-radius:6px; }
.cart-mid { flex:1; }
.cart-right { display:flex; flex-direction:column; align-items:flex-end; justify-content:space-between; min-width:90px; }

.qty-row { display:flex; align-items:center; gap:8px; margin-top:8px; flex-wrap:wrap; }
.qty-btn { width:32px; height:32px; border-radius:6px; border:1px solid var(--gray-200); background:transparent; cursor:pointer; font-size:18px; display:inline-flex; align-items:center; justify-content:center; }
.qty-value { min-width:28px; text-align:center; font-weight:600; }
.remove-btn { margin-left:8px; background:transparent; border:0; color:var(--muted); cursor:pointer; text-decoration:underline; font-size:13px; }

.subtotal-row { display:flex; justify-content:space-between; align-items:center; margin-top:12px; padding-top:12px; border-top:1px solid var(--gray-100); }
</style>
