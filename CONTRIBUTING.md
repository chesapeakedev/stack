# Contributing to @chesapeake/stack

Thanks for your interest in contributing. This document explains how to work on
the library and demo locally.

## Development setup

1. **Clone and install**

   ```bash
   git clone https://github.com/chesapeake-computing/stack.git
   cd stack
   npm install
   ```

2. **Run the component showcase (demo)**

   From the package root:

   ```bash
   npm run dev
   ```

   This starts the Vite dev server. Open http://localhost:5173 to view the demo
   app that exercises the library components.

3. **Lint and typecheck**

   ```bash
   npm run lint
   npm run typecheck
   ```

   Fix formatting with `npm run fmt` and auto-fix lint with `npm run lint:fix`.

## Adding or changing components

- Library code lives under `components/`, `lib/`, `styles/`, and `types/`.
- Make changes in `ux/` for feature components; keep `ui/` reserved for shadcn
  primitives.
- Update `package.json` exports when adding new components.
- Add or update the demo in `src/App.tsx` (and related files under `src/`) so
  new or changed components are visible in the showcase.
- Update README.md and add JSDoc. Run `npm run dev` to verify the demo, then
  `npm run lint` and `npm run typecheck` before opening a PR.
- Ensure all peer dependencies are declared.

## Building the library

To produce the library bundle (e.g. for publishing):

```bash
npm run build
```

Output goes to `dist/` (ESM and CJS). The demo app (`index.html`, `src/`) is not
part of the published package; only the entries listed in `package.json` `files`
are included in the npm tarball.

If you publish a built `dist/` instead of source, add `npm run build` to the
`prepublishOnly` script in `package.json` so the bundle is built before
publishing.

## Adding new shadcn components

UI primitives from [shadcn/ui](https://ui.shadcn.com) live in `components/ui/`
and are managed via the shadcn CLI (new-york style). From the stack directory:

```bash
COMPONENT=<name> make add_component
```

Example: `COMPONENT=select make add_component`

1. **Fix import paths**: Replace `@/lib/utils` with the correct relative path
   (e.g. `../../lib/utils` from `components/ui/<name>.tsx`). To fix all under
   `components/ui/`:\
   `find . -name "*.tsx" -exec sed -i '' 's|@/lib/utils|../../lib/utils|g' {} \;`
2. **Add exports** in `package.json` under `exports` for each new file.
3. **Install any new dependencies**; ensure consuming apps can satisfy peer deps
   (e.g. `react-day-picker`, `vaul`).

To update an existing component: delete its file(s), re-add via the CLI, fix
imports, then test in consuming apps.

## TypeScript

The project uses `strictNullChecks` and selected strict options. Full
`strict: true` is not enabled; see `tsconfig.json` and enable or document any
changes.

## Documentation and practices

- Update README.md and add JSDoc for new or changed components.
- Use TypeScript, React hooks, and existing utilities in `lib/utils.ts`.
- Ensure components work in light and dark themes and document new peer
  dependencies.

## License

By contributing, you agree that your contributions will be licensed under the
same license as the project (Apache-2.0). See [LICENSE](LICENSE).
