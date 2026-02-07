import json
import os
import re

def generate_ramadan_data():
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_file = os.path.join(project_root, 'common_acts_ramadan.json')
    output_file = os.path.join(project_root, 'app', 'src', 'data', 'ramadan_extracted.ts')

    print(f"Reading from {input_file}")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    items = data['content']['items']
    duas = []
    
    current_preamble = []
    current_dua = None
    dua_counter = 1

    # Simple heuristic to identify content vs preamble
    # If it has transliteration and strict Arabic (not just a short phrase), it's likely content.
    # Or if type is specifically tagged (but tags are sparse in the snippet).
    
    seen_contents = set()

    for item in items:
        valid_item = True
        arabic = item.get('arabic', '').strip()
        translit = item.get('transliteration', '').strip()
        english = item.get('english', '').strip()
        
        # Heuristics
        eng_lower = english.lower()
        is_numbered = bool(re.match(r'^\d+\.', english))
        
        # Expanded instruction keywords
        instruction_keywords = [
            'saying:', 'say:', 'recite:', 'supplicate', 'narrated', 'said:', 
            'recommended to', 'reported that', 'peace be upon'
        ]
        is_instruction = any(k in eng_lower for k in instruction_keywords)
        
        # If it's a short phrase without transliteration, it's likely a header/instruction
        if not translit and len(arabic) < 50: 
             # Exception: "Bismillahi..." might be short but is content. 
             # But usually Duas in this file have translit.
             is_instruction = True

        is_content = not (is_numbered or is_instruction)

        if "sayyid ibn tawus narrated" in eng_lower:
            print(f"DEBUG: Item {item.get('id')}: is_instruction={is_instruction}, is_content={is_content}")
            print(f"DEBUG: Keywords found: {[k for k in instruction_keywords if k in eng_lower]}")

        # refine is_content: must have arabic
        if not arabic:
            is_content = False

        if is_content:
            if current_dua:
                # Check for duplicates before appending?
                # Actually, simpler to just append content here, and check for whole-dua dupes later?
                # No, if we have duplicate SECTIONS in JSON, we want to avoid creating a new Dua 
                # that is identical to an old one.
                
                # Append to existing dua
                current_dua['arabicText'] += "\n" + arabic
                current_dua['englishTranslation'] += "\n" + english
                current_dua['transliteration'] += "\n" + translit
            else:
                # Start new Dua
                desc = "\n\n".join(current_preamble)
                
                # Check for custom title from any item in the group
                # For now, we only have one item starting the Dua, so we check that.
                # But we might want to check the preamble items too? 
                # Better to just rely on the 'content' item having the title override.
                custom_title = item.get('custom_title', '').strip()
                
                # Also check generated ID? User might want to override that too later.
                
                name = custom_title if custom_title else f'Common Act {dua_counter}'

                new_dua = {
                    'id': f'common-act-{dua_counter}',
                    'name': name,
                    'arabicName': '',
                    'description': desc,
                    'level': 1,
                    'source': 'Mafatih al-Jinan',
                    'applicableDays': "'all'",
                    'arabicText': arabic,
                    'englishTranslation': english,
                    'transliteration': translit
                }
                current_dua = new_dua
                current_preamble = [] # Consumed
        else:
            # It is preamble/instruction
            if current_dua:
                # Current Dua is finished.
                # Deduplicate: Check if a dua with same Arabic/English exists
                content_hash = current_dua['arabicText'] + current_dua['englishTranslation']
                if content_hash not in seen_contents:
                    duas.append(current_dua)
                    seen_contents.add(content_hash)
                    dua_counter += 1
                else:
                    print(f"Skipping duplicate dua: {current_dua['name']}")
                
                current_dua = None
            
            # Add to preamble buffer
            if english:
                current_preamble.append(english)

    # Add last dua
    if current_dua:
        content_hash = current_dua['arabicText'] + current_dua['englishTranslation']
        if content_hash not in seen_contents:
            duas.append(current_dua)


    # Generate TS Content
    ts_content = f"""// Auto-generated from common_acts_ramadan.json
export interface Dua {{
  id: string;
  name: string;
  arabicName: string;
  description: string;
  level: 1 | 2 | 3;
  source: string;
  applicableDays: 'all' | number[];
  timing?: string;
  arabicText?: string;
  englishTranslation?: string;
  transliteration?: string;
  preamble?: string;
  postamble?: string;
}}

export interface Aamal {{
  id: string;
  name: string;
  arabicName: string;
  description: string;
  level: 1 | 2 | 3;
  source: string;
  applicableDays: 'all' | number[];
  timing?: string;
  instructions?: string[];
}}

export const duas: Dua[] = [
"""
    
    for d in duas:
        # Sanitize strings for JS template literals
        desc = d['description'].replace('`', '\\`').replace('${', '\\${')
        arab = d['arabicText'].replace('`', '\\`').replace('${', '\\${')
        eng = d['englishTranslation'].replace('`', '\\`').replace('${', '\\${')
        trans = d['transliteration'].replace('`', '\\`').replace('${', '\\${')
        
        ts_content += f"""  {{
    id: '{d['id']}',
    name: `{d['name']}`,
    arabicName: `{d['arabicName']}`,
    description: `{desc}`,
    level: {d['level']},
    source: '{d['source']}',
    applicableDays: 'all',
    arabicText: `{arab}`,
    englishTranslation: `{eng}`,
    transliteration: `{trans}`,
  }},
"""

    ts_content += "];\n\nexport const aamal: Aamal[] = [];\n"

    print(f"Writing to {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    print(f"Generated {len(duas)} duas.")

if __name__ == "__main__":
    generate_ramadan_data()
