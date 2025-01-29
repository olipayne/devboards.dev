import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { BoardSchema } from '../src/schemas/board.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BOARDS_DIR = join(__dirname, '../src/data/boards');

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch (err) {
    return false;
  }
}

// Additional validation helpers
function isReasonablePrice(price: number): boolean {
  return price > 0 && price < 1000; // Most dev boards are under $1000
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && date <= new Date();
}

function hasValidDimensions(dimensions: any): boolean {
  return dimensions.length > 0 && dimensions.width > 0 && dimensions.height > 0 &&
         dimensions.length < 1000 && dimensions.width < 1000 && dimensions.height < 1000; // Most boards < 1m
}

async function validateBoards(): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
  };

  const boardFiles = readdirSync(BOARDS_DIR).filter(file => file.endsWith('.json'));
  console.log(`Found ${boardFiles.length} board files to validate`);

  // Track unique values across all boards
  const imageUrlToBoard = new Map<string, string>();
  const usedNames = new Set<string>();

  // First pass: collect all image URLs
  for (const file of boardFiles) {
    try {
      const boardData = JSON.parse(readFileSync(join(BOARDS_DIR, file), 'utf8'));
      
      // Track image URLs
      if (boardData.urls?.image) {
        const imageUrl = boardData.urls.image;
        if (imageUrlToBoard.has(imageUrl)) {
          result.valid = false;
          result.errors.push(`${file}: Image URL ${imageUrl} is already used by ${imageUrlToBoard.get(imageUrl)}`);
        } else {
          imageUrlToBoard.set(imageUrl, file);
        }
      }
    } catch (error) {
      result.valid = false;
      result.errors.push(`Failed to process ${file} during image collection: ${error}`);
    }
  }

  // Second pass: validate everything else
  for (const file of boardFiles) {
    try {
      process.stdout.write(`Validating ${file}...`);
      const boardData = JSON.parse(readFileSync(join(BOARDS_DIR, file), 'utf8'));
      
      // Validate against schema
      try {
        BoardSchema.parse(boardData);
        process.stdout.write(' schema ');
      } catch (error: any) {
        result.valid = false;
        result.errors.push(`Schema validation failed for ${file}: ${error.message}`);
        process.stdout.write(' failed ');
        console.log('');
        continue;
      }

      // Check for reasonable price
      if (!isReasonablePrice(boardData.price)) {
        result.valid = false;
        result.errors.push(`${file}: Price ${boardData.price} seems unreasonable`);
      }

      // Check release date
      if (!isValidDate(boardData.releaseDate)) {
        result.valid = false;
        result.errors.push(`${file}: Invalid release date ${boardData.releaseDate}`);
      }

      // Check dimensions
      if (!hasValidDimensions(boardData.dimensions)) {
        result.valid = false;
        result.errors.push(`${file}: Invalid dimensions`);
      }

      // Validate URL formats
      if (boardData.urls) {
        for (const [key, url] of Object.entries(boardData.urls)) {
          if (typeof url === 'string' && !isValidUrl(url)) {
            result.valid = false;
            result.errors.push(`${file}: Invalid URL format for ${key}: ${url}`);
          }
        }
      }

      // Check for unique board identifiers
      const boardIdentifier = `${boardData.manufacturer}_${boardData.name}`;
      if (usedNames.has(boardIdentifier)) {
        result.valid = false;
        result.errors.push(`${file}: Duplicate board name ${boardIdentifier}`);
      }
      usedNames.add(boardIdentifier);

      // Check for reasonable CPU frequency
      if (boardData.cpu.frequency && (boardData.cpu.frequency <= 0 || boardData.cpu.frequency > 5000)) {
        result.valid = false;
        result.errors.push(`${file}: CPU frequency ${boardData.cpu.frequency}MHz seems unreasonable`);
      }

      // Check memory values
      if (boardData.memory) {
        if (boardData.memory.flash && (boardData.memory.flash <= 0 || boardData.memory.flash > 1024)) {
          result.valid = false;
          result.errors.push(`${file}: Flash memory ${boardData.memory.flash}MB seems unreasonable`);
        }
        if (boardData.memory.ram && (boardData.memory.ram <= 0 || boardData.memory.ram > 1024)) {
          result.valid = false;
          result.errors.push(`${file}: RAM ${boardData.memory.ram}KB seems unreasonable`);
        }
      }

      process.stdout.write(' passed\n');
    } catch (error) {
      result.valid = false;
      result.errors.push(`Failed to process ${file}: ${error}`);
      process.stdout.write(' failed\n');
    }
  }

  return result;
}

validateBoards().then(result => {
  // Write results to file
  writeFileSync('validation-results.json', JSON.stringify(result, null, 2));

  if (!result.valid) {
    console.error('\nValidation failed with the following errors:');
    result.errors.forEach(error => console.error(`- ${error}`));
    process.exit(1);
  } else {
    console.log('\nAll boards validated successfully!');
  }
});
