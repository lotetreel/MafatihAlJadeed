"""
Script to extract the Common Acts section from shahr_ramadan_translated.json
"""
import json
from pathlib import Path

def extract_common_acts():
    # Read the source file
    source_path = Path(__file__).parent.parent / "shahr_ramadan_translated.json"
    with open(source_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    common_acts_section = None
    
    # Navigate through the content structure
    content = data.get("content", {})
    
    # Look for the section with title containing "الأعمال المشتركة" (Common Acts)
    def find_common_acts_section(obj, path=""):
        """Recursively search for the Common Acts section"""
        if isinstance(obj, dict):
            title = obj.get("title", "")
            # Look for "الأعمال المشتركة لشهر رمضان المبارك" (Common Acts for the Blessed Month of Ramadan)
            if "الأعمال المشتركة لشهر رمضان المبارك" in title:
                return obj
            
            # Search in nested items
            for key, value in obj.items():
                result = find_common_acts_section(value, f"{path}.{key}")
                if result:
                    return result
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                result = find_common_acts_section(item, f"{path}[{i}]")
                if result:
                    return result
        return None
    
    common_acts_section = find_common_acts_section(content)
    
    if not common_acts_section:
        # Try looking in the sub_sections
        items = content.get("items", [])
        sub_sections = content.get("sub_sections", [])
        
        for section in sub_sections if sub_sections else items:
            if isinstance(section, dict):
                title = section.get("title", "")
                if "الأعمال المشتركة" in title or "Common acts" in title.lower():
                    common_acts_section = section
                    break
                # Also check nested sections
                nested = find_common_acts_section(section)
                if nested:
                    common_acts_section = nested
                    break
    
    if common_acts_section:
        # Create the output JSON structure
        output = {
            "metadata": {
                "source": data.get("metadata", {}).get("source", ""),
                "author": data.get("metadata", {}).get("author", ""),
                "section": "الأعمال المشتركة لشهر رمضان المبارك - Common Acts for the Blessed Month of Ramadan",
                "extracted_from": "shahr_ramadan_translated.json",
                "description": "Common acts to be performed for every day and night during the month of Ramadan"
            },
            "content": common_acts_section
        }
        
        # Save to new file
        output_path = Path(__file__).parent.parent / "common_acts_ramadan.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        
        print(f"✓ Successfully extracted Common Acts section to: {output_path}")
        print(f"  Section title: {common_acts_section.get('title', 'N/A')}")
        items_count = len(common_acts_section.get('items', []))
        print(f"  Number of items: {items_count}")
    else:
        print("✗ Could not find the Common Acts section")
        print("  Looking for sections with titles containing 'الأعمال المشتركة'...")
        
        # Print all section titles for debugging
        def print_section_titles(obj, level=0):
            if isinstance(obj, dict):
                title = obj.get("title", "")
                if title:
                    print(f"{'  ' * level}Title: {title}")
                for key, value in obj.items():
                    if key in ["items", "sub_sections"]:
                        print_section_titles(value, level + 1)
            elif isinstance(obj, list):
                for item in obj:
                    print_section_titles(item, level)
        
        print("\nAll section titles found:")
        print_section_titles(content)

if __name__ == "__main__":
    extract_common_acts()
