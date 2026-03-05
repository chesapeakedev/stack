# @chesapeake/stack

<!-- npm badge: uncomment when published to npm
[![npm version](https://badge.fury.io/js/@chesapeake/stack.svg)](https://www.npmjs.com/package/@chesapeake/stack)
-->

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A reusable React component library and design system built on shadcn components
& derived user experiences. the shadcn community seems to refer to these things
as blocks, which we currently don't support. The npm package contains a tiny
design system in the form of a tailwind preset & a single css import. The design
system consists of:

- Reusable React components in `components/` (UI components in `ui/`, UX
  components in `ux/`)
- `styles/index.css` that includes Tailwind CSS, design tokens, base styles, and
  component styles
- `tailwind.preset.ts` for use in `tailwind.config.ts`
- Peer dependencies declared for any component dependencies

## Installation

To utilize the design system in your app:

### 1. Install Dependencies

Add the required peer dependencies to your app's `package.json`:

```bash
npm install react react-dom tailwindcss tw-animate-css
npm install react-day-picker vaul  # if using calendar or drawer components
```

### 2. Import Styles

Import the shared styles in your app's main CSS file (e.g., `src/index.css`):

```css
/* Import Tailwind, third-party CSS, and shared styles */
@import "tailwindcss";
@import "tw-animate-css";
@import "react-day-picker/style.css"; /* if using calendar component */
@import "vaul/style.css"; /* if using drawer component */
@import "@chesapeake/stack/styles/index.css";
```

### 3. Configure Bundler and TypeScript

If you consume the package from source (e.g. in a monorepo), add a path alias so
imports resolve correctly. When using the published npm package, use the package
name in place of `@chesapeake/stack` in the examples below.

**Vite** (`vite.config.ts`):

```typescript
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../stack"),
    },
  },
});
```

**TypeScript** (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["../stack/*"]
    }
  }
}
```

### 4. Configure Tailwind

Extend your `tailwind.config.ts` with the shared preset:

```typescript
import type { Config } from "tailwindcss";
import sharedPreset from "@chesapeake/stack/tailwind.preset";

const config: Config = {
  content: [
    // your app's content paths
  ],
  presets: [sharedPreset],
  // your app's additional configuration
};

export default config;
```

### 5. Configure Tailwind Content

Add the package to your Tailwind content configuration so classes are processed:

**`tailwind.config.ts`**:

```typescript
import type { Config } from "tailwindcss";
import sharedPreset from "@chesapeake/stack/tailwind.preset";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@chesapeake/stack/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [sharedPreset],
  // your app's additional configuration
};

export default config;
```

### 6. Import and Use Components

Import and use components in your React components:

```tsx
import { Button } from "@chesapeake/stack/components/ui/button";
import { ThemeProvider } from "@chesapeake/stack/components/ux/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <Button variant="default">Click me</Button>
    </ThemeProvider>
  );
}
```

### Why peer dependencies?

The package declares peer dependencies instead of bundling them so that:

- **CSS is correct**: Third-party CSS (Tailwind, react-day-picker, vaul, etc.)
  is imported once in your app instead of via the package.
- **Versions stay flexible**: Your app installs and controls the versions that
  work with your build.
- **Bundle size stays small**: No duplicated CSS or runtime deps inside the
  package.

Install the peer dependencies listed in the package’s `package.json` in your
app.

### Installation troubleshooting

- **CSS not loading**: Ensure all peer dependencies are installed, CSS imports
  are in your main CSS file in the right order, and your bundler/TypeScript path
  mapping resolves `@chesapeake/stack` (or the package name) correctly.
- **Version conflicts**: Use `npm ls` to inspect installed versions; align with
  the peer dependency ranges required by the package.
- **Build errors**: Run the package’s validate script (e.g. `make validate`) if
  available, confirm required CSS files exist, and check import paths.

### Types (optional)

The package exports shared TypeScript types for use in consuming apps (e.g. user
and friend types). Import from the `types/user` subpath:

```ts
import type {
  BaseUser,
  Friend,
  toBaseUser,
} from "@chesapeake/stack/types/user";
```

### Migrating from an older setup

If you previously copied shared CSS or used a different import pattern: remove
duplicate CSS, switch to the import pattern above, install any missing peer
dependencies, and test all components.

## Usage

### Available Components

#### UI Components (`components/ui/`)

- **Button** - Various button variants and sizes
- **Input** - Form input component
- **Label** - Form label component
- **Textarea** - Multi-line text input
- **Avatar** - User avatar display
- **Calendar** - Date picker component
- **Drawer** - Slide-out drawer component
- **Dropdown Menu** - Dropdown menu component
- **Location Input** - Location search input
- **Popover** - Popover component
- **Toast** - Toast notification system

#### UX Components (`components/ux/`)

- **Theme Provider** - Dark/light theme context provider
- **Gif Search** - GIF search and selection component
- **Image Upload** - Image upload component
- **Tutorial Carousel** - Step-by-step tutorial component
- **Page Layout** - `PageContent`, `PageHeader`, `PageLayout` for consistent
  page structure

### Design System Features

- **Design Tokens**: Consistent color palette, spacing, and typography
- **Dark Mode**: Built-in dark theme support
- **Responsive**: Mobile-first responsive design
- **Accessibility**: ARIA-compliant components
- **Animations**: Smooth transitions and micro-interactions

## Theming

This section explains how the shared theme system works and how projects can
customize themes.

### Base Theme

The shared design system (`@chesapeake/stack`) includes a default theme defined
in `stack/styles/tokens.css`. This theme includes:

- **Color palette**: Primary, secondary, muted, accent, destructive colors
- **Light and dark mode**: Automatic theme switching via `.dark` class
- **Typography**: Poppins (sans-serif), Lora (serif), Fira Code (monospace)
- **Shadows**: Custom shadow system with offset shadows
- **Border radius**: Consistent radius values
- **Chart colors**: Pre-defined chart color palette

This theme is automatically applied to any project that imports
`@chesapeake/stack/styles/index.css`.

### Using the Default Theme

Projects use the default theme automatically:

```css
/* e.g. src/index.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "react-day-picker/style.css";
@import "@chesapeake/stack/styles/index.css";
/* That's it! Default theme is now active */
```

**Don't forget to load fonts in your `index.html`:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Lora:wght@400;500;600&family=Fira+Code:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

### Overriding the Theme

Projects can override specific theme variables to create a different look and
feel:

```css
/* e.g. src/index.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "react-day-picker/style.css";
@import "@chesapeake/stack/styles/index.css";

/* Override theme variables */
:root {
  /* Change primary color */
  --primary: oklch(0.723 0.219 149.579);

  /* Change background */
  --background: oklch(0.95 0.01 200);

  /* Use different fonts */
  --font-sans: "Inter", sans-serif;
  --font-serif: "Crimson Text", serif;
  --font-mono: "JetBrains Mono", monospace;
}

