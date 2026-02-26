import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT,
  // Accept both names to avoid misconfigured deploy envs (Render/Vercel/etc.)
  MONGO_URI: process.env.MONGO_URI || process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  ARCJET_KEY: process.env.ARCJET_KEY,
  // If not explicitly set, mirror NODE_ENV so production deploys don't run Arcjet in dev mode.
  ARCJET_ENV: process.env.ARCJET_ENV || process.env.NODE_ENV || "development",
};
