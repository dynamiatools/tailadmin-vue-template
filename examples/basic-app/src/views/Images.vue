<template>
  <AdminLayout>
    <template #sidebar>
      <AppSidebar :menu-groups="extMenuGroups" />
    </template>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div className="space-y-5 sm:space-y-6">
      <ComponentCard title="Responsive Image">
        <ResponsiveImage />
      </ComponentCard>
      <ComponentCard title="Image in 2 Grid">
        <TwoColumnImageGrid />
      </ComponentCard>
      <ComponentCard title="Image in 3 Grid">
        <ThreeColumnImageGrid />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import PageBreadcrumb from '@dynamia-tools/tailadmin-vue/components/common/PageBreadcrumb.vue'
import AdminLayout from '@dynamia-tools/tailadmin-vue/components/layout/AdminLayout.vue'
import AppSidebar from '@dynamia-tools/tailadmin-vue/components/layout/AppSidebar.vue'
import { extMenuGroups } from '../router/extMenuGroups'
import ComponentCard from '@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue'
import ResponsiveImage from '@dynamia-tools/tailadmin-vue/components/ui/images/ResponsiveImage.vue'
import TwoColumnImageGrid from '@dynamia-tools/tailadmin-vue/components/ui/images/TwoColumnImageGrid.vue'
import ThreeColumnImageGrid from '@dynamia-tools/tailadmin-vue/components/ui/images/ThreeColumnImageGrid.vue'
const currentPageTitle = ref('Images')
</script>

<style></style>
