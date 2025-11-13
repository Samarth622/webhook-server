import crypto from 'crypto';
import { GITHUB_WEBHOOK_SECRET } from "../config/env.js";

function verifySignature(req, res, buf) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    throw new Error('No X-Hub-Signature-256 header');
  }

  const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
  hmac.update(buf);
  const digest = `sha256=${hmac.digest('hex')}`;

  const safeCompare = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );

  if (!safeCompare) {
    throw new Error('Invalid signature');
  }
}

export default verifySignature;