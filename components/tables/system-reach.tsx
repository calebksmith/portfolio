import {
  cn,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/cksui";
import { getMessages } from "@/lib/i18n/server";

/**
 * How far VimUI actually reaches, as a table.
 *
 * The claim is easy to overstate: "a design system across four platforms" is
 * true of the tokens and false of the components. So the table has the seam
 * in its header, one codebase on one side and three separate ones on the
 * other, and a rule down that line. Everything that crosses it crosses by
 * hand.
 *
 * The bottom row is the exception. Login runs in a webview, so it's the one
 * place real VimUI renders on all four platforms, which was a side effect of
 * building login once, not a plan.
 *
 * It was a drawing until it was clear it was a grid of facts: as a table it
 * reads at the page's type size, and a screen reader can move cell by cell.
 */

type State = "vimui" | "byHand" | "own";

/** A cell's mark: filled for VimUI, dashed for copied by hand, open for its own. */
function Mark({ state }: { state: State }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-2.5 shrink-0 rounded-full",
        state === "vimui" && "bg-primary",
        state === "byHand" && "border border-dashed border-input",
        state === "own" && "border border-muted-foreground",
      )}
    />
  );
}

function Cell({
  state,
  children,
  seam = false,
}: {
  state: State;
  children: string;
  /** The first column past the seam carries the rule. */
  seam?: boolean;
}) {
  return (
    <TableCell className={cn(seam && "border-l border-input")}>
      <span
        className={cn(
          "inline-flex items-center gap-2 whitespace-nowrap",
          state === "vimui" ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <Mark state={state} />
        {children}
      </span>
    </TableCell>
  );
}

export async function SystemReach() {
  const t = (await getMessages()).diagrams.systemReach;
  const others = ["ios", "android", "windows"] as const;

  const rows: {
    key: string;
    name: string;
    note: string;
    web: [State, string];
    rest: [State, string];
  }[] = [
    {
      key: "tokens",
      ...t.tokens,
      web: ["vimui", t.sourceOfTruth],
      rest: ["byHand", t.copiedByHand],
    },
    {
      key: "components",
      ...t.components,
      web: ["vimui", t.vimui],
      rest: ["own", t.itsOwn],
    },
    {
      key: "login",
      ...t.login,
      web: ["vimui", t.vimui],
      rest: ["vimui", t.vimui],
    },
  ];

  return (
    <Table aria-label={t.label}>
      <TableHeader>
        {/* The seam, named: one codebase, then three. */}
        <TableRow className="border-0">
          <TableHead />
          <TableHead className="pb-0 normal-case tracking-normal">
            {t.oneCodebase}
          </TableHead>
          <TableHead
            colSpan={3}
            className="border-l border-input pb-0 normal-case tracking-normal"
          >
            {t.separateCodebases}
          </TableHead>
        </TableRow>
        <TableRow>
          <TableHead />
          <TableHead scope="col">{t.columns.web}</TableHead>
          {others.map((key, i) => (
            <TableHead
              key={key}
              scope="col"
              className={cn(i === 0 && "border-l border-input")}
            >
              {t.columns[key]}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key}>
            <TableHead
              scope="row"
              className="py-3 align-top normal-case tracking-normal whitespace-normal"
            >
              <span className="block text-sm text-foreground">{row.name}</span>
              <span className="block text-xs text-muted-foreground">
                {row.note}
              </span>
            </TableHead>
            <Cell state={row.web[0]}>{row.web[1]}</Cell>
            {others.map((key, i) => (
              <Cell key={key} state={row.rest[0]} seam={i === 0}>
                {row.rest[1]}
              </Cell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
