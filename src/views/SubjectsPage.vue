<template>
  <ion-page>

    <ion-header class="ion-no-border">
      <ion-toolbar class="toolbar">
        <div class="toolbar-inner">
          <h1 class="toolbar-title">Subjects</h1>
          <span class="subject-count" v-if="!loading">{{ filtered.length }} subjects</span>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">

      <!-- SEARCH -->
      <div class="search-wrap">
        <div class="search-box">
          <ion-icon :icon="searchOutline" class="search-icon" />
          <input
            v-model="query"
            class="search-input"
            placeholder="Search subjects…"
            type="search"
          />
        </div>
      </div>

      <!-- FILTER CHIPS -->
      <div class="chips-wrap">
        <button
          v-for="chip in chips"
          :key="chip"
          class="chip"
          :class="{ active: activeChip === chip }"
          @click="activeChip = chip"
        >
          {{ chip }}
        </button>
      </div>

      <!-- LOADING SKELETONS -->
      <div v-if="loading" class="container">
        <div v-for="n in 6" :key="n" class="skeleton-row">
          <div class="skeleton-icon" />
          <div class="skeleton-body">
            <div class="skeleton-title" />
            <div class="skeleton-text" />
          </div>
          <div class="skeleton-badge" />
        </div>
      </div>

      <!-- ERROR -->
      <div v-else-if="error" class="empty">
        <ion-icon :icon="alertCircleOutline" class="empty-icon" />
        <p>{{ error }}</p>
        <button class="retry-btn" @click="fetchSubjects">Retry</button>
      </div>

      <!-- EMPTY -->
      <div v-else-if="filtered.length === 0" class="empty">
        <ion-icon :icon="bookOutline" class="empty-icon" />
        <p>No subjects found</p>
      </div>

      <!-- SUBJECT LIST -->
      <div v-else class="container">
        <div
          v-for="subject in filtered"
          :key="subject.id"
          class="card"
          @click="router.push(`/subjects/${subject.id}`)"
        >
          <div class="card-icon" :style="{ background: subjectColor(subject.name).bg }">
            <ion-icon :icon="subjectIcon(subject.name)" :style="{ color: subjectColor(subject.name).fg }" />
          </div>

          <div class="card-body">
            <p class="card-name">{{ subject.name }}</p>
            <p class="card-desc">{{ subject.description }}</p>
          </div>

          <div class="card-right">
            <span class="badge" :class="badgeClass(subject.level)">{{ subject.level }}</span>
            <ion-icon :icon="chevronForwardOutline" class="card-arrow" />
          </div>
        </div>
      </div>

    </ion-content>

  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon
} from '@ionic/vue'

import {
  searchOutline,
  bookOutline,
  calculatorOutline,
  flaskOutline,
  languageOutline,
  globeOutline,
  codeSlashOutline,
  colorPaletteOutline,
  musicalNotesOutline,
  peopleOutline,
  statsChartOutline,
  alertCircleOutline,
  chevronForwardOutline
} from 'ionicons/icons'

import { supabase } from '@/database/database'

const router = useRouter()
const subjects = ref([])
const loading = ref(true)
const error = ref('')
const query = ref('')
const activeChip = ref('All')
const chips = ['All', 'Core', 'Elective']

