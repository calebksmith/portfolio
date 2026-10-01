import { Fragment, type ReactNode } from "react";

/**
 * Renders a dictionary string that carries a little inline markup.
 *
 * Copy lives in plain strings so it can be translated as a whole sentence —
 * splitting "Hit Inspect in the header" into three keys around the bold word
 * makes a translator rebuild word order they cannot see. So the string keeps
 * its emphasis inline, and this turns exactly three tags into elements:
 * `<code>`, `<strong>`, and `<em>`. Anything else is printed as text, so a
 * dictionary can never inject markup the components did not anticipate.
 *
 * Tags do not nest. Nothing on the site needs them to.
 */

const TAG = /<(code|strong|em)>([\s\S]*?)<\/\1>/g;

const ENTITIES: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
};

function decode(text: string) {
  return text.replace(/&(lt|gt|amp);/g, (entity) => ENTITIES[entity]);
}

const render = {
  code: (text: string) => (
    <code className="rounded-sm bg-muted px-1.5 py-0.5 text-[0.9em] text-foreground">
      {text}
    </code>
  ),
  strong: (text: string) => <strong className="font-semibold">{text}</strong>,
  em: (text: string) => <em>{text}</em>,
};

export function RichText({ children }: { children: string }) {
  const parts: ReactNode[] = [];
  let last = 0;

  for (const match of children.matchAll(TAG)) {
    const [whole, tag, inner] = match;
    const index = match.index ?? 0;
    if (index > last) parts.push(decode(children.slice(last, index)));
    parts.push(render[tag as keyof typeof render](decode(inner)));
    last = index + whole.length;
  }
  if (last < children.length) parts.push(decode(children.slice(last)));

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>{part}</Fragment>
      ))}
    </>
  );
}

/** Fills `{name}` placeholders. Missing values are left visible, not blanked. */
export function format(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? values[key] : whole,
  );
}
