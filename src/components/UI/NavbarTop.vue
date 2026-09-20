<script setup lang="ts">
import { RouterLink } from 'vue-router'
// import { Menu } from '@lucide/vue'

interface NavItem {
  name: string
  path: string
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Tools', path: '/tools' },
  { name: 'About', path: '/about' },
]

import { ref } from 'vue'
import ThemeToggle from './ThemeToggle.vue'

function initialTheme(): boolean {
  const saved = localStorage.getItem('theme')
  if (saved) return saved === 'dark'
  return window.matchMedia('(prefers-colors-scheme: dark)').matches
}

const dark = ref(initialTheme())
</script>

<template>
  <!-- Desktop Navbar -->
  <nav class="hidden md:flex justify-between items-center py-4 px-8">
    <div>Interpreters Unite</div>
    <ul class="flex gap-3 list-none m-0 p-0">
      <li v-for="item in navItems" :key="item.path">
        <RouterLink
          :to="item.path"
          class="transition-all text-shadow-none duration-200 hover:text-shadow-primary-300 hover:text-shadow-[0_0_20px]"
          exact-active-class="text-primary-500 font-semibold"
        >
          {{ item.name }}
        </RouterLink>
      </li>
    </ul>
    <ThemeToggle v-model="dark" />
  </nav>
  <!-- Mobile Navbar -->
  <nav
    class="bg-surface flex md:hidden justify-between items-center border-solid border-gray-700 border fixed bottom-0 w-full py-5 px-4 inset-x-0 z-50 mb-1 rounded"
  >
    <div>Interpreters Unite</div>
    <li v-for="item in navItems" :key="item.path">
      <RouterLink
        :to="item.path"
        class="text-sm"
        exact-active-class="text-primary-500 font-semibold"
      >
        {{ item.name }}
      </RouterLink>
    </li>
    <ThemeToggle v-model="dark" />
  </nav>
</template>
