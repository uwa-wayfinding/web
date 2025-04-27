import { db } from "@/lib/db";
import { serverEnv } from "@/lib/env";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// No need to check for environment variables as the schema validation
// will throw an error if they are missing

export const auth = betterAuth({
  emailAndPassword: {
    enabled: false,
  },

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: 'Ov23liRxvNalV0BQJwSH',
      clientSecret: '9e411d549a57b715659d63b55f29bb3a250cf6f7'
    }
  },
});
