import path from 'path';
import fs from 'fs';
import simpleGit from 'simple-git';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_BASE_PATH = path.resolve(__dirname, '../../repos');

if (!fs.existsSync(REPO_BASE_PATH)) {
  fs.mkdirSync(REPO_BASE_PATH, { recursive: true });
}

async function cloneOrPullRepo(repoUrl, repoName, branch = 'main') {
  const repoPath = path.join(REPO_BASE_PATH, repoName);
  const git = simpleGit();

  if (fs.existsSync(repoPath)) {
    console.log(`🔁 Pulling latest changes for ${repoName}`);
    await git.cwd(repoPath).pull('origin', branch);
  } else {
    console.log(`📥 Cloning repo ${repoUrl}`);
    await git.clone(repoUrl, repoPath, ['-b', branch]);
  }

  return repoPath;
}

export {
  cloneOrPullRepo,
};
