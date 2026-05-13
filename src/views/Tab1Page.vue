<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="toolbar-inner">
          <div>
            <p class="toolbar-title">Good Morning, {{ firstName }}</p>
            <p class="toolbar-sub">Let’s continue your learning journey</p>
          </div>
          <div class="toolbar-actions">
            <button type="button" class="toolbar-notification-btn" @click="router.push('/notifications')">
              <ion-icon :icon="notificationsOutline" class="toolbar-notification-icon" />
            </button>
            <ion-avatar class="toolbar-avatar">
              <ion-icon :icon="personOutline" class="toolbar-avatar-icon" />
            </ion-avatar>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <StudentDashboard v-if="role === 'student'" />

  </ion-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonAvatar,
  IonIcon
} from '@ionic/vue'

import {
  personOutline,
  notificationsOutline
} from 'ionicons/icons'

import { useRouter } from 'vue-router'
import { getAuthSession } from '@/utils/authSession'
import { getRoleSession, saveRoleSession } from '@/utils/roleSession'
import { supabase } from '@/database/database'
import StudentDashboard from '@/views/dashboard/StudentDashboard.vue'

const router = useRouter()
const firstName = ref('')
const role = ref('')

onMounted(async () => {
  const [session, savedRole] = await Promise.all([getAuthSession(), getRoleSession()])

  if (session?.firstName) {
    firstName.value = session.firstName
  }

  if (savedRole) {
    role.value = savedRole
    return
  }

  const { data: authData } = await supabase.auth.getUser()
  if (!authData?.user?.email) return

  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('email', authData.user.email)
    .maybeSingle()

  if (profile?.role) {
    role.value = profile.role
    await saveRoleSession(profile.role)
  }
})
</script>

<style scoped>
.dashboard {
  --background: #ffffff;
}

.container {
  padding: 20px;
  background: #ffffff;
}

.toolbar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px 8px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-title {
  font-size: 18px;
  font-weight: 700;
  color: #2b2b2b;
  margin: 0 0 2px;
}

.toolbar-sub {
  font-size: 13px;
  color: #777;
  margin: 0;
}

.toolbar-avatar {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3eee8;
}

.toolbar-avatar-icon {
  font-size: 20px;
  color: #8c7a66;
}

.toolbar-notification-btn {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 999px;
  background: #f3eee8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.toolbar-notification-icon {
  font-size: 20px;
  color: #8c7a66;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.card {
  background: #ffffff;
  border-radius: 18px;
  padding: 16px;
  border: 1px solid #ececec;
}

.icon {
  font-size: 22px;
  color: #8c7a66;
  margin-bottom: 10px;
}

.card h3 {
  margin: 0;
  font-size: 16px;
  color: #2b2b2b;
}

.card p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #7a7a7a;
}

.section h2 {
  font-size: 18px;
  margin: 16px 0 10px;
}

.list-card {
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #ececec;
  margin-bottom: 10px;
}

.list-card h4 {
  margin: 0;
}

.list-card p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #777;
}

.insight {
  background: #ffffff;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #ececec;
  color: #444;
}

.fab {
  --background: #a58a6a;
  color: #fff;
}
</style>
