import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    // Database
    DATABASE_URL: z.string().url(),

    // Google Auth
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    // Auth
    BETTER_AUTH_SECRET: z.string().min(1),

    // R2
    R2_ACCESS_KEY: z.string().min(1),
    R2_SECRET_KEY: z.string().min(1),
    R2_ENDPOINT: z.string().min(1),
    // R2_BUCKET: z.string().min(1),
    R2_PUBLIC_URL: z.string().url(),

    // Node environment
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("production"),
  },
  experimental__runtimeEnv: process.env,
});
