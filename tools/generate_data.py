
import json
import os
import glob
from pathlib import Path

def generate_data():
    project_root = Path(__file__).parent.parent
    dua_amaal_dir = project_root / "DuaAmaal"
    common_acts_path = project_root / "common_acts_ramadan.json"
    output_path = project_root / "app/src/data/ramadan_extracted.ts"

    duas = []
    aamal = []

    # 1. Process individual JSON files in DuaAmaal/
    json_files = glob.glob(str(dua_amaal_dir / "*.json"))
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                # Determine if it's a Dua or Amaal (default to Dua for now if not specified)
                content_type = data.get('content_type', 'dua').lower()
                
                # Parse Level (Handle "L1", "L2", "L3" strings)
                raw_level = data.get('level', 1)
                level = 1
                if isinstance(raw_level, str):
                    if raw_level.upper() == 'L1': level = 1
                    elif raw_level.upper() == 'L2': level = 2
                    elif raw_level.upper() == 'L3': level = 3
                    else: 
                        # Try to parse number from string
                        try:
                            level = int(raw_level.replace('L', ''))
                        except:
                            level = 1
                elif isinstance(raw_level, int):
                    level = raw_level

                # Determine description (Prioritize 'description' field)
                description = data.get('description', '')
                
                # Determine preamble
                preamble = ''
                if isinstance(data.get('preamble'), dict):
                     preamble = data.get('preamble', {}).get('english', '')
                else:
                     preamble = str(data.get('preamble', ''))

                if not description:
                     # Fallback to preamble for description if missing
                     description = preamble

                # Map to application interface
                item = {
                    "id": data.get('id', Path(json_file).stem),
                    "name": data.get('title', 'Unknown Title'),
                    "arabicName": data.get('arabic_title', ''), 
                    "description": description,
                    "level": level,
                    "source": data.get('source', 'Mafatih al-Jinan'), 
                    "applicableDays": data.get('applicable_days', 'all'),
                    "phrases": data.get('phrases', []),
                    "type": content_type,
                    "preamble": preamble  # Explicitly add preamble
                }

                if content_type in ['dua', 'ziyarat', 'supplication']:
                    item['type'] = 'dua' # Normalize to 'dua' for TS interface
                    duas.append(item)
                elif content_type in ['aamal', "a'amal", 'act']:
                    item['instructions'] = data.get('instructions', [])
                    item['type'] = 'aamal' # Normalize
                    aamal.append(item)
                else:
                    # Fallback to Dua
                     item['type'] = 'dua'
                     duas.append(item)

        except Exception as e:
            print(f"Error processing {json_file}: {e}")

    # 2. Process common_acts_ramadan.json (Legacy/Aggregated source) - EXCLUDED PER USER REQUEST
    # if common_acts_path.exists():
    #     try:
    #         with open(common_acts_path, 'r', encoding='utf-8') as f:
    #             common_data = json.load(f)
                
    #             # Navigate to items (assuming structure based on previous view)
    #             items = []
    #             content = common_data.get('content', {})
    #             if 'items' in content:
    #                 items = content['items']
    #             elif 'sub_sections' in content:
    #                  for sub in content['sub_sections']:
    #                      if 'items' in sub:
    #                          items.extend(sub['items'])

    #             for item in items:
    #                 # HEURISTIC: Skip items that are just titles/comments unless they are marked as content
    #                 # For now, we might need a more sophisticated extraction similar to extract_common_acts.py
    #                 # BUT, the user wants us to aggregate.
    #                 # Looking at extract_common_acts.py output, it seemed to just create the common_acts file.
    #                 # We need to extract meaningful Dua/Aamal items from it.
                    
    #                  # Basic heuristic extraction (refining logic from previous conversations)
    #                 if item.get('content_type') == 'dua' or (item.get('arabic') and len(item.get('arabic', '')) > 50): # Assume long arabic text is a dua/aamal
                        
    #                     # Check if it already exists (ID text match?)
    #                     # For now, let's treat common_acts items as simple blocks unless we can match them
                        
    #                     generated_id = f"common_{item.get('id', 'unknown')}"
                        
    #                     obj = {
    #                         "id": generated_id,
    #                         "name": item.get('custom_title') or item.get('english', 'Common Act')[:50] + "...",
    #                         "arabicName": item.get('arabic', '')[:30] + "...",
    #                         "description": item.get('english', ''),
    #                         "level": 1,
    #                         "source": "Mafatih al-Jinan",
    #                         "applicableDays": "all",
    #                         # Use text block for these legacy items
    #                         "arabicText": item.get('arabic', ''),
    #                         "englishTranslation": item.get('english', ''),
    #                         "transliteration": item.get('transliteration', ''),
    #                         "type": 'dua' # Defaulting
    #                     }
                        
    #                     # Add to list (maybe filter out commentary-only items)
    #                     if item.get('content_type') != 'commentary':
    #                          duas.append(obj)

    #     except Exception as e:
    #         print(f"Error processing common stats: {e}")

    # 3. Generate TypeScript File
    ts_content = f"""// Auto-generated by tools/generate_data.py
// DO NOT EDIT DIRECTLY

export interface Phrase {{
  arabic: string;
  english: string;
  transliteration?: string;
}}

export interface Dua {{
  id: string;
  name: string;
  arabicName: string;
  description: string;
  level: 1 | 2 | 3;
  source: string;
  applicableDays: 'all' | number[];
  type: 'dua';
  // Content can be either phrased or block text
  phrases?: Phrase[];
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
  type: 'aamal';
  timing?: string;
  instructions?: string[];
  // Content
  phrases?: Phrase[];
  arabicText?: string;
  englishTranslation?: string;
  transliteration?: string;
}}

export const duas: Dua[] = {json.dumps(duas, indent=2, ensure_ascii=False)};

export const aamal: Aamal[] = {json.dumps(aamal, indent=2, ensure_ascii=False)};
"""

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print(f"Successfully generated data to {output_path}")
    print(f"Duas: {len(duas)}")
    print(f"Aamal: {len(aamal)}")

if __name__ == "__main__":
    generate_data()
