
<script setup>
import { ref, computed, onMounted } from 'vue'
import QuestionCard from './QuestionCard.vue'
import ResultScreen from './ResultScreen.vue'
import rawQuestions from '../data/questions.json'

// --- STATE ---
const currentPart = ref(1) // 1, 2, or 3
const chunkIndex = ref(0) // Index of chunk within the part

const allQuestions = ref([])
const currentChunkQuestions = ref([])
const userAnswers = ref({})
const currentQuestionIndex = ref(0)
const quizState = ref('intro') // intro, playing, result

// --- CONFIGURATION ---
// Part 1: 86 questions (IDs 1-86)
// Part 2: 25 questions (IDs 87-111)
// Part 3: 71 questions (IDs 112-182)
const partConfig = {
  1: { startId: 1, endId: 86, chunkSize: 20 },
  2: { startId: 87, endId: 111, chunkSize: 25 }, // One big chunk
  3: { startId: 112, endId: 182, chunkSize: 20 }
}

onMounted(() => {
  allQuestions.value = [...rawQuestions]
})

// --- ACTIONS ---

function startQuiz() {
  currentPart.value = 1
  chunkIndex.value = 0
  startChunk()
}

function startChunk() {
  const config = partConfig[currentPart.value]
  
  // Filter questions for the current part
  // Note: we rely on the 'part' property I added in build_full_data.js.
  // If 'part' is missing (e.g. older json), we might need fallback, but I rebuilt the JSON.
  // Fallback: use ID ranges
  const partQuestions = allQuestions.value.filter(q => {
      if (q.part) return q.part === currentPart.value
      // Fallback by ID if part prop missing (safety)
      return q.id >= config.startId && q.id <= config.endId
  })
  
  const startIndex = chunkIndex.value * config.chunkSize
  let endIndex = startIndex + config.chunkSize
  
  // --- CHUNKING LOGIC ---
  const remaining = partQuestions.length - startIndex
  
  if (currentPart.value === 1) {
      // Part 1 Special Rule: 4th series is 26 questions (the remainder)
      // Logic: If this is the 4th chunk (index 3), take everything.
      // Or if remaining questions are small enough to likely be the last chunk.
      // 20, 20, 20, 26.
      if (chunkIndex.value === 3 || remaining < (config.chunkSize + 5)) {
          endIndex = partQuestions.length
      }
  } else if (currentPart.value === 2) {
      // Part 2: All 25 questions in one go
      endIndex = partQuestions.length
  } else if (currentPart.value === 3) {
      // Part 3: 20, 20, 20, 11
      // If remaining is small (Last chunk), take all.
      if (remaining < config.chunkSize) {
          endIndex = partQuestions.length
      }
  }
  
  // Clamp to length
  endIndex = Math.min(endIndex, partQuestions.length)

  console.log(`Starting Part ${currentPart.value}, Chunk ${chunkIndex.value}. Indices: ${startIndex} to ${endIndex}. Total in part: ${partQuestions.length}`)

  currentChunkQuestions.value = partQuestions.slice(startIndex, endIndex)
  
  // Reset for new chunk
  currentQuestionIndex.value = 0
  userAnswers.value = {}
  quizState.value = 'playing'
}

function handleAnswer(questionId, optionIndex) {
  userAnswers.value[questionId] = optionIndex
  
  // Delay before next question
  setTimeout(() => {
    if (currentQuestionIndex.value < currentChunkQuestions.value.length - 1) {
      currentQuestionIndex.value++
    } else {
      finishChunk()
    }
  }, 800)
}

function finishChunk() {
  quizState.value = 'result'
}

function nextChunk() {
   if (hasNextChunkInPart.value) {
       chunkIndex.value++
       startChunk()
   } else if (currentPart.value < 3) {
       // Move to next part
       currentPart.value++
       chunkIndex.value = 0
       startChunk()
   } else {
       // Truly finished
       restartQuiz()
   }
}

function restartQuiz() {
    currentPart.value = 1
    chunkIndex.value = 0
    startChunk()
}

// --- COMPUTED ---

const chunkScore = computed(() => {
  let score = 0
  currentChunkQuestions.value.forEach(q => {
    if (userAnswers.value[q.id] === q.correctAnswer) {
      score++
    }
  })
  return score
})

