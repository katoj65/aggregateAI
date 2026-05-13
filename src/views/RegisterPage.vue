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
          <h1 class="hero-title">Create account</h1>
          <p class="hero-sub">Join thousands of students learning with AI</p>
        </div>

        <!-- FORM -->
        <form class="form" @submit.prevent="handleRegister">

          <!-- NAME ROW -->
          <div class="name-row">
            <div class="field">
              <label class="field-label">First name</label>
              <div class="input-wrap" :class="{ invalid: errors.firstName }">
                <input
                  v-model="firstName"
                  type="text"
                  class="input"
                  placeholder="Amina"
                  autocomplete="given-name"
                  @input="clearError('firstName')"
                />
              </div>
              <p v-if="errors.firstName" class="field-error">{{ errors.firstName }}</p>
            </div>

            <div class="field">
              <label class="field-label">Surname</label>
              <div class="input-wrap" :class="{ invalid: errors.surname }">
                <input
                  v-model="surname"
                  type="text"
                  class="input"
                  placeholder="Nakato"
                  autocomplete="family-name"
                  @input="clearError('surname')"
                />
              </div>
              <p v-if="errors.surname" class="field-error">{{ errors.surname }}</p>
            </div>
          </div>

          <!-- EMAIL -->
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
                inputmode="email"
                @input="clearError('email')"
              />
            </div>
            <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
          </div>

          <!-- PASSWORD -->
          <div class="field">
            <label class="field-label">Password</label>
            <div class="input-wrap" :class="{ invalid: errors.password }">
              <ion-icon :icon="lockClosedOutline" class="input-icon" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="input"
                placeholder="Create a strong password"
                autocomplete="new-password"
                @input="clearError('password')"
              />
              <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline" />
              </button>
            </div>
            <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
          </div>

          <!-- STRENGTH -->
          <div v-if="password.length > 0" class="strength-wrap">
            <div class="strength-bars">
              <span
                v-for="i in 4"
                :key="i"
                class="strength-bar"
                :class="{ filled: passwordStrength >= i }"
                :style="{ background: passwordStrength >= i ? strengthColor : '#F1F3F6' }"
              />
            </div>
            <span class="strength-label" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
          </div>

          <SubmitButton title="Create Free Account" :loading="loading" />

          <p class="terms">
            By registering you agree to our
            <span class="terms-link">Terms of Service</span>
          </p>

        </form>

        <!-- SWITCH -->
        <p class="switch-text">
          Already have an account?
          <button class="switch-link" @click="router.push('/login')">Login</button>
        </p>

      </div>
    </ion-content>

  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
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

const router       = useRouter()
const firstName    = ref('')
const surname      = ref('')
const email        = ref('')
const password     = ref('')
const showPassword = ref(false)
const loading      = ref(false)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const errors = ref({ firstName: '', surname: '', email: '', password: '' })

const passwordStrength = computed(() => {
  const p = password.value
  let score = 0
  if (p.length >= 6)              score++
  if (p.length >= 10)             score++
  if (/[A-Z]/.test(p) || /\d/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p))    score++
  return score
})

const strengthColor = computed(() =>
  ['', '#EF4444', '#F97316', '#10B981', '#4F63D2'][passwordStrength.value] ?? '#D1D5DB'
)

const strengthLabel = computed(() =>
  ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength.value] ?? ''
)

function clearError(field) {
  errors.value[field] = ''
}

function validateRegisterForm() {
  const nextErrors = { firstName: '', surname: '', email: '', password: '' }
  const trimmedFirstName = firstName.value.trim()
  const trimmedSurname   = surname.value.trim()
  const trimmedEmail     = email.value.trim()
  if (!trimmedFirstName)                         nextErrors.firstName = 'First name is required.'
  if (!trimmedSurname)                           nextErrors.surname   = 'Surname is required.'
  if (!trimmedEmail)                             nextErrors.email     = 'Email address is required.'
  else if (!emailPattern.test(trimmedEmail))     nextErrors.email     = 'Enter a valid email address.'
  if (!password.value)                           nextErrors.password  = 'Password is required.'
  else if (password.value.length < 6)            nextErrors.password  = 'Password must be at least 6 characters.'
  errors.value = nextErrors
  return !Object.values(nextErrors).some(Boolean)
}

async function handleRegister() {
  if (!validateRegisterForm()) return
  const trimmedFirstName = firstName.value.trim()
  const trimmedSurname   = surname.value.trim()
  const trimmedEmail     = email.value.trim()
  loading.value = true
  try {
    const { error, data } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: password.value,
      options: {
        data: {
          first_name: trimmedFirstName,
          surname:    trimmedSurname,
          full_name:  `${trimmedFirstName} ${trimmedSurname}`
        }
      }
    })
    if (error) throw error
    const user = data?.user ?? data?.session?.user
    const fullName = user?.user_metadata?.full_name || ''
    const [derivedFirstName = ''] = fullName.split(' ').filter(Boolean)
    await saveAuthSession({
      firstName: user?.user_metadata?.first_name || derivedFirstName || trimmedFirstName,
      email:     user?.email || trimmedEmail,
      uuid:      user?.id || ''
    })
    router.push('/tabs/tab1')
  } catch (error) {
    console.error('Register failed:', error)
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
  margin-bottom: 32px;
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
  gap: 16px;
}

/* NAME ROW */
.name-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  min-width: 0;
}

.input::placeholder {
  color: #D1D5DB;
}

.field-error {
  margin: 0;
  font-size: 12px;
  color: #EF4444;
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

/* STRENGTH */
.strength-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: -4px;
}

.strength-bars {
  display: flex;
  gap: 5px;
  flex: 1;
}

.strength-bar {
  flex: 1;
  height: 4px;
  border-radius: 4px;
  transition: background 0.25s ease;
}

.strength-label {
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  transition: color 0.25s ease;
}

/* TERMS */
.terms {
  font-size: 12px;
  color: #9CA3AF;
  text-align: center;
  margin: 0;
}

.terms-link {
  color: #4F63D2;
  text-decoration: underline;
  cursor: pointer;
}

/* SWITCH */
.switch-text {
  font-size: 14px;
  color: #6B7280;
  text-align: center;
  margin: 24px 0 0;
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
