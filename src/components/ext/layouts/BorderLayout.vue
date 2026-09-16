<template>
  <div class="flex min-h-screen flex-col">
    <header v-if="$slots.header" class="shrink-0">
      <slot name="header" />
    </header>

    <div class="flex flex-1 flex-col lg:flex-row">
      <aside v-if="$slots.left" class="shrink-0 lg:w-64">
        <slot name="left" />
      </aside>

      <main class="flex-1">
        <slot />
      </main>

      <aside v-if="$slots.right" class="shrink-0 lg:w-64">
        <slot name="right" />
      </aside>
    </div>

    <footer v-if="$slots.footer" class="shrink-0">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup lang="ts">
// Stacks header/left/center/right/footer in document order on narrow
// viewports, and switches the middle row to a row layout with fixed-width
// side regions at lg — no drawer/overlay complexity, just responsive flow.
</script>
