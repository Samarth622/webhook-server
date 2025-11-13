import express from 'express';
import { cloneOrPullRepo } from '../utils/git.js';
import { runESLint, runPrettier } from '../utils/analyze.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const event = req.headers['x-github-event'];
    if (event !== 'push') return res.sendStatus(204);

    const payload = req.body;
    const repoUrl = payload.repository.clone_url;
    const repoName = payload.repository.name;
    const branch = payload.ref.split('/').pop();
    const commitId = payload.head_commit.id;

    console.log(`🔄 Processing ${repoName} → ${branch} → ${commitId}`);
    const localRepoPath = await cloneOrPullRepo(repoUrl, repoName, branch);

    console.log('🔍 Running ESLint...');
    const eslintResults = await runESLint(localRepoPath);
    const errorCount = eslintResults.reduce((acc, file) => acc + file.errorCount, 0);
    const warningCount = eslintResults.reduce((acc, file) => acc + file.warningCount, 0);
    console.log(`✅ ESLint: ${errorCount} errors, ${warningCount} warnings`);

    console.log('🧼 Checking Prettier...');
    const prettierOutput = await runPrettier(localRepoPath);
    console.log(`🧾 Prettier Output:\n${prettierOutput}`);

    res.status(200).json({
      message: 'Analysis complete',
      eslintErrors: errorCount,
      eslintWarnings: warningCount,
      prettierSummary: prettierOutput,
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).send('Analysis failed');
  }
});

export default router;
