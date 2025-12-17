
import fs from 'fs';
import path from 'path';

const inputPath = 'qcm.txt';
const outputPath = 'new_questions.json';

const content = fs.readFileSync(inputPath, 'utf8');
const lines = content.split(/\r?\n/);

// Find the start of the new section (around line 735, searching for "1.Lorsqu")
let startIndex = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('1.Lorsqu’une entité')) {
        startIndex = i;
        break;
    }
}

if (startIndex === -1) {
    console.error('Could not find start of new questions');
    process.exit(1);
}

const newQuestionsLines = lines.slice(startIndex);
const questions = [];
let currentQuestion = null;

const idStart = 87; // Existing questions end at 86
let idCounter = idStart;

// Regex for "Number. Text"
const questionRegex = /^\d+\.\s*(.+)/;
const optionRegex = /^([A-E])\.\s*(.+)/;

for (let line of newQuestionsLines) {
    line = line.trim();
    if (!line) continue;
    if (line.startsWith('___')) continue; // Separator

    const qMatch = line.match(questionRegex);
    if (qMatch) {
        // Save previous if exists
        if (currentQuestion) {
            questions.push(currentQuestion);
        }
        currentQuestion = {
            id: idCounter++,
            question: qMatch[1],
            options: [],
            correctAnswer: 0
        };
    } else {
        const oMatch = line.match(optionRegex);
        if (oMatch && currentQuestion) {
            // content is in oMatch[2]
            currentQuestion.options.push(oMatch[2]);
        } else if (currentQuestion && currentQuestion.options.length === 0) {
            // Multiline question text or continuation
            currentQuestion.question += " " + line;
        }
    }
}
// Push last one
if (currentQuestion) {
    questions.push(currentQuestion);
}

fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
console.log(`Parsed ${questions.length} new questions.`);
