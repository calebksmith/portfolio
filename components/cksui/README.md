# cksUI

The component library this site is built from.

Built on shadcn/ui's patterns — copied-in source, Radix primitives for behavior,
`cva` for variants — but every visual value resolves to a `--ck-*` token from
`app/globals.css`. It is not an installed dependency and it is not a theme layer
over someone else's components. It is this site's own library, in this
repository, editable in place.

## Rules

1. **No raw values.** No hex, no `rgb()`, no arbitrary `[13px]`. If a value
   doesn't exist, add the token first.
2. **Use the pairs.** A surface class always travels with its foreground:
   `bg-card text-card-foreground`, never `bg-card text-foreground`. This is what
   makes the high-contrast theme a value swap rather than a rewrite.
3. **Every component declares `data-slot`.** The inspector overlay walks these
   to report which component an element belongs to and which tokens it resolved.
   Same attribute and meaning as the VimUI convention, so the two systems share
   a vocabulary.
4. **Interactive targets are at least 44px.** Use `min-h-tap` / `min-w-tap`.
5. **Keyboard first.** If it responds to a pointer it responds to a key, with a
   visible `:focus-visible` ring.
6. **No user-facing strings inside a component.** Pass them in.

## Adding a component

Start from the shadcn/ui source for the component, then:

- replace its `bg-*/text-*` classes with the `--ck-*` pairs
- add `data-slot="<name>"`
- delete variants this site does not use — an unused variant is a guess about
  the future that has to be maintained
- export it from `index.ts`

## Verifying

`npm run check:contrast` proves every token pair clears WCAG AA (AAA for the
high-contrast theme) in all three themes and both modes. It reads
`app/globals.css` directly, so it cannot drift from what ships.
