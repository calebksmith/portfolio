/**
 * The design-system lint rules: the parts of CLAUDE.md a parser can check.
 *
 * Tokens, pairs, and component conventions are written down in CLAUDE.md and
 * shown on the style guide. This is where they stop depending on someone
 * remembering them — the same standard, applied to every author, human or
 * agent, before anything merges. `npm run lint` runs these; CI runs `npm run
 * lint`.
 *
 * Styling on this site is Tailwind utility strings, so most rules read class
 * strings: the `className` attribute and the arguments to `cn()` / `cva()`.
 * What a parser cannot judge — whether a token is the *right* one, whether a
 * layout holds at a breakpoint — stays with review and the design-review
 * skill.
 */

import { PAIRS } from "../scripts/contrast-pairs.mjs";

/* -------------------------------------------------------------------------- */
/* Reading class strings                                                       */
/* -------------------------------------------------------------------------- */

const CLASS_CALLEES = new Set(["cn", "cva", "clsx"]);

/** Every string literal inside a node — template quasis included. */
function* strings(node) {
  if (!node || typeof node !== "object") return;
  if (node.type === "Literal" && typeof node.value === "string") {
    yield { value: node.value, node };
    return;
  }
  if (node.type === "TemplateLiteral") {
    for (const quasi of node.quasis) yield { value: quasi.value.cooked, node };
  }
  for (const key of Object.keys(node)) {
    if (key === "parent") continue;
    const child = node[key];
    if (Array.isArray(child)) for (const c of child) yield* strings(c);
    else if (child && typeof child.type === "string") yield* strings(child);
  }
}

/** Calls `check(classString, node)` for every class string in a file. */
function visitClassStrings(check) {
  return {
    JSXAttribute(node) {
      if (node.name.name !== "className" || !node.value) return;
      for (const s of strings(node.value)) check(s.value, s.node, node);
    },
    CallExpression(node) {
      if (node.callee.type !== "Identifier") return;
      if (!CLASS_CALLEES.has(node.callee.name)) return;
      // Inside a className attribute these were already read.
      if (hasAncestor(node, "JSXAttribute")) return;
      for (const s of strings({ type: "Args", args: node.arguments }))
        check(s.value, s.node, null);
    },
  };
}

function hasAncestor(node, type) {
  for (let p = node.parent; p; p = p.parent) if (p.type === type) return true;
  return false;
}

/** The utility without its variants: `hover:bg-muted` → `bg-muted`. */
const base = (utility) => utility.split(":").pop().replace(/^!/, "");
const hasVariant = (utility) => utility.includes(":");

/* -------------------------------------------------------------------------- */
/* ck/no-raw-color                                                             */
/* -------------------------------------------------------------------------- */

const PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const COLOR_UTILITY =
  "bg|text|border|ring|fill|stroke|outline|decoration|from|via|to|shadow|accent|caret|divide|placeholder";

const RAW_COLOR = new RegExp(
  [
    // Tailwind's built-in palette: `bg-red-500`, `text-white`.
    `(?:^|[\\s:])(?:${COLOR_UTILITY})-(?:(?:${PALETTE})-\\d{2,3}|black|white)\\b`,
    // Literal values in arbitrary utilities: `bg-[#fff]`, `text-[rgb(0,0,0)]`.
    `-\\[(?:#|rgba?\\(|hsla?\\(|oklch\\(|color-mix\\()`,
  ].join("|"),
);

/** @type {import("eslint").Rule.RuleModule} */
const noRawColor = {
  meta: {
    type: "problem",
    docs: { description: "Colors come from --ck-* tokens, never raw values." },
    messages: {
      raw: '"{{utility}}" is a raw color. Use a token utility (`bg-card`, `text-muted-foreground`, …) — add a token to globals.css first if none fits.',
    },
    schema: [],
  },
  create(context) {
    return visitClassStrings((value, node) => {
      for (const utility of value.split(/\s+/)) {
        if (RAW_COLOR.test(` ${utility}`)) {
          context.report({ node, messageId: "raw", data: { utility } });
        }
      }
    });
  },
};

/* -------------------------------------------------------------------------- */
/* ck/no-arbitrary-px                                                          */
/* -------------------------------------------------------------------------- */

const ARBITRARY_PX = /-\[[^\]]*\d(?:\.\d+)?px[^\]]*\]/;

