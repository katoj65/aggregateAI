<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header class="ion-no-border">
      <ion-toolbar class="toolbar">
        <ion-buttons slot="start">
          <ion-button fill="clear" class="back-btn" @click="router.back()">
            <ion-icon slot="icon-only" :icon="chevronBackOutline" />
          </ion-button>
        </ion-buttons>

        <div class="toolbar-center">
          <div class="ai-avatar-sm">
            <ion-icon :icon="sparklesOutline" />
          </div>
          <div>
            <p class="toolbar-name">AI Tutor</p>
            <div class="online-row">
              <span class="online-dot" />
              <span class="online-text">Online</span>
            </div>
          </div>
        </div>

        <ion-buttons slot="end">
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <ion-button fill="clear" class="more-btn" @click="clearChat">
            <ion-icon slot="icon-only" :icon="trashOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- MESSAGES -->
    <ion-content class="page" ref="contentRef">
      <div class="messages-wrap">

        <!-- WELCOME -->
        <div v-if="messages.length === 0" class="welcome">
          <div class="welcome-icon">
            <ion-icon :icon="sparklesOutline" />
          </div>
          <h2 class="welcome-title">Hi, I'm your AI Tutor</h2>
          <p class="welcome-sub">Ask me anything about your subjects. I'll explain, guide and quiz you.</p>
        </div>

        <!-- SUGGESTION CHIPS -->
        <div v-if="messages.length === 0" class="chips-wrap">
          <button
            v-for="chip in suggestions"
            :key="chip.text"
            class="chip"
            @click="sendSuggestion(chip.text)"
          >
            <span class="chip-emoji">{{ chip.emoji }}</span>
            {{ chip.text }}
          </button>
        </div>

        <!-- MESSAGE LIST -->
        <div class="message-list">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="msg-row"
            :class="msg.role"
          >
            <!-- AI AVATAR -->
            <div v-if="msg.role === 'ai'" class="msg-avatar">
              <ion-icon :icon="sparklesOutline" />
            </div>

            <div class="bubble-wrap">
              <div class="bubble" :class="msg.role">
                {{ msg.text }}
              </div>
              <p class="msg-time">{{ msg.time }}</p>
            </div>
          </div>

          <!-- TYPING INDICATOR -->
          <div v-if="isTyping" class="msg-row ai">
            <div class="msg-avatar">
              <ion-icon :icon="sparklesOutline" />
            </div>
            <div class="bubble ai typing">
              <span class="dot" />
              <span class="dot" />
              <span class="dot" />
            </div>
          </div>
        </div>

      </div>
    </ion-content>

    <!-- INPUT BAR -->
    <div class="input-bar">
      <div class="input-wrap">
        <input
          v-model="inputText"
          class="input-field"
          placeholder="Ask your AI tutor…"
          @keydown.enter="sendMessage"
        />
        <button
          class="send-btn"
          :class="{ active: inputText.trim() }"
          :disabled="!inputText.trim()"
          @click="sendMessage"
        >
          <ion-icon :icon="arrowUpOutline" />
        </button>
      </div>
    </div>

  </ion-page>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/vue'

import {
  chevronBackOutline,
  sparklesOutline,
  arrowUpOutline,
  trashOutline
} from 'ionicons/icons'

const router = useRouter()
const contentRef = ref(null)
const inputText = ref('')
const isTyping = ref(false)
const messages = ref([])

const suggestions = [
  { emoji: '📐', text: 'Explain quadratic equations' },
  { emoji: '🧬', text: 'Summarise cell division'      },
  { emoji: '⚗️', text: 'What is ionic bonding?'       },
  { emoji: '📝', text: 'Give me a quick quiz'          }
]

