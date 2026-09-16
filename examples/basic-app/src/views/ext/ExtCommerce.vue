<template>
  <ExtLayout page-title="Ext / Commerce">
    <ComponentCard title="Cart" desc="Selected items with quantity editing and totals.">
      <Cart :items="cartItems" @update:items="(items) => (cartItems = items)" />
    </ComponentCard>

    <ComponentCard title="SelectionGrid" desc="Grid selection with an unavailable cell state (seats/tables/products).">
      <SelectionGrid v-model="selectedSeats" :items="seats" multiple :min-cell-width="60" />
      <p class="text-sm text-gray-500 dark:text-gray-400">Selected: {{ selectedSeats.join(', ') || '—' }}</p>
    </ComponentCard>

    <ComponentCard title="PrintPreview" desc="Preview raw HTML before triggering the browser print dialog.">
      <PrintPreview :html="receiptHtml" height="320px" />
    </ComponentCard>

    <ComponentCard title="ItemCard" desc="Single product card — image, badge, price, and an actions slot.">
      <div class="max-w-56">
        <ItemCard
          title="Wireless Headphones"
          subtitle="Over-ear, noise cancelling"
          image="/images/product/product-01.jpg"
          :price="89.99"
          badge="New"
          badge-color="info"
        >
          <template #actions>
            <button type="button" class="bg-brand-500 hover:bg-brand-600 rounded-lg px-2.5 py-1 text-xs text-white">
              Add
            </button>
          </template>
        </ItemCard>
      </div>
    </ComponentCard>

    <ComponentCard title="ItemGrid" desc="Responsive product grid built on ItemCard, with selection.">
      <ItemGrid :items="products" v-model:selected="selectedProducts" multiple>
        <template #actions="{ item }">
          <button
            type="button"
            class="bg-brand-500 hover:bg-brand-600 rounded-lg px-2.5 py-1 text-xs text-white"
            @click="lastAddedToCart = item.title"
          >
            Add
          </button>
        </template>
      </ItemGrid>
      <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
        Selected: {{ selectedProducts.join(', ') || '—' }} · Last added to cart: {{ lastAddedToCart ?? '—' }}
      </p>
    </ComponentCard>
  </ExtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentCard from '@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue'
import Cart from '@dynamia-tools/tailadmin-vue/components/ext/commerce/Cart.vue'
import type { CartItem } from '@dynamia-tools/tailadmin-vue/components/ext/commerce/Cart.vue'
import SelectionGrid from '@dynamia-tools/tailadmin-vue/components/ext/commerce/SelectionGrid.vue'
import type { SelectionGridItem } from '@dynamia-tools/tailadmin-vue/components/ext/commerce/SelectionGrid.vue'
import PrintPreview from '@dynamia-tools/tailadmin-vue/components/ext/commerce/PrintPreview.vue'
import ItemCard from '@dynamia-tools/tailadmin-vue/components/ext/commerce/ItemCard.vue'
import ItemGrid from '@dynamia-tools/tailadmin-vue/components/ext/commerce/ItemGrid.vue'
import type { ItemGridEntry } from '@dynamia-tools/tailadmin-vue/components/ext/commerce/ItemGrid.vue'
import ExtLayout from './ExtLayout.vue'

const cartItems = ref<CartItem[]>([
  { id: 1, label: 'Wireless Mouse', unitPrice: 19.99, quantity: 2 },
  { id: 2, label: 'Mechanical Keyboard', unitPrice: 79.99, quantity: 1 },
])

const seats: SelectionGridItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: `A${i + 1}`,
  label: `A${i + 1}`,
  status: [3, 7].includes(i) ? 'unavailable' : 'available',
}))
const selectedSeats = ref<(string | number)[]>([])

const receiptHtml = `
  <div style="font-family: sans-serif; padding: 16px;">
    <h2>Receipt #1024</h2>
    <p>Wireless Mouse — $19.99 x2</p>
    <p>Mechanical Keyboard — $79.99 x1</p>
    <hr />
    <p><strong>Total: $119.97</strong></p>
  </div>
`

const products: ItemGridEntry[] = [
  { id: 'p1', title: 'Wireless Headphones', subtitle: 'Over-ear', image: '/images/product/product-01.jpg', price: 89.99, badge: 'New', badgeColor: 'info' },
  { id: 'p2', title: 'Smart Watch', subtitle: 'Fitness tracker', image: '/images/product/product-02.jpg', price: 129.0 },
  { id: 'p3', title: 'Bluetooth Speaker', subtitle: 'Portable', image: '/images/product/product-03.jpg', price: 49.5, badge: 'Sale', badgeColor: 'error' },
  { id: 'p4', title: 'Laptop Stand', subtitle: 'Aluminum', image: '/images/product/product-04.jpg', price: 34.99 },
  { id: 'p5', title: 'Mechanical Keyboard', subtitle: 'RGB backlit', image: '/images/product/product-05.jpg', price: 99.99, disabled: true, badge: 'Out of stock', badgeColor: 'neutral' },
]
const selectedProducts = ref<(string | number)[]>([])
const lastAddedToCart = ref<string | null>(null)
</script>
