import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  SpecList,
  SpecRow,
  StatusDot,
} from "@/components/cksui";

import { Phase, Spine } from "./phase";

/**
 * The double diamond, built rather than drawn.
 *
 * Each phase types the code that produces it, and the real cksUI components
 * appear as its output. The diamond comes from the widths: Discover and Develop
 * diverge wide, Define and Refine converge to one. Nothing here draws a shape —
 * the content's silhouette is the shape.
 *
 * It ends at "ready for launch" rather than at launch, which is the honest
 * boundary of the work.
 */
export function ProcessBuild() {
  return (
    <div className="flex flex-col items-center">
      <Phase
        index="01"
        name="Discover"
        produces="Interviews, tickets, drop-off"
        width="wide"
        code={`<Evidence from="research" />`}
      >
        <ul className="grid gap-3 sm:grid-cols-3">
          {[
            { source: "Participant 4", note: "“I never know if my password saved.”" },
            { source: "Support", note: "Account creation is our top ticket." },
            { source: "Analytics", note: "Drop-off concentrates at MFA." },
          ].map((item) => (
            <li key={item.source}>
              <Card className="h-full">
                <CardHeader>
                  <CardDescription className="text-xs">
                    {item.source}
                  </CardDescription>
                  <CardTitle className="text-sm">{item.note}</CardTitle>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </Phase>

      <Spine />

      <Phase
        index="02"
        name="Define"
        produces="One brief, agreed"
        width="narrow"
        code={`<Brief scope="one flow, three platforms" />`}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Replace three flows with one</CardTitle>
            <CardDescription className="text-xs">
              Web-based, surfaced in the native apps. Add MFA without adding
              friction.
            </CardDescription>
          </CardHeader>
        </Card>
      </Phase>

      <Spine />

      <Phase
        index="03"
        name="Develop"
        produces="Prototypes, in real components"
        width="wide"
        code={`<Button variant={variant} size="lg" />`}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">Continue</Button>
          <Button variant="secondary" size="lg">
            Continue
          </Button>
          <Button variant="outline" size="lg">
            Continue
          </Button>
          <Button variant="ghost" size="lg">
            Continue
          </Button>
        </div>
      </Phase>

      <Spine />

      <Phase
        index="04"
        name="Refine"
        produces="Tested, adjusted, measured"
        width="narrow"
        code={`<Button variant="primary" size="lg">\n  Continue\n</Button>`}
      >
        <div className="flex flex-col items-center gap-4">
          <Button size="lg">Continue</Button>
          <SpecList className="w-full">
            <SpecRow label="Tickets">Down over 80%</SpecRow>
            <SpecRow label="Flows">Three became one</SpecRow>
          </SpecList>
        </div>
      </Phase>

      <Spine tone="dashed" />

      {/* The boundary. Everything above is mine; this is the handoff. */}
      <div className="flex flex-col items-center gap-3">
        <Badge variant="soft" className="gap-2">
          <StatusDot />
          Ready for launch
        </Badge>
        <p className="max-w-[38ch] text-center text-xs text-pretty text-muted-foreground">
          Shipping is someone else&rsquo;s call. Everything up to it is mine —
          and what launch teaches goes back into 01.
        </p>
      </div>
    </div>
  );
}