const aiReplies = {
  'Explain quadratic equations':
    'A quadratic equation is ax² + bx + c = 0. It forms a parabola when graphed. You can solve it by factoring, completing the square, or using the quadratic formula: x = (−b ± √(b²−4ac)) / 2a.',
  'Summarise cell division':
    'Cell division includes mitosis (producing 2 identical daughter cells for growth/repair) and meiosis (producing 4 genetically unique cells for reproduction). Key phases: Prophase → Metaphase → Anaphase → Telophase.',
  'What is ionic bonding?':
    'Ionic bonding occurs when one atom transfers electrons to another, creating oppositely charged ions that attract. Example: Na⁺ and Cl⁻ form NaCl (table salt).',
  'Give me a quick quiz':
    'Here\'s Q1: What is the powerhouse of the cell?\nA) Nucleus  B) Mitochondria  C) Ribosome  D) Golgi Apparatus\nType your answer!'
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  messages.value.push({ role: 'user', text, time: getTime() })
  inputText.value = ''
  await scrollToBottom()

  isTyping.value = true
  await new Promise(r => setTimeout(r, 1200))
  isTyping.value = false

  const reply = aiReplies[text] || 'Great question! Let me think about that… In the meantime, try breaking the problem into smaller parts and I\'ll guide you step by step.'
  messages.value.push({ role: 'ai', text: reply, time: getTime() })
  await scrollToBottom()
}

async function sendSuggestion(text) {
  inputText.value = text
  await sendMessage()
}

function clearChat() {
  messages.value = []
}

async function scrollToBottom() {
  await nextTick()
  const el = contentRef.value?.$el
  if (el) el.scrollToBottom(300)
}
</script>

<style scoped>
.page {
  --background: #F5F6FA;
}

/* HEADER */
.toolbar {
  --background: #ffffff;
  --border-width: 0;
  border-bottom: 1px solid #F1F3F6;
}

.back-btn,
.more-btn {
  --color: #1A1A2E;
}

.toolbar-center {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

.ai-avatar-sm {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: linear-gradient(135deg, #1A1A2E, #2D3561);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #c7d0ff;
  flex-shrink: 0;
}

.toolbar-name {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1A1A2E;
}

.online-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.online-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10B981;
}

.online-text {
  font-size: 11px;
  color: #10B981;
  font-weight: 600;
}

/* MESSAGES WRAP */
.messages-wrap {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;
}

/* WELCOME */
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 20px 8px;
  gap: 10px;
}

.welcome-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: linear-gradient(135deg, #1A1A2E, #2D3561);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #c7d0ff;
}

.welcome-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1A1A2E;
}

.welcome-sub {
  margin: 0;
  font-size: 13px;
  color: #9CA3AF;
  line-height: 1.6;
  max-width: 260px;
}

/* CHIPS */
.chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding: 4px 0;
}

.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1.5px solid #E5E7EB;
  background: #ffffff;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}

.chip:active {
  background: #EEF2FF;
  border-color: #4F63D2;
  color: #4F63D2;
}

.chip-emoji {
  font-size: 15px;
}

/* MESSAGE LIST */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.msg-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.msg-row.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1A1A2E, #2D3561);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #c7d0ff;
  flex-shrink: 0;
}

.bubble-wrap {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-width: 78%;
}

.msg-row.user .bubble-wrap {
  align-items: flex-end;
}

.bubble {
  padding: 12px 15px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.55;
  white-space: pre-wrap;
}

.bubble.ai {
  background: #ffffff;
  color: #1A1A2E;
  border-radius: 4px 18px 18px 18px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.bubble.user {
  background: #4F63D2;
  color: #ffffff;
  border-radius: 18px 18px 4px 18px;
}

.msg-time {
  margin: 0;
  font-size: 10px;
  color: #9CA3AF;
  padding: 0 4px;
}

/* TYPING INDICATOR */
.bubble.typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 14px 18px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #9CA3AF;
  animation: bounce 1.2s infinite ease-in-out;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%            { transform: translateY(-6px); opacity: 1; }
}

/* INPUT BAR */
.input-bar {
  background: #ffffff;
  border-top: 1px solid #F1F3F6;
  padding: 10px 16px 10px;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #F5F6FA;
  border: 1.5px solid #E5E7EB;
  border-radius: 999px;
  padding: 8px 8px 8px 16px;
  transition: border-color 0.15s;
}

.input-wrap:focus-within {
  border-color: #4F63D2;
}

.input-field {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #1A1A2E;
}

.input-field::placeholder {
  color: #9CA3AF;
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #E5E7EB;
  color: #9CA3AF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.send-btn.active {
  background: #4F63D2;
  color: #ffffff;
}

.send-btn:disabled {
  cursor: not-allowed;
}
</style>
