import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ControlBar,
  ControlButton,
  ControlToggle,
  SpecList,
  SpecRow,
  StatusDot,
} from "@/components/cksui";

/**
 * Live component specimens.
 *
 * Rendered from the real cksUI exports, not from screenshots or copies — so a
 * component that breaks breaks visibly here. This is the Storybook substitute:
 * the same guarantee, without a second build.
 */

export type Specimen = {
  id: string;
  name: string;
  slot: string;
  description: string;
  notes?: string[];
  demo: React.ReactNode;
};

export const specimens: Specimen[] = [
  {
    id: "button",
    name: "Button",
    slot: "button",
    description:
      "Four variants, each pairing a surface with its foreground so every one stays legible in all three themes.",
    notes: [
      "44px minimum height is enforced in the component, not remembered at call sites.",
      "asChild renders the child element instead of a <button>, for wrapping a link.",
    ],
    demo: (
      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button disabled>Disabled</Button>
      </div>
    ),
  },
  {
    id: "badge",
    name: "Badge",
    slot: "badge",
    description: "A small label. Used for platforms and pass/fail results.",
    demo: (
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Outline</Badge>
        <Badge variant="soft">Soft</Badge>
        <Badge variant="solid">Solid</Badge>
      </div>
    ),
  },
  {
    id: "card",
    name: "Card",
    slot: "card",
    description:
      "A surface that carries text-card-foreground with its background, so anything nested inherits a legible color without restating it.",
    demo: (
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>
            A description in muted-foreground, on the card surface.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Body content.</p>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "spec-list",
    name: "Spec list",
    slot: "spec-list",
    description:
      "Label and value pairs drawn with hairline rules. A <dl>, not a table — these are term/description pairs, not tabular data, so a screen reader announces “Focus, design systems” rather than “row 1, column 1”.",
    demo: (
      <SpecList className="max-w-md">
        <SpecRow label="Focus">Design systems, product design, front-end</SpecRow>
        <SpecRow label="Based">Seattle, Washington</SpecRow>
        <SpecRow label="Status">
          <StatusDot />
          Portfolio in development
        </SpecRow>
      </SpecList>
    ),
  },
  {
    id: "status-dot",
    name: "Status dot",
    slot: "status-dot",
    description:
      "A pulsing marker. Decorative by design — aria-hidden, fully visible at rest, and a no-op under prefers-reduced-motion. The adjacent label always carries the meaning, so nothing is communicated by color or motion alone.",
    demo: (
      <p className="flex items-center gap-2.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <StatusDot />
        Portfolio in development
      </p>
    ),
  },
  {
    id: "control-bar",
    name: "Control bar",
    slot: "control-bar",
    description:
      "The site control cluster in the header. One bounded unit so the instruments read as a control surface rather than loose buttons, and announce once as a group.",
    notes: [
      "ControlToggle uses aria-pressed, because it turns a page mode on rather than submitting a value.",
      "The inspector toggle joins this cluster at build step 9.",
    ],
    demo: (
      <ControlBar label="Control bar example">
        <ControlButton icon={<DemoIcon />} label="Appearance" />
        <ControlToggle icon={<DemoIcon />} label="Inspect" pressed={false} />
        <ControlToggle icon={<DemoIcon />} label="Pressed" pressed />
      </ControlBar>
    ),
  },
];

function DemoIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M2 4.5h5M11 4.5h3M2 11.5h3M9 11.5h5" />
      <circle cx="9" cy="4.5" r="1.75" />
      <circle cx="7" cy="11.5" r="1.75" />
    </svg>
  );
}
