<template>
  <ion-page>

    <ion-header class="ion-no-border">
      <ion-toolbar class="toolbar">
        <ion-buttons slot="start">
          <ion-button fill="clear" class="back-btn" @click="router.back()">
            <ion-icon slot="icon-only" :icon="chevronBackOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title class="toolbar-title">Timetable</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">
      <div class="container">

        <!-- DAY SELECTOR -->
        <div class="days-scroll">
          <button
            v-for="day in days"
            :key="day.key"
            class="day-pill"
            :class="{ active: activeDay === day.key }"
            @click="activeDay = day.key"
          >
            <span class="day-short">{{ day.short }}</span>
            <span class="day-num">{{ day.num }}</span>
          </button>
        </div>

        <!-- SCHEDULE -->
        <div class="schedule">

          <div v-if="todaySlots.length === 0" class="empty">
            <ion-icon :icon="calendarOutline" class="empty-icon" />
            <p>No classes scheduled for {{ activeDayLabel }}</p>
          </div>

          <div v-else>
            <div
              v-for="(slot, i) in todaySlots"
              :key="i"
              class="slot-row"
            >
              <!-- TIME COLUMN -->
              <div class="time-col">
                <p class="time-start">{{ slot.start }}</p>
                <p class="time-end">{{ slot.end }}</p>
              </div>

              <!-- LINE -->
              <div class="timeline">
                <div class="dot" :class="slot.color" />
                <div class="line" v-if="i < todaySlots.length - 1" />
              </div>

              <!-- CARD -->
              <div class="slot-card" :class="{ active: slot.isNow }">
                <div v-if="slot.isNow" class="now-badge">Now</div>
                <p class="slot-subject">{{ slot.subject }}</p>
                <p class="slot-meta">{{ slot.room }} · {{ slot.teacher }}</p>
                <div class="slot-tag" :class="slot.color">{{ slot.type }}</div>
              </div>

            </div>
          </div>

        </div>

        <!-- WEEK OVERVIEW -->
        <section class="section">
          <p class="section-title">This Week</p>
          <div class="week-cards">
            <div
              v-for="day in days"
              :key="day.key"
              class="week-card"
              :class="{ active: activeDay === day.key }"
              @click="activeDay = day.key"
            >
              <p class="week-day">{{ day.short }}</p>
              <p class="week-count">{{ weekCount[day.key] ?? 0 }}</p>
              <p class="week-label">classes</p>
            </div>
          </div>
        </section>

      </div>
    </ion-content>

  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

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
  calendarOutline
} from 'ionicons/icons'

const router = useRouter()

const today = new Date()
const dayKeys = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const jsDay = today.getDay()
const todayKey = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][jsDay]

const days = dayKeys.map((key, i) => {
  const d = new Date(today)
  const diff = i - (jsDay === 0 ? 6 : jsDay - 1)
  d.setDate(today.getDate() + diff)
  return {
    key,
    short: key,
    num: d.getDate()
  }
})

const activeDay = ref(todayKey)

const activeDayLabel = computed(() => {
  const d = days.find(d => d.key === activeDay.value)
  return d ? d.short : ''
})

const timetable = {
  Mon: [
    { start: '07:30', end: '08:30', subject: 'Mathematics',   room: 'Room A1',  teacher: 'Mr. Okello',   type: 'Core',    color: 'indigo', isNow: false },
    { start: '08:45', end: '09:45', subject: 'Biology',       room: 'Lab 2',    teacher: 'Ms. Namutebi', type: 'Core',    color: 'green',  isNow: true  },
    { start: '10:00', end: '11:00', subject: 'English',       room: 'Room B3',  teacher: 'Ms. Atim',     type: 'Core',    color: 'orange', isNow: false },
    { start: '11:15', end: '12:15', subject: 'Chemistry',     room: 'Lab 1',    teacher: 'Mr. Mugisha',  type: 'Core',    color: 'red',    isNow: false },
    { start: '14:00', end: '15:00', subject: 'Literature',    room: 'Room C2',  teacher: 'Ms. Tendo',    type: 'Elective',color: 'purple', isNow: false }
  ],
  Tue: [
    { start: '07:30', end: '08:30', subject: 'Physics',       room: 'Lab 3',    teacher: 'Mr. Ssemakula',type: 'Core',    color: 'blue',   isNow: false },
    { start: '08:45', end: '09:45', subject: 'Mathematics',   room: 'Room A1',  teacher: 'Mr. Okello',   type: 'Core',    color: 'indigo', isNow: false },
    { start: '10:00', end: '11:00', subject: 'Geography',     room: 'Room D1',  teacher: 'Ms. Kyaligonza',type:'Elective',color: 'teal',   isNow: false }
  ],
  Wed: [
    { start: '07:30', end: '08:30', subject: 'English',       room: 'Room B3',  teacher: 'Ms. Atim',     type: 'Core',    color: 'orange', isNow: false },
    { start: '08:45', end: '09:45', subject: 'Chemistry',     room: 'Lab 1',    teacher: 'Mr. Mugisha',  type: 'Core',    color: 'red',    isNow: false },
    { start: '11:00', end: '12:00', subject: 'Biology',       room: 'Lab 2',    teacher: 'Ms. Namutebi', type: 'Core',    color: 'green',  isNow: false },
    { start: '14:00', end: '15:00', subject: 'Mathematics',   room: 'Room A1',  teacher: 'Mr. Okello',   type: 'Core',    color: 'indigo', isNow: false }
  ],
  Thu: [
    { start: '07:30', end: '08:30', subject: 'Literature',    room: 'Room C2',  teacher: 'Ms. Tendo',    type: 'Elective',color: 'purple', isNow: false },
    { start: '08:45', end: '09:45', subject: 'Physics',       room: 'Lab 3',    teacher: 'Mr. Ssemakula',type: 'Core',    color: 'blue',   isNow: false },
    { start: '10:00', end: '11:00', subject: 'Geography',     room: 'Room D1',  teacher: 'Ms. Kyaligonza',type:'Elective',color: 'teal',   isNow: false }
  ],
  Fri: [
    { start: '07:30', end: '08:30', subject: 'Mathematics',   room: 'Room A1',  teacher: 'Mr. Okello',   type: 'Core',    color: 'indigo', isNow: false },
    { start: '08:45', end: '09:45', subject: 'English',       room: 'Room B3',  teacher: 'Ms. Atim',     type: 'Core',    color: 'orange', isNow: false },
    { start: '10:00', end: '11:00', subject: 'Biology',       room: 'Lab 2',    teacher: 'Ms. Namutebi', type: 'Core',    color: 'green',  isNow: false }
  ],
  Sat: [],
  Sun: []
}

