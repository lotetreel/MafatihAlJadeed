#!/usr/bin/env python3
"""
Ramadan Content Extractor

Extracts Ramadan-related content from mafatih_structured.json and
generates TypeScript content for the Shahr Ramadan website.
"""

import json
import re
from pathlib import Path
from typing import Any

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
JSON_PATH = PROJECT_ROOT / "mafatih_structured.json"
OUTPUT_PATH = PROJECT_ROOT / "app" / "src" / "data" / "ramadan_extracted.ts"


def load_json() -> dict:
    """Load the Mafatih structured JSON."""
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def find_ramadan_chapter(data: dict) -> dict | None:
    """Find the Ramadan chapter in the JSON structure."""
    for section in data.get("sections", []):
        if "RAMADHAN" in section.get("title", "").upper():
            return section
        # Check subsections
        for subsection in section.get("subsections", []):
            if "RAMADHAN" in subsection.get("title", "").upper():
                return subsection
    return None


def extract_arabic_text(block: dict) -> str:
    """Extract Arabic text from a content block."""
    if block.get("type") == "arabic_dua":
        return block.get("text", "")
    return ""


def extract_english_text(block: dict) -> str:
    """Extract English text from a content block."""
    if block.get("type") in ["english_text", "instruction"]:
        return block.get("text", "")
    return ""


def get_day_from_title(title: str) -> list[int] | str:
    """Extract day number(s) from a section title."""
    title_upper = title.upper()
    
    # Check for "all" days patterns
    if "GENERAL" in title_upper or "DAYS & NIGHTS" in title_upper:
        return "all"
    
    # Extract specific day numbers
    days = []
    
    # Pattern: "1ST DAY", "2ND DAY", etc.
    day_pattern = r"(\d+)(?:ST|ND|RD|TH)\s*(?:DAY|NIGHT)"
    matches = re.findall(day_pattern, title_upper)
    days.extend([int(m) for m in matches])
    
    # Pattern: "DAY 1", "NIGHT 23", etc.
    alt_pattern = r"(?:DAY|NIGHT)\s*(\d+)"
    alt_matches = re.findall(alt_pattern, title_upper)
    days.extend([int(m) for m in alt_matches])
    
    # Special cases
    if "SHAB QADR" in title_upper or "LAYLAT" in title_upper:
        return [19, 21, 23]  # Nights of Power
    
    if "LAST NIGHT" in title_upper:
        return [29, 30]
    
    if days:
        return list(set(days))  # Remove duplicates
    
    return "all"


def determine_level(title: str, section_type: str) -> int:
    """Determine the priority level (1-3) based on content type."""
    title_upper = title.upper()
    
    # Level 1: Essential daily practices
    if any(keyword in title_upper for keyword in [
        "GENERAL", "IFTITAH", "SHORT DUA", "SHAB QADR", "LAYLAT"
    ]):
        return 1
    
    # Level 3: Advanced practices
    if any(keyword in title_upper for keyword in [
        "PRAYER FOR THE", "PRAYERS FOR THE NIGHTS"
    ]):
        return 3
    
    # Level 2: Intermediate
    return 2


def escape_typescript_string(s: str) -> str:
    """Escape a string for TypeScript template literals."""
    if not s:
        return ""
    # Escape backticks and ${
    s = s.replace("\\", "\\\\")
    s = s.replace("`", "\\`")
    s = s.replace("${", "\\${")
    return s


def process_section(section: dict) -> tuple[list[dict], list[dict]]:
    """Process a section and extract duas and aamal."""
    duas = []
    aamal = []
    
    title = section.get("title", "")
    section_type = section.get("section_type", "unknown")
    content_blocks = section.get("content_blocks", [])
    
    if not content_blocks:
        return duas, aamal
    
    # Determine if this is a dua or aamal section
    is_dua = section_type == "dua" or "DUA" in title.upper()
    is_aamal = section_type == "amaal" or "AAMAL" in title.upper() or "RITES" in title.upper()
    is_prayer = section_type == "prayer" or "PRAYER" in title.upper()
    
    # Extract content
    arabic_texts = []
    english_texts = []
    
    for block in content_blocks:
        if block.get("type") == "arabic_dua":
            arabic_texts.append(block.get("text", ""))
        elif block.get("type") in ["english_text", "instruction"]:
            english_texts.append(block.get("text", ""))
    
    if not arabic_texts and not english_texts:
        return duas, aamal
    
    # Create ID from title
    id_base = re.sub(r"[^a-zA-Z0-9]+", "-", title.lower()).strip("-")
    if not id_base:
        id_base = section.get("id", "unknown")
    
    days = get_day_from_title(title)
    level = determine_level(title, section_type)
    
    # Combine all Arabic text
    combined_arabic = "\n\n".join(arabic_texts) if arabic_texts else ""
    combined_english = "\n\n".join(english_texts) if english_texts else ""
    
    # Create the entry
    entry = {
        "id": id_base,
        "name": title.title() if title else "Unnamed",
        "arabicName": "",  # We don't have Arabic titles in the JSON
        "description": combined_english[:300] + "..." if len(combined_english) > 300 else combined_english,
        "level": level,
        "source": "Mafatih al-Jinan",
        "applicableDays": days,
        "arabicText": combined_arabic,
        "englishTranslation": "",
        "transliteration": "",
        "preamble": "",
        "postamble": "",
    }
    
    if is_dua or (not is_aamal and not is_prayer and arabic_texts):
        duas.append(entry)
    elif is_aamal or is_prayer:
        entry["instructions"] = english_texts
        entry["timing"] = "Night" if "NIGHT" in title.upper() else "Day" if "DAY" in title.upper() else ""
        aamal.append(entry)
    else:
        # Default to dua if has Arabic text
        if arabic_texts:
            duas.append(entry)
        elif english_texts:
            entry["instructions"] = english_texts
            aamal.append(entry)
    
    return duas, aamal


