<template>
  <AdminLayout>
    <template #sidebar>
      <AppSidebar :menu-groups="extMenuGroups" />
    </template>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Bar Chart 1"> <BarChartOne /> </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import BarChartOne from "@dynamia-tools/tailadmin-vue/components/charts/BarChart/BarChartOne.vue";
import ComponentCard from "@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue";
import PageBreadcrumb from "@dynamia-tools/tailadmin-vue/components/common/PageBreadcrumb.vue";
import AdminLayout from "@dynamia-tools/tailadmin-vue/components/layout/AdminLayout.vue";
import AppSidebar from "@dynamia-tools/tailadmin-vue/components/layout/AppSidebar.vue";
import { extMenuGroups } from "../router/extMenuGroups";
import { ref } from "vue";
const currentPageTitle = ref("Bar Chart");
</script>
