const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, '../data/questions.json');
const data = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

const part3 = data.filter(q => q.part === 3);

console.log(JSON.stringify(part3.slice(0, 5), null, 2)); // Show first 5 questions of part 3
