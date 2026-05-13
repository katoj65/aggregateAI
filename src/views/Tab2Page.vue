<template>
  <ion-page>

    <ion-header class="ion-no-border">
      <ion-toolbar class="toolbar">
        <div class="toolbar-inner">
          <div>
            <h1 class="toolbar-title">Learn</h1>
            <p class="toolbar-sub">All your study materials</p>
          </div>
          <div class="toolbar-icon-wrap">
            <ion-icon :icon="libraryOutline" class="toolbar-icon" />
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">
      <div class="container">

        <!-- SEARCH -->
        <div class="search-box">
          <ion-icon :icon="searchOutline" class="search-icon" />
          <input
            v-model="query"
            class="search-input"
            placeholder="Search subjects, topics…"
            type="search"
          />
        </div>

        <!-- MATERIAL TYPES -->
        <section class="section">
          <p class="section-title">Browse by Type</p>
          <div class="types-row">

            <button class="type-card" @click="router.push('/subjects')">
              <div class="type-icon indigo">
                <ion-icon :icon="bookOutline" />
              </div>
              <span>Subjects</span>
            </button>

            <button class="type-card" @click="router.push('/practice')">
              <div class="type-icon green">
                <ion-icon :icon="createOutline" />
              </div>
              <span>Practice</span>
            </button>

            <button class="type-card" @click="router.push('/chat')">
              <div class="type-icon purple">
                <ion-icon :icon="sparklesOutline" />
              </div>
              <span>AI Tutor</span>
            </button>

            <button class="type-card" @click="router.push('/progress')">
              <div class="type-icon orange">
                <ion-icon :icon="statsChartOutline" />
              </div>
              <span>Progress</span>
            </button>

          </div>
        </section>

        <!-- SUBJECTS -->
        <section class="section">
          <div class="section-header">
            <p class="section-title">Subjects</p>
            <button class="see-all" @click="router.push('/subjects')">See all</button>
          </div>

          <!-- LOADING -->
          <div v-if="loading" class="subject-list">
            <div v-for="n in 4" :key="n" class="sk-row">
              <div class="sk-icon" />
              <div class="sk-body">
                <div class="sk-title" />
                <div class="sk-text" />
              </div>
              <div class="sk-badge" />
            </div>
          </div>

          <!-- EMPTY SEARCH -->
          <div v-else-if="filtered.length === 0" class="empty">
            <ion-icon :icon="searchOutline" class="empty-icon" />
            <p>No subjects match "{{ query }}"</p>
          </div>

          <!-- LIST -->
          <div v-else class="subject-list">
            <div
              v-for="subject in filtered.slice(0, 6)"
              :key="subject.id"
              class="subject-row"
              @click="router.push(`/subjects/${subject.id}`)"
            >
              <div class="subject-icon-wrap" :style="{ background: subjectColor(subject.name).bg }">
                <ion-icon :icon="subjectIcon(subject.name)" :style="{ color: subjectColor(subject.name).fg }" />
              </div>
              <div class="subject-body">
                <p class="subject-name">{{ subject.name }}</p>
                <p class="subject-desc">{{ subject.description }}</p>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="subject-arrow" />
            </div>
          </div>

        </section>

        <!-- CONTINUE LEARNING -->
        <section class="section">
          <p class="section-title">Continue Learning</p>
          <div class="continue-list">
            <div
              v-for="item in continueList"
              :key="item.topic"
              class="continue-card"
              @click="router.push(`/subjects/${item.subjectId}`)"
            >
              <div class="continue-icon" :style="{ background: item.bg }">
                <ion-icon :icon="item.icon" :style="{ color: item.fg }" />
              </div>
              <div class="continue-body">
                <p class="continue-subject">{{ item.subject }}</p>
                <p class="continue-topic">{{ item.topic }}</p>
                <div class="continue-track">
                  <div class="continue-fill" :style="{ width: item.progress + '%', background: item.fg }" />
                </div>
              </div>
              <span class="continue-pct" :style="{ color: item.fg }">{{ item.progress }}%</span>
            </div>
          </div>
        </section>

        <!-- AI BANNER -->
        <div class="ai-banner" @click="router.push('/chat')">
          <div class="ai-banner-deco" />
          <div class="ai-banner-left">
            <div class="ai-banner-icon">
              <ion-icon :icon="sparklesOutline" />
            </div>
            <div>
              <p class="ai-banner-title">Ask AI Tutor</p>
              <p class="ai-banner-sub">Get instant help on any topic</p>
            </div>
          </div>
          <ion-icon :icon="chevronForwardOutline" class="ai-banner-arrow" />
        </div>

      </div>

      <!-- FAB -->
      <button class="fab" @click="router.push('/chat')">
        <ion-icon :icon="sparklesOutline" />
      </button>

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
  libraryOutline,
  bookOutline,
  createOutline,
  sparklesOutline,
  statsChartOutline,
  chevronForwardOutline,
  calculatorOutline,
  flaskOutline,
  languageOutline,
  globeOutline,
  codeSlashOutline,
  colorPaletteOutline,
  musicalNotesOutline,
  peopleOutline
} from 'ionicons/icons'

