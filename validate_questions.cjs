const fs = require('fs');
const path = 'src/data/questions.json';

try {
    const questions = JSON.parse(fs.readFileSync(path, 'utf8'));
    let errorCount = 0;
    let warningCount = 0;

    console.log(`Starting validation of ${questions.length} questions...`);

    questions.forEach((q, index) => {
        const qNum = index + 1;
        const context = `Q${q.id} (Index ${index})`;

        // 1. Basic Structure
        if (!q.id) { console.error(`[ERROR] ${context}: Missing ID`); errorCount++; }
        if (!q.question) { console.error(`[ERROR] ${context}: Missing question text`); errorCount++; }
        if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
            console.error(`[ERROR] ${context}: Missing or empty options`);
            errorCount++;
        }
        if (q.correctAnswer === undefined) { console.error(`[ERROR] ${context}: Missing correctAnswer`); errorCount++; }

        // 2. Validate Indexes
        const numOptions = q.options ? q.options.length : 0;

        if (Array.isArray(q.correctAnswer)) {
            if (q.correctAnswer.length === 0) {
                console.error(`[ERROR] ${context}: correctAnswer array is empty`);
                errorCount++;
            }
            q.correctAnswer.forEach(idx => {
                if (typeof idx !== 'number' || idx < 0 || idx >= numOptions) {
                    console.error(`[ERROR] ${context}: Invalid answer index ${idx} for ${numOptions} options`);
                    errorCount++;
                }
            });
            // Check duplicates
            const unique = new Set(q.correctAnswer);
            if (unique.size !== q.correctAnswer.length) {
                console.warn(`[WARNING] ${context}: Duplicate indices in correctAnswer`);
                warningCount++;
            }
        } else {
            if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= numOptions) {
                console.error(`[ERROR] ${context}: Invalid answer index ${q.correctAnswer} for ${numOptions} options`);
                errorCount++;
            }
        }

        // 3. Content Heuristics (Warnings)
        if (q.options) {
            q.options.forEach((opt, i) => {
                if (!opt) {
                    console.error(`[ERROR] ${context}: Option ${i} is null or empty`);
                    errorCount++;
                    return;
                }
                const lowerOpt = opt.toString().toLowerCase();
                // Check for meta-answers left over
                if (lowerOpt.includes('toutes ces réponses') || lowerOpt.includes('aucune de ces réponses')) {
                    // This is acceptable if it's an option, but we should verify the logic if it's the correct one.
                    // console.log(`[INFO] ${context}: Option ${i} contains meta-text: "${opt}"`);
                }

                // Suspicious: Option contains "Réponse :" or "A." at start
                if (opt.match(/^(?:Réponses?|Answer)\s*:/i)) {
                    console.warn(`[WARNING] ${context}: Option ${i} looks like metadata: "${opt}"`);
                    warningCount++;
                }
            });

            // Check for duplicate options
            const uniqueOptions = new Set(q.options);
            if (uniqueOptions.size !== q.options.length) {
                console.warn(`[WARNING] ${context}: Duplicate options detected`);
                warningCount++;
            }
        }
    });

    console.log(`\nValidation complete.`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Warnings: ${warningCount}`);

    if (errorCount > 0) process.exit(1);

} catch (e) {
    console.error("FATAL ERROR:", e);
    process.exit(1);
}
