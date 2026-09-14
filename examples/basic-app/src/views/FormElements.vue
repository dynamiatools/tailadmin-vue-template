<template>
  <AdminLayout>
    <PageBreadcrumb page-title="Form Elements" />
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div class="space-y-6">
        <ComponentCard title="Default Inputs">
          <DefaultInputs />
        </ComponentCard>
        <ComponentCard title="Select Inputs">
          <SelectInput />
        </ComponentCard>
        <ComponentCard title="Text Area">
          <TextArea />
        </ComponentCard>
        <ComponentCard title="Input States">
          <InputState />
        </ComponentCard>
      </div>
      <div class="space-y-6">
        <ComponentCard title="Input Group">
          <InputGroup />
        </ComponentCard>
        <ComponentCard title="File Input">
          <FileInput />
        </ComponentCard>
        <ComponentCard title="Checkboxes">
          <CheckboxInput />
        </ComponentCard>
        <ComponentCard title="Radio Inputs">
          <RadioInputs />
        </ComponentCard>
        <ComponentCard title="Toggle Switch">
          <ToggleSwitch />
        </ComponentCard>
        <ComponentCard title="Dropzone">
          <Dropzone />
        </ComponentCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
// Same composition as upstream's src/views/Forms/FormElements.vue.
import AdminLayout from '@dynamia-tools/tailadmin-vue/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@dynamia-tools/tailadmin-vue/components/common/PageBreadcrumb.vue'
import ComponentCard from '@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue'
import DefaultInputs from '@dynamia-tools/tailadmin-vue/components/forms/FormElements/DefaultInputs.vue'
import SelectInput from '@dynamia-tools/tailadmin-vue/components/forms/FormElements/SelectInput.vue'
import TextArea from '@dynamia-tools/tailadmin-vue/components/forms/FormElements/TextArea.vue'
import InputState from '@dynamia-tools/tailadmin-vue/components/forms/FormElements/InputState.vue'
import InputGroup from '@dynamia-tools/tailadmin-vue/components/forms/FormElements/InputGroup.vue'
import FileInput from '@dynamia-tools/tailadmin-vue/components/forms/FormElements/FileInput.vue'
import CheckboxInput from '@dynamia-tools/tailadmin-vue/components/forms/FormElements/CheckboxInput.vue'
import RadioInputs from '@dynamia-tools/tailadmin-vue/components/forms/FormElements/RadioInputs.vue'
import ToggleSwitch from '@dynamia-tools/tailadmin-vue/components/forms/FormElements/ToggleSwitch.vue'
import Dropzone from '@dynamia-tools/tailadmin-vue/components/forms/FormElements/Dropzone.vue'
</script>
