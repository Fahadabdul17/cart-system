<template>
  <div id="app">
    <header class="header" role="banner">
      <div class="container header-inner">
        <div class="brand" aria-label="Cart System">
          <!-- improved logo SVG -->
          <div class="logo" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="2.5" y="8" width="19" height="11" rx="2" fill="#fff" stroke="#e6e6e6"/>
              <path d="M3 8L12 3l9 5" stroke="#c7c7c7" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 12h1v4H7zM11 12h1v4h-1zM15 12h1v4h-1z" fill="#c62828" opacity="0.95"/>
            </svg>
          </div>
          <div style="font-weight:800">Cart System</div>
        </div>

        <nav class="nav-actions" role="navigation" aria-label="Main navigation">
          <router-link to="/" class="nav-link">Produk</router-link>
          <button class="cart-button" @click="openCart" aria-label="Buka keranjang" ref="cartBtn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h2l1.5 9h11l1.5-6H7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="10" cy="20" r="1.4" fill="currentColor"/>
              <circle cx="18" cy="20" r="1.4" fill="currentColor"/>
            </svg>
            <span v-if="count>0" class="cart-count" aria-live="polite">{{ count }}</span>
          </button>
        </nav>
      </div>
    </header>

    <main>
      <div class="container">
        <h2 class="h-title"></h2>
        <router-view />
      </div>
    </main>

    <CartDrawer v-if="drawerOpen" @close="closeCart" />
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, computed, watch, onBeforeUnmount } from 'vue';
import { useCartStore } from './stores/cartStore';
import CartDrawer from './components/CartDrawer.vue';

export default defineComponent({
  components: { CartDrawer },
  setup(){
    const cart = useCartStore();
    const drawerOpen = ref(false);
    const count = computed(() => cart.totalItems);

    // lock scroll when drawer opened
    watch(drawerOpen, (v) => {
      document.body.style.overflow = v ? 'hidden' : '';
    });

    // cleanup
    onBeforeUnmount(() => { document.body.style.overflow = ''; });

    function openCart(){ drawerOpen.value = true; }
    function closeCart(){ drawerOpen.value = false; }
    return { drawerOpen, openCart, closeCart, count };
  }
});
</script>
