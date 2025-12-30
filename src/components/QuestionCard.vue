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

const emit = defineEmits(['answer', 'next'])

const selectedIndices = ref([])
const isAnswered = ref(false)

// Determine the correct answers as a set for easy lookup
const correctAnswersSet = computed(() => {
  if (!props.question) return new Set()
  // Support both single value and array in JSON
  const correct = props.question.correctAnswer
  if (Array.isArray(correct)) {
    return new Set(correct)
  }
  return new Set([correct])
})

// Shuffle options when question changes
watch(() => props.question, (newQ) => {
  if (!newQ || !newQ.options) {
    shuffledOptions.value = []
    return
  }
  selectedIndices.value = []
  isAnswered.value = false
  const optionsWithIndex = newQ.options.map((opt, index) => ({ text: opt, originalIndex: index }))
  // Fisher-Yates shuffle
  for (let i = optionsWithIndex.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
  }
  shuffledOptions.value = optionsWithIndex
}, { immediate: true })

const toggleOption = (originalIndex) => {
  if (isAnswered.value) return
  
  const idx = selectedIndices.value.indexOf(originalIndex)
  if (idx === -1) {
    selectedIndices.value.push(originalIndex)
  } else {
    selectedIndices.value.splice(idx, 1)
  }
}

const submitAnswer = () => {
    isAnswered.value = true
    emit('answer', [...selectedIndices.value])
}

const isCorrect = (index) => {
    return correctAnswersSet.value.has(index)
}

const isFullCorrect = computed(() => {
    // Check if selected indices match exactly the correct answer set
    if (selectedIndices.value.length !== correctAnswersSet.value.size) return false
    return selectedIndices.value.every(idx => correctAnswersSet.value.has(idx))
})

const correctAnswersText = computed(() => {
    if (!props.question || !props.question.options) return ''
    const correctIndices = Array.from(correctAnswersSet.value).sort()
    // Find these indices in the SHUFFLED options to get the correct text?
    // Wait, shuffledOptions has { text, originalIndex }.
    // We essentially want the TEXT. 
    // We can get text from props.question.options using originalIndex.
    return correctIndices.map(i => props.question.options[i]).join(', ')
})

const nextQuestion = () => {
  emit('next')
}
</script>

<template>

  <div class="glass-panel question-card">
    <h2 class="question-text">{{ question.question }}</h2>

    <div class="options-grid">
      <button 
        v-for="(opt, idx) in shuffledOptions" 
        :key="idx"
        class="option-btn glass-panel"
        :class="{ 
          'selected': selectedIndices.includes(opt.originalIndex),
          'correct': isAnswered && isCorrect(opt.originalIndex),
          'wrong': isAnswered && selectedIndices.includes(opt.originalIndex) && !isCorrect(opt.originalIndex),
          'dim': isAnswered && !selectedIndices.includes(opt.originalIndex) && !isCorrect(opt.originalIndex)
        }"
        :disabled="isAnswered"
        @click="toggleOption(opt.originalIndex)"
      >
        <span class="option-letter">{{ String.fromCharCode(65 + idx) }}</span>
        <span class="option-text">{{ opt.text }}</span>
        <span v-if="isAnswered && isCorrect(opt.originalIndex)" class="icon-status">✓</span>
        <span v-if="isAnswered && selectedIndices.includes(opt.originalIndex) && !isCorrect(opt.originalIndex)" class="icon-status">✗</span>
      </button>
    </div>

    <div class="actions-bar">
        <!-- New Validation Button -->
        <button v-if="!isAnswered" class="btn-validate" @click="submitAnswer" :disabled="selectedIndices.length === 0">
            Valider la réponse
        </button>

        <div v-else class="feedback-container">
            <div class="feedback-msg" :class="isFullCorrect ? 'msg-correct' : 'msg-wrong'">
                <span v-if="isFullCorrect">Correct !</span>
                <span v-else>
                    Incorrect... <br>
                    <small>La bonne réponse était : {{ correctAnswersText }}</small>
                </span>
            </div>
            <button class="btn-next" @click="nextQuestion">
                Question Suivante →
            </button>
        </div>
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

.option-btn.correct {
  background: rgba(34, 197, 94, 0.2) !important;
  border-color: #22c55e !important;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.3);
}

.option-btn.correct .option-letter {
    background: #22c55e;
    color: white;
}

.option-btn.wrong {
  background: rgba(239, 68, 68, 0.2) !important;
  border-color: #ef4444 !important;
}

.option-btn.wrong .option-letter {
    background: #ef4444;
    color: white;
}

.option-btn.dim {
    opacity: 0.5;
}

.icon-status {
    margin-left: auto;
    font-weight: bold;
    font-size: 1.2rem;
}

.actions-bar {
    margin-top: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.btn-validate {
    background: var(--accent-color);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-validate:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
}

.btn-validate:disabled {
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.3);
    cursor: not-allowed;
    box-shadow: none;
}

.feedback-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
}

.feedback-msg {
    flex-grow: 1;
    font-size: 1.2rem;
    font-weight: bold;
}

.msg-correct { color: #4ade80; }
.msg-wrong { color: #f87171; }

.btn-next {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
}

.btn-next:hover {
    background: rgba(255, 255, 255, 0.2);
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
@media (max-width: 600px) {
  .question-text {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }
  
  .option-btn {
    padding: 1rem;
    font-size: 0.95rem;
  }
  
  .option-letter {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
}
</style>
