<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header class="ion-no-border">
      <ion-toolbar class="toolbar">
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <ion-buttons slot="start">
          <ion-button fill="clear" class="back-btn" @click="router.back()">
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
            <ion-icon slot="icon-only" :icon="chevronBackOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title class="toolbar-title">{{ subject?.name || 'Loading…' }}</ion-title>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <ion-buttons slot="end">
          <ion-button fill="clear" class="ai-btn" @click="openChat">
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
            <ion-icon slot="icon-only" :icon="sparklesOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">

      <!-- LOADING -->
      <div v-if="loading" class="container">
        <div class="sk-progress" />
        <div class="sk-card" />
        <div class="sk-card tall" />
      </div>

      <!-- ERROR -->
      <div v-else-if="error" class="empty">
        <ion-icon :icon="alertCircleOutline" class="empty-icon" />
        <p>{{ error }}</p>
        <ion-button class="retry-btn" @click="fetchData">Retry</ion-button>
      </div>

      <!-- NO TOPICS -->
      <div v-else-if="topics.length === 0" class="empty">
        <ion-icon :icon="layersOutline" class="empty-icon" />
        <p>No topics available for this subject yet.</p>
        <ion-button class="retry-btn" @click="router.back()">Go Back</ion-button>
      </div>

      <!-- COMPLETED -->
      <div v-else-if="completed" class="done-wrap">
        <div class="done-icon-wrap">
          <ion-icon :icon="trophyOutline" class="done-icon" />
        </div>
        <h2 class="done-title">All Done!</h2>
        <p class="done-sub">You've reviewed all {{ topics.length }} topics in <strong>{{ subject?.name }}</strong>. Keep it up!</p>
        <div class="done-actions">
          <ion-button class="done-btn primary" expand="block" @click="restart">
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
            <ion-icon slot="start" :icon="refreshOutline" />
            Review Again
          </ion-button>
          <ion-button class="done-btn secondary" expand="block" fill="outline" @click="openChat">
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
            <ion-icon slot="start" :icon="sparklesOutline" />
            Ask AI Tutor
          </ion-button>
          <ion-button class="done-btn secondary" expand="block" fill="outline" @click="openPractice">
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
            <ion-icon slot="start" :icon="barbellOutline" />
            Practice Now
          </ion-button>
        </div>
      </div>

      <!-- LEARNING FLOW -->
      <div v-else class="container">

        <!-- TOPIC CARD -->
        <div class="topic-card">
          <div class="topic-title-row">
            <div class="topic-number-badge">
              <ion-icon :icon="bookOutline" class="badge-icon" />
            </div>
            <h2 class="topic-title">{{ currentTopic.title }}</h2>
          </div>
          <div class="topic-desc-row">
            <p class="topic-desc" :class="{ placeholder: !currentTopic.description }">
              {{ currentTopic.description || 'Study this topic carefully. Use the AI Tutor below if you need a deeper explanation.' }}
            </p>
            <span class="topic-count-label">{{ currentIndex + 1 }}/{{ topics.length }}</span>
          </div>
        </div>

        <!-- STUDY ACTIONS -->
        <div class="action-row">
          <button class="action-chip" @click="openChat">
            <ion-icon :icon="sparklesOutline" class="chip-icon purple" />
            <span>Explain with AI</span>
          </button>
          <button class="action-chip" @click="openPractice">
            <ion-icon :icon="barbellOutline" class="chip-icon orange" />
            <span>Practice</span>
          </button>
          <button class="action-chip" @click="toggleNote">
            <ion-icon :icon="noteCompleted ? checkmarkCircleOutline : pencilOutline" class="chip-icon" :class="noteCompleted ? 'green' : 'blue'" />
            <span>{{ noteCompleted ? 'Noted' : 'Take Note' }}</span>
          </button>
        </div>

        <!-- STUDY NOTE -->
        <div v-if="showNote" class="note-card">
          <div class="note-header">
            <ion-icon :icon="pencilOutline" class="note-icon" />
            <p class="note-label">Your Notes</p>
          </div>
          <textarea
            v-model="noteText"
            class="note-input"
            placeholder="Jot down key points, formulas, or questions…"
            rows="4"
          />
        </div>

        <!-- KEY POINTS -->
        <div class="key-points-card">
          <div class="kp-header">
            <ion-icon :icon="bulbOutline" class="kp-icon" />
            <p class="kp-title">How to approach this topic</p>
          </div>
          <div class="kp-list">
            <div class="kp-item">
              <span class="kp-dot" style="background:#EEF2FF;color:#4F63D2">1</span>
              <p class="kp-text">Read the topic title and recall any prior knowledge you have.</p>
            </div>
            <div class="kp-item">
              <span class="kp-dot" style="background:#ECFDF5;color:#10B981">2</span>
              <p class="kp-text">Ask the AI Tutor to explain it in simple terms or give an example.</p>
            </div>
            <div class="kp-item">
              <span class="kp-dot" style="background:#FFF7ED;color:#F97316">3</span>
              <p class="kp-text">Test your understanding with a quick practice question before moving on.</p>
            </div>
          </div>
        </div>

      </div>
    </ion-content>

    <!-- BOTTOM NAV -->
    <div v-if="!loading && !error && topics.length > 0 && !completed" class="bottom-nav">
      <div class="progress-wrap">
        <div class="progress-meta">
          <span class="progress-label">Topic {{ currentIndex + 1 }} of {{ topics.length }}</span>
          <span class="progress-pct">{{ progressPct }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPct + '%' }" />
        </div>
      </div>
      <div class="nav-row">
        <button class="nav-btn prev" :disabled="currentIndex === 0" @click="prev">
          <ion-icon :icon="chevronBackOutline" />
          Previous
        </button>
        <div class="topic-dots">
          <span
            v-for="(_, i) in topics"
            :key="i"
            class="dot"
            :class="{ active: i === currentIndex, done: i < currentIndex }"
          />
        </div>
        <button class="nav-btn next" @click="next">
          {{ currentIndex === topics.length - 1 ? 'Finish' : 'Next' }}
          <ion-icon :icon="currentIndex === topics.length - 1 ? checkmarkOutline : chevronForwardOutline" />
        </button>
      </div>
    </div>

  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/vue'

