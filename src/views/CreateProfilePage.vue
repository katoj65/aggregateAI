<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header class="header">
      <ion-toolbar class="toolbar">

        <ion-buttons slot="start">
          <ion-button fill="clear">
            <ion-icon :icon="chevronBackOutline" />
          </ion-button>
        </ion-buttons>

        <ion-title class="title">Create Profile</ion-title>

      </ion-toolbar>
    </ion-header>

    <!-- CONTENT -->
    <ion-content :fullscreen="true" class="profile-page">



      

      <div class="container">

        <!-- USER AVATAR -->
        <div class="avatar">
          <ion-icon :icon="personCircleOutline" />
        </div>

        <p v-if="authFirstName || authLastName" class="auth-name">
          {{ authFirstName }} {{ authLastName }}
        </p>

        <p class="subtitle">
          Complete your profile to personalize your learning experience
        </p>

        <!-- FORM -->
        <form class="form" @submit.prevent="handleSaveProfile">

          <!-- GENDER -->
          <div class="field">
            <label>Gender</label>
            <ion-select
              v-model="gender"
              :class="{ invalid: errors.gender }"
              placeholder="Select gender"
              @ionChange="clearError('gender')"
            >
              <ion-select-option value="male">Male</ion-select-option>
              <ion-select-option value="female">Female</ion-select-option>
              <ion-select-option value="other">Other</ion-select-option>
            </ion-select>
            <p v-if="errors.gender" class="field-error">{{ errors.gender }}</p>
          </div>

          <!-- PHONE -->
          <div class="field">
            <label>Telephone</label>
            <ion-input
              v-model="phone"
              :class="{ invalid: errors.phone }"
              type="tel"
              placeholder="+256..."
              @ionInput="clearError('phone')"
            />
            <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
          </div>

          <!-- ADDRESS -->
          <div class="field">
            <label>Address</label>
            <ion-textarea
              v-model="address"
              :class="{ invalid: errors.address }"
              placeholder="Your location"
              :auto-grow="true"
              @ionInput="clearError('address')"
            />
            <p v-if="errors.address" class="field-error">{{ errors.address }}</p>
          </div>

          <!-- ROLE -->
          <div class="field role-field">
            <label>I am a</label>
            <ion-radio-group v-model="role" @ionChange="clearError('role')">
              <div class="role-options">
                <label
                  v-for="option in roleOptions"
                  :key="option.value"
                  class="role-option"
                  :class="{ selected: role === option.value, invalid: errors.role }"
                >
                  <div class="role-option-main">
                    <ion-icon :icon="option.icon" class="role-icon" />
                    <span class="role-label">{{ option.label }}</span>
                  </div>
                  <ion-radio :value="option.value" />
                </label>
              </div>
            </ion-radio-group>
            <p v-if="errors.role" class="field-error">{{ errors.role }}</p>
          </div>

          <p v-if="formError" class="field-error form-error">{{ formError }}</p>

          <!-- SAVE -->
          <SubmitButton title="Save Profile" :loading="loading" />

        </form>

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
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonRadioGroup,
  IonRadio
} from '@ionic/vue'

import {
  chevronBackOutline,
  personCircleOutline,
  schoolOutline,
  personOutline,
  peopleOutline
} from 'ionicons/icons'
import { supabase } from '@/database/database'
import SubmitButton from '@/components/SubmitButton.vue'
import { saveRoleSession } from '@/utils/roleSession'
import { saveUserSession } from '@/utils/userSession'

const router = useRouter()

// Auth user details pre-filled from Supabase metadata
const authFirstName = ref('')
const authLastName  = ref('')

// Form fields
const role    = ref('')
const gender  = ref('')
const phone   = ref('')
const address = ref('')

// UI state
const loading   = ref(false)
const formError = ref('')

// Available role choices rendered as radio cards
const roleOptions = [
  { label: 'Student', value: 'student', icon: schoolOutline },
  { label: 'Teacher', value: 'teacher', icon: personOutline },
  { label: 'Parent',  value: 'parent',  icon: peopleOutline }
]

// Per-field validation error messages
const errors = ref({
  role:    '',
  gender:  '',
  phone:   '',
  address: ''
})

// Load the signed-in user's name and email from Supabase auth metadata
onMounted(async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Failed to load auth user:', error)
    return
  }

  const metadata = data.user?.user_metadata || {}
  authFirstName.value = metadata.first_name || ''
  authLastName.value  = metadata.last_name || metadata.surname || ''
})

// Clear a single field error when the user starts editing it
function clearError(field) {
  errors.value[field] = ''
  formError.value = ''
}

