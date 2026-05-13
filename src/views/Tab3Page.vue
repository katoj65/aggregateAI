<template>
  <ion-page>

    <ion-header class="ion-no-border">
      <ion-toolbar class="toolbar">
        <div class="toolbar-inner">
          <div>
            <h1 class="toolbar-title">Insights</h1>
            <p class="toolbar-sub">Your learning analytics</p>
          </div>
          <div class="period-pills">
            <button
              v-for="p in periods"
              :key="p"
              class="period-pill"
              :class="{ active: period === p }"
              @click="period = p"
            >{{ p }}</button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">
      <div class="container">

        <!-- PERFORMANCE HERO -->
        <div class="perf-card">
          <div class="perf-deco" />
          <div class="perf-deco-2" />
          <div class="perf-left">
            <p class="perf-label">Overall Performance</p>
            <p class="perf-value">78%</p>
            <div class="perf-trend">
              <ion-icon :icon="trendingUpOutline" class="trend-icon" />
              <span>+4% from last week</span>
            </div>
          </div>
          <div class="perf-ring">
            <svg viewBox="0 0 64 64" class="ring-svg">
              <circle cx="32" cy="32" r="26" class="ring-bg" />
              <circle cx="32" cy="32" r="26" class="ring-fill" :stroke-dasharray="`${78 * 1.634} 163.4`" />
            </svg>
            <span class="ring-label">78%</span>
          </div>
        </div>

        <!-- STATS ROW -->
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-icon-wrap flame">
              <ion-icon :icon="flameOutline" />
            </div>
            <p class="stat-val">7</p>
            <p class="stat-lbl">Streak</p>
          </div>
          <div class="stat-sep" />
          <div class="stat-item">
            <div class="stat-icon-wrap blue">
              <ion-icon :icon="timeOutline" />
            </div>
            <p class="stat-val">12h</p>
            <p class="stat-lbl">Study Time</p>
          </div>
          <div class="stat-sep" />
          <div class="stat-item">
            <div class="stat-icon-wrap green">
              <ion-icon :icon="checkmarkCircleOutline" />
            </div>
            <p class="stat-val">24</p>
            <p class="stat-lbl">Completed</p>
          </div>
          <div class="stat-sep" />
          <div class="stat-item">
            <div class="stat-icon-wrap purple">
              <ion-icon :icon="trophyOutline" />
            </div>
            <p class="stat-val">84%</p>
            <p class="stat-lbl">Accuracy</p>
          </div>
        </div>

        <!-- WEEKLY ACTIVITY -->
        <section class="section">
          <p class="section-title">Weekly Activity</p>
          <div class="activity-card">
            <div class="days-row">
              <div
                v-for="day in weekDays"
                :key="day.label"
                class="day-col"
              >
                <div
                  class="day-bar"
                  :style="{ height: day.pct + '%' }"
                  :class="day.isToday ? 'today' : ''"
                />
                <span class="day-label" :class="{ today: day.isToday }">{{ day.label }}</span>
              </div>
            </div>
            <div class="activity-legend">
              <span class="legend-dot indigo" />
              <span class="legend-text">Study sessions this week</span>
            </div>
          </div>
        </section>

        <!-- ACHIEVEMENTS -->
        <section class="section">
          <p class="section-title">Achievements</p>
          <div class="badges-row">
            <div
              v-for="badge in badges"
              :key="badge.label"
              class="badge-card"
              :class="{ locked: !badge.earned }"
            >
              <div class="badge-icon" :class="badge.color">
                <ion-icon :icon="badge.icon" />
              </div>
              <p class="badge-label">{{ badge.label }}</p>
            </div>
          </div>
        </section>

        <!-- SUBJECT BREAKDOWN -->
        <section class="section">
          <p class="section-title">Subject Breakdown</p>
          <div class="subject-list">
            <div
              v-for="subject in subjects"
              :key="subject.name"
              class="subject-card"
            >
              <div class="subject-icon-wrap" :class="subject.color">
                <ion-icon :icon="subject.icon" />
              </div>
              <div class="subject-body">
                <div class="subject-top">
                  <p class="subject-name">{{ subject.name }}</p>
                  <span class="subject-score" :class="subject.color">{{ subject.score }}%</span>
                </div>
                <div class="subject-track">
                  <div class="subject-fill" :class="subject.color" :style="{ width: subject.score + '%' }" />
                </div>
                <p class="subject-status">{{ subject.status }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- AI INSIGHT -->
        <div class="ai-card">
          <div class="ai-deco" />
          <div class="ai-top">
            <div class="ai-icon-wrap">
              <ion-icon :icon="sparklesOutline" class="ai-icon" />
            </div>
            <div>
              <p class="ai-label">AI Insight</p>
              <p class="ai-headline">On track for <strong>Grade B+</strong></p>
            </div>
          </div>
          <div class="ai-tips">
            <div v-for="(tip, i) in tips" :key="i" class="tip-row">
              <ion-icon :icon="tip.icon" class="tip-icon" :class="tip.color" />
              <p>{{ tip.text }}</p>
            </div>
          </div>
          <button class="ai-cta" @click="router.push('/chat')">
            <ion-icon :icon="sparklesOutline" />
            Get personalised advice
          </button>
        </div>

      </div>
    </ion-content>

  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon
} from '@ionic/vue'

