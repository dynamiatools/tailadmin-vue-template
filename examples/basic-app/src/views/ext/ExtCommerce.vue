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
</script>
