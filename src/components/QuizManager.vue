
<script setup>
import { ref, computed, onMounted } from 'vue'
import QuestionCard from './QuestionCard.vue'
import ResultScreen from './ResultScreen.vue'
import CoursePart1 from './CoursePart1.vue'
import CoursePart2 from './CoursePart2.vue'
import CoursePart3 from './CoursePart3.vue'
import rawQuestions from '../data/questions.json'

// --- STATE ---
const currentPart = ref(1) // 1, 2, or 3
const chunkIndex = ref(0) // Index of chunk within the part

const allQuestions = ref([])
const currentChunkQuestions = ref([])
const userAnswers = ref({})
const currentQuestionIndex = ref(0)
const quizState = ref('intro') // intro, series-selection, playing, result, course
const selectedCourse = ref(1) // 1, 2, or 3

// --- CONFIGURATION ---
const partConfig = {
  1: { startId: 1, endId: 86, chunkSize: 20, label: "Questions .NET (Original)" },
  2: { startId: 87, endId: 111, chunkSize: 25, label: "Définitions" },
  3: { startId: 112, endId: 182, chunkSize: 20, label: "Questions .NET (New)" }
}

onMounted(() => {
  allQuestions.value = [...rawQuestions]
})

// --- ACTIONS ---

function selectPart(partId) {
    currentPart.value = partId
    quizState.value = 'series-selection'
}

function openCourse(courseId) {
    selectedCourse.value = courseId
    quizState.value = 'course'
}

