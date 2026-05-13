<template>
  <ion-page>

    <ion-header class="ion-no-border">
      <ion-toolbar class="toolbar">
        <div class="toolbar-inner">
          <div>
            <h1 class="toolbar-title">My Progress</h1>
            <p class="toolbar-sub">Track your learning journey</p>
          </div>
          <div class="toolbar-icon-wrap">
            <ion-icon :icon="statsChartOutline" class="toolbar-icon" />
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">
      <div class="container">

        <!-- STATS GRID -->
        <div class="stats-grid">

          <div class="stat-card accent">
            <p class="stat-value">78%</p>
            <p class="stat-label">Overall</p>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrap flame">
              <ion-icon :icon="flameOutline" />
            </div>
            <p class="stat-value">7</p>
            <p class="stat-label">Day Streak</p>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrap green">
              <ion-icon :icon="checkmarkCircleOutline" />
            </div>
            <p class="stat-value">24</p>
            <p class="stat-label">Completed</p>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrap blue">
              <ion-icon :icon="trophyOutline" />
            </div>
            <p class="stat-value">84%</p>
            <p class="stat-label">Avg Score</p>
          </div>

        </div>

        <!-- AI PREDICTION -->
        <div class="ai-card">
          <div class="ai-deco" />
          <div class="ai-deco-2" />
          <div class="ai-top">
            <div class="ai-icon-wrap">
              <ion-icon :icon="bulbOutline" class="ai-icon" />
            </div>
            <div>
              <p class="ai-label">AI Prediction</p>
              <p class="ai-grade">On track for <strong>Grade B+</strong></p>
            </div>
          </div>
          <div class="ai-insights">
            <div v-for="(insight, i) in insights" :key="i" class="insight-row">
              <ion-icon :icon="insight.icon" class="insight-icon" :class="insight.color" />
              <p>{{ insight.text }}</p>
            </div>
          </div>
        </div>

        <!-- SUBJECT PROGRESS -->
        <section class="section">
          <p class="section-title">Subject Progress</p>
          <div class="subject-list">
            <div
              v-for="subject in subjects"
              :key="subject.name"
              class="subject-card"
            >
              <div class="subject-top">
                <div class="subject-icon-wrap" :class="subject.color">
                  <ion-icon :icon="subject.icon" />
                </div>
                <div class="subject-info">
                  <p class="subject-name">{{ subject.name }}</p>
                  <p class="subject-status">{{ subject.status }}</p>
                </div>
                <span class="subject-score" :class="subject.color">{{ subject.score }}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" :class="subject.color" :style="{ width: subject.score + '%' }" />
              </div>
            </div>
          </div>
        </section>

        <!-- IMPROVEMENT PLAN -->
        <section class="section">
          <p class="section-title">Improvement Plan</p>
          <div class="plan-list">
            <div
              v-for="(item, i) in improvements"
              :key="i"
              class="plan-card"
            >
              <div class="plan-num">{{ i + 1 }}</div>
              <div class="plan-body">
                <p class="plan-title">{{ item.title }}</p>
                <p class="plan-desc">{{ item.description }}</p>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="plan-arrow" />
            </div>
          </div>
        </section>

      </div>
    </ion-content>

  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon
} from '@ionic/vue'

import {
  statsChartOutline,
  flameOutline,
  checkmarkCircleOutline,
  trophyOutline,
  bulbOutline,
  calculatorOutline,
  flaskOutline,
  bookOutline,
  languageOutline,
  chevronForwardOutline,
  trendingUpOutline,
  alertCircleOutline,
  removeCircleOutline
} from 'ionicons/icons'

const insights = [
  { text: 'Strong improvement in Biology (+12%)', icon: trendingUpOutline,   color: 'green'  },
  { text: 'Mathematics needs daily practice',     icon: alertCircleOutline,  color: 'orange' },
  { text: 'Chemistry performance is stable',      icon: removeCircleOutline, color: 'blue'   }
]

