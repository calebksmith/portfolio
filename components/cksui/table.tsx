import type { ComponentProps } from "react";

import { cn } from "./lib/cn";

/**
 * A data table: real <table> markup, so rows and columns are announced as
 * rows and columns, styled onto the hairline and muted pairs.
 *
 * When the content is a grid of facts, a table says it better than a drawing
 * of one: it reads at the page's own type size, a screen reader can move cell
 * by cell, and nothing in it looks like a button.
 *
 * The wrapper scrolls sideways on a narrow screen rather than squeezing the
 * columns until the words break. Row headers are `<TableHead scope="row">`.
 */
export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn("w-full border-collapse text-left text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("border-b border-border", className)}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&>tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn("border-b border-border", className)}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "px-3 py-2 align-bottom text-label font-normal tracking-label whitespace-nowrap text-muted-foreground uppercase first:pl-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("px-3 py-3 align-top first:pl-0", className)}
      {...props}
    />
  );
}
