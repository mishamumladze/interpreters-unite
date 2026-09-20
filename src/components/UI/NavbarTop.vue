<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Menu, X } from '@lucide/vue'

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
const menuOpen = ref(false)
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
  <!-- Main Fixed Bottom Bar -->
  <nav
    class="bg-surface flex md:hidden justify-between items-center border-solid border-gray-700 border fixed bottom-0 w-95/100 py-5 px-5 inset-x-0 z-50 mb-1 place-self-center transition-all duration-500"
    :class="menuOpen ? 'rounded-b-xl rounded-t-0' : 'rounded-xl'"
  >
    <div>Interpreters Unite</div>
    <div class="flex items-center gap-2">
      <ThemeToggle v-model="dark" />
      <button
        @click="menuOpen = !menuOpen"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        aria-label="Menu"
        class="p-1 text-2xl leading-none bg-primary-400 rounded"
      >
        <Menu v-if="!menuOpen" class="w-10 h-10" />
        <X v-else class="w-10 h-10" />
      </button>
    </div>
  </nav>

  <!-- Mobile Menu Panel with Vue Transition -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-4 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-4 opacity-0"
  >
    <div
      v-if="menuOpen"
      id="mobile-menu"
      class="md:hidden grid fixed inset-x-3 bottom-23 z-50 rounded-t-xl border border-gray-700 bg-surface p-2 border-b-0"
    >
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        @click="menuOpen = false"
        class="py-5 text-right pr-5"
      >
        {{ item.name }}
      </RouterLink>
    </div>
  </Transition>
</template>