function selectSeries(seriesIndex) {
    chunkIndex.value = seriesIndex
    startChunk()
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startChunk() {
  const config = partConfig[currentPart.value]
  
  // Filter questions for the current part
  const partQuestions = allQuestions.value.filter(q => {
      if (q.part) return q.part === currentPart.value
      return q.id >= config.startId && q.id <= config.endId
  })
  
  const startIndex = chunkIndex.value * config.chunkSize
  let endIndex = startIndex + config.chunkSize
  
  // --- CHUNKING LOGIC ---
  const remaining = partQuestions.length - startIndex
  
  if (currentPart.value === 1) {
      // Part 1: 4th series (index 3) takes the remainder (Total 26)
      if (chunkIndex.value === 3 || remaining < (config.chunkSize + 10)) {
          endIndex = partQuestions.length
      }
  } else if (currentPart.value === 2) {
      // Part 2: All 25 questions
      endIndex = partQuestions.length
  } else if (currentPart.value === 3) {
      // Part 3: Last chunk takes remainder
      if (remaining < config.chunkSize) {
          endIndex = partQuestions.length
      }
  }
  
  endIndex = Math.min(endIndex, partQuestions.length)
  
  // Get the slice of questions for this series
  const slicedQuestions = partQuestions.slice(startIndex, endIndex)
  
  // Shuffle them!
  currentChunkQuestions.value = shuffleArray([...slicedQuestions])
  
  currentQuestionIndex.value = 0
  userAnswers.value = {}
  quizState.value = 'playing'
}



function handleAnswer(questionId, answer) {
  // answer is now an array of indices
  userAnswers.value[questionId] = answer
}

function nextQuestion() {
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
   if (hasNextChunkInPart.value) {
       chunkIndex.value++
       startChunk()
   } else if (currentPart.value < 3) {
       currentPart.value++
       quizState.value = 'series-selection'
   } else {
       restartQuiz()
   }
}

function restartQuiz() {
    quizState.value = 'intro'
    currentPart.value = 1
    chunkIndex.value = 0
}

function returnToIntro() {
    quizState.value = 'intro'
}

// --- HELPER ---
function isAnswerCorrect(question, userAnswer) {
    if (!question || userAnswer === undefined) return false
    
    // Normalize correct answer to array
    let correct = question.correctAnswer
    if (!Array.isArray(correct)) {
        correct = [correct]
    }
    
    // Normalize user answer to array (should already be array from QuestionCard)
    let user = userAnswer
    if (!Array.isArray(user)) {
        user = [user]
    }
    
    if (correct.length !== user.length) return false
    
    const correctSet = new Set(correct)
    return user.every(a => correctSet.has(a))
}

// --- COMPUTED ---

const chunkScore = computed(() => {
  let score = 0
  currentChunkQuestions.value.forEach(q => {
    if (q && q.id && isAnswerCorrect(q, userAnswers.value[q.id])) {
      score++
    }
  })
  return score
})

const chunkResults = computed(() => {
  return currentChunkQuestions.value.map(q => {
    if (!q) return null // Safety
    const isCorrect = isAnswerCorrect(q, userAnswers.value[q.id])
    return {
      question: q,
      userAnswer: userAnswers.value[q.id],
      isCorrect: isCorrect
    }
  }).filter(r => r !== null)
})

// Calculate available series for the selected part
const availableSeries = computed(() => {
    const config = partConfig[currentPart.value]
    if (!config) return []
    
    const partQuestions = allQuestions.value.filter(q => {
        if (q.part) return q.part === currentPart.value
        return q.id >= config.startId && q.id <= config.endId
    })
    
    const count = partQuestions.length
    const series = []
    
    let currentIdx = 0
    let seriesCount = 1
    
    while(currentIdx < count) {
        let size = config.chunkSize
        
        // Match chunking logic for display
        const remaining = count - currentIdx
        
        if (currentPart.value === 1 && seriesCount === 4) {
             size = remaining // Last one is 26
        } else if (currentPart.value === 2) {
             size = count
        } else if (remaining < config.chunkSize) {
             size = remaining
        }
        
        // If it's the very last bit and logic dictates merge (e.g. Part 1), loop handles it.
        // But for display loop:
        series.push({
            id: seriesCount - 1,
            label: `Série ${seriesCount}`,
            desc: `${size} Questions`
        })
        
        currentIdx += size
        seriesCount++
    }
    
    return series
})

const hasNextChunkInPart = computed(() => {
   // Logic to check if there is a next series available
   // We can just check if chunkIndex + 1 exists in availableSeries
   // Note: availableSeries is re-calculated based on currentPart, confusing if we change part.
   // But we only run this when playing.
   return chunkIndex.value < availableSeries.value.length - 1
})

</script>

<template>
  <div class="quiz-container">
    <transition name="fade" mode="out-in">
      
      <!-- STEP 1: PART SELECTION (INTRO) -->
      <div v-if="quizState === 'intro'" class="selection-screen glass-panel">
        <h1 class="title">1QCM'OK</h1>
        <p class="subtitle">Sélectionnez une Partie</p>
        
        <div class="card-grid">
            <div class="selection-card" @click="selectPart(1)">
                <div class="card-icon">1</div>
                <h3>Partie 1</h3>
                <p>Questions 1-86</p>
                <div class="tag">86 Questions</div>
            </div>
            
            <div class="selection-card" @click="selectPart(2)">
                <div class="card-icon">2</div>
                <h3>Partie 2</h3>
                <p>Définitions</p>
                <div class="tag">25 Questions</div>
            </div>
            
            <div class="selection-card" @click="selectPart(3)">
                <div class="card-icon">3</div>
                <h3>Partie 3</h3>
                <p>Questions 112-182</p>
                <div class="tag">71 Questions</div>
            </div>
        </div>

        <div class="resources-section">
            <h3 class="section-subtitle">Ressources</h3>
            <div class="card-grid">
                <div class="selection-card course-card" @click="openCourse(1)">
                    <div class="card-icon course-icon">📖</div>
                    <h3>Synthèse</h3>
                    <p>Révision Partie 1</p>
                    <div class="tag course-tag">Cours</div>
                </div>
                <div class="selection-card course-card" @click="openCourse(2)">
                    <div class="card-icon course-icon">📚</div>
                    <h3>Définitions</h3>
                    <p>Révision Partie 2</p>
                    <div class="tag course-tag">Cours</div>
                </div>
                 <div class="selection-card course-card" @click="openCourse(3)">
                    <div class="card-icon course-icon">🧠</div>
                    <h3>Avancé</h3>
                    <p>Révision Partie 3</p>
                    <div class="tag course-tag">Cours</div>
                </div>
            </div>
        </div>
      </div>

      <!-- STEP 2: SERIES SELECTION -->
      <div v-else-if="quizState === 'series-selection'" class="selection-screen glass-panel">
         
         <div class="nav-header">
             <button class="btn-text" @click="returnToIntro">← Retour</button>
         </div>

         <h2 class="section-title">Partie {{ currentPart }}</h2>
         <p class="subtitle">Choisissez votre série</p>
         
         <div class="series-grid">
             <button 
                v-for="s in availableSeries" 
                :key="s.id" 
                class="btn series-btn"
                @click="selectSeries(s.id)"
             >
                <span class="series-name">{{ s.label }}</span>
                <span class="series-count">{{ s.desc }}</span>
             </button>
         </div>
      </div>

      <!-- STEP 3: PLAYING -->
      <div v-else-if="quizState === 'playing'" class="playing-screen">
        <div v-if="currentChunkQuestions.length > 0 && currentChunkQuestions[currentQuestionIndex]" class="quiz-content">
            <div class="header-bar">
                <div class="part-indicator">
                    <button class="btn-xs" @click="restartQuiz">Accueil</button>
                    <span class="separator">/</span>
                    Partie {{ currentPart }} 
                    <span class="chunk-indicator">Série {{ chunkIndex + 1 }}</span>
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
            @answer="(idx) => handleAnswer(currentChunkQuestions[currentQuestionIndex].id, idx)"
            @next="nextQuestion"
            />
        </div>
        <div v-else class="error-state">
            <p>Erreur: Aucune question chargée pour cette série.</p>
            <button class="btn" @click="restartQuiz">Retour à l'accueil</button>
        </div>
      </div>

      <!-- STEP 4: RESULTS -->
      <div v-else-if="quizState === 'result'" class="result-wrapper">
         <ResultScreen
            :score="chunkScore"
            :total="currentChunkQuestions.length"
            :results="chunkResults"
            :has-next-chunk="hasNextChunkInPart"
            @next-chunk="nextChunk"
            @retry-chunk="startChunk"
            @restart="restartQuiz"
        />
      </div>

      <!-- STEP 5: COURSE VIEW -->
      <div v-else-if="quizState === 'course'" class="course-wrapper">
          <CoursePart1 v-if="selectedCourse === 1" @close="returnToIntro" />
          <CoursePart2 v-if="selectedCourse === 2" @close="returnToIntro" />
          <CoursePart3 v-if="selectedCourse === 3" @close="returnToIntro" />
      </div>

    </transition>
  </div>
</template>

<style scoped>
.quiz-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* SELECTION SCREENS */
.selection-screen {
    text-align: center;
    padding: 3rem;
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

.section-title {
    font-size: 2.5rem;
    color: var(--text-primary);
}

.subtitle {
    color: #94a3b8;
    font-size: 1.2rem;
    margin-bottom: 3rem;
}

.nav-header {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 1rem;
}

.btn-text {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1rem;
    cursor: pointer;
    transition: color 0.3s;
}
.btn-text:hover { color: var(--accent-color); }

/* Card Grid for Parts */
.card-grid {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.selection-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 2rem;
    width: 220px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.selection-card:hover {
    transform: translateY(-5px);
    background: rgba(255,255,255,0.1);
    border-color: var(--accent-color);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.card-icon {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--accent-color);
    background: rgba(0,0,0,0.2);
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
}

.selection-card h3 { margin: 0.5rem 0; font-size: 1.5rem; }
.selection-card p { color: var(--text-secondary); margin-bottom: 1.5rem; }

.tag {
    background: rgba(147, 51, 234, 0.2);
    color: #d8b4fe;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
}

/* Series Grid */
.series-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
}

.series-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    gap: 0.5rem;
    background: rgba(255,255,255,0.05);
}

.series-name { font-size: 1.2rem; font-weight: bold; }
.series-count { font-size: 0.9rem; color: var(--text-secondary); }

/* Play Header */
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
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: var(--text-secondary);
}

.separator { color: rgba(255,255,255,0.2); }

.btn-xs {
    background: none;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 2px 8px;
    border-radius: 4px;
    color: var(--text-secondary);
    font-size: 0.8rem;
    cursor: pointer;
}

.chunk-indicator {
    color: var(--accent-color);
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
}

@media (max-width: 600px) {
  .card-grid {
      gap: 1rem;
      flex-direction: column;
      align-items: center;
  }
  
  .selection-card {
      width: 100%;
      max-width: 300px;
  }
  
  .series-grid {
      grid-template-columns: 1fr; /* Stack series buttons */
  }
  
  .title {
      font-size: 2.5rem;
  }
  
  .header-bar {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
  }
  
  .progress-track {
      width: 100%;
      margin: 0.5rem 0;
  }
}

/* Resources Section */
.resources-section {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.1);
}

.section-subtitle {
    color: #94a3b8;
    margin-bottom: 2rem;
    font-weight: 400;
}

.course-card {
    border-color: rgba(16, 185, 129, 0.2);
}
.course-card:hover {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.05);
}
.course-icon {
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
}
.course-tag {
    background: rgba(16, 185, 129, 0.2);
    color: #6ee7b7;
}
</style>
