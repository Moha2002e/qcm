
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/questions.json');
const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let count = 0;

questions.forEach(q => {
    if (q.part === 2) {
        // Extract definition text from quotes using regex
        const match = q.question.match(/"([^"]+)"/);

        if (match && match[1]) {
            const defText = match[1];

            // Get correct answer text
            let correctIdx = q.correctAnswer;
            if (Array.isArray(correctIdx)) {
                correctIdx = correctIdx[0];
            }

            const answerText = q.options[correctIdx];

            // Formulate explanation
            // Note: emphasizing the specific term and its definition
            q.explanation = `<strong>${answerText}</strong> : ${defText}`;
            count++;
        }
    }
});

fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf8');
console.log(`Added explanations to ${count} questions in Part 2.`);