const todaySlots = computed(() => timetable[activeDay.value] || [])

const weekCount = computed(() =>
  Object.fromEntries(Object.entries(timetable).map(([k, v]) => [k, v.length]))
)
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

/* CONTAINER */
.container {
  padding: 8px 0 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* DAY SELECTOR */
.days-scroll {
  display: flex;
  gap: 8px;
  padding: 0 16px;
  overflow-x: auto;
}

.days-scroll::-webkit-scrollbar {
  display: none;
}

.day-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  border: 1.5px solid #F1F3F6;
  border-radius: 16px;
  background: #ffffff;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;
}

.day-pill.active {
  background: #1A1A2E;
  border-color: #1A1A2E;
}

.day-short {
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
}

.day-num {
  font-size: 16px;
  font-weight: 800;
  color: #1A1A2E;
}

.day-pill.active .day-short,
.day-pill.active .day-num {
  color: #ffffff;
}

/* SCHEDULE */
.schedule {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
}

.slot-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

/* TIME */
.time-col {
  width: 48px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 4px;
}

.time-start {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: #1A1A2E;
}

.time-end {
  margin: 0;
  font-size: 11px;
  color: #9CA3AF;
}

/* TIMELINE */
.timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 16px;
  padding-top: 6px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1.5px currentColor;
}

.dot.indigo { color: #4F63D2; background: #4F63D2; }
.dot.green  { color: #10B981; background: #10B981; }
.dot.orange { color: #F97316; background: #F97316; }
.dot.red    { color: #EF4444; background: #EF4444; }
.dot.purple { color: #7C3AED; background: #7C3AED; }
.dot.blue   { color: #3B82F6; background: #3B82F6; }
.dot.teal   { color: #0D9488; background: #0D9488; }

.line {
  flex: 1;
  width: 1.5px;
  background: #F1F3F6;
  margin: 4px 0;
  min-height: 16px;
}

/* SLOT CARD */
.slot-card {
  flex: 1;
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  position: relative;
}

.slot-card.active {
  border-color: #4F63D2;
  background: #FAFBFF;
  box-shadow: 0 4px 16px rgba(79, 99, 210, 0.12);
}

.now-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #4F63D2;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
}

.slot-subject {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1A1A2E;
}

.slot-meta {
  margin: 0;
  font-size: 12px;
  color: #9CA3AF;
}

.slot-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  align-self: flex-start;
}

.slot-tag.indigo { background: #EEF2FF; color: #4F63D2; }
.slot-tag.green  { background: #ECFDF5; color: #10B981; }
.slot-tag.orange { background: #FFF7ED; color: #F97316; }
.slot-tag.red    { background: #FFF0F0; color: #EF4444; }
.slot-tag.purple { background: #F5F3FF; color: #7C3AED; }
.slot-tag.blue   { background: #EFF6FF; color: #3B82F6; }
.slot-tag.teal   { background: #F0FDFA; color: #0D9488; }

/* SECTION */
.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1A1A2E;
}

/* WEEK OVERVIEW */
.week-cards {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.week-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 12px;
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.week-card.active {
  background: #1A1A2E;
  border-color: #1A1A2E;
}

.week-day {
  margin: 0;
  font-size: 10px;
  font-weight: 600;
  color: #9CA3AF;
}

.week-count {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1A1A2E;
}

.week-label {
  margin: 0;
  font-size: 9px;
  color: #9CA3AF;
}

.week-card.active .week-day,
.week-card.active .week-count,
.week-card.active .week-label {
  color: #ffffff;
}

/* EMPTY */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 20px;
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
</style>
