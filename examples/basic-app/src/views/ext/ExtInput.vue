<template>
  <ExtLayout page-title="Ext / Input">
    <ComponentCard title="MoneyInput" desc="Currency-aware numeric input with locale formatting.">
      <MoneyInput v-model="money" label="Price" currency="USD" />
      <p class="text-sm text-gray-500 dark:text-gray-400">Value: {{ money }}</p>
    </ComponentCard>

    <ComponentCard title="QuantityInput" desc="Stepper with increment/decrement controls.">
      <QuantityInput v-model="quantity" :min="0" :max="20" label="Quantity" />
    </ComponentCard>

    <ComponentCard title="NumericKeypad" desc="Touch-friendly numeric keypad.">
      <NumericKeypad v-model="keypadValue" @submit="(value) => (keypadSubmitted = value)" />
      <p class="text-sm text-gray-500 dark:text-gray-400">Submitted: {{ keypadSubmitted || '—' }}</p>
    </ComponentCard>

    <ComponentCard title="ScannerInput" desc="Text input tuned for barcode scanners (Enter completes a scan).">
      <ScannerInput v-model="scannerValue" :auto-focus="false" @scan="(value) => (lastScan = value)" />
      <p class="text-sm text-gray-500 dark:text-gray-400">Last scan: {{ lastScan || '—' }}</p>
    </ComponentCard>

    <ComponentCard title="PaymentInput" desc="Records one or more payment entries against a total.">
      <PaymentInput v-model="payments" :total="150" :methods="paymentMethods" currency="USD" />
    </ComponentCard>

    <ComponentCard title="Rating" desc="Star rating, interactive and read-only.">
      <div class="flex items-center gap-6">
        <Rating v-model="rating" />
        <Rating :model-value="4" readonly size="sm" />
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">Value: {{ rating }}</p>
    </ComponentCard>

    <ComponentCard title="ColorPicker" desc="Native color input with hex field and presets.">
      <ColorPicker v-model="color" label="Accent color" :presets="colorPresets" />
    </ComponentCard>
  </ExtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentCard from '@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue'
import MoneyInput from '@dynamia-tools/tailadmin-vue/components/ext/input/MoneyInput.vue'
import QuantityInput from '@dynamia-tools/tailadmin-vue/components/ext/input/QuantityInput.vue'
import NumericKeypad from '@dynamia-tools/tailadmin-vue/components/ext/input/NumericKeypad.vue'
import ScannerInput from '@dynamia-tools/tailadmin-vue/components/ext/input/ScannerInput.vue'
import PaymentInput from '@dynamia-tools/tailadmin-vue/components/ext/input/PaymentInput.vue'
import type { PaymentEntry } from '@dynamia-tools/tailadmin-vue/components/ext/input/PaymentInput.vue'
import Rating from '@dynamia-tools/tailadmin-vue/components/ext/input/Rating.vue'
import ColorPicker from '@dynamia-tools/tailadmin-vue/components/ext/input/ColorPicker.vue'
import ExtLayout from './ExtLayout.vue'

const money = ref<number | null>(49.9)
const quantity = ref(1)
const keypadValue = ref('')
const keypadSubmitted = ref('')
const scannerValue = ref('')
const lastScan = ref('')
const rating = ref(3)
const color = ref('#465fff')
const colorPresets = ['#465fff', '#12b76a', '#f04438', '#f79009', '#0ea5e9']

const paymentMethods = [
  { label: 'Cash', value: 'cash' },
  { label: 'Card', value: 'card' },
  { label: 'Transfer', value: 'transfer' },
]
const payments = ref<PaymentEntry[]>([{ method: 'cash', amount: 150 }])
</script>
