<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, Copy } from '@lucide/vue'

const language = ref('')
const firstName = ref('')
const lastName = ref('')
const idNo = ref('')
const shortCallDesc = ref('')
const toast = ref<string | null>(null)

let toastTimer: ReturnType<typeof setTimeout> | null = null

const fullName = computed(() => {
  const name = firstName.value.trim() || 'Name'
  return lastName.value.trim() ? `${name} ${lastName.value.trim()}` : name
})

const header = computed(
  () => `${language.value.trim() || 'Georgian'} - ${fullName.value} #${idNo.value.trim() || 'ID'}`,
)

function showToast(message: string) {
  toast.value = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = null
  }, 2000)
}

async function copyAction(actionCode: string, description: string, buttonName: string) {
  let message = `${header.value} - **${actionCode}**`
  if (description.trim()) message += `\n${description.trim()}`
  try {
    await navigator.clipboard.writeText(message)
    showToast(`Copied: ${buttonName}`)
  } catch {
    showToast('Failed to copy')
  }
}

const inputClass =
  'w-full rounded-lg border border-gray-700 bg-surface-hover px-3 py-2 text-sm focus:outline-none focus:border-primary-500'
const primaryBtn =
  'rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-600 active:scale-[0.98]'
const secondaryBtn =
  'rounded-lg bg-secondary-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-secondary-600 active:scale-[0.98]'
const neutralBtn =
  'rounded-lg border border-gray-700 px-4 py-3 text-sm font-semibold transition-all duration-200 hover:border-primary-500 hover:text-primary-500 active:scale-[0.98]'
const dangerBtn =
  'rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-600 active:scale-[0.98]'
</script>

<template>
  <div class="mx-auto max-w-xl px-6 py-12">
    <RouterLink
      to="/tools"
      class="inline-flex items-center gap-1 text-sm font-semibold text-primary-500 hover:underline"
    >
      <ArrowLeft class="w-4 h-4" /> All tools
    </RouterLink>

    <div class="mt-4 rounded-2xl border border-gray-700 p-6 md:p-8">
      <h1 class="text-2xl font-bold text-center">Shift Tracker</h1>
      <p class="mt-1 text-sm opacity-70 text-center">
        Fill in your details, then tap a button to copy a Discord-ready message.
      </p>

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wide opacity-70 mb-1" for="st-language">Language</label>
          <input id="st-language" v-model="language" type="text" placeholder="e.g., Georgian" :class="inputClass" />
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wide opacity-70 mb-1" for="st-name">Name</label>
          <input id="st-name" v-model="firstName" type="text" placeholder="e.g., John" :class="inputClass" />
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wide opacity-70 mb-1" for="st-lastname">Last Name</label>
          <input id="st-lastname" v-model="lastName" type="text" placeholder="e.g., Doe" :class="inputClass" />
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wide opacity-70 mb-1" for="st-id">ID</label>
          <input id="st-id" v-model="idNo" type="text" placeholder="e.g., 123456" :class="inputClass" />
        </div>
      </div>

      <div class="mt-6 rounded-lg border border-gray-700 bg-surface-hover p-3 font-mono text-sm opacity-80">
        {{ header }}
      </div>

      <div class="mt-6 flex flex-col gap-3">
        <button :class="primaryBtn" @click="copyAction('SOS', '', 'Start Of Shift')">
          Start Of Shift
        </button>
        <button
          :class="primaryBtn"
          @click="copyAction('SOS', 'Using first hour for mentoring', 'Start Of Shift With Mentoring')"
        >
          Start Of Shift With Mentoring
        </button>
        <button :class="secondaryBtn" @click="copyAction('EOS', '', 'End Of Shift')">
          End Of Shift
        </button>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wide opacity-70 mb-1" for="st-shortcall">SHORT CALL Description</label>
          <input
            id="st-shortcall"
            v-model="shortCallDesc"
            type="text"
            placeholder="e.g., T-Mobile Contract Centers - LEP hung up"
            :class="inputClass"
          />
        </div>
        <button :class="primaryBtn" @click="copyAction('SHORT CALL', shortCallDesc, 'SHORT CALL')">
          SHORT CALL
        </button>

        <div class="grid grid-cols-2 gap-3">
          <button :class="neutralBtn" @click="copyAction('RR OUT', '', 'Restroom Out')">RR Out</button>
          <button :class="neutralBtn" @click="copyAction('RR IN', '', 'Restroom In')">RR In</button>
          <button :class="neutralBtn" @click="copyAction('BRK 1 OUT', '', 'Break 1 Out')">BRK 1 Out</button>
          <button :class="neutralBtn" @click="copyAction('BRK 1 IN', '', 'Break 1 In')">BRK 1 In</button>
          <button :class="neutralBtn" @click="copyAction('BRK 2 OUT', '', 'Break 2 Out')">BRK 2 Out</button>
          <button :class="neutralBtn" @click="copyAction('BRK 2 IN', '', 'Break 2 In')">BRK 2 In</button>
          <button :class="neutralBtn" @click="copyAction('LBRK OUT', '', 'Lunch Break Out')">LBRK Out</button>
          <button :class="neutralBtn" @click="copyAction('LBRK IN', '', 'Lunch Break In')">LBRK In</button>
        </div>

        <button :class="dangerBtn" @click="copyAction('Error', 'Unable to login to InterpreterConnect.', 'Error')">
          Error
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toast"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-lg flex items-center gap-2"
        role="status"
      >
        <Copy class="w-4 h-4" /> {{ toast }}
      </div>
    </Transition>
  </div>
</template>
