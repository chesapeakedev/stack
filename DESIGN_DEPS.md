# Design System Dependency Glossary

This document provides an overview of all dependencies used in the Chesapeake
Stack design system, organized by dependency type. Each dependency includes a
brief explanation of its purpose and necessity.

## Runtime Dependencies

These dependencies are bundled with the design system and are required at
runtime when using the components.

### Radix UI Primitives

**@radix-ui/react-avatar** (`^1.1.10`)

- **Purpose**: Provides accessible avatar component primitives
- **Usage**: Used in the `Avatar` component for displaying user profile pictures
  and initials
- **Why needed**: Ensures accessibility features (ARIA attributes, keyboard
  navigation) are built-in

**@radix-ui/react-checkbox** (`^1.1.1`)

- **Purpose**: Accessible checkbox primitive with keyboard and screen reader
  support
- **Usage**: Used in the `Checkbox` component for form inputs and selection
  states
- **Why needed**: Provides built-in accessibility, focus management, and state
  handling for checkboxes

**@radix-ui/react-dialog** (`^1.1.15`)

- **Purpose**: Accessible modal/dialog primitive
- **Usage**: Used in the `Dialog` component for modal dialogs
- **Why needed**: Provides accessible modal dialogs with focus trapping, escape
  handling, and ARIA attributes

**@radix-ui/react-dropdown-menu** (`^2.1.16`)

- **Purpose**: Accessible dropdown menu primitive
- **Usage**: Used in the `DropdownMenu` component for context menus, user menus,
  and action menus
- **Why needed**: Handles keyboard navigation, focus management, and ARIA
  attributes for accessible menus

**@radix-ui/react-label** (`^2.1.7`)

- **Purpose**: Accessible label primitive
- **Usage**: Used in the `Label` component for form labels that properly
  associate with inputs
- **Why needed**: Ensures labels are correctly linked to form controls for
  accessibility

**@radix-ui/react-popover** (`^1.1.15`)

- **Purpose**: Accessible popover/floating content primitive
- **Usage**: Used in the `Popover` component for floating content that appears
  relative to a trigger
- **Why needed**: Provides positioning, focus management, and accessibility for
  floating UI elements

**@radix-ui/react-select** (`^2.2.6`)

- **Purpose**: Accessible select/dropdown primitive
- **Usage**: Used in the `Select` component for single- and multi-value
  selection dropdowns
- **Why needed**: Handles keyboard navigation, focus management, and ARIA
  attributes for accessible select controls

**@radix-ui/react-separator** (`^1.1.8`)

- **Purpose**: Accessible separator/divider primitive
- **Usage**: Used in the `Separator` component for visual dividers between
  content sections
- **Why needed**: Provides accessible separator elements with proper ARIA
  attributes and orientation support

**@radix-ui/react-slot** (`^1.2.4`)

- **Purpose**: Allows component composition by forwarding props and refs to
  child elements
- **Usage**: Used in the `Button` and `ButtonGroup` components (e.g. `asChild`
  prop) to allow rendering as different elements
- **Why needed**: Enables flexible component composition while maintaining
  proper prop forwarding

### Styling & Utilities

**class-variance-authority** (`^0.7.0`)

- **Purpose**: Type-safe variant system for component styling
- **Usage**: Used in the `Button`, `Badge`, and `ButtonGroup` components to
  define type-safe variant props
- **Why needed**: Provides a type-safe way to define component variants (e.g.,
  button sizes, colors) with proper TypeScript inference

**clsx** (`^2.0.0`)

- **Purpose**: Utility for constructing conditional className strings
- **Usage**: Used throughout components via the `cn` utility function for
  conditional class application
- **Why needed**: Simplifies conditional styling logic in components

**tailwind-merge** (`^2.0.0`)

- **Purpose**: Intelligently merges Tailwind CSS classes, resolving conflicts
- **Usage**: Used in the `cn` utility function to merge Tailwind classes without
  conflicts (e.g., `p-4 p-6` becomes `p-6`)
- **Why needed**: Prevents Tailwind class conflicts when combining classes from
  different sources (props, variants, defaults)

### React Framework

**react** (`^19.0.0`)

- **Purpose**: Core React framework
- **Usage**: Required for all React components in the design system
- **Why needed**: The foundation for all React components

### UI Components

**lucide-react** (`^0.400.0`)

- **Purpose**: Icon library providing React components for Lucide icons
- **Usage**: Used throughout components for icons (CheckIcon, ChevronDownIcon,
  Search, etc.)
- **Why needed**: Provides consistent, accessible icon components with proper
  sizing and styling

**sonner** (`^1.7.4`)

- **Purpose**: Toast notification library for React
- **Usage**: Used in the `Sonner` component for toast notifications
- **Why needed**: Provides accessible toast notifications with queue management,
  positioning, and customizable styling

**vaul** (`^1.1.2`)

- **Purpose**: Drawer/sheet component library for bottom and side panels
- **Usage**: Used in the `Drawer` component for slide-out panels
- **Why needed**: Provides accessible drawer functionality with smooth
  animations and proper focus management

### Date Utilities

**date-fns** (`^4.1.0`)

- **Purpose**: Modern JavaScript date utility library
- **Usage**: Used for date formatting and manipulation in calendar/date-picker
  contexts; `react-day-picker` uses it internally
- **Why needed**: Provides reliable date operations and formatting for calendar
  and date-picker components

---

## Peer Dependencies

These dependencies must be installed by consuming applications. They are marked
as peer dependencies because they should be a single instance shared across the
application, or they require specific versions that apps may need to control.

### Core Frameworks

**react** (`^19.0.0`)

- **Purpose**: Core React framework (also in runtime dependencies)
- **Why peer**: Apps need React installed and should control the React version
  for their entire application
- **Usage**: Required by all design system components

**react-dom** (`^19.0.0`) - _Required_

- **Purpose**: React DOM renderer for web applications
- **Why peer**: Apps need react-dom installed for rendering React components in
  the browser
- **Usage**: Required for all React components to render in the DOM
- **Note**: Marked as non-optional in peerDependenciesMeta - required for all
  apps using the design system

**tailwindcss** (`^4.1.0`) - _Required_

- **Purpose**: Utility-first CSS framework
- **Why peer**: Apps configure Tailwind in their own `tailwind.config.ts` and
  extend the shared preset
- **Usage**: Required for all Tailwind-based styling in the design system
- **Note**: Marked as non-optional - all apps using the design system must have
  Tailwind CSS installed

**tw-animate-css** (`^1.2.0`) - _Required_

- **Purpose**: Additional Tailwind CSS animation utilities
- **Why peer**: Apps import this separately in their CSS entry point
- **Usage**: Provides animation utilities used in design system components
- **Note**: Marked as non-optional - required for animations to work properly

### Component Libraries

**react-day-picker** (`^9.11.1`) - _Required_

- **Purpose**: Flexible calendar component library
- **Why peer**: Must be a single instance; apps control the version
- **Usage**: Used by the `Calendar` component for date selection
- **Note**: Marked as non-optional in peerDependenciesMeta - required for all
  apps using the design system

**vaul** (`^1.1.2`) - _Required_

- **Purpose**: Drawer/sheet component library (also in runtime dependencies)
- **Why peer**: Listed here to ensure consuming apps install the correct version
- **Usage**: Used by the `Drawer` component
- **Note**: Marked as non-optional in peerDependenciesMeta - required when using
  Drawer component

### Version Constraints

All dependencies use caret (`^`) version ranges, allowing:

- Patch and minor version updates automatically
- Maintaining compatibility with the declared major version
- Flexibility for dependency resolution while preventing breaking changes
