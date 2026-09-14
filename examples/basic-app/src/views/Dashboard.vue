<template>
  <AdminLayout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
        <MonthlyTarget />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <MonthlySale />
      </div>

      <div class="col-span-12">
        <StatisticsChart />
      </div>

      <div class="col-span-12 xl:col-span-5">
        <CustomerDemographic />
      </div>

      <div class="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
// Same composition as upstream's src/views/Ecommerce.vue — the reference
// dashboard for the template.
import AdminLayout from '@dynamia-tools/tailadmin-vue/components/layout/AdminLayout.vue'
import EcommerceMetrics from '@dynamia-tools/tailadmin-vue/components/ecommerce/EcommerceMetrics.vue'
import MonthlyTarget from '@dynamia-tools/tailadmin-vue/components/ecommerce/MonthlySale.vue'
import MonthlySale from '@dynamia-tools/tailadmin-vue/components/ecommerce/MonthlyTarget.vue'
import CustomerDemographic from '@dynamia-tools/tailadmin-vue/components/ecommerce/CustomerDemographic.vue'
import StatisticsChart from '@dynamia-tools/tailadmin-vue/components/ecommerce/StatisticsChart.vue'
import RecentOrders from '@dynamia-tools/tailadmin-vue/components/ecommerce/RecentOrders.vue'
</script>
