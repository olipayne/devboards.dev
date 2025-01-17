#!/usr/bin/env python3

import json
import os
import re
from pathlib import Path
from typing import Dict, Any

def fix_json_file(filepath: Path) -> str:
    """Try to fix common JSON issues in the file."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Try to find the complete JSON object
    match = re.search(r'({[^}]*"hits":\s*\[.*?\]})', content, re.DOTALL)
    if match:
        return match.group(1)
    
    return content

def slugify(text: str) -> str:
    """Convert text to a URL-friendly slug."""
    # Convert to lowercase and replace spaces with hyphens
    text = text.lower().replace(' ', '-')
    # Remove any characters that aren't alphanumeric or hyphens
    text = re.sub(r'[^a-z0-9-]', '', text)
    # Remove multiple consecutive hyphens
    text = re.sub(r'-+', '-', text)
    return text

def convert_board(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Convert a board document to the new format."""
    features = doc.get('featureData', {})
    if not isinstance(features, dict):
        features = {}
    
    # Map USB connector types
    usb_type_map = {
        'USB-Micro': 'Micro-USB',
        'USB-C': 'Type-C',
        'USB-A': 'USB-A',
        'USB-B': 'USB-B',
        'Mini-USB': 'Mini-USB',
    }
    
    try:
        new_board = {
            'id': doc['id'],
            'name': doc['product_name'],
            'manufacturer': doc['product_manufacture'],
            'description': doc['product_desc'],
            'cpu': doc['product_cpu'],
            'cpuArchitecture': doc['product_cpuArch'],
            'cpuSpeed': doc['product_cpuSpeed'],
            'flash': doc['product_flash'],
            'ram': doc.get('product_ram', ''),
            'price': doc.get('product_price', None),
            'dimensions': {
                'length': doc.get('sizeX', 0),
                'width': doc.get('sizeY', 0),
                'height': doc.get('sizeZ', 0),
            },
            'gpio': doc.get('product_gpio', 0),
            'analog': doc.get('product_analog', 0),
            'usbConnectorType': usb_type_map.get(doc.get('product_usb', ''), None),
            
            # Features
            'wifi': features.get('WiFi', False),
            'bluetooth': features.get('Bluetooth', False),
            'lora': features.get('LoRa', False),
            'ethernet': features.get('Ethernet', False),
            'zigbee': features.get('Zigbee', False),
            'can': features.get('CAN', False),
            'matter': features.get('Matter', False),
            
            # Sensors
            'accelerometer': features.get('Accelerometer', False),
            'gyroscope': features.get('gyroscope', False),
            'temperatureSensor': features.get('TemperatureSensor', False),
            'hallSensor': features.get('HallSensor', False),
            'lightSensor': features.get('LightSensor', False),
            'altitudeSensor': features.get('AltitudeSensor', False),
            'motionSensor': features.get('MotionSensor', False),
            
            # Power features
            'batteryPowered': features.get('BatteryPowered', False),
            'liPoCharging': features.get('LiPoCharging', False),
            'ultraLowPower': features.get('UltraLowPower', False),
            'lowPowerDeepSleep': features.get('LowPowerDeepSleep', False),
            'barrelJack5V': features.get('BarrelJack5V', False),
            'poe': features.get('POE', False),
            
            # Other features
            'camera': features.get('Camera', False),
            'display': features.get('Display', False) or features.get('Screen', False),
            'touchScreen': features.get('TouchScreen', False),
            'sdCard': features.get('SDCard', False),
            'openSource': features.get('OpenSource', False),
            'breadBoardFriendly': features.get('BreadBoardFriendly', False),
            'rtc': features.get('RTC', False),
            
            # Interfaces
            'i2c': features.get('i2c', False),
            'spi': features.get('SPI', False),
            'nativeUSB': features.get('NativeUSB', False),
            'usbHost': features.get('USBHost', False),
            'stemmaConnector': features.get('StemmaConnector', False),
            'groveConnector': features.get('GROVE', False),
            'uextConnector': features.get('UEXTConnector', False),
            
            # URLs and resources
            'productUrl': doc.get('url2', '') or doc.get('url1', ''),
            'schematicUrl': doc.get('schematic_url', ''),
            'githubUrl': doc.get('github', ''),
            'imageUrl': doc.get('urlPhoto', ''),
        }
        
        # Remove None values and empty strings
        return {k: v for k, v in new_board.items() if v is not None and v != ''}
    except KeyError as e:
        print(f"Missing required field in board: {e}")
        print(f"Board data: {doc}")
        return None

def main():
    # Create output directory if it doesn't exist
    output_dir = Path(__file__).parent.parent / 'src' / 'data' / 'boards'
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Read and fix the input file
    input_file = Path(__file__).parent.parent / 'boards.json'
    
    print("Reading boards.json...")
    with open(input_file, 'r') as f:
        content = f.read()
    
    # Try different approaches to parse the JSON
    json_attempts = [
        content,  # Try original content
        fix_json_file(input_file),  # Try regex-fixed content
        re.sub(r',\s*}', '}', content),  # Try removing trailing commas
        re.sub(r',\s*]', ']', content),  # Try removing trailing commas in arrays
    ]
    
    data = None
    for attempt in json_attempts:
        try:
            data = json.loads(attempt)
            break
        except json.JSONDecodeError:
            continue
    
    if not data:
        print("Failed to parse JSON file after multiple attempts")
        return
    
    print(f"Found {len(data.get('hits', []))} boards in the file")
    converted = 0
    failed = 0
    
    # Convert each board
    if isinstance(data, dict) and 'hits' in data:
        for hit in data['hits']:
            try:
                doc = hit.get('document')
                if not doc:
                    print(f"Missing document in hit: {hit}")
                    failed += 1
                    continue
                
                board = convert_board(doc)
                if not board:
                    failed += 1
                    continue
                
                # Create filename from board name
                filename = f"{slugify(board['name'])}.json"
                
                # Write to file
                output_path = output_dir / filename
                with open(output_path, 'w') as f:
                    json.dump(board, f, indent=2)
                print(f"Converted {board['name']} -> {filename}")
                converted += 1
            except Exception as e:
                print(f"Error converting board: {e}")
                failed += 1
                continue
    else:
        print("Invalid data format: Expected a dictionary with 'hits' key")
    
    print(f"\nConversion complete:")
    print(f"Successfully converted: {converted} boards")
    print(f"Failed to convert: {failed} boards")

if __name__ == '__main__':
    main()
