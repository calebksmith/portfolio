/**
 * Environment access.
 *
 * Read through this module rather than touching process.env directly, so that a
 * missing variable fails with a sentence telling you what to do instead of an
 * `undefined` propagating into a connection string.
 *
 * Every accessor is a lazy getter on purpose: importing this file must never
 * throw. `next build` imports modules that transitively reach here on routes
 * that do not actually query, and eager validation would break the build on a
 * machine without a database URL.
 */

function required(name: string, hint: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. ${hint} ` +
        `See .env.example and docs/decisions/0002-database.md.`,
    );
  }
  return value;
}

export const env = {
  get databaseUrl(): string {
    return required(
      "DATABASE_URL",
      "Copy the pooled connection string from your Neon project dashboard.",
    );
  },

  get authSecret(): string {
    return required("AUTH_SECRET", "Generate one with `npx auth secret`.");
  },

  get githubClientId(): string {
    return required(
      "AUTH_GITHUB_ID",
      "Create an OAuth app at https://github.com/settings/developers.",
    );
  },

  get githubClientSecret(): string {
    return required(
      "AUTH_GITHUB_SECRET",
      "Create an OAuth app at https://github.com/settings/developers.",
    );
  },

  /**
   * Comma-separated GitHub logins permitted to reach the admin area.
   *
   * This is the actual authorization boundary. GitHub OAuth proves *who* a
   * visitor is; it does not decide whether they may edit your portfolio.
   * Without this allowlist, anyone with a GitHub account could sign in.
   */
  get adminGithubLogins(): string[] {
    return required("ADMIN_GITHUB_LOGINS", "Set it to your GitHub username.")
      .split(",")
      .map((login) => login.trim().toLowerCase())
      .filter(Boolean);
  },

  /** Salt for hashing visitor IPs in the CV view log. */
  get visitorHashSalt(): string {
    return required(
      "VISITOR_HASH_SALT",
      "Any long random string; rotating it resets repeat-view detection.",
    );
  },
} as const;
