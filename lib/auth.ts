import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { getDb, schema } from "@/lib/db";
import { env } from "@/lib/env";

/**
 * Auth.js (NextAuth v5) configuration — GitHub OAuth, database sessions.
 *
 * ---------------------------------------------------------------------------
 * The authorization-code flow, and where each leg lands in this codebase
 * ---------------------------------------------------------------------------
 * 1. The visitor hits /api/auth/signin/github. Auth.js redirects the browser to
 *    github.com/login/oauth/authorize with our client_id, a redirect_uri, and a
 *    single-use `state` value it also stores in a cookie (this is the CSRF
 *    defence — GitHub echoes `state` back and Auth.js checks it matches).
 * 2. The visitor approves on GitHub's own domain. Our app never sees their
 *    GitHub password; that is the entire point of OAuth over asking for
 *    credentials directly.
 * 3. GitHub redirects back to /api/auth/callback/github?code=...&state=...
 *    The `code` is a short-lived, single-use authorization code. It is not a
 *    token and cannot be used to call the API.
 * 4. Server-side, Auth.js POSTs that code plus our client_secret to GitHub's
 *    token endpoint and receives an access token. This is the "exchange", and
 *    it happens back-channel — the token never travels through the browser.
 * 5. The token and provider ids are written to the `account` table; the person
 *    is written to `user`; a random session token is written to `session` and
 *    set as an HttpOnly cookie.
 *
 * That is why this uses `strategy: "database"` rather than the JWT default:
 * every step above leaves an inspectable row. It also means sign-out and
 * revocation are real — deleting the session row ends the session immediately,
 * whereas a signed JWT stays valid until it expires no matter what you delete.
 * The cost is a database read per request, which is irrelevant at this scale.
 *
 * See docs/decisions/0003-authentication.md.
 */

export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  /**
   * Lazily constructed so that importing this module does not require
   * DATABASE_URL — `next build` reaches here on routes that never authenticate.
   */
  adapter: DrizzleAdapter(getDb(), {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),

  providers: [
    GitHub({
      clientId: env.githubClientId,
      clientSecret: env.githubClientSecret,
    }),
  ],

  session: { strategy: "database" },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  callbacks: {
    /**
     * Authentication is not authorization.
     *
     * GitHub will happily prove the identity of any of its ~100 million users.
     * Returning false here is what stops them: only logins on the allowlist get
     * an account row at all. Rejecting at sign-in rather than at the admin
     * layout means an unauthorized visitor never gets a session in the first
     * place.
     */
    signIn({ profile }) {
      const login =
        typeof profile?.login === "string"
          ? profile.login.toLowerCase()
          : undefined;
      return Boolean(login && env.adminGithubLogins.includes(login));
    },

    /** Expose the user id on the session so the DAL can use it. */
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
}));
