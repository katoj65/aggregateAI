<template>
  <ion-page>
    <ion-header class="header ion-no-border">
      <ion-toolbar class="toolbar">
        <ion-buttons slot="start">
          <ion-button class="header-btn" @click="router.back()">
            <ion-icon :icon="arrowBackOutline" />
          </ion-button>
        </ion-buttons>

        <ion-buttons slot="end">
          <div class="header-logo">
            <ion-icon :icon="sparklesOutline" class="header-logo-icon" />
          </div>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="forgot-content">
      <div class="wrap">
        <div class="brand">
          <h1 class="brand-name">Reset password</h1>
          <p class="brand-sub">Enter your email and we'll send you a password reset link.</p>
        </div>

        <form class="form" @submit.prevent="handleForgotPassword">
          <div class="field">
            <label class="field-label">Email address</label>
            <div class="input-wrap" :class="{ invalid: emailError }">
              <ion-icon :icon="mailOutline" class="input-icon" />
              <input
                v-model="email"
                type="email"
                class="input"
                placeholder="you@example.com"
                autocomplete="email"
                @input="clearMessages"
              />
            </div>
            <p v-if="emailError" class="field-error">{{ emailError }}</p>
          </div>

          <p v-if="formError" class="form-error">{{ formError }}</p>
          <p v-if="successMessage" class="form-success">{{ successMessage }}</p>

          <SubmitButton title="Send Reset Link" :loading="loading" />
        </form>

        <p class="switch-text">
          Remembered your password?
          <button class="switch-link" @click="router.push('/login')">Back to login</button>
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon
} from '@ionic/vue';
import { arrowBackOutline, sparklesOutline, mailOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import SubmitButton from '@/components/SubmitButton.vue';
import { supabase } from '@/database/database';

const router = useRouter();
const email = ref('');
const emailError = ref('');
const formError = ref('');
const successMessage = ref('');
const loading = ref(false);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clearMessages() {
  emailError.value = '';
  formError.value = '';
  successMessage.value = '';
}

function validateEmail() {
  const trimmedEmail = email.value.trim();

  if (!trimmedEmail) {
    emailError.value = 'Email address is required.';
    return null;
  }

  if (!emailPattern.test(trimmedEmail)) {
    emailError.value = 'Enter a valid email address.';
    return null;
  }

  emailError.value = '';
  return trimmedEmail;
}

async function handleForgotPassword() {
  clearMessages();

  const trimmedEmail = validateEmail();
  if (!trimmedEmail) {
    return;
  }

  loading.value = true;

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: `${window.location.origin}/login`
    });

    if (error) {
      throw error;
    }

    successMessage.value = 'Password reset link sent. Check your email inbox.';
  } catch (error) {
    console.error('Forgot password failed:', error);
    formError.value = error?.message || 'Unable to send reset email. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.header,
.toolbar {
  --background: #FFFFFF;
  box-shadow: none !important;
  border: none !important;
}

.forgot-content { --background: #FFFFFF; --padding-start: 0; --padding-end: 0; }

.wrap {
  padding: 20px 24px 40px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-btn {
  --background: #F5F5F5;
  --color: #333333;
  --border-radius: 999px;
  --padding-start: 0;
  --padding-end: 0;
  width: 38px;
  height: 38px;
  min-width: 38px;
  margin-inline-start: 8px;
}

.header-btn::part(native) {
  width: 38px;
  height: 38px;
  border-radius: 999px;
}

.header-logo {
  width: 38px;
  height: 38px;
  margin-inline-end: 12px;
  border-radius: 12px;
  background: #FBF8F4;
  border: 0.5px solid #E0D8D0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-logo-icon {
  font-size: 18px;
  color: #A98B6A;
}

.brand { margin-bottom: 36px; }
.brand-name { font-size: 26px; font-weight: 800; color: #1C1C1C; margin: 0 0 6px; }
.brand-sub  { font-size: 14px; color: #777; margin: 0; }

.form { display: flex; flex-direction: column; gap: 18px; }

.field { display: flex; flex-direction: column; gap: 7px; }
.field-label { font-size: 13px; font-weight: 600; color: #444; }

.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0.5px solid #D0D0D0;
  border-radius: 14px;
  padding: 13px 14px;
  background: #FFFFFF;
  transition: border-color 0.15s ease;
}

.input-wrap:focus-within { border-color: #A98B6A; }
.input-wrap.invalid,
.input-wrap.invalid:focus-within { border-color: #D96A6A; }

.input-icon { font-size: 17px; color: #AAAAAA; flex-shrink: 0; }

.input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #1C1C1C;
  background: transparent;
}

.input::placeholder { color: #BBBBBB; }

.field-error,
.form-error {
  margin: 0;
  font-size: 12px;
  color: #D96A6A;
}

.form-success {
  margin: 0;
  font-size: 12px;
  color: #5BAD73;
}

.switch-text { font-size: 14px; color: #666; text-align: center; margin: 24px 0 0; }
.switch-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  font-weight: 700;
  color: #A98B6A;
  cursor: pointer;
}
</style>
