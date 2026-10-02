/**
 * Names shared by the server, which grants and checks access, and the page,
 * which only needs to know which version of a gated figure to show. Nothing
 * here is a secret, so client code can import it.
 */

/** The credential: a signed access token. httpOnly; checked on every image. */
export const ACCESS_COOKIE = "ck-access-token";

/**
 * A readable flag set beside it. It grants nothing — the image route checks
 * the token, not this — it only lets the page show the right version of a
 * gated figure before first paint, the same way the theme cookie does.
 */
export const ACCESS_FLAG_COOKIE = "ck-access";

/** Stamped on <html> by the theme script when the flag is present. */
export const ACCESS_ATTRIBUTE = "data-access";
