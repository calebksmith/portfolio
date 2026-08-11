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
 */
const script = `
(function(){try{
var c=document.cookie;
var t=(c.match(/(?:^|; )${THEME_COOKIE}=([^;]*)/)||[])[1];
var m=(c.match(/(?:^|; )${MODE_COOKIE}=([^;]*)/)||[])[1];
var r=document.documentElement;
if(t&&t!=='default'){r.setAttribute('data-theme',t)}
if(m&&m!=='system'){r.setAttribute('data-mode',m)}
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
