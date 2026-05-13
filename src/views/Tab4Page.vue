<template>
  <ion-page>

    <ion-header class="ion-no-border">
      <ion-toolbar class="toolbar">
        <div class="toolbar-inner">
          <h1 class="toolbar-title">Profile</h1>
          <div class="toolbar-icon-wrap">
            <ion-icon :icon="personOutline" class="toolbar-icon" />
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">

      <!-- SKELETON -->
      <div v-if="isLoading" class="container">
        <div class="sk-avatar" />
        <div class="sk-name" />
        <div class="sk-sub" />
        <div class="sk-stats" />
        <div class="sk-menu">
          <div v-for="n in 5" :key="n" class="sk-menu-row" />
        </div>
      </div>

      <!-- CONTENT -->
      <div v-else class="container">

        <!-- PROFILE HERO -->
        <div class="hero">
          <div class="hero-bg" />
          <div class="avatar-wrap">
            <img
              src="https://api.dicebear.com/9.x/adventurer/svg?seed=Amina"
              alt="Avatar"
              class="avatar-img"
            />
            <div class="avatar-badge">
              <ion-icon :icon="pencilOutline" />
            </div>
          </div>
          <p class="profile-name">{{ profileName }}</p>
          <p class="profile-school">St. Mary's College, Kampala</p>
        </div>

        <!-- STATS -->
        <div class="stats-card">
          <div class="stat-item">
            <p class="stat-value">24</p>
            <p class="stat-label">Lessons</p>
          </div>
          <div class="stat-sep" />
          <div class="stat-item">
            <p class="stat-value">6h 20m</p>
            <p class="stat-label">Study Time</p>
          </div>
          <div class="stat-sep" />
          <div class="stat-item">
            <p class="stat-value">340 XP</p>
            <p class="stat-label">Points</p>
          </div>
        </div>

        <!-- MENU -->
        <div class="menu-card">
          <button
            v-for="item in menuItems"
            :key="item.label"
            class="menu-row"
            :class="{ danger: item.danger }"
            @click="handleMenuAction(item)"
          >
            <div class="menu-left">
              <div class="menu-icon-wrap" :class="item.color">
                <ion-icon :icon="item.icon" />
              </div>
              <span class="menu-label">{{ item.label }}</span>
            </div>
            <ion-icon :icon="chevronForwardOutline" class="menu-arrow" />
          </button>
        </div>

        <p class="app-version">AggregateAI v1.0.0</p>

      </div>

    </ion-content>

  </ion-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon
} from '@ionic/vue'

import {
  personOutline,
  pencilOutline,
  notificationsOutline,
  downloadOutline,
  lockClosedOutline,
  helpCircleOutline,
  logOutOutline,
  chevronForwardOutline,
  timeOutline
} from 'ionicons/icons'

import { supabase } from '@/database/database'
import { clearAuthSession } from '@/utils/authSession'

const router = useRouter()
const profileName = ref('Amina Nakato')
const isLoading = ref(true)

const menuItems = [
  { label: 'Edit Profile',       icon: personOutline,        color: 'indigo', action: 'edit-profile' },
  { label: 'Notifications',      icon: notificationsOutline, color: 'blue'   },
  { label: 'Downloaded Lessons', icon: downloadOutline,      color: 'green'  },
  { label: 'Study Reminders',    icon: timeOutline,          color: 'orange' },
  { label: 'Change Password',    icon: lockClosedOutline,    color: 'purple' },
  { label: 'Help & Support',     icon: helpCircleOutline,    color: 'teal'   },
  { label: 'Log Out',            icon: logOutOutline,        color: 'red',    action: 'logout', danger: true }
]

onMounted(async () => {
  isLoading.value = true
  const { data, error } = await supabase.auth.getUser()

  if (!error) {
    const metadata = data.user?.user_metadata || {}
    const fullName = metadata.full_name ||
      [metadata.first_name, metadata.surname].filter(Boolean).join(' ')
    if (fullName) profileName.value = fullName
  }

  isLoading.value = false
})

async function handleMenuAction(item) {
  if (item.action === 'edit-profile') {
    router.push('/create-profile')
    return
  }
  if (item.action === 'logout') {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      await clearAuthSession()
      router.replace('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }
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
  gap: 16px;
}

/* HERO */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px 20px 24px;
  position: relative;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 90px;
  background: linear-gradient(135deg, #EEF2FF, #F5F3FF);
  border-radius: 20px;
}

.avatar-wrap {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  overflow: visible;
  position: relative;
  z-index: 1;
  margin-top: 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #4F63D2;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #ffffff;
}

.profile-name {
  margin: 4px 0 0;
  font-size: 20px;
  font-weight: 800;
  color: #1A1A2E;
  position: relative;
  z-index: 1;
}

.profile-school {
  margin: 0;
  font-size: 13px;
  color: #9CA3AF;
  position: relative;
  z-index: 1;
}

/* STATS */
.stats-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 18px;
  padding: 16px 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  margin: 0 0 3px;
  font-size: 17px;
  font-weight: 800;
  color: #1A1A2E;
}

.stat-label {
  margin: 0;
  font-size: 11px;
  color: #9CA3AF;
  font-weight: 500;
}

.stat-sep {
  width: 1px;
  height: 32px;
  background: #F1F3F6;
  flex-shrink: 0;
}

/* MENU */
.menu-card {
  background: #ffffff;
  border: 1px solid #F1F3F6;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.menu-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: none;
  border-bottom: 1px solid #F9FAFB;
  background: #ffffff;
  width: 100%;
  cursor: pointer;
  transition: background 0.15s;
}

.menu-row:last-child {
  border-bottom: none;
}

.menu-row:active {
  background: #F9FAFB;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.menu-icon-wrap.indigo { background: #EEF2FF; color: #4F63D2; }
.menu-icon-wrap.blue   { background: #EFF6FF; color: #3B82F6; }
.menu-icon-wrap.green  { background: #ECFDF5; color: #10B981; }
.menu-icon-wrap.orange { background: #FFF7ED; color: #F97316; }
.menu-icon-wrap.purple { background: #F5F3FF; color: #7C3AED; }
.menu-icon-wrap.teal   { background: #F0FDFA; color: #0D9488; }
.menu-icon-wrap.red    { background: #FFF0F0; color: #EF4444; }

.menu-label {
  font-size: 14px;
  font-weight: 600;
  color: #1A1A2E;
}

.menu-row.danger .menu-label {
  color: #EF4444;
}

.menu-arrow {
  font-size: 15px;
  color: #D1D5DB;
}

.menu-row.danger .menu-arrow {
  color: #FECACA;
}

/* APP VERSION */
.app-version {
  margin: 0;
  text-align: center;
  font-size: 12px;
  color: #D1D5DB;
}

/* SKELETONS */
@keyframes shimmer {
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
}

.sk-avatar, .sk-name, .sk-sub, .sk-stats, .sk-menu-row {
  background: #F3F4F6;
  border-radius: 12px;
  animation: shimmer 1.4s ease-in-out infinite;
}

.sk-avatar { width: 84px; height: 84px; border-radius: 50%; align-self: center; }
.sk-name   { width: 140px; height: 20px; align-self: center; }
.sk-sub    { width: 100px; height: 14px; align-self: center; }
.sk-stats  { height: 72px; border-radius: 18px; }
.sk-menu   { display: flex; flex-direction: column; gap: 2px; border-radius: 20px; overflow: hidden; }
.sk-menu-row { height: 56px; border-radius: 0; }
</style>
