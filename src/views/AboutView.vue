<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { FileText, BookOpen, MessageCircle, ArrowRight, type LucideProps } from '@lucide/vue'
import type { FunctionalComponent } from 'vue'
import HeroSection from '../components/Page/HeroSection.vue'
import ContentSection from '../components/Page/ContentSection.vue'

interface Offer {
  name: string
  description: string
  icon: FunctionalComponent<LucideProps>
}

// TODO: replace placeholder copy with real mission/content
const offers: Offer[] = [
  {
    name: 'Scripts',
    description: 'Placeholder: practice material for real scenarios.',
    icon: FileText,
  },
  {
    name: 'Glossaries',
    description: 'Placeholder: shared terms and translations.',
    icon: BookOpen,
  },
  {
    name: 'Community',
    description: 'Placeholder: learn together on Discord.',
    icon: MessageCircle,
  },
]
</script>

<template>
  <div>
    <HeroSection>
      <template #eyebrow>About</template>
      <template #title>Why Interpreters Unite exists</template>
      <template #subtitle
        >Placeholder mission statement — replace with real story and goals.</template
      >
      <template #actions>
        <RouterLink
          to="/tools"
          class="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-primary-600"
        >
          Explore Tools <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </template>
    </HeroSection>

    <ContentSection
      title="Our mission"
      subtitle="Placeholder: who this is for and what problem it solves."
    >
      <p class="mx-auto max-w-2xl opacity-70">
        Placeholder paragraph — write 2-3 sentences about supporting interpreters with free,
        practical tools and community.
      </p>
    </ContentSection>

    <ContentSection title="What we offer" subtitle="Placeholder: overview of the three pillars.">
      <ul class="grid gap-4 md:grid-cols-3 list-none m-0 p-0 text-left">
        <li
          v-for="offer in offers"
          :key="offer.name"
          class="rounded-xl border border-gray-700 p-6 flex flex-col gap-3"
        >
          <component :is="offer.icon" class="w-6 h-6 text-primary-500" />
          <div class="font-semibold text-lg">{{ offer.name }}</div>
          <p class="text-sm opacity-70">{{ offer.description }}</p>
        </li>
      </ul>
    </ContentSection>

    <ContentSection title="Get in touch" subtitle="Placeholder: contact and community links.">
      <div class="flex flex-wrap gap-4 justify-center">
        <a
          href="#"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-primary-600"
        >
          <MessageCircle class="w-4 h-4" /> Join Discord
        </a>
        <a
          href="mailto:placeholder@example.com"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-3 font-semibold transition-all duration-200 hover:text-primary-500 hover:border-primary-500"
        >
          Contact Us
        </a>
      </div>
    </ContentSection>
  </div>
</template>
