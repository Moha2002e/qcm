const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, '../data/questions.json');
const data = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

const part1 = data.filter(q => q.part === 1);

const outputPath = path.join(__dirname, '../data/questions_part1.json');
fs.writeFileSync(outputPath, JSON.stringify(part1, null, 2), 'utf8');
console.log(`Exported ${part1.length} questions to ${outputPath}`);
