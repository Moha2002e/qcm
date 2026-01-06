const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, '../data/questions.json');
const data = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

const part2 = data.filter(q => q.part === 2);

console.log(JSON.stringify(part2.slice(0, 5), null, 2)); // Show first 5 questions of part 2
