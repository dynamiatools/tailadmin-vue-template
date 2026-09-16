<template>
  <Modal v-if="modelValue" @close="close">
    <template #body>
      <div class="dark:bg-gray-900 relative mx-4 w-full max-w-sm rounded-2xl bg-white p-6">
        <button
          type="button"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close"
          @click="close"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.5 4.5l-9 9M4.5 4.5l9 9"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ title }}</h3>

        <form class="mt-5 space-y-4" @submit.prevent="onSubmit">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Password</label>
            <input
              v-model="password"
              type="password"
              required
              class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90"
            />
          </div>

          <p v-if="error" class="text-error-600 dark:text-error-500 text-sm">{{ error }}</p>

          <Button type="submit" class="w-full justify-center" :disabled="loading">
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </Button>
        </form>

        <div v-if="$slots.social" class="mt-5">
          <slot name="social" />
        </div>
        <div v-if="$slots.footer" class="mt-5 text-center text-sm">
          <slot name="footer" />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Modal from '../../profile/Modal.vue'
import Button from '../../ui/Button.vue'

interface LoginDialogProps {
  modelValue: boolean
  title?: string
  loading?: boolean
  error?: string
}

withDefaults(defineProps<LoginDialogProps>(), {
  title: 'Sign in',
  loading: false,
  error: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [credentials: { email: string; password: string }]
}>()

const email = ref('')
const password = ref('')

function close() {
  emit('update:modelValue', false)
}

function onSubmit() {
  emit('submit', { email: email.value, password: password.value })
}
</script>