// Validate all form fields and populate errors; returns true if the form is valid
function validateProfileForm() {
  const nextErrors = {
    role:    '',
    gender:  '',
    phone:   '',
    address: ''
  }

  const trimmedPhone   = phone.value.trim()
  const trimmedAddress = address.value.trim()
  const phoneDigits    = trimmedPhone.replace(/\D/g, '')

  if (!role.value)    nextErrors.role    = 'Role is required.'
  if (!gender.value)  nextErrors.gender  = 'Gender is required.'

  if (!trimmedPhone) {
    nextErrors.phone = 'Telephone is required.'
  } else if (phoneDigits.length < 10) {
    nextErrors.phone = 'Enter a valid telephone number.'
  }

  if (!trimmedAddress) nextErrors.address = 'Address is required.'

  errors.value = nextErrors
  return !Object.values(nextErrors).some(Boolean)
}

// Save profile to Supabase, persist session, then route based on role
async function handleSaveProfile() {
  if (!validateProfileForm()) return

  loading.value   = true
  formError.value = ''

  try {
    // Re-fetch auth user to get the latest metadata at submit time
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error

    const user              = data.user
    const metadata          = user?.user_metadata || {}
    const derivedFirstName  = metadata.first_name || authFirstName.value
    const derivedLastName   = metadata.last_name || metadata.surname || authLastName.value
    const derivedEmail      = user?.email || ''

    // Guard against accounts with incomplete name metadata
    if (!derivedEmail || !derivedFirstName || !derivedLastName) {
      formError.value = 'Your account name details are missing. Please sign in again.'
      return
    }

    // Upsert the profile row and retrieve its internal id for session storage
    const { data: profileData, error: profileError } = await supabase
      .from('profile')
      .upsert({
        uuid:       user.id,
        email:      derivedEmail,
        first_name: derivedFirstName,
        last_name:  derivedLastName,
        role:       role.value,
        gender:     gender.value,
        telephone:  phone.value.trim(),
        address:    address.value.trim()
      })
      .select('id')
      .limit(1)

    if (profileError) throw profileError

    // Persist the profile id and role locally for downstream pages
    if (profileData?.[0]?.id) await saveUserSession(profileData[0].id)
    await saveRoleSession(role.value)

    // Students need to fill in academic details before reaching the dashboard
    if (role.value === 'student') {
      router.push('/create-student-details')
    } else {
      router.replace('/tabs/tab1')
    }
  } catch (error) {
    console.error('Failed to save profile:', error)
    formError.value = error?.message || 'Unable to save profile. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* PAGE */
.profile-page {
  --background: #ffffff;
}

/* HEADER */
.header,
.toolbar {
  --background: #ffffff;
  box-shadow: none !important;
  border: none !important;
}

.title {
  font-size: 17px;
  font-weight: 600;
  color: #2b2b2b;
}

/* CONTAINER */
.container {
  padding: 24px;
}

/* AVATAR */
.avatar {
  width: 92px;
  height: 92px;

  margin: 10px auto 14px;

  border-radius: 28px;

  background: #f7f3ee;

  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar ion-icon {
  font-size: 44px;
  color: #b59a7a;
}

.auth-name {
  margin: 0 0 10px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #2b2b2b;
}

/* SUBTITLE */
.subtitle {
  text-align: center;
  font-size: 13px;
  color: #7a7a7a;
  margin-bottom: 22px;
  padding: 0 10px;
}

/* FORM */
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* FIELD */
.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.role-field {
  margin-top: 6px;
  padding-top: 18px;
  border-top: 1px solid #f0ebe5;
}

/* ROLE OPTIONS */
.role-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.role-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 14px 12px;
  border: 1px solid #f0ebe5;
  border-radius: 14px;
  background: #ffffff;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.role-option.selected {
  border-color: #b59a7a;
  background: #fcfaf7;
}

.role-option.invalid {
  border-color: #d96a6a;
}

.role-option-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.role-icon {
  font-size: 20px;
  color: #b59a7a;
}

.role-label {
  font-size: 13px;
  font-weight: 600;
  color: #2b2b2b;
}

label {
  font-size: 12px;
  font-weight: 600;
  color: #8a8a8a;
  text-transform: capitalize;
}

/* INPUTS */
ion-input,
ion-textarea,
ion-select {
  --padding-start: 12px;
  --padding-end: 12px;
  --highlight-height: 0;

  border: 1px solid #f0ebe5;
  border-radius: 14px;

  background: #ffffff;

  font-size: 14px;
  color: #2b2b2b;
}

ion-input.invalid,
ion-textarea.invalid,
ion-select.invalid {
  border-color: #d96a6a;
}

ion-radio {
  --color: #d7cec4;
  --color-checked: #b59a7a;
}

.field-error {
  margin: 0;
  font-size: 12px;
  color: #d96a6a;
}

.form-error {
  margin-top: 4px;
  text-align: center;
}

</style>
