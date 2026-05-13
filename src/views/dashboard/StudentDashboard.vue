<template>
  <ion-content :fullscreen="true" class="dashboard">
    <div class="container">


      <!-- QUICK ACTIONS -->
      <section class="section">

        <div class="actions-grid">

          <button class="action-card" @click="router.push('/subjects')">
            <div class="action-icon blue">
              <ion-icon :icon="bookOutline" />
            </div>
            <span>Subjects</span>
          </button>

          <button class="action-card" @click="router.push('/practice')">
            <div class="action-icon green">
              <ion-icon :icon="createOutline" />
            </div>
            <span>Practice</span>
          </button>

          <button class="action-card" @click="router.push('/chat')">
            <div class="action-icon purple">
              <ion-icon :icon="chatbubbleEllipsesOutline" />
            </div>
            <span>AI Chat</span>
          </button>

          <button class="action-card" @click="router.push('/timetable')">
            <div class="action-icon orange">
              <ion-icon :icon="calendarOutline" />
            </div>
            <span>Timetable</span>
          </button>

        </div>

      </section>

      <!-- CONTINUE LEARNING -->
      <section class="section">

        <div class="section-header">
          <h3 class="section-title">Continue Learning</h3>
          <button class="see-all" @click="router.push('/subjects')">See all</button>
        </div>

        <div class="lessons">

          <div class="lesson-card">
            <div class="lesson-icon" style="background: #EEF2FF;">
              <ion-icon :icon="calculatorOutline" style="color: #4F63D2;" />
            </div>
            <div class="lesson-body">
              <div class="lesson-meta">
                <span class="lesson-tag">Mathematics</span>
                <span class="lesson-pct">72%</span>
              </div>
              <p class="lesson-topic">Quadratic Equations</p>
              <div class="progress-track">
                <div class="progress-fill" style="width: 72%; background: #4F63D2;" />
              </div>
            </div>
          </div>

          <div class="lesson-card">
            <div class="lesson-icon" style="background: #ECFDF5;">
              <ion-icon :icon="leafOutline" style="color: #10B981;" />
            </div>
            <div class="lesson-body">
              <div class="lesson-meta">
                <span class="lesson-tag">Biology</span>
                <span class="lesson-pct">45%</span>
              </div>
              <p class="lesson-topic">Cell Structure & Division</p>
              <div class="progress-track">
                <div class="progress-fill" style="width: 45%; background: #10B981;" />
              </div>
            </div>
          </div>

          <div class="lesson-card">
            <div class="lesson-icon" style="background: #FFF7ED;">
              <ion-icon :icon="globeOutline" style="color: #F97316;" />
            </div>
            <div class="lesson-body">
              <div class="lesson-meta">
                <span class="lesson-tag">Geography</span>
                <span class="lesson-pct">30%</span>
              </div>
              <p class="lesson-topic">Climate Zones & Biomes</p>
              <div class="progress-track">
                <div class="progress-fill" style="width: 30%; background: #F97316;" />
              </div>
            </div>
          </div>

        </div>

      </section>

      <!-- TODAY'S GOALS -->
      <section class="section">

        <h3 class="section-title">Today's Goals</h3>

        <div class="goals">

          <div class="goal-item completed">
            <ion-icon :icon="checkmarkCircleOutline" class="goal-icon completed" />
            <span>Complete 2 practice problems</span>
          </div>

          <div class="goal-item">
            <ion-icon :icon="ellipseOutline" class="goal-icon" />
            <span>Read Chapter 4 — Biology</span>
          </div>

          <div class="goal-item">
            <ion-icon :icon="ellipseOutline" class="goal-icon" />
            <span>Ask AI Tutor 3 questions</span>
          </div>

        </div>

      </section>

    </div>
    <!-- FAB -->
    <button class="fab-btn" @click="router.push('/chat')">
      <ion-icon :icon="sparklesOutline" />
    </button>

  </ion-content>
</template>

<script setup>
import { IonContent, IonIcon } from '@ionic/vue'
import { useRouter } from 'vue-router'

