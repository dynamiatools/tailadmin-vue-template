<template>
  <ExtLayout page-title="Ext / Media">
    <ComponentCard title="Webcam" desc="Camera capture — click Start to grant permission.">
      <Webcam @capture="(dataUrl) => (capturedPhoto = dataUrl)" />
      <img v-if="capturedPhoto" :src="capturedPhoto" alt="Captured" class="mt-3 h-24 rounded-lg border border-gray-200 dark:border-gray-800" />
    </ComponentCard>

    <ComponentCard title="ImageCropper" desc="Pan, zoom, and rotate an image, then export the crop.">
      <ImageCropper ref="cropperRef" src="/images/user/user-01.jpg" :width="240" :height="240" />
      <button
        type="button"
        class="bg-brand-500 hover:bg-brand-600 mt-3 rounded-lg px-3 py-1.5 text-sm text-white"
        @click="exportCrop"
      >
        Export crop
      </button>
      <img v-if="croppedImage" :src="croppedImage" alt="Cropped" class="mt-3 h-24 w-24 rounded-lg border border-gray-200 object-cover dark:border-gray-800" />
    </ComponentCard>

    <ComponentCard title="SignaturePad" desc="Draw a signature, undo strokes, or clear.">
      <SignaturePad v-model="signature" :width="360" :height="160" />
    </ComponentCard>

    <ComponentCard title="DropFileUploader" desc="Drag & drop or browse files (no backend — files stay pending).">
      <DropFileUploader :auto-upload="false" :accepted-types="['image/*']" />
    </ComponentCard>

    <ComponentCard title="SoundPlayer" desc="Visible playback controls, or an invisible/headless mode for UI sounds.">
      <SoundPlayer src="/files/sample-tone.wav" />
      <div class="mt-4 flex items-center gap-3">
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-400"
          @click="invisiblePlayerRef?.play()"
        >
          Play invisible sound effect
        </button>
        <SoundPlayer ref="invisiblePlayerRef" src="/files/sample-tone.wav" :visible="false" />
      </div>
    </ComponentCard>
  </ExtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentCard from '@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue'
import Webcam from '@dynamia-tools/tailadmin-vue/components/ext/media/Webcam.vue'
import ImageCropper from '@dynamia-tools/tailadmin-vue/components/ext/media/ImageCropper.vue'
import SignaturePad from '@dynamia-tools/tailadmin-vue/components/ext/media/SignaturePad.vue'
import DropFileUploader from '@dynamia-tools/tailadmin-vue/components/ext/media/DropFileUploader.vue'
import SoundPlayer from '@dynamia-tools/tailadmin-vue/components/ext/media/SoundPlayer.vue'
import ExtLayout from './ExtLayout.vue'

const capturedPhoto = ref('')

const cropperRef = ref<InstanceType<typeof ImageCropper> | null>(null)
const croppedImage = ref('')
function exportCrop() {
  croppedImage.value = cropperRef.value?.exportImage() ?? ''
}

const signature = ref('')

const invisiblePlayerRef = ref<InstanceType<typeof SoundPlayer> | null>(null)
</script>