import {
  chevronBackOutline,
  chevronForwardOutline,
  sparklesOutline,
  alertCircleOutline,
  layersOutline,
  bookOutline,
  bulbOutline,
  barbellOutline,
  pencilOutline,
  checkmarkCircleOutline,
  checkmarkOutline,
  trophyOutline,
  refreshOutline
} from 'ionicons/icons'

import { supabase } from '@/database/database'

const router = useRouter()
const route = useRoute()

const subject = ref(null)
const topics = ref([])
const loading = ref(true)
const error = ref('')
const currentIndex = ref(0)
const completed = ref(false)

const showNote = ref(false)
const noteText = ref('')
const noteCompleted = ref(false)

const currentTopic = computed(() => topics.value[currentIndex.value] || {})
const progressPct = computed(() =>
  topics.value.length ? Math.round((currentIndex.value / topics.value.length) * 100) : 0
)

async function fetchData() {
  loading.value = true
  error.value = ''

  const { data, error: err } = await supabase
    .from('subject')
    .select('id, name, topic(*)')
    .eq('id', route.params.id)

  if (err) {
    error.value = 'Failed to load. Please try again.'
  } else if (!data || data.length === 0) {
    error.value = 'Subject not found.'
  } else {
    subject.value = data[0]
    topics.value = data[0].topic || []
  }

  loading.value = false
}

function next() {
  if (currentIndex.value < topics.value.length - 1) {
    currentIndex.value++
    resetNote()
  } else {
    completed.value = true
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    resetNote()
  }
}

function restart() {
  currentIndex.value = 0
  completed.value = false
  resetNote()
}

function resetNote() {
  showNote.value = false
  noteText.value = ''
  noteCompleted.value = false
}

function toggleNote() {
  if (noteCompleted.value) return
  showNote.value = !showNote.value
  if (!showNote.value && noteText.value.trim()) {
    noteCompleted.value = true
  }
}

function openChat() {
  router.push(`/chat?subject=${subject.value?.id}&topic=${encodeURIComponent(currentTopic.value?.title || '')}`)
}

function openPractice() {
  router.push(`/practice?subject=${subject.value?.id}`)
}

onMounted(fetchData)
</script>

<style scoped>
.page {
  --background: #ffffff;
}

.toolbar {
  --background: #ffffff;
  --border-width: 0;
  border-bottom: 1px solid #F1F3F6;
}

.toolbar-title {
  font-size: 16px;
  font-weight: 700;
  color: #1A1A2E;
}

