// Add this line to the very top to disable caching for all auth routes
export const dynamic = "force-dynamic";

import { auth } from "@/app/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);