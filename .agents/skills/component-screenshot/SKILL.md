---
name: component-screenshot
description: >-
  Capture an isolated screenshot of a shared @chesapeake/stack component in the
  local component showcase or a purpose-built fixture, without requiring an
  authenticated product app.
---

# Component Screenshot

Use this skill when a user wants visual proof of an individual component,
variant, state, or responsive treatment in the shared stack repository. Keep
the capture focused on the component and its immediate context; do not capture
an unrelated full product page.

## Workflow

1. Inspect the component and its showcase entrypoint before changing anything.
   Prefer the existing stack showcase in `src/App.tsx`; create a temporary
   fixture only when the requested state is not represented there.
2. Give the target component a stable user-facing locator, preferably a
   `data-testid` on the fixture wrapper and an accessible name on interactive
   controls. Do not select by generated CSS classes or DOM position.
3. Start the stack showcase with `npm run dev` and use a fresh headless
   Playwright context against the local Vite URL. If Playwright is not already
   available, use the repository's existing test dependency or `npx playwright`
   after confirming the user wants dependencies installed.
4. Wait for the fixture locator to be visible before capturing. For components
   with animation or async content, wait for the observable settled state rather
   than relying on a fixed delay.
5. Capture the component wrapper, not the entire page. For responsive work,
   capture each requested viewport explicitly and use descriptive names.
6. Write screenshots to `/tmp` or another disposable path outside the
   repository unless the user explicitly requests a committed artifact.
7. Report the output path(s), viewport(s), and any fixture assumptions.

## Constraints

- Do not use a normal browser profile, export authentication state, or add
  product authentication to a component screenshot.
- Do not alter shared component behavior solely to make a screenshot easier to
  capture. A fixture may provide props, controlled state, and representative
  data, but it must exercise the real exported component.
- Check light and dark themes when the request is about theming, and check
  keyboard-focus state when the request concerns accessibility or controls.
- Keep temporary fixture edits reversible and do not leave screenshots or build
  output tracked in the stack repository.