.back-btn { --color: #1A1A2E; }
.ai-btn   { --color: #4F63D2; }

/* CONTAINER */
.container {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* PROGRESS */
.progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
}

.progress-pct {
  font-size: 12px;
  font-weight: 700;
  color: #4F63D2;
}

.progress-bar {
  height: 6px;
  background: #E5E7EB;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4F63D2, #7C8FE8);
  border-radius: 999px;
  transition: width 0.4s ease;
}

/* TOPIC CARD */
.topic-card {
  background: linear-gradient(135deg, #1A1A2E 0%, #2D3561 100%);
  border-radius: 22px;
  padding: 16px 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.topic-card::before {
  content: '';
  position: absolute;
  top: -28px;
  right: -28px;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: rgba(79, 99, 210, 0.25);
  pointer-events: none;
}

.topic-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.topic-number-badge {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge-icon {
  font-size: 16px;
  color: #c7d0ff;
}

.topic-title {
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.25;
  flex: 1;
}

.topic-desc-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.topic-desc {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.55;
  flex: 1;
}

.topic-desc.placeholder {
  font-style: italic;
}

.topic-count-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ACTION CHIPS */
.action-row {
  display: flex;
  gap: 8px;
}

.action-chip {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 16px;
  padding: 12px 8px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  transition: background 0.15s;
}

.action-chip:active {
  background: #F9FAFB;
}

.chip-icon {
  font-size: 20px;
}

.chip-icon.purple { color: #7C3AED; }
.chip-icon.orange { color: #F97316; }
.chip-icon.blue   { color: #4F63D2; }
.chip-icon.green  { color: #10B981; }

/* NOTE CARD */
.note-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.note-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.note-icon {
  font-size: 16px;
  color: #4F63D2;
}

.note-label {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #1A1A2E;
}

.note-input {
  width: 100%;
  border: 1.5px solid #E5E7EB;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
  color: #1A1A2E;
  background: #F9FAFB;
  outline: none;
  resize: none;
  font-family: inherit;
  line-height: 1.55;
  box-sizing: border-box;
}

.note-input:focus {
  border-color: #4F63D2;
  background: #ffffff;
}

.note-input::placeholder {
  color: #9CA3AF;
}

/* KEY POINTS */
.key-points-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 20px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.kp-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.kp-icon {
  font-size: 18px;
  color: #EAB308;
}

.kp-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #1A1A2E;
}

.kp-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kp-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.kp-dot {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kp-text {
  margin: 0;
  font-size: 13px;
  color: #6B7280;
  line-height: 1.55;
}

/* BOTTOM NAV */
.bottom-nav {
  background: #ffffff;
  border-top: 1px solid #F1F3F6;
  padding: 10px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bottom-nav .progress-wrap {
  gap: 6px;
}

.bottom-nav .nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  padding: 11px 18px;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}

.nav-btn.prev {
  background: #F3F4F6;
  color: #6B7280;
}

.nav-btn.prev:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.nav-btn.next {
  background: #1A1A2E;
  color: #ffffff;
}

.nav-btn.next:active {
  background: #0f0f1a;
}

.topic-dots {
  display: flex;
  gap: 5px;
  align-items: center;
  flex: 1;
  justify-content: center;
  overflow: hidden;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #E5E7EB;
  flex-shrink: 0;
  transition: background 0.2s, transform 0.2s;
}

.dot.active {
  background: #4F63D2;
  transform: scale(1.4);
}

.dot.done {
  background: #10B981;
}

/* COMPLETED */
.done-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px 40px;
  gap: 14px;
  text-align: center;
}

.done-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: linear-gradient(135deg, #1A1A2E, #2D3561);
  display: flex;
  align-items: center;
  justify-content: center;
}

.done-icon {
  font-size: 36px;
  color: #EAB308;
}

.done-title {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  color: #1A1A2E;
}

.done-sub {
  margin: 0;
  font-size: 14px;
  color: #6B7280;
  line-height: 1.6;
  max-width: 280px;
}

.done-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.done-btn.primary {
  --background: #1A1A2E;
  --background-activated: #0f0f1a;
  --border-radius: 16px;
  --color: #ffffff;
  font-weight: 700;
  height: 52px;
}

.done-btn.secondary {
  --border-radius: 16px;
  --color: #4F63D2;
  --border-color: #DDE3FA;
  font-weight: 600;
  height: 48px;
}

/* SKELETONS */
@keyframes shimmer {
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
}

.sk-progress, .sk-card {
  background: #E5E7EB;
  border-radius: 16px;
  animation: shimmer 1.4s ease-in-out infinite;
}

.sk-progress { height: 36px; border-radius: 10px; }
.sk-card     { height: 160px; border-radius: 24px; }
.sk-card.tall { height: 200px; }

/* EMPTY / ERROR */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 14px;
  text-align: center;
}

.empty-icon {
  font-size: 52px;
  color: #D1D5DB;
}

.empty p {
  margin: 0;
  font-size: 14px;
  color: #9CA3AF;
}

.retry-btn {
  --background: #4F63D2;
  --border-radius: 12px;
  --color: #ffffff;
  font-weight: 600;
}
</style>
