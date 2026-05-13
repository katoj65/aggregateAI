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
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <ion-buttons slot="end">
          <div class="app-icon">
            <ion-icon :icon="sparklesOutline" class="app-icon-inner" />
          </div>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="page">
      <div class="wrap">

        <!-- HERO -->
        <div class="hero">
          <h1 class="hero-title">Welcome back</h1>
          <p class="hero-sub">Login to continue your learning journey</p>
        </div>

        <!-- FORM -->
        <form class="form" @submit.prevent="handleLogin">

          <div class="field">
            <label class="field-label">Email address</label>
            <div class="input-wrap" :class="{ invalid: errors.email }">
              <ion-icon :icon="mailOutline" class="input-icon" />
              <input
                v-model="email"
                type="email"
                class="input"
                placeholder="you@example.com"
                autocomplete="email"
                @input="clearError('email')"
              />
            </div>
            <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
          </div>

          <div class="field">
            <div class="label-row">
              <label class="field-label">Password</label>
              <button type="button" class="forgot-link" @click="router.push('/forgot-password')">
                Forgot password?
              </button>
            </div>
            <div class="input-wrap" :class="{ invalid: errors.password }">
              <ion-icon :icon="lockClosedOutline" class="input-icon" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="input"
                placeholder="Enter your password"
                autocomplete="current-password"
                @input="clearError('password')"
              />
              <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline" />
              </button>
            </div>
            <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
          </div>

          <p v-if="loginError" class="form-error">{{ loginError }}</p>

          <SubmitButton title="Login" :loading="loading" />

        </form>

        <!-- DIVIDER -->
        <div class="divider">
          <span class="divider-line" />
          <span class="divider-text">or</span>
          <span class="divider-line" />
        </div>

        <!-- SWITCH -->
        <p class="switch-text">
          Don't have an account?
          <button class="switch-link" @click="router.push('/register')">Create one free</button>
        </p>

      </div>
    </ion-content>

  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon
} from '@ionic/vue'
import {
  chevronBackOutline,
  sparklesOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons'
import { useRouter } from 'vue-router'
import SubmitButton from '@/components/SubmitButton.vue'
import { supabase } from '@/database/database'
import { saveAuthSession } from '@/utils/authSession'
import { saveUserSession } from '@/utils/userSession'

const router       = useRouter()
const email        = ref('')
const password     = ref('')
const showPassword = ref(false)
const loading      = ref(false)
const loginError   = ref('')
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const errors       = ref({ email: '', password: '' })

function clearError(field) {
  errors.value[field] = ''
  loginError.value = ''
}

function validateLoginForm() {
  const nextErrors = { email: '', password: '' }
  const trimmedEmail = email.value.trim()
  if (!trimmedEmail)                       nextErrors.email    = 'Email address is required.'
  else if (!emailPattern.test(trimmedEmail)) nextErrors.email  = 'Enter a valid email address.'
  if (!password.value)                     nextErrors.password = 'Password is required.'
  errors.value = nextErrors
  return !Object.values(nextErrors).some(Boolean)
}

async function handleLogin() {
  loginError.value = ''
  const trimmedEmail = email.value.trim()
  if (!validateLoginForm()) return null
  loading.value = true
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: password.value
    })
    if (error) throw error
    const user = data?.user ?? data?.session?.user
    const fullName = user?.user_metadata?.full_name || ''
    const [derivedFirstName = ''] = fullName.split(' ').filter(Boolean)
    await saveAuthSession({
      firstName: user?.user_metadata?.first_name || derivedFirstName,
      email:     user?.email || trimmedEmail,
      uuid:      user?.id || ''
    })

    const { data: profile } = await supabase
      .from('profile')
      .select('id')
      .eq('email', user?.email || trimmedEmail)
      .limit(1)

    if (profile?.[0]?.id) {
      await saveUserSession(profile[0].id)
    }

    router.push('/tabs/tab1')
    return data
  } catch (error) {
    console.error('Login failed:', error)
    loginError.value = error?.message || 'Unable to login. Please try again.'
    return null
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  --background: #ffffff;
}

.wrap {
  padding: 20px 24px 48px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.toolbar {
  --background: #ffffff;
  --border-width: 0;
}

.back-btn {
  --color: #1A1A2E;
}

.app-icon {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: linear-gradient(135deg, #1A1A2E, #2D3561);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
}

.app-icon-inner {
  font-size: 18px;
  color: #c7d0ff;
}

/* HERO */
.hero {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 36px;
}

.hero-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #1A1A2E;
  line-height: 1.15;
}

.hero-sub {
  margin: 0;
  font-size: 14px;
  color: #6B7280;
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

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

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

.input-wrap.invalid,
.input-wrap.invalid:focus-within {
  border-color: #EF4444;
}

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

.input::placeholder {
  color: #D1D5DB;
}

.field-error {
  margin: 0;
  font-size: 12px;
  color: #EF4444;
}

.form-error {
  margin: 0;
  font-size: 13px;
  color: #EF4444;
  text-align: center;
  background: #FFF0F0;
  border-radius: 10px;
  padding: 10px 14px;
}

.eye-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #9CA3AF;
  font-size: 18px;
  display: flex;
  align-items: center;
}

.forgot-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  font-weight: 600;
  color: #4F63D2;
  cursor: pointer;
}

/* DIVIDER */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0 20px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #F1F3F6;
}

.divider-text {
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 500;
}

/* SWITCH */
.switch-text {
  font-size: 14px;
  color: #6B7280;
  text-align: center;
  margin: 0;
}

.switch-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  font-weight: 700;
  color: #4F63D2;
  cursor: pointer;
}
</style>
