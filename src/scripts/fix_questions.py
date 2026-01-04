import json

file_path = r'c:\Users\moha4\Documents\qcm\src\data\questions.json'

with open(file_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Total questions before processing: {len(questions)}")

unique_questions = []
seen_questions = set()

duplicates_count = 0
for q in questions:
    q_text = q['question'].strip()
    if q_text in seen_questions:
        duplicates_count += 1
        continue
    seen_questions.add(q_text)
    
    # Determine type
    if isinstance(q['correctAnswer'], list):
        q['type'] = 'multiple'
    else:
        q['type'] = 'single'
        
    unique_questions.append(q)

print(f"Total questions after removing duplicates: {len(unique_questions)}")
print(f"Duplicates removed: {duplicates_count}")

# Save back
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(unique_questions, f, ensure_ascii=False, indent=2)
