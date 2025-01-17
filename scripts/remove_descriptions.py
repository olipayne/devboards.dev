#!/usr/bin/env python3
import json
import os
from pathlib import Path

def process_board_file(file_path: Path) -> bool:
    """Process a single board JSON file. Returns True if file was modified."""
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        if 'description' in data:
            del data['description']
            # Pretty print JSON with 2-space indentation
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=2)
            print(f"Removed description from {file_path.name}")
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
    print(f"Removed descriptions from {modified_count} files")

if __name__ == '__main__':
    main()
