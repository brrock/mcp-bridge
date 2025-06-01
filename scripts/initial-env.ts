<<<<<<< HEAD
import fs from "fs";
import path from "path";
=======
import fs from 'fs';
import path from 'path';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)

// Get current directory path
const ROOT = process.cwd();
/**
 * Copy .env.example to .env if .env doesn't exist
 */
function copyEnvFile() {
<<<<<<< HEAD
  const envPath = path.join(ROOT, ".env");
  const envExamplePath = path.join(ROOT, ".env.example");

  if (!fs.existsSync(envPath)) {
    try {
      console.warn(".env file not found. Copying from .env.example...");
      fs.copyFileSync(envExamplePath, envPath);
      console.log(".env file has been created.");
      console.warn(
        "Important: You may need to edit the .env file to set your API keys.",
      );
    } catch (error) {
      console.error("Error occurred while creating .env file.");
=======
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
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
      console.error(error);
      return false;
    }
  } else {
<<<<<<< HEAD
    console.info(".env file already exists. Skipping...");
  }


=======
    console.info('.env file already exists. Skipping...');
  }

>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
  return true;
}

// Execute copy operation
const result = copyEnvFile();
<<<<<<< HEAD
process.exit(result ? 0 : 1);
=======
process.exit(result ? 0 : 1);
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
