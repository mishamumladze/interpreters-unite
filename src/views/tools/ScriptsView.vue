<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  FileText,
  Folder,
  FolderPlus,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from '@lucide/vue'

interface ScriptItem {
  id: string
  title: string
  english: string
  georgian: string
  createdAt: string
  folderId: string | null
}

interface Folder {
  id: string
  name: string
  createdAt: string
  collapsed: boolean
}

const SCRIPTS_KEY = 'scripts'
const FOLDERS_KEY = 'script-folders'

function loadScripts(): ScriptItem[] {
  try {
    const saved = localStorage.getItem(SCRIPTS_KEY)
    if (!saved) return []
    // Migrate pre-folder scripts: missing folderId -> null (Ungrouped)
    return (JSON.parse(saved) as Partial<ScriptItem>[]).map((s) => ({
      id: s.id ?? Date.now().toString(),
      title: s.title ?? 'Untitled',
      english: s.english ?? '',
      georgian: s.georgian ?? '',
      createdAt: s.createdAt ?? new Date().toISOString(),
      folderId: s.folderId ?? null,
    }))
  } catch {
    return []
  }
}

function loadFolders(): Folder[] {
  try {
    const saved = localStorage.getItem(FOLDERS_KEY)
    return saved ? (JSON.parse(saved) as Folder[]) : []
  } catch {
    return []
  }
}

const scripts = ref<ScriptItem[]>(loadScripts())
const folders = ref<Folder[]>(loadFolders())
const searchQuery = ref('')
const showAddModal = ref(false)
const editingId = ref<string | null>(null)

const newTitle = ref('')
const newEnglish = ref('')
const newGeorgian = ref('')
const newFolderId = ref<string | null>(null)

const editTitle = ref('')
const editEnglish = ref('')
const editGeorgian = ref('')
const editFolderId = ref<string | null>(null)

const toast = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

// --- Scoped search: "FolderName: term" searches inside one folder ---
interface ParsedSearch {
  folder: Folder | null
  term: string
}

const parsedSearch = computed<ParsedSearch>(() => {
  const q = searchQuery.value
  const colon = q.indexOf(':')
  if (colon === -1) return { folder: null, term: q.trim().toLowerCase() }
  const left = q.slice(0, colon).trim().toLowerCase()
  const term = q.slice(colon + 1).trim().toLowerCase()
  if (!left) return { folder: null, term }
  const exact = folders.value.find((f) => f.name.toLowerCase() === left)
  const folder = exact ?? folders.value.find((f) => f.name.toLowerCase().startsWith(left)) ?? null
  if (!folder) return { folder: null, term: q.trim().toLowerCase() }
  return { folder, term }
})

const isSearching = computed(() => searchQuery.value.trim().length > 0)

function matchesTerm(s: ScriptItem, term: string): boolean {
  if (!term) return true
  return (
    s.title.toLowerCase().includes(term) ||
    s.english.toLowerCase().includes(term) ||
    s.georgian.toLowerCase().includes(term)
  )
}

// Flat results when searching (folders hidden); folder badge shown per card
const flatResults = computed(() => {
  const { folder, term } = parsedSearch.value
  return scripts.value.filter(
    (s) => (!folder || s.folderId === folder.id) && matchesTerm(s, term),
  )
})

const ungroupedScripts = computed(() => scripts.value.filter((s) => !s.folderId || !folders.value.some((f) => f.id === s.folderId)))

function scriptsInFolder(folderId: string) {
  return scripts.value.filter((s) => s.folderId === folderId)
}

function folderName(folderId: string | null): string {
  if (!folderId) return 'Ungrouped'
  return folders.value.find((f) => f.id === folderId)?.name ?? 'Ungrouped'
}

const editingScript = computed(() => scripts.value.find((s) => s.id === editingId.value) ?? null)

function persistScripts() {
  localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts.value))
}

function persistFolders() {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders.value))
}

function showToast(message: string) {
  toast.value = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = null
  }, 2500)
}

