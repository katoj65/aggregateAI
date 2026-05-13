<template>
  <ion-page>

    <ion-header class="ion-no-border">
      <ion-toolbar class="toolbar">
        <ion-buttons slot="start">
          <ion-button fill="clear" class="back-btn" @click="router.back()">
            <ion-icon slot="icon-only" :icon="chevronBackOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title class="toolbar-title">Subject</ion-title>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <ion-buttons slot="end">
          <ion-button fill="clear" class="header-action-btn" @click="router.push(`/chat?subject=${subject?.id}`)">
            <ion-icon slot="icon-only" :icon="sparklesOutline" />
          </ion-button>
          <ion-button fill="clear" class="header-action-btn" @click="router.push(`/practice?subject=${subject?.id}`)">
            <ion-icon slot="icon-only" :icon="createOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">

      <!-- LOADING -->
      <div v-if="loading" class="container">
        <div class="sk-cover" />
        <div class="sk-row">
          <div class="sk-btn" />
          <div class="sk-btn" />
        </div>
        <div class="sk-block" />
        <div class="sk-block tall" />
      </div>

      <!-- ERROR -->
      <div v-else-if="error" class="empty">
        <ion-icon :icon="alertCircleOutline" class="empty-icon" />
        <p>{{ error }}</p>
        <ion-button class="retry-btn" @click="fetchSubject">Retry</ion-button>
      </div>

      <!-- CONTENT -->
      <div v-else-if="subject" class="container">

        <!-- HERO -->
        <div class="hero">
          <div class="hero-glow" />
          <div class="hero-top">
            <h1 class="hero-name">{{ subject.name }}</h1>
            <div class="hero-icon-wrap">
              <ion-icon :icon="bookOutline" class="hero-icon" />
            </div>
          </div>
          <p v-if="subject.description" class="hero-desc" style="padding-right:10px;">{{ subject.description }}</p>
          <div class="hero-footer">
            <div class="hero-pills">
              <div v-if="subject.class_id" class="hero-pill">
                <ion-icon :icon="schoolOutline" class="pill-icon" />
                <span>Class {{ subject.class_id }}</span>
              </div>
              <div class="hero-pill">
                <ion-icon :icon="layersOutline" class="pill-icon" />
                <span>{{ topics.length }} topics</span>
              </div>
            </div>
            <span v-if="subject.tag" class="hero-tag">{{ subject.tag }}</span>
          </div>
        </div>

        <!-- TOPICS -->
        <div class="topics-card">
          <div class="card-header">
            <p class="card-label">Topics</p>
            <span v-if="topics.length" class="count-badge">{{ topics.length }}</span>
          </div>

          <div v-if="topics.length" class="topic-list">
            <div
              v-for="(topic, i) in topics"
              :key="topic.id"
              class="topic-row"
            >
              <div class="topic-index">{{ i + 1 }}</div>
              <p class="topic-title">{{ topic.title }}</p>
              <ion-icon :icon="chevronForwardOutline" class="topic-arrow" />
            </div>
          </div>

          <p v-else class="no-topics">No topics available yet.</p>
        </div>

        <!-- CTA -->
        <ion-button class="start-btn" expand="block" @click="router.push(`/subjects/${subject.id}/learn`)">
          Start Learning
        </ion-button>

        <!-- STATS -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon-wrap blue">
              <ion-icon :icon="layersOutline" class="stat-icon" />
            </div>
            <span class="stat-value">{{ topics.length }}</span>
            <span class="stat-label">Topics</span>
          </div>
          <div class="stat-card">
            <div class="stat-icon-wrap green">
              <ion-icon :icon="timeOutline" class="stat-icon" />
            </div>
            <span class="stat-value">{{ estTime }}</span>
            <span class="stat-label">Est. Time</span>
          </div>
          <div class="stat-card clickable" @click="router.push(`/practice?subject=${subject.id}`)">
            <div class="stat-icon-wrap orange">
              <ion-icon :icon="barbellOutline" class="stat-icon" />
            </div>
            <span class="stat-value">Practice</span>
            <span class="stat-label">Test Yourself</span>
          </div>
        </div>

        <!-- STUDY TIPS -->
        <div class="tips-card">
          <div class="tips-header">
            <div class="tips-icon-wrap">
              <ion-icon :icon="bulbOutline" class="tips-bulb" />
            </div>
            <p class="tips-title">Study Tips</p>
          </div>
          <div class="tip-list">
            <div class="tip-item">
              <ion-icon :icon="checkmarkCircleOutline" class="tip-check blue" />
              <p class="tip-text">Break topics into small daily sessions — 15 minutes per topic is a great target.</p>
            </div>
            <div class="tip-item">
              <ion-icon :icon="checkmarkCircleOutline" class="tip-check green" />
              <p class="tip-text">Use the AI chat to get instant, personalized explanations on anything unclear.</p>
            </div>
            <div class="tip-item">
              <ion-icon :icon="checkmarkCircleOutline" class="tip-check orange" />
              <p class="tip-text">Reinforce what you learn with practice exercises after finishing each topic.</p>
            </div>
          </div>
        </div>

      </div>

    </ion-content>

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
  createOutline,
  alertCircleOutline,
  bookOutline,
  schoolOutline,
  layersOutline,
  timeOutline,
  bulbOutline,
  barbellOutline,
  checkmarkCircleOutline
} from 'ionicons/icons'

import { supabase } from '@/database/database'

const router = useRouter()
const route = useRoute()

