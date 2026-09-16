<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <slot name="navbar" />
    <slot name="hero" />
    <slot name="features" />
    <slot name="testimonials" />
    <slot name="pricing" />
    <slot name="faq" />
    <slot name="cta" />
    <slot />
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
// Ordering shell for a standard marketing page — each slot is optional and
// left empty by default. Drop the matching ext/layouts section component
// (Navbar, Hero, FeatureGrid, Testimonial, PricingTable, FAQAccordion, CTA,
// Footer) into the slot with the same name; sections not used are simply
// omitted rather than configured through a prop.
</script>
