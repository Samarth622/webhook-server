import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runESLint(targetPath) {
  const configPath = path.join(targetPath, 'eslint.config.js');

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(
      configPath,
      `
export default [
  {
    files: ["**/*.js"],
    rules: {
      semi: "error",
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off"
    }
  }
];
`
    );
  }

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