// --- Folders CRUD ---
function createFolder() {
  const name = prompt('Folder name:')?.trim()
  if (!name) return
  folders.value.push({
    id: Date.now().toString(),
    name,
    createdAt: new Date().toISOString(),
    collapsed: false,
  })
  persistFolders()
  showToast(`Folder "${name}" created`)
}

function renameFolder(id: string) {
  const folder = folders.value.find((f) => f.id === id)
  if (!folder) return
  const name = prompt('Rename folder:', folder.name)?.trim()
  if (!name || name === folder.name) return
  folder.name = name
  persistFolders()
  showToast('Folder renamed')
}

function deleteFolder(id: string) {
  const folder = folders.value.find((f) => f.id === id)
  if (!folder) return
  if (!confirm(`Delete folder "${folder.name}"? Its scripts move to Ungrouped.`)) return
  scripts.value.forEach((s) => {
    if (s.folderId === id) s.folderId = null
  })
  folders.value = folders.value.filter((f) => f.id !== id)
  persistScripts()
  persistFolders()
  showToast('Folder deleted')
}

function toggleFolder(id: string) {
  const folder = folders.value.find((f) => f.id === id)
  if (!folder) return
  folder.collapsed = !folder.collapsed
  persistFolders()
}

function clearSearch() {
  searchQuery.value = ''
}

// --- Scripts CRUD ---
function openAddModal(preselectFolder: string | null = null) {
  newTitle.value = ''
  newEnglish.value = ''
  newGeorgian.value = ''
  newFolderId.value = preselectFolder
  showAddModal.value = true
}

function addScript() {
  if (!newEnglish.value.trim() && !newGeorgian.value.trim()) {
    showToast('Add at least one version')
    return
  }
  scripts.value.push({
    id: Date.now().toString(),
    title: newTitle.value.trim() || 'Untitled',
    english: newEnglish.value,
    georgian: newGeorgian.value,
    createdAt: new Date().toISOString(),
    folderId: newFolderId.value,
  })
  persistScripts()
  showAddModal.value = false
  showToast('Script added')
}

function openEditor(id: string) {
  const script = scripts.value.find((s) => s.id === id)
  if (!script) return
  editingId.value = id
  editTitle.value = script.title
  editEnglish.value = script.english
  editGeorgian.value = script.georgian
  editFolderId.value = script.folderId
}

function closeEditor() {
  editingId.value = null
}

function saveEdit() {
  const script = scripts.value.find((s) => s.id === editingId.value)
  if (!script) return
  script.title = editTitle.value.trim() || 'Untitled'
  script.english = editEnglish.value
  script.georgian = editGeorgian.value
  script.folderId = editFolderId.value
  persistScripts()
  closeEditor()
  showToast('Script updated')
}

function deleteScript(id: string) {
  if (!confirm('Delete this script?')) return
  scripts.value = scripts.value.filter((s) => s.id !== id)
  persistScripts()
  showToast('Script deleted')
}

