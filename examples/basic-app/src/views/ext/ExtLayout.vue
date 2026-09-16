<template>
  <AdminLayout>
    <template #sidebar>
      <AppSidebar :menu-groups="extMenuGroups" />
    </template>
    <PageBreadcrumb :pageTitle="pageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <slot />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@dynamia-tools/tailadmin-vue/components/layout/AdminLayout.vue'
import AppSidebar from '@dynamia-tools/tailadmin-vue/components/layout/AppSidebar.vue'
import PageBreadcrumb from '@dynamia-tools/tailadmin-vue/components/common/PageBreadcrumb.vue'
import { extMenuGroups } from '../../router/extMenuGroups'

defineProps<{
  pageTitle: string
}>()
</script>
