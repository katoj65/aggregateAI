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
        <ion-title class="toolbar-title">Academic Details</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">
      <div class="container">

        <!-- HERO -->
        <div class="hero">
          <div class="hero-icon">
            <ion-icon :icon="schoolOutline" />
          </div>
          <h2 class="hero-title">Tell us about your studies</h2>
          <p class="hero-sub">Help us personalise your learning experience</p>
        </div>

        <!-- PROGRESS -->
        <div class="progress-row">
          <div class="progress-step done">1</div>
          <div class="progress-line" />
          <div class="progress-step active">2</div>
          <div class="progress-line" />
          <div class="progress-step">3</div>
        </div>

        <!-- FORM -->
        <form class="form" @submit.prevent="handleSubmit">

          <!-- SCHOOL -->
          <div class="field">
            <label class="field-label">School name</label>
            <div class="input-wrap" :class="{ invalid: errors.school }">
              <ion-icon :icon="businessOutline" class="input-icon" />
              <input
                v-model="school"
                type="text"
                class="input"
                placeholder="e.g. St. Mary's College Kisubi"
                @input="clearError('school')"
              />
            </div>
            <p v-if="errors.school" class="field-error">{{ errors.school }}</p>
          </div>

          <!-- CLASS -->
          <div class="field">
            <label class="field-label">Class / Year</label>
            <ion-item lines="none" class="select-item" :class="{ invalid: errors.className }">
              <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
              <ion-icon :icon="bookOutline" slot="start" class="input-icon" />
              <ion-select
                v-model="className"
                placeholder="Select class"
                @ion-change="clearError('className')"
              >
                <ion-select-option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</ion-select-option>
              </ion-select>
            </ion-item>
            <p v-if="errors.className" class="field-error">{{ errors.className }}</p>
          </div>




          <p v-if="formError" class="form-error">{{ formError }}</p>

          <SubmitButton title="Finish Setup" :loading="loading" />

          <button type="button" class="skip-btn" @click="router.replace('/tabs/tab1')">
            Skip for now
          </button>

        </form>

      </div>
    </ion-content>

  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonSelect,
  IonSelectOption
} from '@ionic/vue'

import {
  chevronBackOutline,
  schoolOutline,
  businessOutline,
  bookOutline
} from 'ionicons/icons'

import { supabase } from '@/database/database'
import { getUserSession } from '@/utils/userSession'
import SubmitButton from '@/components/SubmitButton.vue'

const router = useRouter()

const classes = ref([])

onMounted(async () => {
  const { data, error } = await supabase.from('class').select('*')
  if (error) {
    console.error('class fetch error:', error)
    return
  }
  console.log('class rows:', data)
  classes.value = data ?? []
})

const school    = ref('')
const className = ref('')
const loading   = ref(false)
const formError = ref('')

const errors = ref({
  school:    '',
  className: ''
})

function clearError(field) {
  errors.value[field] = ''
  formError.value = ''
}

function validate() {
  const next = { school: '', className: '' }
  if (!school.value.trim()) next.school    = 'School name is required.'
  if (!className.value)     next.className = 'Class is required.'
  errors.value = next
  return !Object.values(next).some(Boolean)
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  formError.value = ''

  try {
    const profileId = await getUserSession()

    if (!profileId) {
      formError.value = 'Session not found. Please go back and try again.'
      return
    }

    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError

    const { error } = await supabase
      .from('student_profile')
      .insert({
        user_id:    authData.user.id,
        profile_id: profileId,
        class_id:   className.value,
        school:     school.value.trim()
      })

    if (error) throw error

    router.replace('/tabs/tab1')
  } catch (err) {
    console.error('Failed to save student details:', err)
    formError.value = err?.message || 'Unable to save. Please try again.'
  } finally {
    loading.value = false
  }
}
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
  padding: 8px 20px 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* HERO */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 16px 0 4px;
}

.hero-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: #EEF2FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #4F63D2;
  margin-bottom: 4px;
}

.hero-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1A1A2E;
}

.hero-sub {
  margin: 0;
  font-size: 13px;
  color: #9CA3AF;
}

/* PROGRESS */
.progress-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.progress-step {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #E5E7EB;
  background: #ffffff;
  color: #9CA3AF;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.progress-step.done {
  background: #10B981;
  border-color: #10B981;
  color: #ffffff;
}

.progress-step.active {
  background: #4F63D2;
  border-color: #4F63D2;
  color: #ffffff;
}

.progress-line {
  flex: 1;
  height: 2px;
  background: #E5E7EB;
  max-width: 48px;
}

/* FORM */
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.optional {
  font-weight: 400;
  color: #9CA3AF;
}

/* INPUT */
.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid #E5E7EB;
  border-radius: 14px;
  padding: 14px;
  background: #ffffff;
  transition: border-color 0.15s;
}

.input-wrap:focus-within {
  border-color: #4F63D2;
}

.input-wrap.invalid { border-color: #EF4444; }

.input-icon {
  font-size: 17px;
  color: #9CA3AF;
  flex-shrink: 0;
}

.input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #1A1A2E;
  background: transparent;
}

.input::placeholder { color: #D1D5DB; }

/* ION-SELECT ITEM */
.select-item {
  --background: #ffffff;
  --border-radius: 14px;
  --padding-start: 14px;
  --inner-padding-end: 14px;
  --min-height: 52px;
  border: 1.5px solid #E5E7EB;
  border-radius: 14px;
  transition: border-color 0.15s;
}

.select-item:focus-within { border-color: #4F63D2; }
.select-item.invalid { border-color: #EF4444; }

.select-item ion-select {
  --placeholder-color: #D1D5DB;
  --placeholder-opacity: 1;
  font-size: 15px;
  color: #1A1A2E;
  width: 100%;
}

/* STUDY HOURS GRID */
.hours-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.hour-chip {
  padding: 12px 6px;
  border: 1.5px solid #E5E7EB;
  border-radius: 12px;
  background: #ffffff;
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}

.hour-chip.active {
  border-color: #4F63D2;
  background: #EEF2FF;
  color: #4F63D2;
}

/* ERRORS */
.field-error {
  margin: 0;
  font-size: 12px;
  color: #EF4444;
}

.form-error {
  margin: 0;
  font-size: 13px;
  color: #EF4444;
  background: #FFF0F0;
  border-radius: 10px;
  padding: 10px 14px;
  text-align: center;
}

/* SKIP */
.skip-btn {
  background: none;
  border: none;
  font-size: 13px;
  color: #9CA3AF;
  text-align: center;
  cursor: pointer;
  padding: 4px 0;
}
</style>
