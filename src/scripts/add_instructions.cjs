const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/questions.json');

try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(rawData);

    console.log(`Total questions processing: ${questions.length}`);

    let updatedCount = 0;

    questions.forEach(q => {
        let suffix = "";
        if (q.type === 'multiple') {
            suffix = " (Plusieurs réponses possibles)";
        } else {
            suffix = " (Une seule réponse possible)";
        }

        // Check if suffix already exists to avoid duplication
        if (!q.question.includes("(Plusieurs réponses possibles)") && !q.question.includes("(Une seule réponse possible)")) {
            q.question = q.question.trim() + suffix;
            updatedCount++;
        }
    });

    console.log(`Questions updated with instructions: ${updatedCount}`);

    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf8');
    console.log('Successfully updated questions.json');

} catch (err) {
    console.error('Error processing questions:', err);
}
