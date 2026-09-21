<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface FooterItem {
  name: string
  path: string
}

const footerItems: FooterItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Tools', path: '/tools' },
  { name: 'About', path: '/about' },
]
</script>

<template>
  <!-- Footer -->
  <footer class="py-4 px-16 grid grid-cols-3 text-center border-t-1">
    <div class="left-0">
      <div>Logo</div>
      <div>Interpreters Unite</div>
    </div>
    <div class="middle">
      <div>License</div>
      <div>FAQ</div>
    </div>
    <div class="right">
      <div></div>
    </div>
    <div class="absoloute bottom-0 bottom w-full col-span-full">
      <ul class="flex gap-16 list-none m-0 p-0 justify-center">
        <li v-for="item in footerItems" :key="item.path">
          <RouterLink
            :to="item.path"
            class="transition-all text-shadow-none duration-200 hover:text-shadow-primary-300 hover:text-shadow-[0_0_20px]"
            exact-active-class="text-primary-500 font-semibold"
          >
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>
      <span>Interpreters Unite</span>
    </div>
  </footer>
</template>
