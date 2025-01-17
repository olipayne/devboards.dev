#!/usr/bin/env python3
import json
import os
from pathlib import Path

def clean_board_name(name: str, manufacturer: str) -> str:
    """Remove manufacturer name from the start of board name if present."""
    # Convert both to lower case for case-insensitive comparison
    name_lower = name.lower()
    manufacturer_lower = manufacturer.lower()
    
    # Check if name starts with manufacturer (case insensitive)
    if name_lower.startswith(manufacturer_lower):
        # Remove manufacturer name and any following spaces/hyphens
        cleaned_name = name[len(manufacturer):].lstrip(' -')
        return cleaned_name
    return name

def process_board_file(file_path: Path) -> bool:
    """Process a single board JSON file. Returns True if file was modified."""
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        if 'name' not in data or 'manufacturer' not in data:
            print(f"Warning: Missing required fields in {file_path}")
            return False
        
        original_name = data['name']
        cleaned_name = clean_board_name(original_name, data['manufacturer'])
        
        if cleaned_name != original_name:
            data['name'] = cleaned_name
            # Pretty print JSON with 2-space indentation
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=2)
            print(f"Updated {file_path.name}: '{original_name}' -> '{cleaned_name}'")
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    # Get the absolute path to the boards directory
    script_dir = Path(__file__).parent
    boards_dir = script_dir.parent / 'src' / 'data' / 'boards'
    
    if not boards_dir.exists():
        print(f"Error: Boards directory not found at {boards_dir}")
        return
    
    modified_count = 0
    total_count = 0
    
    # Process all JSON files in the boards directory
    for file_path in boards_dir.glob('*.json'):
        total_count += 1
        if process_board_file(file_path):
            modified_count += 1
    
    print(f"\nProcessed {total_count} board files")
    print(f"Modified {modified_count} board names")

if __name__ == '__main__':
    main()