const filtered = computed(() => {
  return subjects.value.filter(s => {
    const matchesQuery = s.name.toLowerCase().includes(query.value.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(query.value.toLowerCase())
    const matchesChip = activeChip.value === 'All' || s.level === activeChip.value
    return matchesQuery && matchesChip
  })
})

async function fetchSubjects() {
  loading.value = true
  error.value = ''

  const { data, error: err } = await supabase
    .from('subject')
    .select('id, name, description, class_id')
    .order('name', { ascending: true })

  if (err) {
    error.value = 'Failed to load subjects. Please try again.'
  } else {
    subjects.value = data || []
  }

  loading.value = false
}

function subjectIcon(name = '') {
  const n = name.toLowerCase()
  if (n.includes('math'))       return calculatorOutline
  if (n.includes('biology') || n.includes('chem') || n.includes('science') || n.includes('physics')) return flaskOutline
  if (n.includes('english') || n.includes('language') || n.includes('literature')) return languageOutline
  if (n.includes('geo'))        return globeOutline
  if (n.includes('computer') || n.includes('ict') || n.includes('code')) return codeSlashOutline
  if (n.includes('art'))        return colorPaletteOutline
  if (n.includes('music'))      return musicalNotesOutline
  if (n.includes('history') || n.includes('social')) return peopleOutline
  if (n.includes('economic') || n.includes('commerce')) return statsChartOutline
  return bookOutline
}

function subjectColor(name = '') {
  const n = name.toLowerCase()
  if (n.includes('math'))       return { bg: '#EEF2FF', fg: '#4F63D2' }
  if (n.includes('biology') || n.includes('science') || n.includes('physics')) return { bg: '#ECFDF5', fg: '#10B981' }
  if (n.includes('chem'))       return { bg: '#FFF0F0', fg: '#EF4444' }
  if (n.includes('english') || n.includes('language') || n.includes('literature')) return { bg: '#FFF7ED', fg: '#F97316' }
  if (n.includes('geo'))        return { bg: '#F0FDF4', fg: '#16A34A' }
  if (n.includes('computer') || n.includes('ict') || n.includes('code')) return { bg: '#F5F3FF', fg: '#7C3AED' }
  if (n.includes('art'))        return { bg: '#FDF4FF', fg: '#C026D3' }
  if (n.includes('music'))      return { bg: '#FFF1F2', fg: '#E11D48' }
  if (n.includes('history') || n.includes('social')) return { bg: '#FFFBEB', fg: '#D97706' }
  if (n.includes('economic') || n.includes('commerce')) return { bg: '#F0FDFA', fg: '#0D9488' }
  return { bg: '#F1F5F9', fg: '#64748B' }
}

function badgeClass(level = '') {
  const l = level.toLowerCase()
  if (l === 'core')     return 'badge-core'
  if (l === 'elective') return 'badge-elective'
  return 'badge-default'
}

onMounted(fetchSubjects)
</script>

<style scoped>
.page {
  --background: #ffffff;
}

/* TOOLBAR */
.toolbar {
  --background: #ffffff;
  --border-width: 0;
}

.toolbar-inner {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 8px 20px 4px;
}

.toolbar-title {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  color: #1A1A2E;
}

.subject-count {
  font-size: 13px;
  color: #9CA3AF;
  font-weight: 500;
}

/* SEARCH */
.search-wrap {
  padding: 8px 20px 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border-radius: 14px;
  padding: 12px 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-icon {
  font-size: 18px;
  color: #9CA3AF;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #1A1A2E;
}

.search-input::placeholder {
  color: #9CA3AF;
}

/* CHIPS */
.chips-wrap {
  display: flex;
  gap: 8px;
  padding: 14px 20px;
  overflow-x: auto;
}

.chip {
  flex-shrink: 0;
  border: 1.5px solid #E5E7EB;
  border-radius: 999px;
  background: #ffffff;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.15s;
}

.chip.active {
  background: #1A1A2E;
  border-color: #1A1A2E;
  color: #ffffff;
}

/* CONTAINER */
.container {
  padding: 0 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* CARD */
.card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 16px;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.card:active {
  background: #F9FAFB;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  flex-shrink: 0;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-name {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc {
  margin: 0;
  font-size: 12px;
  color: #9CA3AF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.badge {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
}

.badge-core    { background: #EEF2FF; color: #4F63D2; }
.badge-elective { background: #ECFDF5; color: #10B981; }
.badge-default  { background: #F1F5F9; color: #64748B; }

.card-arrow {
  font-size: 15px;
  color: #D1D5DB;
}

/* SKELETONS */
@keyframes shimmer {
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #F1F3F6;
  border-radius: 16px;
  background: #ffffff;
}

.skeleton-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton-icon,
.skeleton-badge,
.skeleton-title,
.skeleton-text {
  background: #F3F4F6;
  border-radius: 6px;
  animation: shimmer 1.4s ease-in-out infinite;
}

.skeleton-icon  { width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0; }
.skeleton-title { width: 50%; height: 13px; }
.skeleton-text  { width: 75%; height: 11px; }
.skeleton-badge { width: 48px; height: 20px; border-radius: 999px; flex-shrink: 0; }

/* EMPTY / ERROR */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  color: #9CA3AF;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  color: #D1D5DB;
}

.empty p {
  margin: 0;
  font-size: 14px;
}

.retry-btn {
  background: #4F63D2;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
</style>
