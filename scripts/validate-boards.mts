import { readFileSync, readdirSync } from 'fs';
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

async function validateBoards(): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
  };

  const boardFiles = readdirSync(BOARDS_DIR).filter(file => file.endsWith('.json'));
  console.log(`Found ${boardFiles.length} board files to validate`);

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
        process.stdout.write(' schema ');
        console.log(''); // New line
        continue;
      }

      // Check for duplicate IDs
      const duplicateCheck = boardFiles
        .filter(f => f !== file)
        .map(f => JSON.parse(readFileSync(join(BOARDS_DIR, f), 'utf8')))
        .some(b => b.id === boardData.id);

      if (duplicateCheck) {
        result.valid = false;
        result.errors.push(`Duplicate board ID found: ${boardData.id}`);
        process.stdout.write(' duplicate ');
      } else {
        process.stdout.write(' duplicate ');
      }

      // Validate image URL format
      if (!isValidUrl(boardData.imageUrl)) {
        result.valid = false;
        result.errors.push(`Invalid image URL format in ${file}: ${boardData.imageUrl}`);
        process.stdout.write(' url ');
      } else {
        process.stdout.write(' url ');
      }

      console.log(''); // New line after each file

    } catch (error) {
      result.valid = false;
      result.errors.push(`Failed to parse ${file}: ${error}`);
      console.log(' parse error ');
    }
  }

  return result;
}

validateBoards().then(result => {
  if (!result.valid) {
    console.error('\nValidation failed with the following errors:');
    result.errors.forEach(error => console.error(`- ${error}`));
    process.exit(1);
  } else {
    console.log('\nAll boards validated successfully!');
  }
});