import { supabase } from '@/database/database'

const router = useRouter()
const subjects = ref([])
const loading = ref(true)
const query = ref('')

const continueList = [
  {
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    progress: 72,
    subjectId: 1,
    icon: calculatorOutline,
    bg: '#EEF2FF',
    fg: '#4F63D2'
  },
  {
    subject: 'Biology',
    topic: 'Cell Structure & Division',
    progress: 45,
    subjectId: 2,
    icon: flaskOutline,
    bg: '#ECFDF5',
    fg: '#10B981'
  }
]

const filtered = computed(() => {
  if (!query.value) return subjects.value
  const q = query.value.toLowerCase()
  return subjects.value.filter(s =>
    s.name.toLowerCase().includes(q) ||
    (s.description || '').toLowerCase().includes(q)
  )
})

function subjectIcon(name = '') {
  const n = name.toLowerCase()
  if (n.includes('math'))                                                         return calculatorOutline
  if (n.includes('biology') || n.includes('science') || n.includes('physics'))   return flaskOutline
  if (n.includes('chem'))                                                         return flaskOutline
  if (n.includes('english') || n.includes('language') || n.includes('literature')) return languageOutline
  if (n.includes('geo'))                                                          return globeOutline
  if (n.includes('computer') || n.includes('ict') || n.includes('code'))         return codeSlashOutline
  if (n.includes('art'))                                                          return colorPaletteOutline
  if (n.includes('music'))                                                        return musicalNotesOutline
  if (n.includes('history') || n.includes('social'))                             return peopleOutline
  return bookOutline
}

function subjectColor(name = '') {
  const n = name.toLowerCase()
  if (n.includes('math'))                                                         return { bg: '#EEF2FF', fg: '#4F63D2' }
  if (n.includes('biology') || n.includes('science') || n.includes('physics'))   return { bg: '#ECFDF5', fg: '#10B981' }
  if (n.includes('chem'))                                                         return { bg: '#FFF0F0', fg: '#EF4444' }
  if (n.includes('english') || n.includes('language') || n.includes('literature')) return { bg: '#FFF7ED', fg: '#F97316' }
  if (n.includes('geo'))                                                          return { bg: '#F0FDF4', fg: '#16A34A' }
  if (n.includes('computer') || n.includes('ict') || n.includes('code'))         return { bg: '#F5F3FF', fg: '#7C3AED' }
  if (n.includes('art'))                                                          return { bg: '#FDF4FF', fg: '#C026D3' }
  if (n.includes('music'))                                                        return { bg: '#FFF1F2', fg: '#E11D48' }
  if (n.includes('history') || n.includes('social'))                             return { bg: '#FFFBEB', fg: '#D97706' }
  return { bg: '#F1F5F9', fg: '#64748B' }
}

async function fetchSubjects() {
  const { data } = await supabase
    .from('subject')
    .select('id, name, description')
    .order('name', { ascending: true })
  subjects.value = data || []
  loading.value = false
}

