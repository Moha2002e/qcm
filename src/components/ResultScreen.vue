<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  results: {
    type: Array, // [{ question: Object, userAnswer: Number (index), isCorrect: Boolean }]
    required: true
  },
  hasNextChunk: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['next-chunk', 'restart'])

const percentage = computed(() => Math.round((props.score / props.total) * 100))
const gradeColor = computed(() => {
  if (percentage.value >= 80) return '#10b981' // Green
  if (percentage.value >= 50) return '#f59e0b' // Orange
  return '#ef4444' // Red
})
</script>

<template>
  <div class="glass-panel result-card">
    <div class="score-section">
      <div class="score-circle" :style="{ borderColor: gradeColor }">
        <span class="score-number" :style="{ color: gradeColor }">{{ score }}/{{ total }}</span>
        <span class="score-label">Score</span>
      </div>
      <h2 class="feedback-text">
        <span v-if="percentage >= 80">Excellent! 🎉</span>
        <span v-else-if="percentage >= 50">Bien joué! 👍</span>
        <span v-else>Continuez vos efforts! 💪</span>
      </h2>
    </div>

    <div class="review-section">
      <h3>Révision</h3>
      <div class="review-list">
        <div 
          v-for="(item, idx) in results" 
          :key="item.question.id"
          class="review-item glass-panel"
          :class="{ 'correct': item.isCorrect, 'incorrect': !item.isCorrect }"
        >
          <div class="review-header">
            <span class="q-num">#{{ idx + 1 }}</span>
            <span class="status-icon">{{ item.isCorrect ? '✅' : '❌' }}</span>
          </div>
          <p class="review-q">{{ item.question.question }}</p>
          
          <div v-if="!item.isCorrect" class="correction">
            <div class="your-answer">
              <span class="label">Votre réponse:</span>
              <span class="text">{{ item.question.options[item.userAnswer] || 'Aucune' }}</span>
            </div>
            <div class="correct-answer">
              <span class="label">Réponse correcte:</span>
              <span class="text">{{ item.question.options[item.question.correctAnswer] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="btn secondary" @click="$emit('retry-chunk')">
        Refaire la série
      </button>
      <button v-if="hasNextChunk" class="btn" @click="$emit('next-chunk')">
        Série Suivante
      </button>
      <button v-else class="btn" @click="$emit('restart')">
        Recommencer Tout
      </button>
    </div>
  </div>
</template>

<style scoped>
.result-card {
  width: 100%;
  max-width: 800px;
  animation: fadeIn 0.8s ease;
  text-align: center;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.score-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
}

.score-circle {
  width: 150px;
  height: 150px;
  border: 4px solid;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 30px rgba(0,0,0,0.3);
  background: rgba(255,255,255,0.05);
}

.score-number {
  font-size: 2.5rem;
  font-weight: 700;
}

.score-label {
  font-size: 0.9rem;
  opacity: 0.7;
}

.feedback-text {
  font-size: 1.8rem;
  margin: 0;
}

.review-section {
  text-align: left;
  margin-bottom: 2rem;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px; /* Scrollable review */
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Scrollbar styling */
.review-list::-webkit-scrollbar {
  width: 8px;
}
.review-list::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.05);
  border-radius: 4px;
}
.review-list::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
}

.review-item {
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255,255,255,0.03);
}

.review-item.correct {
  border-left: 4px solid var(--success-color);
}

.review-item.incorrect {
  border-left: 4px solid var(--error-color);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.q-num {
  font-weight: bold;
  opacity: 0.6;
}

.review-q {
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.correction {
  font-size: 0.95rem;
  background: rgba(0,0,0,0.2);
  padding: 0.8rem;
  border-radius: 8px;
}

.your-answer, .correct-answer {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.your-answer { color: var(--error-color); }
.correct-answer { color: var(--success-color); }

.label { font-weight: bold; }

.actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
