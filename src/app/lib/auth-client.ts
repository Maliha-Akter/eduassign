import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

// Create a single client instance with your configuration
export const authClient = createAuthClient({
    // Use NEXT_PUBLIC_ if this needs to be exposed to the browser in Next.js
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL,
    plugins: [jwtClient()],
});

// Export the methods directly from the configured instance
export const { signIn, signUp, useSession, signOut } = authClient;