def generate_typescript(duas: list[dict], aamal: list[dict]) -> str:
    """Generate TypeScript content file."""
    
    def format_days(days) -> str:
        if days == "all":
            return "'all'"
        elif isinstance(days, list):
            return f"[{', '.join(str(d) for d in sorted(days))}]"
        return "'all'"
    
    def format_string(s: str) -> str:
        if not s:
            return "''"
        escaped = escape_typescript_string(s)
        return f"`{escaped}`"
    
    def format_instructions(instructions: list) -> str:
        if not instructions:
            return "[]"
        items = [format_string(i) for i in instructions]
        return f"[\n      {',\n      '.join(items)}\n    ]"
    
    lines = [
        "// Auto-generated from mafatih_structured.json",
        "// DO NOT EDIT MANUALLY - Run ramadan_content_extractor.py to regenerate",
        "",
        "export interface Dua {",
        "  id: string;",
        "  name: string;",
        "  arabicName: string;",
        "  description: string;",
        "  level: 1 | 2 | 3;",
        "  source: string;",
        "  applicableDays: 'all' | number[];",
        "  timing?: string;",
        "  arabicText?: string;",
        "  englishTranslation?: string;",
        "  transliteration?: string;",
        "  preamble?: string;",
        "  postamble?: string;",
        "}",
        "",
        "export interface Aamal {",
        "  id: string;",
        "  name: string;",
        "  arabicName: string;",
        "  description: string;",
        "  level: 1 | 2 | 3;",
        "  source: string;",
        "  applicableDays: 'all' | number[];",
        "  timing?: string;",
        "  instructions?: string[];",
        "}",
        "",
        "export const duas: Dua[] = [",
    ]
    
    # Add duas
    for dua in duas:
        lines.append("  {")
        lines.append(f"    id: '{dua['id']}',")
        lines.append(f"    name: {format_string(dua['name'])},")
        lines.append(f"    arabicName: {format_string(dua['arabicName'])},")
        lines.append(f"    description: {format_string(dua['description'])},")
        lines.append(f"    level: {dua['level']},")
        lines.append(f"    source: '{dua['source']}',")
        lines.append(f"    applicableDays: {format_days(dua['applicableDays'])},")
        if dua.get('arabicText'):
            lines.append(f"    arabicText: {format_string(dua['arabicText'])},")
        if dua.get('englishTranslation'):
            lines.append(f"    englishTranslation: {format_string(dua['englishTranslation'])},")
        if dua.get('transliteration'):
            lines.append(f"    transliteration: {format_string(dua['transliteration'])},")
        lines.append("  },")
    
    lines.append("];")
    lines.append("")
    lines.append("export const aamal: Aamal[] = [")
    
    # Add aamal
    for a in aamal:
        lines.append("  {")
        lines.append(f"    id: '{a['id']}',")
        lines.append(f"    name: {format_string(a['name'])},")
        lines.append(f"    arabicName: {format_string(a['arabicName'])},")
        lines.append(f"    description: {format_string(a['description'])},")
        lines.append(f"    level: {a['level']},")
        lines.append(f"    source: '{a['source']}',")
        lines.append(f"    applicableDays: {format_days(a['applicableDays'])},")
        if a.get('timing'):
            lines.append(f"    timing: '{a['timing']}',")
        if a.get('instructions'):
            lines.append(f"    instructions: {format_instructions(a['instructions'])},")
        lines.append("  },")
    
    lines.append("];")
    lines.append("")
    
    return "\n".join(lines)


def main():
    print("Loading Mafatih JSON...")
    data = load_json()
    
    print("Finding Ramadan chapter...")
    ramadan_chapter = find_ramadan_chapter(data)
    
    if not ramadan_chapter:
        print("ERROR: Could not find Ramadan chapter!")
        return
    
    print(f"Found: {ramadan_chapter.get('title', 'Unknown')}")
    
    all_duas = []
    all_aamal = []
    
    # Process main chapter content blocks
    duas, aamal = process_section(ramadan_chapter)
    all_duas.extend(duas)
    all_aamal.extend(aamal)
    
    # Process subsections
    subsections = ramadan_chapter.get("subsections", [])
    print(f"Processing {len(subsections)} subsections...")
    
    for subsection in subsections:
        duas, aamal = process_section(subsection)
        all_duas.extend(duas)
        all_aamal.extend(aamal)
        
        # Process nested subsections if any
        for nested in subsection.get("subsections", []):
            duas, aamal = process_section(nested)
            all_duas.extend(duas)
            all_aamal.extend(aamal)
    
    print(f"Extracted {len(all_duas)} duas and {len(all_aamal)} aamal")
    
    # Generate TypeScript
    print("Generating TypeScript...")
    ts_content = generate_typescript(all_duas, all_aamal)
    
    # Write output
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(ts_content)
    
    print(f"Written to: {OUTPUT_PATH}")
    print("Done!")


if __name__ == "__main__":
    main()
