#!/usr/bin/env python3
"""
Extract the Ramadan Calendar section from shahr_ramadan_translated.json
"""

import json
from pathlib import Path

def extract_calendar_section():
    # Load the main JSON file
    input_path = Path(__file__).parent.parent / "shahr_ramadan_translated.json"
    output_path = Path(__file__).parent.parent / "ramadan_calendar.json"
    
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Find the calendar sub-section
    calendar_section = None
    content_items = data.get('content', {}).get('items', [])
    
    for item in content_items:
        if isinstance(item, dict) and item.get('title') == 'تقويم هذا الشهر:':
            calendar_section = item
            break
    
    if not calendar_section:
        print("Calendar section not found!")
        return
    
    # Create the output structure
    output_data = {
        "metadata": {
            "source": data["metadata"]["source"],
            "author": data["metadata"]["author"],
            "section": "تقويم شهر رمضان المبارك",
            "section_english": "Calendar of the Blessed Month of Ramadan",
            "description": "Important dates and events during the month of Ramadan"
        },
        "calendar": {
            "title": calendar_section["title"],
            "title_english": "Calendar of this Month",
            "type": calendar_section["type"],
            "level": calendar_section["level"],
            "events": []
        }
    }
    
    # Extract calendar events (dates and their descriptions)
    # We want to pair date headers with their event descriptions
    items = calendar_section.get('items', [])
    current_date = None
    
    for item in items:
        arabic_text = item.get('arabic', '')
        
        # Check if this is a date header (contains "من رمضان" or day ordinals)
        is_date_header = any(keyword in arabic_text for keyword in [
            'العاشر من رمضان',
            'الخامس عشر من رمضان',
            'السابع عشر',
            'التاسع عشر',
            'الحادي والعشرون'
        ])
        
        if is_date_header:
            current_date = {
                "date_arabic": arabic_text,
                "date_english": item.get('english', ''),
                "date_transliteration": item.get('transliteration', ''),
                "events": []
            }
            output_data["calendar"]["events"].append(current_date)
        elif current_date and item.get('content_type') == 'commentary':
            # This is an event description for the current date
            # Skip if it's clearly not a calendar event (longer commentary text)
            if 'وفاة' in arabic_text or 'ولادة' in arabic_text or 'شهادة' in arabic_text or 'جرح' in arabic_text or 'انتصار' in arabic_text:
                event = {
                    "id": item.get('id'),
                    "arabic": arabic_text,
                    "english": item.get('english', ''),
                    "transliteration": item.get('transliteration', ''),
                    "footnote_refs": item.get('footnote_refs', [])
                }
                current_date["events"].append(event)
    
    # Write the output
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"Calendar section extracted to: {output_path}")
    print(f"Found {len(output_data['calendar']['events'])} date entries")

if __name__ == "__main__":
    extract_calendar_section()
