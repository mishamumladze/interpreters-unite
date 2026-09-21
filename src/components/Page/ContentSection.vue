<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    align?: 'center' | 'left'
  }>(),
  { align: 'center' },
)
</script>

<template>
  <section class="px-6 md:px-16 py-12">
    <div class="mx-auto max-w-6xl" :class="align === 'center' ? 'text-center' : 'text-left'">
      <h2 v-if="title || $slots.title" class="text-2xl md:text-3xl font-bold">
        <slot name="title">{{ title }}</slot>
      </h2>
      <p
        v-if="subtitle || $slots.subtitle"
        class="mt-2 opacity-70 max-w-2xl"
        :class="align === 'center' ? 'mx-auto' : ''"
      >
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>
      <div class="mt-8">
        <slot />
      </div>
    </div>
  </section>
</template>
