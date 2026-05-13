<template>
  <button type="submit" class="submit-button" :disabled="loading">
    <ion-spinner v-if="loading" name="crescent" class="spinner" />
    <span>{{ title }}</span>
  </button>
</template>

<script setup>
import { IonSpinner } from '@ionic/vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
})
</script>

<style scoped>
.submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-top: 4px;
  padding: 16px 20px;
  border: none;
  border-radius: 16px;
  background: #516051;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(81, 96, 81, 0.28);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.submit-button:active {
  transform: scale(0.97);
}

.submit-button:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  color: #ffffff;
}
</style>
