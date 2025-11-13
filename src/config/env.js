import dotenv from 'dotenv';
dotenv.config();

exports = {
  PORT: process.env.PORT || 3000,
  GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET,
};
