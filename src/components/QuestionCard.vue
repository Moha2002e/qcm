<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['answer'])

const shuffledOptions = ref([])
const selectedOptionOriginalIndex = ref(null)

// Shuffle options when question changes
watch(() => props.question, (newQ) => {
  if (!newQ || !newQ.options) {
    shuffledOptions.value = []
    return
  }
  selectedOptionOriginalIndex.value = null
  const optionsWithIndex = newQ.options.map((opt, index) => ({ text: opt, originalIndex: index }))
  // Fisher-Yates shuffle
  for (let i = optionsWithIndex.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
  }
  shuffledOptions.value = optionsWithIndex
}, { immediate: true })

const selectOption = (originalIndex) => {
  selectedOptionOriginalIndex.value = originalIndex
  // Small delay for visual feedback before emitting
  setTimeout(() => {
    emit('answer', originalIndex)
  }, 400)
}
</script>

<template>
  <div class="glass-panel question-card">
    <div class="header">
      <span class="badge">Question {{ questionNumber }} / {{ totalQuestions }}</span>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${(questionNumber / totalQuestions) * 100}%` }"></div>
      </div>
    </div>

    <h2 class="question-text">{{ question.question }}</h2>

    <div class="options-grid">
      <button 
        v-for="(opt, idx) in shuffledOptions" 
        :key="idx"
        class="option-btn glass-panel"
        :class="{ 'selected': selectedOptionOriginalIndex === opt.originalIndex }"
        @click="selectOption(opt.originalIndex)"
      >
        <span class="option-letter">{{ String.fromCharCode(65 + idx) }}</span>
        <span class="option-text">{{ opt.text }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  width: 100%;
  max-width: 700px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header {
  margin-bottom: 2rem;
}

.badge {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-color), #c084fc);
  transition: width 0.5s ease;
}

.question-text {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
  line-height: 1.4;
}

.options-grid {
  display: grid;
  gap: 1rem;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-color);
}

.option-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.option-btn.selected {
  background: var(--accent-color);
  border-color: var(--accent-color);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
}

.option-letter {
  background: rgba(255, 255, 255, 0.1);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
  flex-shrink: 0;
}

.option-text {
  font-size: 1.1rem;
}
</style>