const subjects = [
  { name: 'Mathematics', score: 72, status: 'Needs improvement', icon: calculatorOutline, color: 'indigo' },
  { name: 'Biology',     score: 85, status: 'Strong progress',   icon: flaskOutline,      color: 'green'  },
  { name: 'Chemistry',   score: 65, status: 'Average',           icon: flaskOutline,      color: 'red'    },
  { name: 'English',     score: 78, status: 'Good progress',     icon: languageOutline,   color: 'orange' },
  { name: 'Literature',  score: 80, status: 'Good progress',     icon: bookOutline,       color: 'purple' }
]

const improvements = [
  { title: 'Daily Algebra Practice',  description: 'Solve at least 5 equations daily'     },
  { title: 'Physics Revision',        description: 'Focus on motion and energy concepts'   },
  { title: 'Quiz Consistency',        description: 'Attempt one quiz every day'            }
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
  padding: 8px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* STATS GRID */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.stat-card.accent {
  background: linear-gradient(135deg, #1A1A2E, #2D3561);
  border-color: transparent;
}

.stat-card.accent .stat-value {
  color: #ffffff;
  font-size: 28px;
}

.stat-card.accent .stat-label {
  color: rgba(255,255,255,0.6);
}

.stat-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
}

.stat-icon-wrap.flame { background: #FFF3E0; color: #F57C00; }
.stat-icon-wrap.green { background: #ECFDF5; color: #10B981; }
.stat-icon-wrap.blue  { background: #EEF2FF; color: #4F63D2; }

.stat-value {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #1A1A2E;
}

.stat-label {
  margin: 0;
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 500;
}

/* AI CARD */
.ai-card {
  background: linear-gradient(135deg, #1A1A2E, #2D3561);
  border-radius: 22px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  background: rgba(79, 99, 210, 0.25);
}

.ai-deco-2 {
  position: absolute;
  bottom: -20px;
  right: 50px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(79, 99, 210, 0.12);
}

.ai-top {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 1;
}

.ai-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  background: rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-icon {
  font-size: 20px;
  color: #c7d0ff;
}

.ai-label {
  margin: 0 0 3px;
  font-size: 11px;
  font-weight: 700;
  color: #8b9aff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ai-grade {
  margin: 0;
  font-size: 14px;
  color: rgba(255,255,255,0.8);
}

.ai-grade strong {
  color: #ffffff;
  font-weight: 800;
}

.ai-insights {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.insight-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.insight-row p {
  margin: 0;
  font-size: 13px;
  color: rgba(255,255,255,0.65);
}

.insight-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.insight-icon.green  { color: #34D399; }
.insight-icon.orange { color: #FBB740; }
.insight-icon.blue   { color: #93C5FD; }

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

/* SUBJECTS */
.subject-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.subject-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.subject-top {
  display: flex;
  align-items: center;
  gap: 12px;
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

.subject-info {
  flex: 1;
  min-width: 0;
}

.subject-name {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
}

.subject-status {
  margin: 0;
  font-size: 12px;
  color: #9CA3AF;
}

.subject-score {
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
}

.subject-score.indigo { color: #4F63D2; }
.subject-score.green  { color: #10B981; }
.subject-score.red    { color: #EF4444; }
.subject-score.orange { color: #F97316; }
.subject-score.purple { color: #7C3AED; }

.progress-track {
  height: 6px;
  background: #F3F4F6;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s ease;
}

.progress-fill.indigo { background: #4F63D2; }
.progress-fill.green  { background: #10B981; }
.progress-fill.red    { background: #EF4444; }
.progress-fill.orange { background: #F97316; }
.progress-fill.purple { background: #7C3AED; }

/* PLAN */
.plan-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.plan-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 16px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.plan-num {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: #EEF2FF;
  color: #4F63D2;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.plan-body {
  flex: 1;
  min-width: 0;
}

.plan-title {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
}

.plan-desc {
  margin: 0;
  font-size: 12px;
  color: #9CA3AF;
}

.plan-arrow {
  font-size: 16px;
  color: #D1D5DB;
  flex-shrink: 0;
}
</style>
