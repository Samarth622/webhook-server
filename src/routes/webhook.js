import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  console.log("🚀 Headers: ", req.headers);

  console.log("📬 Webhook received: ", payload);

  console.log(`📦 Received GitHub Event: ${event}`);
  console.log(`🧑 Author: ${payload.head_commit?.author?.name}`);
  console.log(`📄 Message: ${payload.head_commit?.message}`);

  res.status(200).json({ message: "Webhook received successfully" });
});

export default router;