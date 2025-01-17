import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { UsbConnectorType } from '../src/types/board.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BOARDS_DIR = join(__dirname, '../src/data/boards');

// List of all required boolean fields that should default to false
const REQUIRED_BOOLEAN_FIELDS = [
  'threadProtocol',
  'batteryConnector',
  'batteryMonitoring',
  'dualLDOs',
  'pioUSB',
  'usbDetection',
  'dualUSB',
  'hid',
  'speaker',
  'microphone',
  'solarCharging'
];

function fixBoard(boardData: any, filename: string): any {
  // Add id if missing (use filename without extension)
  if (!boardData.id) {
    boardData.id = filename.replace('.json', '');
  }

  // Add brand if missing (extract from id)
  if (!boardData.brand) {
    const brandMatch = boardData.id.match(/^([a-zA-Z0-9-]+)/);
    boardData.brand = brandMatch ? brandMatch[1] : 'unknown';
  }

  // Add missing boolean fields
  for (const field of REQUIRED_BOOLEAN_FIELDS) {
    if (boardData[field] === undefined) {
      boardData[field] = false;
    }
  }

  // Fix dimensions if needed
  if (boardData.dimensions) {
    if (!boardData.dimensions.height || boardData.dimensions.height <= 0) {
      boardData.dimensions.height = 1; // Default to 1mm if invalid
    }
    if (!boardData.dimensions.width || boardData.dimensions.width <= 0) {
      boardData.dimensions.width = 1;
    }
    if (!boardData.dimensions.length || boardData.dimensions.length <= 0) {
      boardData.dimensions.length = 1;
    }
  }

  // Fix GPIO count if needed
  if (!boardData.gpio || boardData.gpio <= 0) {
    boardData.gpio = 1; // Default to 1 GPIO if invalid
  }

  // Fix USB connector type if missing
  if (!boardData.usbConnectorType) {
    // Try to guess based on board name/brand
    if (filename.includes('pro-mini')) {
      boardData.usbConnectorType = UsbConnectorType.None;
    } else if (filename.includes('uno-rev3') || filename.includes('mega')) {
      boardData.usbConnectorType = UsbConnectorType.UsbB;
    } else {
      boardData.usbConnectorType = UsbConnectorType.MicroUsb; // Most common default
    }
  }

  // Fix image URLs
  if (boardData.imageUrl) {
    // Convert GitHub raw URLs to use githubusercontent.com
    boardData.imageUrl = boardData.imageUrl.replace(
      'raw.githubusercontent.com',
      'raw.githubusercontent.com'
    );

    // Convert webp to jpg for M5Stack images
    if (boardData.imageUrl.includes('m5stack.com') && boardData.imageUrl.endsWith('.webp')) {
      boardData.imageUrl = boardData.imageUrl.replace('.webp', '.jpg');
    }

    // Use smaller Adafruit images
    if (boardData.imageUrl.includes('cdn-shop.adafruit.com')) {
      boardData.imageUrl = boardData.imageUrl.replace('970x728', '500x400');
    }
  }

  return boardData;
}

async function fixBoards() {
  const boardFiles = readdirSync(BOARDS_DIR).filter(file => file.endsWith('.json'));

  for (const file of boardFiles) {
    try {
      const boardPath = join(BOARDS_DIR, file);
      const boardData = JSON.parse(readFileSync(boardPath, 'utf8'));
      const fixedBoardData = fixBoard(boardData, file);
      writeFileSync(boardPath, JSON.stringify(fixedBoardData, null, 2));
      console.log(`Fixed ${file}`);
    } catch (error) {
      console.error(`Failed to fix ${file}:`, error);
    }
  }
}

fixBoards().then(() => {
  console.log('All boards fixed!');
});
