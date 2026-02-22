import json
import os
import shutil

# Directories
SOURCE_DIR = 'DuaAmaal'
BACKUP_DIR = 'DuaAmaal_backups'

def main():
    # 1. Create a backup folder if it doesn't exist
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        print(f"Created backup directory: {BACKUP_DIR}")

    files_processed = 0

    # 2. Iterate over all JSON files
    for filename in os.listdir(SOURCE_DIR):
        if filename.endswith('.json'):
            file_path = os.path.join(SOURCE_DIR, filename)
            backup_path = os.path.join(BACKUP_DIR, filename)

            # 3. Create a safety backup
            shutil.copy2(file_path, backup_path)

            # 4. Read the JSON with UTF-8 encoding
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # 5. Check if 'timing' already exists, if not, add it
            if 'timing' not in data:
                # We can insert it in a specific order by recreating the dictionary
                new_data = {}
                for key, value in data.items():
                    new_data[key] = value
                    # Insert 'timing' right after 'type' or 'applicable_days' for neatness
                    if key == 'applicable_days' or key == 'content_type':
                        new_data['timing'] = [] 

                # Fallback if the keys above weren't found
                if 'timing' not in new_data:
                    new_data['timing'] = []

                # 6. Write back the JSON
                # CRITICAL: ensure_ascii=False ensures Arabic remains as Arabic characters
                # and doesn't get converted to \u06... unreadable codes
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(new_data, f, ensure_ascii=False, indent=2)
                
                files_processed += 1
                print(f"Added 'timing' to: {filename}")
            else:
                print(f"Skipped {filename} (already has 'timing')")

    print(f"\nDone! Processed {files_processed} files.")
    print(f"Your original files are safely backed up in the '{BACKUP_DIR}' folder.")

if __name__ == '__main__':
    main()
