<script setup lang="ts"></script>

<template>
  <section class="px-6 md:px-16 py-16 md:py-24 text-center">
    <div class="mx-auto max-w-3xl flex flex-col items-center gap-6">
      <p v-if="$slots.eyebrow" class="text-sm font-semibold uppercase tracking-wide text-primary-500">
        <slot name="eyebrow" />
      </p>
      <h1 v-if="$slots.title" class="text-4xl md:text-5xl font-bold leading-tight">
        <slot name="title" />
      </h1>
      <p v-if="$slots.subtitle" class="text-lg opacity-70 max-w-xl">
        <slot name="subtitle" />
      </p>
      <div v-if="$slots.actions" class="flex flex-wrap gap-4 justify-center">
        <slot name="actions" />
      </div>
      <slot />
    </div>
  </section>
</template>
