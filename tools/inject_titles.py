import json
import os

def inject_titles():
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_file = os.path.join(project_root, 'common_acts_ramadan.json')
    
    print(f"Reading from {input_file}")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    items = data['content']['items']
    count = 0
    
    for item in items:
        # Add custom_title if missing
        if 'custom_title' not in item:
            item['custom_title'] = "" # Placeholder
            count += 1
            
        # Also clean up any null fields if present, to keep it clean? 
        # No, safe to strictly add.

    print(f"Injecting 'custom_title' into {count} items.")
    
    with open(input_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Done.")

if __name__ == "__main__":
    inject_titles()
