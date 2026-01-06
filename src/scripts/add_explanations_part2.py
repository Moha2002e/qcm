
import json
import re

def add_explanations():
    file_path = 'src/data/questions.json'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    count = 0
    for q in questions:
        if q.get('part') == 2:
            # Extract definition text from quotes
            match = re.search(r'"([^"]+)"', q['question'])
            if match:
                def_text = match.group(1)
                
                # Get correct answer text
                correct_idx = q['correctAnswer']
                if isinstance(correct_idx, list):
                     correct_idx = correct_idx[0] # Assume single answer for definitions usually
                
                answer_text = q['options'][correct_idx]
                
                # Formulate explanation
                explanation = f"Correct ! **{answer_text}** correspond à : {def_text}."
                
                q['explanation'] = explanation
                count += 1
            else:
                # Fallback if regex fails
                q['explanation'] = "Cette définition correspond à la bonne réponse."

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
        
    print(f"Added explanations to {count} questions in Part 2.")

if __name__ == "__main__":
    add_explanations()
