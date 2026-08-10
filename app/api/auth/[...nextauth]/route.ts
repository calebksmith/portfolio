import { handlers } from "@/lib/auth";

/**
 * Auth.js mounts its whole surface here: the sign-in redirect, the OAuth
 * callback that receives GitHub's authorization code, sign-out, and the session
 * endpoint. The catch-all segment is what lets one file serve all of them.
 */
export const { GET, POST } = handlers;
