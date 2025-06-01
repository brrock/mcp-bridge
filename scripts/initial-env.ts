import fs from 'fs';
import path from 'path';

// Get current directory path
const ROOT = process.cwd();
/**
 * Copy .env.example to .env if .env doesn't exist
 */
function copyEnvFile() {
  const envPath = path.join(ROOT, '.env');
  const envExamplePath = path.join(ROOT, '.env.example');

  if (!fs.existsSync(envPath)) {
    try {
      console.warn('.env file not found. Copying from .env.example...');
      fs.copyFileSync(envExamplePath, envPath);
      console.log('.env file has been created.');
      console.warn(
        'Important: You may need to edit the .env file to set your API keys.',
      );
    } catch (error) {
      console.error('Error occurred while creating .env file.');
      console.error(error);
      return false;
    }
  } else {
    console.info('.env file already exists. Skipping...');
  }

  return true;
}

// Execute copy operation
const result = copyEnvFile();
process.exit(result ? 0 : 1);