import {
  trendingUpOutline,
  flameOutline,
  timeOutline,
  checkmarkCircleOutline,
  trophyOutline,
  sparklesOutline,
  starOutline,
  flashOutline,
  ribbonOutline,
  calculatorOutline,
  flaskOutline,
  languageOutline,
  bookOutline,
  trendingDownOutline,
  removeCircleOutline,
  alertCircleOutline
} from 'ionicons/icons'

const router = useRouter()
const period = ref('Week')
const periods = ['Week', 'Month']

const weekDays = [
  { label: 'M', pct: 60,  isToday: false },
  { label: 'T', pct: 80,  isToday: false },
  { label: 'W', pct: 40,  isToday: false },
  { label: 'T', pct: 90,  isToday: false },
  { label: 'F', pct: 70,  isToday: true  },
  { label: 'S', pct: 30,  isToday: false },
  { label: 'S', pct: 10,  isToday: false }
]

const badges = [
  { label: '7-Day Streak',   icon: flameOutline,   color: 'flame',  earned: true  },
  { label: 'Quiz Master',    icon: flashOutline,   color: 'indigo', earned: true  },
  { label: 'Top Student',    icon: ribbonOutline,  color: 'green',  earned: false },
  { label: 'Star Learner',   icon: starOutline,    color: 'yellow', earned: false }
]

const subjects = [
  { name: 'Mathematics', score: 72, status: 'Needs improvement',  icon: calculatorOutline, color: 'indigo' },
  { name: 'Biology',     score: 85, status: 'Strong progress',    icon: flaskOutline,      color: 'green'  },
  { name: 'Chemistry',   score: 65, status: 'Average',            icon: flaskOutline,      color: 'red'    },
  { name: 'English',     score: 78, status: 'Good progress',      icon: languageOutline,   color: 'orange' },
  { name: 'Literature',  score: 80, status: 'Good progress',      icon: bookOutline,       color: 'purple' }
]

const tips = [
  { text: 'Biology is up 12% — keep the momentum',   icon: trendingUpOutline,   color: 'green'  },
  { text: 'Mathematics needs daily practice',         icon: alertCircleOutline,  color: 'orange' },
  { text: 'Chemistry is stable — push for more',      icon: removeCircleOutline, color: 'blue'   }
]
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

.period-pills {
  display: flex;
  gap: 6px;
  background: #F3F4F6;
  border-radius: 999px;
  padding: 3px;
}

