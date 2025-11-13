import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

export { PORT, GITHUB_WEBHOOK_SECRET };
