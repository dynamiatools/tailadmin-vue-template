<template>
  <AdminLayout>
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div class="col-span-1">
        <h1 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
          @dynamia-tools/tailadmin-vue example
        </h1>
        <EcommerceMetrics />
      </div>

      <div class="col-span-1 flex flex-col gap-6">
        <Alert
          variant="success"
          title="It works"
          message="Layout, icons, composables and UI components are all rendering from the published package source."
        />

        <div class="flex flex-wrap items-center gap-3">
          <Button size="sm" variant="primary">Primary</Button>
          <Button size="sm" variant="outline">Outline</Button>
          <Badge color="success">Active</Badge>
          <Badge color="warning">Pending</Badge>
        </div>
      </div>

      <div class="col-span-1 xl:col-span-2">
        <BasicTableOne />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@dynamia-tools/tailadmin-vue/components/layout/AdminLayout.vue'
import EcommerceMetrics from '@dynamia-tools/tailadmin-vue/components/ecommerce/EcommerceMetrics.vue'
import Alert from '@dynamia-tools/tailadmin-vue/components/ui/Alert.vue'
import Button from '@dynamia-tools/tailadmin-vue/components/ui/Button.vue'
import Badge from '@dynamia-tools/tailadmin-vue/components/ui/Badge.vue'
import BasicTableOne from '@dynamia-tools/tailadmin-vue/components/tables/basic-tables/BasicTableOne.vue'
</script>
