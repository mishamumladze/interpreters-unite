<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { FileText, BookOpen, MessageCircle, ArrowRight, type LucideProps } from '@lucide/vue'
import type { FunctionalComponent } from 'vue'
import HeroSection from '../components/Page/HeroSection.vue'
import ContentSection from '../components/Page/ContentSection.vue'

interface ToolCard {
  name: string
  description: string
  to: string
  external?: boolean
  icon: FunctionalComponent<LucideProps>
}

// TODO: point glossaries card at real route once built
const toolCards: ToolCard[] = [
  {
    name: 'Scripts',
    description: 'Save and edit English + Georgian practice scripts.',
    to: '/tools/scripts',
    icon: FileText,
  },
  {
    name: 'Glossaries',
    description: 'Placeholder: key terms and translations.',
    to: '/tools',
    icon: BookOpen,
  },
  {
    name: 'Discord',
    description: 'Shift tracker: copy Discord-ready SOS / EOS / break messages.',
    to: '/tools/discord',
    icon: MessageCircle,
  },
]
</script>

<template>
  <div>
    <HeroSection>
      <template #title>
        The only website you <span class="font-bold text-primary-500">NEED</span> for interpreting
      </template>
      <template #subtitle>Interpreters! Unite! Placeholder subcopy — replace with real pitch.</template>
      <template #actions>
        <RouterLink
          to="/tools"
          class="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-primary-600"
        >
          Explore Tools <ArrowRight class="w-4 h-4" />
        </RouterLink>
        <RouterLink
          to="/about"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-3 font-semibold transition-all duration-200 hover:text-primary-500 hover:border-primary-500"
        >
          Learn More
        </RouterLink>
      </template>
    </HeroSection>

    <ContentSection
      title="Everything in one place"
      subtitle="Placeholder: short overview of what the site offers."
    >
      <ul class="grid gap-4 md:grid-cols-3 list-none m-0 p-0 text-left">
        <li
          v-for="card in toolCards"
          :key="card.name"
          class="rounded-xl border border-gray-700 p-6 flex flex-col gap-3 transition-all duration-200 hover:border-primary-500"
        >
          <component :is="card.icon" class="w-6 h-6 text-primary-500" />
          <div class="font-semibold text-lg">{{ card.name }}</div>
          <p class="text-sm opacity-70 flex-1">{{ card.description }}</p>
          <a
            v-if="card.external"
            :href="card.to"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1 text-sm font-semibold text-primary-500 hover:underline"
          >
            Open <ArrowRight class="w-4 h-4" />
          </a>
          <RouterLink
            v-else
            :to="card.to"
            class="inline-flex items-center gap-1 text-sm font-semibold text-primary-500 hover:underline"
          >
            Open <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </li>
      </ul>
    </ContentSection>

    <ContentSection title="Join the community" subtitle="Placeholder: Discord invite + contact.">
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
