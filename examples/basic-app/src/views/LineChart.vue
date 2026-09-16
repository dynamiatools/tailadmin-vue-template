<template>
  <AdminLayout>
    <template #sidebar>
      <AppSidebar :menu-groups="extMenuGroups" />
    </template>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Line Chart 1">
        <LineChartOne />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import LineChartOne from "@dynamia-tools/tailadmin-vue/components/charts/LineChart/LineChartOne.vue";
import ComponentCard from "@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue";
import PageBreadcrumb from "@dynamia-tools/tailadmin-vue/components/common/PageBreadcrumb.vue";
import AdminLayout from "@dynamia-tools/tailadmin-vue/components/layout/AdminLayout.vue";
import AppSidebar from "@dynamia-tools/tailadmin-vue/components/layout/AppSidebar.vue";
import { extMenuGroups } from "../router/extMenuGroups";
import { ref } from "vue";
const currentPageTitle = ref("Line Chart");
</script>