import {
  flameOutline,
  timeOutline,
  checkmarkCircleOutline,
  sparklesOutline,
  chatbubbleEllipsesOutline,
  bookOutline,
  createOutline,
  calendarOutline,
  calculatorOutline,
  leafOutline,
  globeOutline,
  ellipseOutline
} from 'ionicons/icons'

const router = useRouter()
</script>

<style scoped>
.dashboard {
  --background: #F5F6FA;
}

.container {
  padding: 20px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* STATS ROW */
.stats-row {
  background: #ffffff;
  border-radius: 20px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: center;
}

.stat-chip:first-child {
  justify-content: flex-start;
}

.stat-chip:last-child {
  justify-content: flex-end;
}

.stat-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.stat-icon-wrap.flame {
  background: #FFF3E0;
  color: #F57C00;
}

.stat-icon-wrap.blue {
  background: #EEF2FF;
  color: #4F63D2;
}

.stat-icon-wrap.green {
  background: #ECFDF5;
  color: #10B981;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: #F0F0F0;
  flex-shrink: 0;
}

.stat-value {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1A1A2E;
}

.stat-label {
  margin: 0;
  font-size: 11px;
  color: #9CA3AF;
}

/* HERO */
.hero-card {
  background: linear-gradient(135deg, #1A1A2E 0%, #2D3561 100%);
  border-radius: 28px;
  padding: 28px 24px;
  position: relative;
  overflow: hidden;
}

.hero-card::before {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(79, 99, 210, 0.25);
}

.hero-card::after {
  content: '';
  position: absolute;
  bottom: -30px;
  right: 40px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(79, 99, 210, 0.15);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #c7d0ff;
  margin-bottom: 16px;
}

.hero-badge ion-icon {
  font-size: 14px;
}

.hero-card h2 {
  margin: 0 0 10px;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.2;
  color: #ffffff;
  position: relative;
  z-index: 1;
}

.hero-card p {
  margin: 0 0 22px;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
  position: relative;
  z-index: 1;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #4F63D2;
  color: #ffffff;
  border: none;
  border-radius: 14px;
  padding: 13px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  z-index: 1;
  box-shadow: 0 6px 20px rgba(79, 99, 210, 0.45);
  transition: opacity 0.15s;
}

.hero-btn:active {
  opacity: 0.85;
}

.hero-btn ion-icon {
  font-size: 16px;
}

/* SECTION */
.section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  margin: 0;
  font-size: 17px;
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

/* QUICK ACTIONS */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.action-card {
  background: #ffffff;
  border: none;
  border-radius: 18px;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.15s;
}

.action-card:active {
  transform: scale(0.95);
}

.action-card span {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.action-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.action-icon.blue   { background: #EEF2FF; color: #4F63D2; }
.action-icon.green  { background: #ECFDF5; color: #10B981; }
.action-icon.purple { background: #F5F3FF; color: #7C3AED; }
.action-icon.orange { background: #FFF7ED; color: #F97316; }

/* LESSONS */
.lessons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lesson-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.lesson-icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.lesson-body {
  flex: 1;
  min-width: 0;
}

.lesson-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.lesson-tag {
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.lesson-pct {
  font-size: 12px;
  font-weight: 700;
  color: #374151;
}

.lesson-topic {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #1A1A2E;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-track {
  width: 100%;
  height: 5px;
  background: #F3F4F6;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
}

/* GOALS */
.goals {
  background: #ffffff;
  border-radius: 20px;
  padding: 6px 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #F3F4F6;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.goal-item:last-child {
  border-bottom: none;
}

.goal-item.completed {
  color: #9CA3AF;
  text-decoration: line-through;
}

.goal-icon {
  font-size: 20px;
  color: #D1D5DB;
  flex-shrink: 0;
}

.goal-icon.completed {
  color: #10B981;
}

/* FAB */
.fab-btn {
  position: fixed;
  bottom: 32px;
  right: 20px;
  z-index: 100;

  width: 58px;
  height: 58px;

  border: none;
  border-radius: 50%;

  background: #4F63D2;
  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;

  box-shadow: 0 8px 24px rgba(79, 99, 210, 0.45);

  cursor: pointer;

  transition: transform 0.15s, opacity 0.15s;
}

.fab-btn:active {
  transform: scale(0.93);
  opacity: 0.9;
}
</style>
