import { ACCESS_ATTRIBUTE, ACCESS_FLAG_COOKIE } from "@/lib/access-cookies";
import { MODE_COOKIE, THEME_COOKIE } from "@/lib/theme";

/**
 * Applies the saved theme before the browser paints.
 *
 * This runs as a blocking inline script in <head> rather than in a layout,
 * deliberately: reading cookies on the server would opt the root layout into
 * dynamic rendering and take every page — including the static landing page —
 * off the prerendered path. This keeps the whole site static and still shows
 * the right theme on first paint, with no flash.
 *
 * It only ever adds attributes the stylesheet already accounts for, and a
 * failure is swallowed: a missing or malformed cookie must fall back to the
 * default theme, never to an unstyled page.
 *
 * It also marks a browser that opened an access link, so gated figures show
 * the right version on first paint. The mark grants nothing — the image
 * route checks the httpOnly token — it only decides what the page draws.
 */
const script = `
(function(){try{
var c=document.cookie;
var t=(c.match(/(?:^|; )${THEME_COOKIE}=([^;]*)/)||[])[1];
var m=(c.match(/(?:^|; )${MODE_COOKIE}=([^;]*)/)||[])[1];
var r=document.documentElement;
if(t&&t!=='default'){r.setAttribute('data-theme',t)}
if(m&&m!=='system'){r.setAttribute('data-mode',m)}
if(/(?:^|; )${ACCESS_FLAG_COOKIE}=1(?:;|$)/.test(c)){r.setAttribute('${ACCESS_ATTRIBUTE}','granted')}
}catch(e){}})();
`.trim();

export function ThemeScript() {
  return (
    <script
      // The content is a constant defined above — no user input reaches it.
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
