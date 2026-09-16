<template>
  <div class="flex min-h-screen">
    <div class="hidden w-1/2 items-center justify-center bg-gray-900 p-12 lg:flex">
      <slot name="brand">
        <div v-if="image" class="max-w-md">
          <img :src="image" alt="" class="w-full rounded-xl object-cover" />
        </div>
      </slot>
    </div>

    <div class="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
      <div class="w-full max-w-sm">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AuthSplitProps {
  image?: string
}

withDefaults(defineProps<AuthSplitProps>(), {
  image: '',
})
</script>