/** @type {import("eslint").Rule.RuleModule} */
const noArbitraryPx = {
  meta: {
    type: "problem",
    docs: {
      description:
        "No pixel values in arbitrary utilities; sizes come from the scale.",
    },
    messages: {
      px: '"{{utility}}" hardcodes pixels. Use a scale step or a token; if the value is genuinely new, add it to the token block in globals.css.',
    },
    schema: [],
  },
  create(context) {
    return visitClassStrings((value, node) => {
      for (const utility of value.split(/\s+/)) {
        if (ARBITRARY_PX.test(utility)) {
          context.report({ node, messageId: "px", data: { utility } });
        }
      }
    });
  },
};

/* -------------------------------------------------------------------------- */
/* ck/paired-surface                                                           */
/* -------------------------------------------------------------------------- */

/** surface → the foregrounds it is measured with. */
const MEASURED = new Map();
for (const [surface, foreground] of PAIRS) {
  if (!MEASURED.has(surface)) MEASURED.set(surface, new Set());
  MEASURED.get(surface).add(foreground);
}

/** Surfaces that must carry a foreground. `background` is the page itself. */
const SURFACES = [...MEASURED.keys()].filter(
  (s) => s !== "background" && !s.startsWith("mark-"),
);

/** @type {import("eslint").Rule.RuleModule} */
const pairedSurface = {
  meta: {
    type: "problem",
    docs: {
      description:
        "A surface is only ever drawn with a foreground the contrast gate measures.",
    },
    messages: {
      unpaired:
        '"{{surface}}" inherits the page foreground, which is never measured against it. Add `text-{{expected}}` or another measured foreground from scripts/contrast-pairs.mjs.',
      unmeasured:
        '"{{surface}}" is drawn with "{{text}}", a pair the contrast gate never measures. Use `text-{{expected}}`, or add the pair to scripts/contrast-pairs.mjs so it is measured.',
    },
    schema: [],
  },
  /**
   * Loose by design. The rule is not "every surface names its own foreground
   * token" — it is "no surface is drawn with a combination nobody measured".
   * So a surface passes when:
   *
   *   - it sets a text color, and that pair is in contrast-pairs.mjs. Any
   *     measured foreground will do; there is no need for a surface-specific
   *     token when an equivalent one already exists.
   *   - it sets none, and inherits the page `foreground` — which passes when
   *     (surface, foreground) is measured.
   *   - it carries no text at all: a dot, a skeleton bar, a caret. Those are
   *     aria-hidden (themselves or an ancestor), which is also what makes them
   *     decorative to a screen reader.
   */
  create(context) {
    return visitClassStrings((value, node, attribute) => {
      if (attribute && isDecorative(attribute.parent)) return;

      const utilities = value.split(/\s+/).filter(Boolean);
      const texts = utilities
        .filter((u) => !hasVariant(u) && /^text-[a-z-]+$/.test(u))
        .map((u) => u.slice(5))
        .filter(
          (t) =>
            !/^(xs|sm|base|lg|xl|\dxl|label|label-sm|left|right|center|justify|balance|pretty|wrap|nowrap|ellipsis|clip)$/.test(
              t,
            ),
        );

      for (const utility of utilities) {
        if (hasVariant(utility)) continue;
        const match = /^bg-([a-z-]+?)(?:\/\d+)?$/.exec(base(utility));
        if (!match || !SURFACES.includes(match[1])) continue;

        const surface = match[1];
        const allowed = MEASURED.get(surface);
        const expected = `${surface}-foreground`;

        if (texts.length === 0) {
          if (allowed.has("foreground")) continue;
          context.report({
            node,
            messageId: "unpaired",
            data: { surface: utility, expected },
          });
        } else if (!texts.some((t) => allowed.has(t))) {
          context.report({
            node,
            messageId: "unmeasured",
            data: { surface: utility, text: `text-${texts[0]}`, expected },
          });
        }
      }
    });
  },
};

/** Hidden from assistive technology here or on any enclosing element. */
function isDecorative(openingElement) {
  for (let el = openingElement; el; el = el.parent) {
    if (el.type === "JSXOpeningElement" && isAriaHidden(el)) return true;
    if (el.type === "JSXElement" && isAriaHidden(el.openingElement))
      return true;
  }
  return false;
}

function isAriaHidden(openingElement) {
  return openingElement.attributes.some(
    (a) =>
      a.type === "JSXAttribute" &&
      a.name.name === "aria-hidden" &&
      (a.value === null ||
        (a.value.type === "Literal" && a.value.value === "true") ||
        (a.value.type === "JSXExpressionContainer" &&
          a.value.expression.value === true)),
  );
}