function closeAll() {
  showAddModal.value = false
  closeEditor()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeAll()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

const inputClass =
  'w-full rounded-lg border border-gray-700 bg-surface-hover px-3 py-2 text-sm focus:outline-none focus:border-primary-500'
const selectClass =
  'rounded-lg border border-gray-700 bg-surface-hover px-3 py-2 text-sm focus:outline-none focus:border-primary-500'
const labelClass = 'block text-sm font-medium mb-1'
const cardClass =
  'rounded-2xl border border-gray-700 p-6 flex flex-col gap-4 transition-all duration-200 hover:border-primary-500 hover:-translate-y-0.5'
const modalOverlay =
  'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'
const modalPanel = 'w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl border border-gray-700 bg-surface p-6'
</script>

<template>
  <div class="mx-auto max-w-6xl px-6 py-12">
    <RouterLink
      to="/tools"
      class="inline-flex items-center gap-1 text-sm font-semibold text-primary-500 hover:underline"
    >
      <ArrowLeft class="w-4 h-4" /> All tools
    </RouterLink>

    <div class="mt-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
      <div>
        <h1 class="text-3xl font-bold">Script Manager</h1>
        <p class="mt-1 text-sm opacity-70">Save English + Georgian scripts locally in your browser.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder='Search... or "Folder: term"'
          aria-label="Search scripts"
          class="rounded-full border border-gray-700 bg-surface-hover px-4 py-2 text-sm focus:outline-none focus:border-primary-500 min-w-52"
        />
        <button
          class="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold transition-all hover:border-primary-500 hover:text-primary-500"
          @click="createFolder"
        >
          <FolderPlus class="w-4 h-4" /> Folder
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-600"
          @click="openAddModal()"
        >
          <Plus class="w-4 h-4" /> Add
        </button>
      </div>
    </div>

    <!-- Search mode: flat results, folders hidden -->
    <div v-if="isSearching">
      <div class="mt-6 flex items-center gap-2 text-sm">
        <span class="opacity-70">
          {{ flatResults.length }} result{{ flatResults.length === 1 ? '' : 's' }}
        </span>
        <button
          v-if="parsedSearch.folder"
          class="inline-flex items-center gap-1 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-500 hover:bg-primary-500 hover:text-white transition-all"
          @click="clearSearch"
          title="Clear search"
        >
          In {{ parsedSearch.folder.name }} <X class="w-3 h-3" />
        </button>
        <button v-else class="text-xs font-semibold text-primary-500 hover:underline" @click="clearSearch">
          Clear
        </button>
        <span class="opacity-50 text-xs hidden sm:inline">Tip: "Folder: term" searches inside one folder</span>
      </div>
      <ul v-if="flatResults.length" class="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 list-none m-0 p-0">
        <li v-for="script in flatResults" :key="script.id" :class="cardClass">
          <div class="flex items-center gap-2">
            <div class="font-bold truncate flex-1">{{ script.title }}</div>
            <span class="text-xs rounded-full border border-gray-700 px-2 py-0.5 opacity-70 shrink-0">
              {{ folderName(script.folderId) }}
            </span>
          </div>
          <p class="text-sm opacity-70 line-clamp-3 min-h-16 whitespace-pre-line">{{ script.english || '—' }}</p>
          <div class="flex gap-2 mt-auto">
            <button
              class="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-primary-500/10 px-3 py-2 text-sm font-semibold text-primary-500 transition-all duration-200 hover:bg-primary-500 hover:text-white"
              @click="openEditor(script.id)"
            >
              <Eye class="w-4 h-4" /> View/Edit
            </button>
            <button
              class="inline-flex items-center justify-center gap-1 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-500 transition-all duration-200 hover:bg-red-500 hover:text-white"
              @click="deleteScript(script.id)"
              :aria-label="`Delete ${script.title}`"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </li>
      </ul>
      <div v-else class="mt-4 text-center rounded-2xl border-2 border-dashed border-gray-700 px-6 py-16">
        <h2 class="text-xl font-bold">No matches</h2>
        <p class="mt-1 text-sm opacity-70">Try a different search</p>
      </div>
    </div>

    <!-- Grouped mode -->
    <div v-else class="mt-8 flex flex-col gap-6">
      <section v-for="folder in folders" :key="folder.id" class="rounded-2xl border border-gray-700">
        <div class="flex items-center gap-2 p-4">
          <button
            class="flex flex-1 items-center gap-2 text-left"
            @click="toggleFolder(folder.id)"
            :aria-expanded="!folder.collapsed"
          >
            <ChevronDown
              class="w-5 h-5 text-primary-500 transition-transform duration-200"
              :class="folder.collapsed ? '-rotate-90' : ''"
            />
            <Folder class="w-5 h-5 text-primary-500" />
            <span class="font-bold">{{ folder.name }}</span>
            <span class="text-xs rounded-full border border-gray-700 px-2 py-0.5 opacity-70">
              {{ scriptsInFolder(folder.id).length }}
            </span>
          </button>
          <button
            class="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:text-primary-500"
            @click="renameFolder(folder.id)"
            :aria-label="`Rename ${folder.name}`"
          >
            <Pencil class="w-4 h-4" />
          </button>
          <button
            class="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:text-red-500"
            @click="deleteFolder(folder.id)"
            :aria-label="`Delete ${folder.name}`"
          >
            <Trash2 class="w-4 h-4" />
          </button>
          <button
            class="inline-flex items-center gap-1 rounded-lg bg-primary-500/10 px-3 py-1.5 text-xs font-semibold text-primary-500 transition-all hover:bg-primary-500 hover:text-white"
            @click="openAddModal(folder.id)"
          >
            <Plus class="w-3 h-3" /> Script
          </button>
        </div>
        <ul
          v-show="!folder.collapsed"
          class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 list-none m-0 p-4 pt-0"
        >
          <li v-for="script in scriptsInFolder(folder.id)" :key="script.id" :class="cardClass">
            <div class="font-bold truncate">{{ script.title }}</div>
            <p class="text-sm opacity-70 line-clamp-3 min-h-16 whitespace-pre-line">{{ script.english || '—' }}</p>
            <div class="flex gap-2 mt-auto">
              <button
                class="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-primary-500/10 px-3 py-2 text-sm font-semibold text-primary-500 transition-all duration-200 hover:bg-primary-500 hover:text-white"
                @click="openEditor(script.id)"
              >
                <Eye class="w-4 h-4" /> View/Edit
              </button>
              <button
                class="inline-flex items-center justify-center gap-1 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-500 transition-all duration-200 hover:bg-red-500 hover:text-white"
                @click="deleteScript(script.id)"
                :aria-label="`Delete ${script.title}`"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </li>
        </ul>
        <p
          v-show="!folder.collapsed && scriptsInFolder(folder.id).length === 0"
          class="px-4 pb-4 text-sm opacity-50"
        >
          Empty — add a script to this folder.
        </p>
      </section>

      <!-- Ungrouped -->
      <section v-if="ungroupedScripts.length" class="rounded-2xl border border-dashed border-gray-700 p-4">
        <div class="mb-4 flex items-center gap-2">
          <FileText class="w-5 h-5 text-primary-500" />
          <span class="font-bold">Ungrouped</span>
          <span class="text-xs rounded-full border border-gray-700 px-2 py-0.5 opacity-70">
            {{ ungroupedScripts.length }}
          </span>
        </div>
        <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 list-none m-0 p-0">
          <li v-for="script in ungroupedScripts" :key="script.id" :class="cardClass">
            <div class="font-bold truncate">{{ script.title }}</div>
            <p class="text-sm opacity-70 line-clamp-3 min-h-16 whitespace-pre-line">{{ script.english || '—' }}</p>
            <div class="flex gap-2 mt-auto">
              <button
                class="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-primary-500/10 px-3 py-2 text-sm font-semibold text-primary-500 transition-all duration-200 hover:bg-primary-500 hover:text-white"
                @click="openEditor(script.id)"
              >
                <Eye class="w-4 h-4" /> View/Edit
              </button>
              <button
                class="inline-flex items-center justify-center gap-1 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-500 transition-all duration-200 hover:bg-red-500 hover:text-white"
                @click="deleteScript(script.id)"
                :aria-label="`Delete ${script.title}`"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </li>
        </ul>
      </section>

      <!-- Empty state -->
      <div
        v-if="scripts.length === 0"
        class="text-center rounded-2xl border-2 border-dashed border-gray-700 px-6 py-16"
      >
        <div
          class="mx-auto mb-4 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-500/10 text-primary-500"
        >
          <FileText class="w-10 h-10" />
        </div>
        <h2 class="text-xl font-bold">No scripts yet</h2>
        <p class="mt-1 text-sm opacity-70">Create your first script to get started</p>
        <button
          class="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-primary-600"
          @click="openAddModal()"
        >
          <Plus class="w-4 h-4" /> Create your first script
        </button>
      </div>
    </div>

    <!-- View/Edit modal -->
    <div v-if="editingScript" :class="modalOverlay" @click.self="closeEditor">
      <div :class="modalPanel" role="dialog" aria-modal="true" :aria-label="editingScript.title">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold truncate">{{ editingScript.title }}</h2>
          <button
            class="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-700 transition-all hover:border-primary-500 hover:text-primary-500"
            @click="closeEditor"
            aria-label="Close"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label :class="labelClass" for="edit-title">Title</label>
            <input id="edit-title" v-model="editTitle" type="text" :class="inputClass" />
          </div>
          <div>
            <label :class="labelClass" for="edit-folder">Folder</label>
            <select id="edit-folder" v-model="editFolderId" :class="selectClass + ' w-full'">
              <option :value="null">Ungrouped</option>
              <option v-for="f in folders" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
          </div>
        </div>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <h3 class="text-xs font-semibold uppercase tracking-wide opacity-70 border-l-2 border-primary-500 pl-2 mb-2">
              English Version
            </h3>
            <textarea
              v-model="editEnglish"
              rows="12"
              :class="inputClass + ' font-mono'"
              placeholder="Enter English script..."
            />
          </div>
          <div>
            <h3 class="text-xs font-semibold uppercase tracking-wide opacity-70 border-l-2 border-primary-500 pl-2 mb-2">
              Georgian Version
            </h3>
            <textarea
              v-model="editGeorgian"
              rows="12"
              :class="inputClass + ' font-mono'"
              placeholder="Enter Georgian script..."
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold transition-all hover:border-primary-500 hover:text-primary-500"
            @click="closeEditor"
          >
            <X class="w-4 h-4" /> Cancel
          </button>
          <button
            class="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-600"
            @click="saveEdit"
          >
            <Save class="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>

    <!-- Add modal -->
    <div v-if="showAddModal" :class="modalOverlay" @click.self="showAddModal = false">
      <div :class="modalPanel" role="dialog" aria-modal="true" aria-label="Add new script">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">Add New Script</h2>
          <button
            class="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-700 transition-all hover:border-primary-500 hover:text-primary-500"
            @click="showAddModal = false"
            aria-label="Close"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label :class="labelClass" for="new-title">Title</label>
            <input id="new-title" v-model="newTitle" type="text" placeholder="Script title" :class="inputClass" />
          </div>
          <div>
            <label :class="labelClass" for="new-folder">Folder</label>
            <select id="new-folder" v-model="newFolderId" :class="selectClass + ' w-full'">
              <option :value="null">Ungrouped</option>
              <option v-for="f in folders" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
          </div>
        </div>
        <div class="mb-4">
          <label :class="labelClass" for="new-english">English Version</label>
          <textarea id="new-english" v-model="newEnglish" rows="6" placeholder="Enter English script..." :class="inputClass + ' font-mono'" />
        </div>
        <div class="mb-4">
          <label :class="labelClass" for="new-georgian">Georgian Version</label>
          <textarea id="new-georgian" v-model="newGeorgian" rows="6" placeholder="Enter Georgian script..." :class="inputClass + ' font-mono'" />
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold transition-all hover:border-primary-500 hover:text-primary-500"
            @click="showAddModal = false"
          >
            <X class="w-4 h-4" /> Cancel
          </button>
          <button
            class="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-600"
            @click="addScript"
          >
            <Plus class="w-4 h-4" /> Add
          </button>
        </div>
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
        class="fixed bottom-6 right-6 rounded-xl bg-dark-900 text-light-200 px-4 py-3 text-sm font-semibold shadow-lg flex items-center gap-2"
        role="status"
      >
        <Check class="w-4 h-4 text-primary-500" /> {{ toast }}
      </div>
    </Transition>
  </div>
</template>
