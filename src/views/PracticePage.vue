<template>
  <ion-page>

    <ion-header class="ion-no-border">
      <ion-toolbar class="toolbar">
        <div class="toolbar-inner">
          <div>
            <h1 class="toolbar-title">Practice</h1>
            <p class="toolbar-sub">Sharpen your skills daily</p>
          </div>
          <div class="toolbar-icon-wrap">
            <ion-icon :icon="barbellOutline" class="toolbar-icon" />
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">

      <div class="container">

        <!-- AI INSIGHT -->
        <div class="insight-card">
          <div class="insight-left">
            <div class="insight-icon-wrap">
              <ion-icon :icon="sparklesOutline" class="insight-icon" />
            </div>
            <div>
              <p class="insight-label">AI Insight</p>
              <p class="insight-text">Focus on <strong>Algebra</strong> and <strong>Physics</strong> to boost your score this week.</p>
            </div>
          </div>
        </div>

        <!-- PRACTICE MODES -->
        <section class="section">
          <p class="section-title">Practice Modes</p>
          <div class="modes-grid">

            <button class="mode-card" @click="startMode('quiz')">
              <div class="mode-icon yellow">
                <ion-icon :icon="flashOutline" />
              </div>
              <p class="mode-name">Quick Quiz</p>
              <p class="mode-desc">5–10 questions</p>
            </button>

            <button class="mode-card" @click="startMode('timed')">
              <div class="mode-icon blue">
                <ion-icon :icon="timerOutline" />
              </div>
              <p class="mode-name">Timed Test</p>
              <p class="mode-desc">Exam style</p>
            </button>

            <button class="mode-card" @click="startMode('topic')">
              <div class="mode-icon green">
                <ion-icon :icon="bookOutline" />
              </div>
              <p class="mode-name">By Topic</p>
              <p class="mode-desc">Weak areas</p>
            </button>

            <button class="mode-card" @click="startMode('challenge')">
              <div class="mode-icon purple">
                <ion-icon :icon="trophyOutline" />
              </div>
              <p class="mode-name">Challenge</p>
              <p class="mode-desc">Advanced</p>
            </button>

          </div>
        </section>

        <!-- RECOMMENDED -->
        <section class="section">
          <p class="section-title">Recommended for You</p>
          <div class="rec-list">
            <button
              v-for="item in recommendations"
              :key="item.title"
              class="rec-card"
            >
              <div class="rec-icon-wrap" :class="item.color">
                <ion-icon :icon="item.icon" />
              </div>
              <div class="rec-body">
                <p class="rec-title">{{ item.title }}</p>
                <p class="rec-desc">{{ item.description }}</p>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="rec-arrow" />
            </button>
          </div>
        </section>

        <!-- RECENT ACTIVITY -->
        <section class="section">
          <p class="section-title">Recent Activity</p>
          <div class="activity-list">
            <div
              v-for="item in history"
              :key="item.title"
              class="activity-card"
            >
              <div class="activity-top">
                <p class="activity-title">{{ item.title }}</p>
                <span class="activity-badge" :class="item.status === 'Completed' ? 'badge-done' : 'badge-review'">
                  {{ item.status }}
                </span>
              </div>
              <div class="score-row">
                <div class="score-bar">
                  <div class="score-fill" :style="{ width: item.score + '%' }" />
                </div>
                <span class="score-pct">{{ item.score }}%</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      <!-- FAB -->
      <button class="fab" @click="goToChat">
        <ion-icon :icon="sparklesOutline" />
      </button>

    </ion-content>

  </ion-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon
} from '@ionic/vue'

import {
  sparklesOutline,
  flashOutline,
  timerOutline,
  bookOutline,
  trophyOutline,
  chevronForwardOutline,
  barbellOutline,
  calculatorOutline,
  flaskOutline
} from 'ionicons/icons'

const router = useRouter()

const recommendations = [
  {
    title: 'Algebra Basics',
    description: 'Equations and expressions',
    icon: calculatorOutline,
    color: 'indigo'
  },
  {
    title: 'Physics — Motion',
    description: 'Velocity and acceleration',
    icon: flaskOutline,
    color: 'green'
  }
]

const history = [
  { title: 'Biology Quiz',  score: 78, status: 'Completed'   },
  { title: 'Math Test',     score: 65, status: 'Needs Review' }
]

function startMode(mode) {
  router.push(`/chat?mode=${mode}`)
}

function goToChat() {
  router.push('/chat')
}
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
  gap: 24px;
}

/* AI INSIGHT */
.insight-card {
  background: linear-gradient(135deg, #1A1A2E, #2D3561);
  border-radius: 20px;
  padding: 18px;
}

.insight-left {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.insight-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.insight-icon {
  font-size: 18px;
  color: #c7d0ff;
}

.insight-label {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  color: #8b9aff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.insight-text {
  margin: 0;
  font-size: 13px;
  color: rgba(255,255,255,0.75);
  line-height: 1.55;
}

.insight-text strong {
  color: #ffffff;
  font-weight: 700;
}

/* SECTION */
.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1A1A2E;
}

/* MODES GRID */
.modes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.mode-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: transform 0.15s;
  text-align: left;
}

.mode-card:active {
  transform: scale(0.96);
}

.mode-icon {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.mode-icon.yellow { background: #FFFBEB; color: #D97706; }
.mode-icon.blue   { background: #EEF2FF; color: #4F63D2; }
.mode-icon.green  { background: #ECFDF5; color: #10B981; }
.mode-icon.purple { background: #F5F3FF; color: #7C3AED; }

.mode-name {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
}

.mode-desc {
  margin: 0;
  font-size: 11px;
  color: #9CA3AF;
}

/* RECOMMENDED */
.rec-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rec-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 16px;
  padding: 14px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: transform 0.15s;
  text-align: left;
  width: 100%;
}

.rec-card:active {
  transform: scale(0.98);
}

.rec-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.rec-icon-wrap.indigo { background: #EEF2FF; color: #4F63D2; }
.rec-icon-wrap.green  { background: #ECFDF5; color: #10B981; }

.rec-body {
  flex: 1;
  min-width: 0;
}

.rec-title {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
}

.rec-desc {
  margin: 0;
  font-size: 12px;
  color: #9CA3AF;
}

.rec-arrow {
  font-size: 16px;
  color: #D1D5DB;
  flex-shrink: 0;
}

/* RECENT ACTIVITY */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.activity-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.activity-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
}

.activity-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
}

.badge-done   { background: #ECFDF5; color: #10B981; }
.badge-review { background: #FFF7ED; color: #F97316; }

.score-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-bar {
  flex: 1;
  height: 6px;
  background: #F3F4F6;
  border-radius: 999px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: #4F63D2;
  border-radius: 999px;
}

.score-pct {
  font-size: 12px;
  font-weight: 700;
  color: #4F63D2;
  flex-shrink: 0;
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
