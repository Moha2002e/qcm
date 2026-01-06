const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, '../data/questions.json');
const data = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

const part3 = data.filter(q => q.part === 3);
const outputPath = path.join(__dirname, '../data/questions_part3.json');

fs.writeFileSync(outputPath, JSON.stringify(part3, null, 2), 'utf8');
console.log(`Exported ${part3.length} questions to ${outputPath}`);
