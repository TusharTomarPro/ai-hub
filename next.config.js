const nextConfig = {
  reactStrictMode: true,
  env: {
    HF_API_KEY: process.env.HF_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY
  }
};
module.exports = nextConfig;
