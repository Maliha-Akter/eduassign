import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"; 
import { MongoClient, Db } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { createAuthMiddleware, APIError } from "better-auth/api";

const mongoUri = process.env.MONGODB_URI;
const authDbName = process.env.AUTH_DB_NAME;

// 1. Strict Environment Variable Validation
if (!mongoUri) {
  console.error("Critical Error: MONGODB_URI environment variable is missing.");
  process.exit(1);
}

// Initialize MongoDB client
const client: MongoClient = new MongoClient(mongoUri);
const db: Db = client.db(authDbName);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL as string, 

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: (process.env.GOOGLE_CLIENT_ID as string) || "",
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET as string) || "",
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Check if a login/session generation endpoint just ran successfully
      const session = ctx.context.newSession;

      // Intercept if the authenticated user has the blocked flag active
      if (session && session.user && session.user.isBlocked === true) {
        throw new APIError("UNAUTHORIZED", {
          message: "Your account has been suspended by an administrator.",
        });
      }
    }),
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        // Default role for new signups on EduAssign
        defaultValue: 'student', 
        input: true,
      },
      isBlocked: {
        type: 'boolean',
        defaultValue: false,
        input: false, // Prevents manipulation from the client payload during signup
      },
      
      // --- Student Specific Fields ---
      class: {
        type: 'string',
        required: false, // Optional because teachers don't have this
        input: true,     // Allows it to be passed during signup
      },

      // --- Teacher Specific Fields ---
      primarySubject: {
        type: 'string',
        required: false, // Optional because students don't have this
        input: true,
      },
      qualification: {
        type: 'string',
        required: false, 
        input: true,
      }
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24, // 1 day in seconds
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 24 * 60,
    },
  },
  
  plugins: [jwt()],
});

// ✅ Explicitly extract the individual inner types from the inferred object.
// The new fields (class, primarySubject, qualification) will automatically 
// be included in this exported User type.
export type Session = typeof auth.$Infer.Session["session"];
export type User = typeof auth.$Infer.Session["user"];