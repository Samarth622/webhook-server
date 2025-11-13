import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run ESLint on a target directory
export function runESLint(targetPath) {
  return new Promise((resolve, reject) => {
    exec(
      `npx eslint . --ext .js,.jsx,.ts,.tsx -f json`,
      { cwd: targetPath },
      (err, stdout, stderr) => {
        if (err && !stdout) {
          return reject(new Error(stderr));
        }

        try {
          const results = JSON.parse(stdout);
          resolve(results);
        } catch (parseErr) {
          reject(new Error('Failed to parse ESLint output: ' + parseErr.message));
        }
      }
    );
  });
}

// Run Prettier on a target directory
export function runPrettier(targetPath) {
  return new Promise((resolve, reject) => {
    exec(
      `npx prettier "**/*.{js,jsx,ts,tsx}" --check`,
      { cwd: targetPath },
      (err, stdout, stderr) => {
        if (err && !stdout) {
          return reject(new Error(stderr));
        }

        resolve(stdout.trim());
      }
    );
  });
}
