import express from 'express';
import bodyParser from 'body-parser';
import { PORT } from "./config/env.js";
import verifySignature from './middleware/verifySignature.js';
import webhookRoute from './routes/webhook.js';

const app = express();

app.use(
  bodyParser.json()
);

app.use('/webhook', webhookRoute);

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(400).send('Webhook Error: ' + err.message);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