.period-pill {
  border: none;
  background: transparent;
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.period-pill.active {
  background: #ffffff;
  color: #1A1A2E;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

/* CONTAINER */
.container {
  padding: 8px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* PERFORMANCE HERO */
.perf-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.perf-deco,
.perf-deco-2 {
  display: none;
}

.perf-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.perf-label {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.perf-value {
  margin: 0;
  font-size: 44px;
  font-weight: 900;
  color: #1A1A2E;
  line-height: 1;
}

.perf-trend {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #10B981;
  font-weight: 600;
}

.trend-icon {
  font-size: 14px;
}

/* RING */
.perf-ring {
  position: relative;
  width: 80px;
  height: 80px;
}

.ring-svg {
  width: 80px;
  height: 80px;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: #F1F3F6;
  stroke-width: 6;
}

.ring-fill {
  fill: none;
  stroke: #4F63D2;
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dasharray 0.8s ease;
}

.ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  color: #4F63D2;
}

/* STATS ROW */
.stats-row {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 18px;
  padding: 16px 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-bottom: 2px;
}

.stat-icon-wrap.flame  { background: #FFF3E0; color: #F57C00; }
.stat-icon-wrap.blue   { background: #EEF2FF; color: #4F63D2; }
.stat-icon-wrap.green  { background: #ECFDF5; color: #10B981; }
.stat-icon-wrap.purple { background: #F5F3FF; color: #7C3AED; }

.stat-val {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: #1A1A2E;
}

.stat-lbl {
  margin: 0;
  font-size: 10px;
  color: #9CA3AF;
  font-weight: 500;
}

.stat-sep {
  width: 1px;
  height: 40px;
  background: #F1F3F6;
  flex-shrink: 0;
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

/* WEEKLY ACTIVITY */
.activity-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.days-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 80px;
  gap: 6px;
  margin-bottom: 10px;
}

.day-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  height: 100%;
  justify-content: flex-end;
}

.day-bar {
  width: 100%;
  border-radius: 6px 6px 0 0;
  background: #EEF2FF;
  min-height: 6px;
  transition: height 0.4s ease;
}

.day-bar.today {
  background: #4F63D2;
}

.day-label {
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
}

.day-label.today {
  color: #4F63D2;
}

.activity-legend {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.legend-dot.indigo { background: #4F63D2; }

.legend-text {
  font-size: 12px;
  color: #9CA3AF;
}

/* BADGES */
.badges-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.badge-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 16px;
  padding: 14px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.badge-card.locked {
  opacity: 0.45;
}

.badge-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.badge-icon.flame  { background: #FFF3E0; color: #F57C00; }
.badge-icon.indigo { background: #EEF2FF; color: #4F63D2; }
.badge-icon.green  { background: #ECFDF5; color: #10B981; }
.badge-icon.yellow { background: #FFFBEB; color: #D97706; }

.badge-label {
  margin: 0;
  font-size: 10px;
  font-weight: 600;
  color: #374151;
  text-align: center;
  line-height: 1.3;
}

/* SUBJECTS */
.subject-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.subject-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
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

.subject-icon-wrap.indigo { background: #EEF2FF; color: #4F63D2; }
.subject-icon-wrap.green  { background: #ECFDF5; color: #10B981; }
.subject-icon-wrap.red    { background: #FFF0F0; color: #EF4444; }
.subject-icon-wrap.orange { background: #FFF7ED; color: #F97316; }
.subject-icon-wrap.purple { background: #F5F3FF; color: #7C3AED; }

.subject-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.subject-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subject-name {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
}

.subject-score {
  font-size: 13px;
  font-weight: 800;
}

.subject-score.indigo { color: #4F63D2; }
.subject-score.green  { color: #10B981; }
.subject-score.red    { color: #EF4444; }
.subject-score.orange { color: #F97316; }
.subject-score.purple { color: #7C3AED; }

.subject-track {
  height: 5px;
  background: #F3F4F6;
  border-radius: 999px;
  overflow: hidden;
}

.subject-fill {
  height: 100%;
  border-radius: 999px;
}

.subject-fill.indigo { background: #4F63D2; }
.subject-fill.green  { background: #10B981; }
.subject-fill.red    { background: #EF4444; }
.subject-fill.orange { background: #F97316; }
.subject-fill.purple { background: #7C3AED; }

.subject-status {
  margin: 0;
  font-size: 11px;
  color: #9CA3AF;
}

/* AI CARD */
.ai-card {
  background: linear-gradient(135deg, #1A1A2E, #2D3561);
  border-radius: 22px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  overflow: hidden;
}

.ai-deco {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: rgba(79, 99, 210, 0.2);
}

.ai-top {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.ai-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-icon {
  font-size: 18px;
  color: #c7d0ff;
}

.ai-label {
  margin: 0 0 2px;
  font-size: 10px;
  font-weight: 700;
  color: #8b9aff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ai-headline {
  margin: 0;
  font-size: 14px;
  color: rgba(255,255,255,0.8);
}

.ai-headline strong {
  color: #ffffff;
  font-weight: 800;
}

.ai-tips {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.tip-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tip-row p {
  margin: 0;
  font-size: 13px;
  color: rgba(255,255,255,0.65);
}

.tip-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.tip-icon.green  { color: #34D399; }
.tip-icon.orange { color: #FBB740; }
.tip-icon.blue   { color: #93C5FD; }

.ai-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 12px;
  padding: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: background 0.15s;
}

.ai-cta:active {
  background: rgba(255,255,255,0.2);
}

.ai-cta ion-icon {
  font-size: 16px;
  color: #c7d0ff;
}
</style>
