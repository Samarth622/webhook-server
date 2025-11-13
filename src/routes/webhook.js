import express from "express";
import { cloneOrPullRepo } from "../utils/git.js";
import { runESLint } from "../utils/analyze.js";
import { reviewCodeWithGemini } from "../utils/gemini.js";
import fs from "fs";
import path from "path";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const event = req.headers["x-github-event"];
    if (event !== "push") return res.sendStatus(204);

    const payload = req.body;
    const repoUrl = payload.repository.clone_url;
    const repoName = payload.repository.name;
    const branch = payload.ref.split("/").pop();
    const commitId = payload.head_commit.id;

    console.log(`🔄 Processing ${repoName} → ${branch} → ${commitId}`);
    const localRepoPath = await cloneOrPullRepo(repoUrl, repoName, branch);

    console.log("🔍 Running ESLint...");
    const eslintResults = await runESLint(localRepoPath);
    const errorCount = eslintResults.reduce(
      (acc, file) => acc + file.errorCount,
      0
    );
    const warningCount = eslintResults.reduce(
      (acc, file) => acc + file.warningCount,
      0
    );
    console.log(`✅ ESLint: ${errorCount} errors, ${warningCount} warnings`);;

    const changedFiles = payload.head_commit.modified.concat(
      payload.head_commit.added
    );

    const reviewResults = [];

    for (const file of changedFiles) {
      const fullPath = path.join(localRepoPath, file);

      if (fs.existsSync(fullPath) && file.endsWith(".js")) {
        console.log(`🤖 Reviewing ${file}...`);
        const suggestion = await reviewCodeWithGemini(fullPath);
        reviewResults.push({ file, suggestion });
      }
    }

    res.status(200).json({
      message: "Analysis complete",
      eslintErrors: errorCount,
      eslintWarnings: warningCount,
      filesReviewed: reviewResults.length,
      suggestions: reviewResults,
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).send("Analysis failed");
  }
});

export default router;
