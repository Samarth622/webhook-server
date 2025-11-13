import express from "express";
const router = express.Router();
import { cloneOrPullRepo } from "../utils/git.js";

router.post("/", async (req, res) => {
  try {
    const event = req.headers['x-github-event'];
    if (event !== 'push') return res.sendStatus(204);

    const payload = req.body;

    const repoUrl = payload.repository.clone_url;
    const repoName = payload.repository.name;
    const branch = payload.ref.split('/').pop();
    const commitId = payload.head_commit.id;

    console.log(`🧠 Processing push to ${repoName} on branch ${branch}`);
    console.log(`🔗 Repo: ${repoUrl}`);
    console.log(`📌 Commit: ${commitId}`);

    const localRepoPath = await cloneOrPullRepo(repoUrl, repoName, branch);
    console.log(`✅ Code ready at: ${localRepoPath}`);

    res.status(200).json({ message: 'Repo ready for analysis' });
  } catch (err) {
    console.error('❌ Error handling push:', err.message);
    res.status(500).send('Error processing push event');
  }
});

export default router;