onMounted(fetchSubjects)
</script>

<style scoped>
.page {
  --background: #ffffff;
}

/* HEADER */
.toolbar {
  --background: #ffffff;
  --border-width: 0;
}

.toolbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px 6px;
}

.toolbar-title {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  color: #1A1A2E;
}

.toolbar-sub {
  margin: 2px 0 0;
  font-size: 13px;
  color: #9CA3AF;
}

.toolbar-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  background: #EEF2FF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-icon {
  font-size: 22px;
  color: #4F63D2;
}

/* CONTAINER */
.container {
  padding: 8px 16px 100px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* SEARCH */
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #F9FAFB;
  border: 1px solid #F1F3F6;
  border-radius: 14px;
  padding: 12px 14px;
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

/* SECTION */
.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1A1A2E;
}

.see-all {
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: #4F63D2;
  cursor: pointer;
  padding: 0;
}

/* MATERIAL TYPES */
.types-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.type-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 16px;
  padding: 14px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: transform 0.15s;
}

.type-card:active {
  transform: scale(0.94);
}

.type-card span {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
}

.type-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}

.type-icon.indigo { background: #EEF2FF; color: #4F63D2; }
.type-icon.green  { background: #ECFDF5; color: #10B981; }
.type-icon.purple { background: #F5F3FF; color: #7C3AED; }
.type-icon.orange { background: #FFF7ED; color: #F97316; }

/* SUBJECT LIST */
.subject-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subject-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 14px;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.15s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.subject-row:active {
  background: #F9FAFB;
}

.subject-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.subject-body {
  flex: 1;
  min-width: 0;
}

.subject-name {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subject-desc {
  margin: 0;
  font-size: 12px;
  color: #9CA3AF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subject-arrow {
  font-size: 15px;
  color: #D1D5DB;
  flex-shrink: 0;
}

/* CONTINUE LEARNING */
.continue-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.continue-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 16px;
  padding: 14px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.continue-card:active {
  background: #F9FAFB;
}

.continue-icon {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.continue-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.continue-subject {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.continue-topic {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.continue-track {
  height: 4px;
  background: #F3F4F6;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 2px;
}

.continue-fill {
  height: 100%;
  border-radius: 999px;
}

.continue-pct {
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

/* AI BANNER */
.ai-banner {
  background: linear-gradient(135deg, #1A1A2E, #2D3561);
  border-radius: 20px;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.ai-banner-deco {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(79, 99, 210, 0.25);
}

.ai-banner-left {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 1;
}

.ai-banner-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #c7d0ff;
  flex-shrink: 0;
}

.ai-banner-title {
  margin: 0 0 2px;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.ai-banner-sub {
  margin: 0;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
}

.ai-banner-arrow {
  font-size: 18px;
  color: rgba(255,255,255,0.5);
  position: relative;
  z-index: 1;
}

/* SKELETONS */
@keyframes shimmer {
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
}

.sk-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #F1F3F6;
  border-radius: 14px;
}

.sk-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sk-icon, .sk-title, .sk-text, .sk-badge {
  background: #F3F4F6;
  border-radius: 6px;
  animation: shimmer 1.4s ease-in-out infinite;
}

.sk-icon  { width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0; }
.sk-title { height: 13px; width: 50%; }
.sk-text  { height: 11px; width: 75%; }
.sk-badge { width: 20px; height: 20px; border-radius: 999px; flex-shrink: 0; }

/* EMPTY */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
  gap: 10px;
  color: #9CA3AF;
}

.empty-icon {
  font-size: 36px;
  color: #D1D5DB;
}

.empty p {
  margin: 0;
  font-size: 13px;
}

/* FAB */
.fab {
  position: fixed;
  bottom: 32px;
  right: 20px;
  z-index: 100;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: #4F63D2;
  color: #ffffff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(79, 99, 210, 0.4);
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}

.fab:active {
  transform: scale(0.92);
  opacity: 0.9;
}
</style>
