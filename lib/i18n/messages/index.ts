import type { Locale } from "../config";

import { en, type Messages } from "./en";

export type { Messages };

/**
 * One entry per locale in `LOCALES`. Typing it as a full record means adding a
 * locale to the config without a dictionary here is a build error.
 */
export const messages: Record<Locale, Messages> = { en };