.dark {
  /* Override dark mode colors */
  --primary: oklch(0.8 0.2 150);
  --background: oklch(0.2 0.02 200);
}

/* Project-specific utility classes (e.g. brand gradient) */
.my-brand-gradient {
  background: linear-gradient(to right, var(--primary), var(--secondary));
}
```

### CSS Variable Priority

CSS custom properties follow standard CSS cascade rules:

1. **Shared theme** (`@chesapeake/stack/styles/tokens.css`) - Base defaults
2. **Project overrides** (your `index.css` after
   `@import "@chesapeake/stack/styles/index.css"`) - Your customizations
3. **Inline styles** (component-level) - Most specific

This means you only need to override the variables you want to change!

### Available Theme Variables

#### Colors

- `--background`, `--foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--border`, `--input`, `--ring`
- `--chart-1` through `--chart-5`
- `--sidebar-*` variants

#### Typography

- `--font-sans` (default: Poppins)
- `--font-serif` (default: Lora)
- `--font-mono` (default: Fira Code)

#### Spacing & Layout

- `--radius` (default: 0.4rem)
- `--spacing` (default: 0.25rem)
- `--tracking-normal` (default: 0em)

#### Shadows

- `--shadow-2xs`, `--shadow-xs`, `--shadow-sm`, `--shadow`, `--shadow-md`,
  `--shadow-lg`, `--shadow-xl`, `--shadow-2xl`
- `--shadow-x`, `--shadow-y`, `--shadow-blur`, `--shadow-spread`,
  `--shadow-opacity`, `--shadow-color`

### Example: Creating a Custom Brand Theme

```css
/* e.g. src/index.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "@chesapeake/stack/styles/index.css";

:root {
  /* Brand colors */
  --primary: oklch(0.65 0.25 250); /* Purple brand */
  --secondary: oklch(0.75 0.15 180); /* Teal accent */
  --accent: oklch(0.85 0.1 300); /* Pink accent */

  /* Custom background */
  --background: oklch(0.98 0.005 260); /* Very light purple tint */

  /* Custom fonts */
  --font-sans: "Inter", "system-ui", sans-serif;
  --font-serif: "Crimson Text", serif;
  --font-mono: "SF Mono", "Monaco", monospace;

  /* Larger border radius for softer look */
  --radius: 0.75rem;
}

.dark {
  /* Dark mode adjustments */
  --primary: oklch(0.75 0.25 250);
  --background: oklch(0.15 0.02 260);
  --secondary: oklch(0.65 0.15 180);
}

/* Custom utility classes for this app */
.my-app-gradient {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
}
```

### Theming Tips

1. **Always import shared styles first**, then override
2. **Use OKLCH color space** for better color interpolation and consistency
3. **Test both light and dark modes** when customizing
4. **Keep shadow values** unless you want a completely different shadow system
5. **Override fonts** if your brand requires different typography
6. **Use Tailwind's color utilities** - they automatically use your custom
   variables

### Migrating from an Older Theme

If you're migrating from the old theme:

1. Check which variables your project currently uses
2. Import `@chesapeake/stack/styles/index.css`
3. Override only the variables that need to change
4. Test thoroughly in both light and dark modes

### Further Reading

- [MDN: CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) -
  Comprehensive guide with examples
- [CSS Tricks: Custom Properties](https://css-tricks.com/a-complete-guide-to-custom-properties/) -
  In-depth tutorial and best practices
- [Can I Use: CSS Custom Properties](https://caniuse.com/css-variables) -
  Browser support information

## Project Structure

```
stack/
├── components/
│   ├── ui/           # Basic UI components (shadcn/ui primitives)
│   └── ux/           # Complex UX components (auth, layout, feedback)
├── styles/
│   ├── index.css     # Main stylesheet entry point
│   ├── tokens.css    # Design tokens and CSS variables
│   ├── base.css      # Base styles and utilities
│   └── components.css # Component-specific styles
├── lib/
│   └── utils.ts      # Utility functions
├── types/            # Shared TypeScript types (e.g. user)
├── tailwind.preset.ts # Tailwind configuration preset
├── index.html        # Demo app entry (run npm run dev to preview)
├── src/              # Demo app source (showcase components)
├── public/           # Demo app static assets
├── Makefile          # Lint, validate, add_component
└── package.json      # Package configuration and exports
```

The demo app (`index.html`, `src/`, `public/`) is for local development and
showcase only; it is not published to npm.

# Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, adding shadcn
components, and opening PRs. 
