<template>
  <div class="space-y-3">
    <div
      v-for="(entry, index) in modelValue"
      :key="index"
      class="flex items-end gap-2"
    >
      <div class="w-40 shrink-0">
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Method
        </label>
        <select
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
          :value="entry.method"
          @change="updateEntry(index, { method: ($event.target as HTMLSelectElement).value })"
        >
          <option v-for="method in methods" :key="method.value" :value="method.value">
            {{ method.label }}
          </option>
        </select>
      </div>
      <div class="flex-1">
        <MoneyInput
          label="Amount"
          :currency="currency"
          :model-value="entry.amount"
          @update:model-value="(value) => updateEntry(index, { amount: value ?? 0 })"
        />
      </div>
      <button
        type="button"
        class="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        :disabled="modelValue.length <= 1"
        aria-label="Remove payment"
        @click="removeEntry(index)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 8H12"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <button
      type="button"
      class="text-brand-500 hover:text-brand-600 flex items-center gap-1 text-sm font-medium"
      @click="addEntry"
    >
      <PlusIcon />
      Add payment
    </button>

    <div class="flex items-center justify-between border-t border-gray-200 pt-3 text-sm dark:border-gray-800">
      <span class="text-gray-500 dark:text-gray-400">Paid</span>
      <span class="font-medium text-gray-800 dark:text-white/90">{{ formattedPaidTotal }}</span>
    </div>
    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-500 dark:text-gray-400">Remaining</span>
      <span
        :class="remaining > 0 ? 'text-error-600 dark:text-error-500' : 'text-success-600 dark:text-success-500'"
        class="font-medium"
      >
        {{ formattedRemaining }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MoneyInput from './MoneyInput.vue'
import PlusIcon from '../../../icons/PlusIcon.vue'

export interface PaymentEntry {
  method: string
  amount: number
}

export interface PaymentMethodOption {
  label: string
  value: string
}

interface PaymentInputProps {
  modelValue: PaymentEntry[]
  total: number
  methods: PaymentMethodOption[]
  currency?: string
  locale?: string
}

const props = withDefaults(defineProps<PaymentInputProps>(), {
  currency: 'USD',
  locale: 'en-US',
})

const emit = defineEmits<{
  'update:modelValue': [value: PaymentEntry[]]
}>()

const paidTotal = computed(() => props.modelValue.reduce((sum, entry) => sum + (entry.amount || 0), 0))
const remaining = computed(() => props.total - paidTotal.value)

const currencyFormatter = computed(
  () => new Intl.NumberFormat(props.locale, { style: 'currency', currency: props.currency }),
)
const formattedPaidTotal = computed(() => currencyFormatter.value.format(paidTotal.value))
const formattedRemaining = computed(() => currencyFormatter.value.format(Math.abs(remaining.value)))

function updateEntry(index: number, patch: Partial<PaymentEntry>) {
  const next = props.modelValue.map((entry, i) => (i === index ? { ...entry, ...patch } : entry))
  emit('update:modelValue', next)
}

function addEntry() {
  const defaultMethod = props.methods[0]?.value ?? ''
  emit('update:modelValue', [...props.modelValue, { method: defaultMethod, amount: Math.max(remaining.value, 0) }])
}

function removeEntry(index: number) {
  if (props.modelValue.length <= 1) return
  emit(
    'update:modelValue',
    props.modelValue.filter((_, i) => i !== index),
  )
}
</script>
