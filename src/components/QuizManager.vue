<script setup>
import { ref, computed, onMounted } from 'vue'
import rawQuestions from '../data/questions.json'
import QuestionCard from './QuestionCard.vue'
import ResultScreen from './ResultScreen.vue'

// Constants
const CHUNK_SIZE = 20

// State
const allQuestions = ref([])
const currentChunkIndex = ref(0)
const currentQuestionIndex = ref(0) // 0 to CHUNK_SIZE - 1
const userAnswers = ref([]) // Array of objects for current chunk
const quizState = ref('intro') // 'intro', 'playing', 'result'
const totalScore = ref(0) 

// Review data
const chunkResults = ref([])

onMounted(() => {
  initializeQuiz()
})

function initializeQuiz() {
  allQuestions.value = [...rawQuestions]
}

const totalSeries = computed(() => {
  return Math.ceil(allQuestions.value.length / CHUNK_SIZE)
})

const currentChunkQuestions = computed(() => {
  const start = currentChunkIndex.value * CHUNK_SIZE
  return allQuestions.value.slice(start, start + CHUNK_SIZE)
})

const currentQuestion = computed(() => {
  return currentChunkQuestions.value[currentQuestionIndex.value]
})

const progress = computed(() => {
  return currentQuestionIndex.value + 1
})

const hasNextChunk = computed(() => {
  return (currentChunkIndex.value + 1) * CHUNK_SIZE < allQuestions.value.length
})

// Actions
function startQuiz(seriesIndex = 0) {
  currentChunkIndex.value = seriesIndex
  startChunk()
}

function startChunk() {
  currentQuestionIndex.value = 0
  userAnswers.value = []
  chunkResults.value = []
  quizState.value = 'playing'
}

function handleAnswer(answerIndex) {
  const question = currentQuestion.value
  const isCorrect = answerIndex === question.correctAnswer
  
  // Record result
  chunkResults.value.push({
    question: question,
    userAnswer: answerIndex,
    isCorrect: isCorrect
  })

  // Next question or finish
  if (currentQuestionIndex.value < currentChunkQuestions.value.length - 1) {
    currentQuestionIndex.value++
  } else {
    finishChunk()
  }
}

function finishChunk() {
  quizState.value = 'result'
}

function nextChunk() {
  currentChunkIndex.value++
  startChunk()
}

function restartQuiz() {
  quizState.value = 'intro'
  initializeQuiz() // Optional reload
}

const chunkScore = computed(() => {
  return chunkResults.value.filter(r => r.isCorrect).length
})

</script>

<template>
  <div class="quiz-manager">
    
    <!-- Intro Screen -->
    <div v-if="quizState === 'intro'" class="glass-panel intro-card">
      <h1 class="title">1QCM<span class="highlight">'OK</span></h1>
      <p class="subtitle">Testez vos connaissances .NET & EF Core</p>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="icon">❓</span>
          <span>{{ allQuestions.length }} Questions</span>
        </div>
        <div class="info-item">
          <span class="icon">📚</span>
          <span>{{ totalSeries }} Séries</span>
        </div>
      </div>
      
      <div class="series-selection">
        <h3>Choisissez votre série :</h3>
        <div class="series-grid">
          <button 
            v-for="i in totalSeries" 
            :key="i" 
            class="btn series-btn" 
            @click="startQuiz(i - 1)"
          >
            Série {{ i }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quiz Playing -->
    <transition name="fade" mode="out-in">
      <QuestionCard
        v-if="quizState === 'playing'"
        :key="currentQuestion.id"
        :question="currentQuestion"
        :question-number="progress"
        :total-questions="currentChunkQuestions.length"
        @answer="handleAnswer"
      />
    </transition>

    <!-- Result Screen -->
    <transition name="slide-up">
      <ResultScreen
        v-if="quizState === 'result'"
        :score="chunkScore"
        :total="currentChunkQuestions.length"
        :results="chunkResults"
        :has-next-chunk="hasNextChunk"
        @next-chunk="nextChunk"
        @retry-chunk="startChunk"
        @restart="restartQuiz"
      />
    </transition>

  </div>
</template>

<style scoped>
.quiz-manager {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
}

.intro-card {
  text-align: center;
  max-width: 600px; /* Increased width for series grid */
  padding: 4rem 2rem;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.title {
  font-size: 4rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  letter-spacing: -2px;
  background: linear-gradient(135deg, #fff, #94a3b8);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.highlight {
  color: var(--accent-color);
  -webkit-text-fill-color: var(--accent-color);
}

.subtitle {
  font-size: 1.2rem;
  color: #94a3b8;
  margin-bottom: 3rem;
}

.info-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.icon {
  font-size: 2rem;
  background: rgba(255,255,255,0.1);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.series-selection {
  margin-top: 2rem;
}

.series-selection h3 {
  margin-bottom: 1.5rem;
  font-weight: 500;
  color: #e2e8f0;
}

.series-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.series-btn {
  font-size: 1.1rem;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.series-btn:hover {
  background: var(--accent-color);
  color: rgb(157, 12, 12);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
</style>
