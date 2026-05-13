<template>
  <ion-page>
    <ion-content :fullscreen="true" class="page">

      <!-- BACKGROUND ORBS -->
      <div class="orb orb-1" />
      <div class="orb orb-2" />

      <div class="container">

        <!-- TOP SPACER -->
        <div class="spacer" />

        <!-- BRAND -->
        <section class="brand">
          <div class="app-icon">
            <ion-icon :icon="sparklesOutline" class="app-icon-glyph" />
          </div>
          <h1 class="app-name">AggregateAI</h1>
          <p class="app-tagline">Smart learning for Uganda's curriculum — powered by AI</p>
        </section>

        <!-- FEATURES -->
        <div class="features">
          <div class="feature-row">
            <div class="feature-icon indigo">
              <ion-icon :icon="sparklesOutline" />
            </div>
            <div>
              <p class="feature-title">AI Tutor</p>
              <p class="feature-desc">Ask questions, get instant explanations</p>
            </div>
          </div>
          <div class="feature-row">
            <div class="feature-icon green">
              <ion-icon :icon="bookOutline" />
            </div>
            <div>
              <p class="feature-title">Practice & Revise</p>
              <p class="feature-desc">Quizzes and exercises for every subject</p>
            </div>
          </div>
          <div class="feature-row">
            <div class="feature-icon orange">
              <ion-icon :icon="trendingUpOutline" />
            </div>
            <div>
              <p class="feature-title">Track Progress</p>
              <p class="feature-desc">See your growth across all subjects</p>
            </div>
          </div>
        </div>

        <!-- ACTIONS -->
        <section class="actions">
          <SubmitButton title="Get Started" :loading="false" @click="router.push('/register')" />
          <button class="login-link" @click="router.push('/login')">
            Already have an account? <strong>Login</strong>
          </button>
        </section>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonContent, IonIcon } from '@ionic/vue'
import { sparklesOutline, bookOutline, trendingUpOutline } from 'ionicons/icons'
import { useRouter } from 'vue-router'
import SubmitButton from '@/components/SubmitButton.vue'

const router = useRouter()
</script>

<style scoped>
.page {
  --background: #ffffff;
}

/* ORBS */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}

.orb-1 {
  width: 280px;
  height: 280px;
  background: rgba(79, 99, 210, 0.1);
  top: -80px;
  right: -80px;
}

.orb-2 {
  width: 240px;
  height: 240px;
  background: rgba(16, 185, 129, 0.07);
  bottom: -60px;
  left: -60px;
}

/* CONTAINER */
.container {
  position: relative;
  z-index: 1;
  min-height: 100%;
  padding: 0 28px 48px;
  display: flex;
  flex-direction: column;
}

.spacer {
  flex: 1;
  min-height: 60px;
}

/* BRAND */
.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
  margin-bottom: 52px;
}

.app-icon {
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: linear-gradient(135deg, #1A1A2E, #2D3561);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16px 40px rgba(26, 26, 46, 0.22);
}

.app-icon-glyph {
  font-size: 36px;
  color: #c7d0ff;
}

.app-name {
  margin: 0;
  font-size: 36px;
  font-weight: 900;
  color: #1A1A2E;
  letter-spacing: -1px;
  line-height: 1;
}

.app-tagline {
  margin: 0;
  font-size: 15px;
  color: #6B7280;
  line-height: 1.55;
  max-width: 260px;
}

/* FEATURES */
.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 52px;
}

.feature-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.feature-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.feature-icon.indigo { background: #EEF2FF; color: #4F63D2; }
.feature-icon.green  { background: #ECFDF5; color: #10B981; }
.feature-icon.orange { background: #FFF7ED; color: #F97316; }

.feature-title {
  margin: 0 0 2px;
  font-size: 15px;
  font-weight: 700;
  color: #1A1A2E;
}

.feature-desc {
  margin: 0;
  font-size: 13px;
  color: #9CA3AF;
}

/* ACTIONS */
.actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-link {
  background: none;
  border: none;
  font-size: 14px;
  color: #6B7280;
  text-align: center;
  cursor: pointer;
  padding: 0;
}

.login-link strong {
  color: #4F63D2;
  font-weight: 700;
}
</style>
