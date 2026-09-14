<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from '@dynamia-tools/tailadmin-vue/components/layout/ThemeProvider.vue'
import SidebarProvider from '@dynamia-tools/tailadmin-vue/components/layout/SidebarProvider.vue'
</script>
