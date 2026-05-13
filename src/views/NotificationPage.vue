<template>
  <ion-page>

    <ion-header class="ion-no-border">
      <ion-toolbar class="toolbar">
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <ion-buttons slot="start">
          <ion-button fill="clear" class="back-btn" @click="router.back()">
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
            <ion-icon slot="icon-only" :icon="chevronBackOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title class="toolbar-title">Notifications</ion-title>
        <ion-buttons slot="end">
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <ion-button fill="clear" class="mark-btn" @click="markAllRead">
            <span class="mark-text">Mark all read</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">
      <div class="container">

        <!-- UNREAD BANNER -->
        <div v-if="unreadCount > 0" class="unread-banner">
          <div class="unread-dot" />
          <p>{{ unreadCount }} unread notification{{ unreadCount > 1 ? 's' : '' }}</p>
        </div>

        <!-- EMPTY STATE -->
        <div v-if="grouped.length === 0" class="empty">
          <div class="empty-icon-wrap">
            <ion-icon :icon="notificationsOffOutline" class="empty-icon" />
          </div>
          <p class="empty-title">All caught up!</p>
          <p class="empty-sub">No notifications right now. Check back later.</p>
        </div>

        <!-- GROUPED NOTIFICATIONS -->
        <template v-else>
          <section
            v-for="group in grouped"
            :key="group.label"
            class="group"
          >
            <p class="group-label">{{ group.label }}</p>

            <div class="notif-list">
              <div
                v-for="(notif, i) in group.items"
                :key="i"
                class="notif-card"
                :class="{ unread: !notif.read }"
                @click="markRead(notif)"
              >
                <div class="notif-icon" :class="notif.color">
                  <ion-icon :icon="notif.icon" />
                </div>

                <div class="notif-body">
                  <div class="notif-top">
                    <p class="notif-title">{{ notif.title }}</p>
                    <span class="notif-time">{{ notif.time }}</span>
                  </div>
                  <p class="notif-text">{{ notif.text }}</p>
                </div>

                <div v-if="!notif.read" class="unread-pip" />
              </div>
            </div>

          </section>
        </template>

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
  sparklesOutline,
  bookOutline,
  statsChartOutline,
  timeOutline,
  trophyOutline,
  alertCircleOutline,
  notificationsOffOutline
} from 'ionicons/icons'

const router = useRouter()

const notifications = ref([
  {
    group: 'Today',
    title: 'AI Study Suggestion',
    text: 'Continue Mathematics practice to improve your weekly progress.',
    icon: sparklesOutline,
    color: 'indigo',
    time: '2m ago',
    read: false
  },
  {
    group: 'Today',
    title: 'New Lesson Available',
    text: 'Biology revision materials have been added. Start now to stay ahead.',
    icon: bookOutline,
    color: 'green',
    time: '1h ago',
    read: false
  },
  {
    group: 'Today',
    title: 'Achievement Unlocked',
    text: 'You completed a 7-day learning streak. Keep it up!',
    icon: trophyOutline,
    color: 'yellow',
    time: '3h ago',
    read: false
  },
  {
    group: 'Earlier',
    title: 'Progress Updated',
    text: 'Your Chemistry score improved by 12% this week.',
    icon: statsChartOutline,
    color: 'blue',
    time: 'Yesterday',
    read: true
  },
  {
    group: 'Earlier',
    title: 'Study Reminder',
    text: 'You haven\'t completed your Physics practice session today.',
    icon: timeOutline,
    color: 'orange',
    time: '2d ago',
    read: true
  },
  {
    group: 'Earlier',
    title: 'Low Score Alert',
    text: 'Your last Chemistry quiz score was 58%. Consider reviewing ionic bonding.',
    icon: alertCircleOutline,
    color: 'red',
    time: '3d ago',
    read: true
  }
])

const grouped = computed(() => {
  const groups = {}
  for (const n of notifications.value) {
    if (!groups[n.group]) groups[n.group] = []
    groups[n.group].push(n)
  }
  return Object.entries(groups).map(([label, items]) => ({ label, items }))
})

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function markRead(notif) {
  notif.read = true
}

function markAllRead() {
  notifications.value.forEach(n => { n.read = true })
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
  border-bottom: 1px solid #F1F3F6;
}

.toolbar-title {
  font-size: 16px;
  font-weight: 700;
  color: #1A1A2E;
}

.back-btn {
  --color: #1A1A2E;
}

.mark-btn {
  --color: #4F63D2;
}

.mark-text {
  font-size: 12px;
  font-weight: 600;
}

/* CONTAINER */
.container {
  padding: 12px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* UNREAD BANNER */
.unread-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #EEF2FF;
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 6px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4F63D2;
  flex-shrink: 0;
}

.unread-banner p {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #4F63D2;
}

/* GROUP */
.group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.group-label {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 2px;
}

/* NOTIFICATION LIST */
.notif-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* NOTIFICATION CARD */
.notif-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 18px;
  padding: 14px;
  cursor: pointer;
  transition: background 0.15s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  position: relative;
}

.notif-card.unread {
  background: #FAFBFF;
  border-color: #E0E7FF;
}

.notif-card:active {
  background: #F9FAFB;
}

/* ICON */
.notif-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.notif-icon.indigo { background: #EEF2FF; color: #4F63D2; }
.notif-icon.green  { background: #ECFDF5; color: #10B981; }
.notif-icon.yellow { background: #FFFBEB; color: #D97706; }
.notif-icon.blue   { background: #EFF6FF; color: #3B82F6; }
.notif-icon.orange { background: #FFF7ED; color: #F97316; }
.notif-icon.red    { background: #FFF0F0; color: #EF4444; }

/* BODY */
.notif-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notif-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.notif-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notif-time {
  font-size: 11px;
  color: #9CA3AF;
  flex-shrink: 0;
  font-weight: 500;
}

.notif-text {
  margin: 0;
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
}

/* UNREAD PIP */
.unread-pip {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4F63D2;
  flex-shrink: 0;
  margin-top: 4px;
}

/* EMPTY STATE */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 12px;
  text-align: center;
}

.empty-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 32px;
  color: #D1D5DB;
}

.empty-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1A1A2E;
}

.empty-sub {
  margin: 0;
  font-size: 13px;
  color: #9CA3AF;
  line-height: 1.55;
  max-width: 240px;
}
</style>
