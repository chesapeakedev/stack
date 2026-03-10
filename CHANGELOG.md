# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2026-03-09

### Changed

- `styles/index.css` now declares `@source "../components"` so Tailwind v4
  detects the package's utility classes automatically. Consuming apps no longer
  need to add a separate `@source` or `content` path for `@chesapeake/stack`;
  `@import "@chesapeake/stack/styles"` is sufficient.

## [0.1.2] - 2026-03-05

- `examples/` folder with copy-pasteable React examples: basic-form,
  auth-setup, page-layout, theme-customization, feedback-and-notifications,
  data-display, user-management
- polish README.md

### Added

## [0.1.1] - 2026-03-05

### Added

- UI component: LocationInput – Google Maps Places Autocomplete search with
  debounced input, keyboard navigation, and suggestions dropdown
- UI export: sonner-api – re-exports `toast` and `ToasterProps` for
  programmatic toast notifications
- UX component: ActivityAnimation – activity indicator with pulse and particles
  variants (sm/md/lg)
- UX component: FireAnimation – animated fire visualization scaled by
  productivity score
- CONTRIBUTING.md with development setup and component guidelines

### Changed

- README rewritten for npm consumers: added examples table with GitHub links,
  Package Contents section, and Contributing link

### Fixed

- GitHub URLs corrected from `chesapeake-computing` to `chesapeakedev` across
  README.md, package.json, CONTRIBUTING.md, and CHANGELOG.md

## [0.1.0] - 2026-02-05

### Added

- Initial public release
- shadcn/ui based component library with New York style
- UI components: Button, Avatar, Calendar, Card, Dialog, Drawer, DropdownMenu,
  Input, Label, Textarea, Checkbox, Popover, Select, Separator, Sonner, Tooltip,
  Badge, ButtonGroup
- UX components: UserSearch, UserSelector, FriendList, FriendRequestList,
  GifSearch, ImageUpload, TutorialCarousel, PageLayout, FeedbackDrawer,
  ThemeProvider
- Authentication components: GoogleAuth, GitHubAuth with providers and callbacks
- Tailwind CSS preset with design tokens
- Full dark mode support via CSS custom properties
- Apache 2.0 license

[0.1.3]: https://github.com/chesapeakedev/stack/releases/tag/v0.1.3
[0.1.2]: https://github.com/chesapeakedev/stack/releases/tag/v0.1.2
[0.1.1]: https://github.com/chesapeakedev/stack/releases/tag/v0.1.1
[0.1.0]: https://github.com/chesapeakedev/stack/releases/tag/v0.1.0
