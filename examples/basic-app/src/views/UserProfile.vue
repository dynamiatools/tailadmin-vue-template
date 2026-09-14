<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Profile</h3>
      <profile-card />
      <address-card />
      <security />
      <danger-zone />
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '@dynamia-tools/tailadmin-vue/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@dynamia-tools/tailadmin-vue/components/common/PageBreadcrumb.vue'
import { ref } from 'vue'
import ProfileCard from '@dynamia-tools/tailadmin-vue/components/profile/ProfileCard.vue'
import AddressCard from '@dynamia-tools/tailadmin-vue/components/profile/AddressCard.vue'
import Security from '@dynamia-tools/tailadmin-vue/components/profile/Security.vue'
import DangerZone from '@dynamia-tools/tailadmin-vue/components/profile/DangerZone.vue'
const currentPageTitle = ref('User Profile')
</script>
