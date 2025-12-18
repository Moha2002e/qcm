
import fs from 'fs';

const content = fs.readFileSync('qcm.txt', 'utf8');
const lines = content.split(/\r?\n/);

let startIndex = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('1.Lorsqu’une entité')) {
        startIndex = i;
        break;
    }
}

const section = lines.slice(startIndex);
let count = 0;
const questionRegex = /^\d+\.\s*(.+)/;

const foundNumbers = [];

for (const line of section) {
    const match = line.trim().match(questionRegex);
    if (match) {
        count++;
        foundNumbers.push(parseInt(line.trim().split('.')[0]));
    }
}

console.log(`Found ${count} questions in the second section.`);
if (foundNumbers.length > 0) {
    console.log(`First number: ${foundNumbers[0]}`);
    console.log(`Last number: ${foundNumbers[foundNumbers.length - 1]}`);
    // Check for gaps
    for (let i = 0; i < foundNumbers.length - 1; i++) {
        if (foundNumbers[i + 1] !== foundNumbers[i] + 1) {
            console.log(`Gap: ${foundNumbers[i]} -> ${foundNumbers[i + 1]}`);
        }
    }
}
