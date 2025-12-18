
import fs from 'fs';

const qcmText = fs.readFileSync('qcm.txt', 'utf8');
const lines = qcmText.split(/\r?\n/);

// --- PART 1: Existing JSON ---
// We'll read the existing questions.json but strictly take the first 86.
// Or effectively re-parse/use the known set.
// Actually, the current questions.json has 157 questions (Part 1 + Part 3).
// I should filter it or better yet, verify I have Part 1 clean.
// Let's assume questions 1-86 in current JSON are Part 1.
const currentJson = JSON.parse(fs.readFileSync('src/data/questions.json', 'utf8'));
const part1 = currentJson.filter(q => q.id <= 86);
part1.forEach(q => q.part = 1);

// --- PART 2: Definitions ---
// Look for lines 705 to 730 approx
let defStart = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('1.	Entity Framework Core – ORM')) {
        defStart = i;
        break;
    }
}

if (defStart === -1) {
    // Fallback search
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Entity Framework Core – ORM')) {
            defStart = i;
            break;
        }
    }
}

const part2Definitions = [];
// We expect 25 definitions.
if (defStart !== -1) {
    for (let i = 0; i < 25; i++) {
        const line = lines[defStart + i];
        if (!line) continue;
        // Format: "1. Term – Definition"
        // Regex: Number. Term – Definition
        // Characters might be "–" or "-"
        const match = line.match(/^\d+\.\s*(.+?)\s*[–-]\s*(.+)/);
        if (match) {
            part2Definitions.push({
                term: match[1].trim(),
                definition: match[2].trim()
            });
        }
    }
}

// Generate QCMs for Part 2
const part2 = part2Definitions.map((item, index) => {
    // Correct term
    const correctTerm = item.term;
    // Pick 4 random distractors
    const distractors = part2Definitions
        .filter(d => d.term !== correctTerm)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
        .map(d => d.term);

    const options = [correctTerm, ...distractors];
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    return {
        id: 86 + 1 + index, // 87 to 111
        part: 2,
        question: `Définition : "${item.definition}"`,
        options: options,
        correctAnswer: options.indexOf(correctTerm) // Store index
    };
});

// --- PART 3: New Questions ---
// These are questions 87+ in the current file, but now they will be pushed after Part 2.
// Existing count of Part 3 questions was 71.
// We can re-extract them from the current JSON (id >= 87) or re-parse.
// Using current JSON is safer as I already parsed them.
const part3Raw = currentJson.filter(q => q.id >= 87);
const part3 = part3Raw.map((q, index) => {
    return {
        ...q,
        id: 111 + 1 + index, // Starts at 112
        part: 3
    };
});

// Combine
const fullData = [...part1, ...part2, ...part3];

fs.writeFileSync('src/data/questions.json', JSON.stringify(fullData, null, 2));
console.log(`Build Complete.`);
console.log(`Part 1: ${part1.length} questions (1-86)`);
console.log(`Part 2: ${part2.length} questions (87-111)`);
console.log(`Part 3: ${part3.length} questions (112-${111 + part3.length})`);
console.log(`Total: ${fullData.length}`);