const chunkResults = computed(() => {
  return currentChunkQuestions.value.map(q => ({
    ...q,
    userSelected: userAnswers.value[q.id],
    isCorrect: userAnswers.value[q.id] === q.correctAnswer
  }))
})

const hasNextChunkInPart = computed(() => {
   const config = partConfig[currentPart.value]
   const partQuestions = allQuestions.value.filter(q => {
      // Same fallback logic for safety
      if (q.part) return q.part === currentPart.value
      return q.id >= config.startId && q.id <= config.endId
   })
   
   if (currentChunkQuestions.value.length === 0) return false
   
   const currentLastId = currentChunkQuestions.value[currentChunkQuestions.value.length - 1].id
   const partLastId = partQuestions[partQuestions.length - 1].id
   
   return currentLastId < partLastId
})
</script>

<template>
  <div class="quiz-container">
    <transition name="fade" mode="out-in">
      
      <!-- INTRO -->
      <div v-if="quizState === 'intro'" class="intro-screen glass-panel">
        <h1 class="title">1QCM'OK</h1>
        <p class="subtitle">182 Questions • EF Core & Architecture</p>
        
        <div class="info-grid">
           <div class="info-item">
               <span class="label">Partie 1</span>
               <span class="val">86 Questions</span>
           </div>
           <div class="info-item">
               <span class="label">Partie 2</span>
               <span class="val">25 Définitions</span>
           </div>
           <div class="info-item">
               <span class="label">Partie 3</span>
               <span class="val">71 Questions</span>
           </div>
        </div>

        <button class="btn start-btn" @click="startQuiz">Commencer le Quiz</button>
      </div>

      <!-- PLAYING -->
      <div v-else-if="quizState === 'playing'" class="playing-screen">
        <div class="header-bar">
            <div class="part-indicator">
                Partie {{ currentPart }} <span class="chunk-indicator" v-if="chunkIndex > 0">Série {{ chunkIndex + 1 }}</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" :style="{ width: ((currentQuestionIndex + 1) / currentChunkQuestions.length) * 100 + '%' }"></div>
            </div>
            <div class="question-counter">
                {{ currentQuestionIndex + 1 }} / {{ currentChunkQuestions.length }}
            </div>
        </div>

        <QuestionCard 
          :question="currentChunkQuestions[currentQuestionIndex]"
          :index="currentQuestionIndex"
          :total="currentChunkQuestions.length"
          @answer="handleAnswer"
        />
      </div>

      <!-- RESULTS -->
      <div v-else-if="quizState === 'result'" class="result-wrapper">
         <ResultScreen
            :score="chunkScore"
            :total="currentChunkQuestions.length"
            :results="chunkResults"
            :has-next-chunk="hasNextChunkInPart || currentPart < 3"
            @next-chunk="nextChunk"
            @retry-chunk="startChunk"
            @restart="restartQuiz"
        />
      </div>

    </transition>
  </div>
</template>

<style scoped>
.quiz-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* INTRO */
.intro-screen {
    text-align: center;
    padding: 3rem;
    animation: float 6s ease-in-out infinite;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #fff, #94a3b8);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
    color: #94a3b8;
    font-size: 1.2rem;
    margin-bottom: 2rem;
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
    background: rgba(255,255,255,0.05);
    padding: 1rem;
    border-radius: 12px;
    min-width: 120px;
}

.info-item .label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.info-item .val {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--text-primary);
}

.start-btn {
    font-size: 1.3rem;
    padding: 1rem 3rem;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

/* PLAYING HEADER */
.header-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    background: rgba(15, 23, 42, 0.6);
    padding: 1rem 1.5rem;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
}

.part-indicator {
    font-weight: 600;
    color: var(--accent-color);
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.chunk-indicator {
    font-size: 0.8rem;
    background: rgba(255,255,255,0.1);
    padding: 2px 8px;
    border-radius: 4px;
    color: var(--text-secondary);
}

.progress-track {
    flex-grow: 1;
    height: 6px;
    background: rgba(255,255,255,0.1);
    border-radius: 3px;
    margin: 0 1.5rem;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--accent-color);
    transition: width 0.3s ease;
}

.question-counter {
    font-variant-numeric: tabular-nums;
    color: var(--text-secondary);
    font-weight: 500;
}
</style>
