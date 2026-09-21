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
      <template #eyebrow>Tools</template>
      <template #title>Pick a tool to get started</template>
      <template #subtitle
        >Scripts and the Discord shift tracker are ready — glossaries coming soon.</template
      >
    </HeroSection>

    <ContentSection title="All tools" subtitle="Choose a tool below.">
      <ul class="grid gap-4 md:grid-cols-3 list-none m-0 p-0 text-left">
        <li
          v-for="card in toolCards"
          :key="card.name"
          class="rounded-xl border border-gray-700 p-6 flex flex-col gap-3 transition-all duration-200 hover:border-primary-500"
        >
          <component :is="card.icon" class="w-6 h-6 text-primary-500" />
          <div class="flex items-center gap-2">
            <span class="font-semibold text-lg">{{ card.name }}</span>
            <span
              v-if="card.to === '/tools'"
              class="text-xs font-semibold uppercase tracking-wide rounded-full border border-gray-700 px-2 py-0.5 opacity-70"
            >
              Soon
            </span>
          </div>
          <p class="text-sm opacity-70 flex-1">{{ card.description }}</p>
          <RouterLink
            :to="card.to"
            class="inline-flex items-center gap-1 text-sm font-semibold text-primary-500 hover:underline"
          >
            Open <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </li>
      </ul>
    </ContentSection>
  </div>
</template>