/* -------------------------------------------------------------------------- */
/* ck/require-data-slot                                                        */
/* -------------------------------------------------------------------------- */

/** @type {import("eslint").Rule.RuleModule} */
const requireDataSlot = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Every exported cksUI component sets data-slot on the element it renders.",
    },
    messages: {
      missing:
        "{{name}} renders <{{tag}}> without a data-slot. Set data-slot to the component's kebab-case name so the inspector can report it.",
    },
    schema: [],
  },
  create(context) {
    function checkComponent(name, fn) {
      if (!/^[A-Z]/.test(name) || !fn.body) return;
      const roots = [];
      if (fn.body.type === "JSXElement") roots.push(fn.body);
      else if (fn.body.type === "BlockStatement") {
        for (const statement of fn.body.body) {
          if (statement.type !== "ReturnStatement") continue;
          let arg = statement.argument;
          while (arg?.type === "ConditionalExpression") arg = arg.consequent;
          if (arg?.type === "JSXElement") roots.push(arg);
        }
      }
      for (const root of roots) {
        const opening = root.openingElement;
        // A component that renders another component delegates the slot to
        // it, or passes its own through props; only native elements must
        // carry one here.
        if (opening.name.type !== "JSXIdentifier") continue;
        if (!/^[a-z]/.test(opening.name.name)) continue;
        const has = opening.attributes.some(
          (a) => a.type === "JSXAttribute" && a.name.name === "data-slot",
        );
        if (!has) {
          context.report({
            node: opening,
            messageId: "missing",
            data: { name, tag: opening.name.name },
          });
        }
      }
    }

    return {
      ExportNamedDeclaration(node) {
        const decl = node.declaration;
        if (decl?.type === "FunctionDeclaration" && decl.id) {
          checkComponent(decl.id.name, decl);
        }
      },
    };
  },
};

/* -------------------------------------------------------------------------- */
/* ck/no-literal-copy                                                          */
/* -------------------------------------------------------------------------- */

const COPY_ATTRIBUTES = new Set([
  "aria-label",
  "aria-description",
  "title",
  "alt",
  "placeholder",
  "label",
  "legend",
]);

/** @type {import("eslint").Rule.RuleModule} */
const noLiteralCopy = {
  meta: {
    type: "problem",
    docs: {
      description:
        "User-facing words come from props or the locale dictionary, never literals.",
    },
    messages: {
      literal:
        '"{{text}}" is copy written into markup. Pages read it from lib/i18n/messages; library components take it as a prop.',
    },
    schema: [
      {
        type: "object",
        properties: { allow: { type: "array", items: { type: "string" } } },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const allow = new Set(context.options[0]?.allow ?? []);
    const isCopy = (text) => {
      const trimmed = text.trim();
      if (allow.has(trimmed)) return false;
      // Token and property names are identifiers, not words: `--ck-`.
      if (/^--[a-z-]*$/.test(trimmed)) return false;
      return /\p{L}{2,}/u.test(trimmed);
    };

    return {
      JSXText(node) {
        // Source code shown as source code — the playground's printed JSX.
        if (insideCode(node)) return;
        if (isCopy(node.value)) {
          context.report({
            node,
            messageId: "literal",
            data: { text: node.value.trim().slice(0, 40) },
          });
        }
      },
      JSXAttribute(node) {
        if (!COPY_ATTRIBUTES.has(node.name.name)) return;
        if (
          node.value?.type === "Literal" &&
          isCopy(String(node.value.value))
        ) {
          context.report({
            node,
            messageId: "literal",
            data: { text: String(node.value.value).slice(0, 40) },
          });
        }
      },
    };
  },
};

function insideCode(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (
      p.type === "JSXElement" &&
      p.openingElement.name.type === "JSXIdentifier" &&
      ["code", "pre", "kbd"].includes(p.openingElement.name.name)
    ) {
      return true;
    }
  }
  return false;
}

/* -------------------------------------------------------------------------- */

const plugin = {
  meta: { name: "eslint-plugin-ck" },
  rules: {
    "no-raw-color": noRawColor,
    "no-arbitrary-px": noArbitraryPx,
    "paired-surface": pairedSurface,
    "require-data-slot": requireDataSlot,
    "no-literal-copy": noLiteralCopy,
  },
};

export default plugin;
