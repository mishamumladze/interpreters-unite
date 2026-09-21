<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { CodeXml, MessageCircle, Mail, type LucideProps } from '@lucide/vue'
import type { FunctionalComponent } from 'vue'

interface FooterItem {
  name: string
  path: string
}

interface SocialLink {
  name: string
  href: string
  icon: FunctionalComponent<LucideProps>
}

const footerItems: FooterItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Tools', path: '/tools' },
  { name: 'About', path: '/about' },
]

// TODO: replace placeholder hrefs with real URLs
const socials: SocialLink[] = [
  { name: 'GitHub', href: '#', icon: CodeXml },
  { name: 'Discord', href: '#', icon: MessageCircle },
  { name: 'Contact', href: 'mailto:placeholder@example.com', icon: Mail },
]

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-gray-700 px-6 md:px-16 pt-8 pb-28 md:pb-8">
    <div
      class="mx-auto max-w-6xl flex flex-col md:flex-row gap-8 justify-between text-center md:text-left"
    >
      <!-- Brand -->
      <div>
        <div class="font-semibold">Interpreters Unite</div>
        <p class="text-sm opacity-70">Tools for interpreters, by interpreters.</p>
      </div>

      <!-- Site nav -->
      <nav aria-label="Footer">
        <div class="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">Site</div>
        <ul class="flex md:flex-col gap-4 md:gap-2 list-none m-0 p-0 justify-center">
          <li v-for="item in footerItems" :key="item.path">
            <RouterLink
              :to="item.path"
              class="transition-all duration-200 hover:text-primary-500"
              exact-active-class="text-primary-500 font-semibold"
            >
              {{ item.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Socials / contact -->
      <div>
        <div class="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">Connect</div>
        <ul class="flex gap-4 list-none m-0 p-0 justify-center md:justify-start">
          <li v-for="link in socials" :key="link.name">
            <a
              :href="link.href"
              :aria-label="link.name"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 transition-all duration-200 hover:text-primary-500"
            >
              <component :is="link.icon" class="w-5 h-5" />
              <span class="sr-only md:not-sr-only md:text-sm">{{ link.name }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="mx-auto max-w-6xl mt-8 text-center text-sm opacity-70">
      <span>© {{ year }} Interpreters Unite</span>
    </div>
  </footer>
</template>
