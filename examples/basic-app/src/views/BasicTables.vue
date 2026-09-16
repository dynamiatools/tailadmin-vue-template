<template>
  <AdminLayout>
    <template #sidebar>
      <AppSidebar :menu-groups="extMenuGroups" />
    </template>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Basic Table 1">
        <BasicTableOne />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import PageBreadcrumb from "@dynamia-tools/tailadmin-vue/components/common/PageBreadcrumb.vue";
import AdminLayout from "@dynamia-tools/tailadmin-vue/components/layout/AdminLayout.vue";
import AppSidebar from "@dynamia-tools/tailadmin-vue/components/layout/AppSidebar.vue";
import { extMenuGroups } from "../router/extMenuGroups";
import ComponentCard from "@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue";
import BasicTableOne from "@dynamia-tools/tailadmin-vue/components/tables/basic-tables/BasicTableOne.vue";
const currentPageTitle = ref("Basic Tables");
</script>