const subject = ref(null)
const topics = ref([])
const loading = ref(true)
const error = ref('')

const estTime = computed(() => {
  const mins = topics.value.length * 15
  if (mins === 0) return '—'
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}m` : `${h}h`
})

async function fetchSubject() {
  loading.value = true
  error.value = ''

  const { data, error: err } = await supabase
    .from('subject')
    .select('id, name, description, context, class_id, tag, topic(*)')
    .eq('id', route.params.id)

  if (err) {
    error.value = 'Failed to load subject. Please try again.'
  } else if (!data || data.length === 0) {
    error.value = 'Subject not found.'
  } else {
    subject.value = data[0]
    topics.value = data[0].topic || []
  }

  loading.value = false
}

onMounted(fetchSubject)
</script>

<style scoped>
.page {
  --background: #ffffff;
}

.toolbar {
  --background: #ffffff;
  --border-width: 0;
}

.toolbar-title {
  font-size: 16px;
  font-weight: 700;
  color: #1A1A2E;
}

.back-btn {
  --color: #1A1A2E;
}

.header-action-btn {
  --color: #4F63D2;
  --padding-start: 6px;
  --padding-end: 6px;
}

/* CONTAINER */
.container {
  padding: 8px 16px 52px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* HERO */
.hero {
  background: linear-gradient(135deg, #1A1A2E 0%, #2D3561 100%);
  border-radius: 24px;
  padding: 18px 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  top: -36px;
  right: -36px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(79, 99, 210, 0.25);
  pointer-events: none;
}

.hero-glow::after {
  content: '';
  position: absolute;
  bottom: -20px;
  right: 30px;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgba(79, 99, 210, 0.15);
}

.hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.hero-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hero-icon {
  font-size: 18px;
  color: #c7d0ff;
}

.hero-name {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.25;
  flex: 1;
  position: relative;
  z-index: 1;
}

.hero-desc {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.55;
  position: relative;
  z-index: 1;
}

.hero-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.hero-pills {
  display: flex;
  gap: 6px;
}

.hero-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #c7d0ff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  padding: 3px 10px;
}

.pill-icon {
  font-size: 12px;
}

.hero-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(79, 99, 210, 0.45);
  border: 1px solid rgba(99, 118, 220, 0.5);
  color: #c7d0ff;
  white-space: nowrap;
}

/* TOPICS CARD */
.topics-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 20px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-label {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
}

.count-badge {
  font-size: 11px;
  font-weight: 700;
  background: #EEF2FF;
  color: #4F63D2;
  padding: 3px 10px;
  border-radius: 999px;
}

.topic-list {
  display: flex;
  flex-direction: column;
}

.topic-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #F3F4F6;
  cursor: pointer;
}

.topic-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.topic-row:first-child {
  padding-top: 0;
}

.topic-index {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #EEF2FF;
  color: #4F63D2;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.topic-title {
  flex: 1;
  margin: 0;
  font-size: 14px;
  color: #1A1A2E;
  font-weight: 500;
}

.topic-arrow {
  font-size: 15px;
  color: #D1D5DB;
  flex-shrink: 0;
}

.no-topics {
  margin: 0;
  font-size: 14px;
  color: #9CA3AF;
  text-align: center;
  padding: 8px 0;
}

/* START CTA */
.start-btn {
  --background: #1A1A2E;
  --background-activated: #0f0f1a;
  --border-radius: 16px;
  --color: #ffffff;
  font-weight: 700;
  font-size: 15px;
  height: 54px;
}

/* STATS ROW */
.stats-row {
  display: flex;
  gap: 10px;
}

.stat-card {
  flex: 1;
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 18px;
  padding: 14px 10px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-card.clickable {
  cursor: pointer;
  transition: background 0.15s;
}

.stat-card.clickable:active {
  background: #F9FAFB;
}

.stat-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-wrap.blue   { background: #EEF2FF; }
.stat-icon-wrap.green  { background: #ECFDF5; }
.stat-icon-wrap.orange { background: #FFF7ED; }

.stat-icon {
  font-size: 17px;
}

.stat-icon-wrap.blue   .stat-icon { color: #4F63D2; }
.stat-icon-wrap.green  .stat-icon { color: #10B981; }
.stat-icon-wrap.orange .stat-icon { color: #F97316; }

.stat-value {
  font-size: 13px;
  font-weight: 800;
  color: #1A1A2E;
  line-height: 1;
}

.stat-label {
  font-size: 10px;
  font-weight: 500;
  color: #9CA3AF;
  text-align: center;
}

/* STUDY TIPS */
.tips-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 20px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tips-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: #FEFCE8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tips-bulb {
  font-size: 16px;
  color: #EAB308;
}

.tips-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
}

.tip-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.tip-check {
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 1px;
}

.tip-check.blue   { color: #4F63D2; }
.tip-check.green  { color: #10B981; }
.tip-check.orange { color: #F97316; }

.tip-text {
  margin: 0;
  font-size: 13px;
  color: #6B7280;
  line-height: 1.55;
}

/* SKELETONS */
@keyframes shimmer {
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
}

.sk-cover, .sk-btn, .sk-block {
  background: #F3F4F6;
  border-radius: 16px;
  animation: shimmer 1.4s ease-in-out infinite;
}

.sk-cover { height: 170px; border-radius: 24px; }
.sk-block  { height: 100px; }
.sk-block.tall { height: 220px; }

.sk-row {
  display: flex;
  gap: 10px;
}

.sk-btn { flex: 1; height: 50px; }

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
