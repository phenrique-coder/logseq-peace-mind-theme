# Changelog

All notable changes to this project will be documented in this file.

## [1.1.1] - 2026-03-25

### Fixed
- **UI Reliability**: Refactored "Create" button hover selectors to ensure compatibility with different Logseq versions while maintaining background stability.
- **Improved Contrast**: Fixed "Create" button text color to ensure accessibility and clear reading.
- **Project Assets**: Resolved broken screenshot links in README.md by switching to absolute GitHub Raw URLs for better rendering in the Logseq Marketplace.
- **Badge Links**: Fixed GitHub repository links in README badges.

## [1.1.0] - 2026-03-23

### Changed
- **Architectural Overhaul**: Migrated entry point from `index.js` to `index.html` to ensure `@logseq/libs` are fully loaded before plugin execution.
- **Improved Style Propagation**: Now using high-priority inline styles on `<html>` for color variables, ensuring they override defaults correctly.

### Fixed
- **Theme Leakage**: Added a robust cleanup system that removes all custom CSS variables when switching to other themes.
- **Dynamic Visibility**: The palette button now intelligently hides/shows based on whether the PeaceMind theme is actually active.
- **Race Condition**: Resolved the issue where the palette button wouldn't appear on first install.

## [1.0.5] - 2026-03-23

### Fixed
- **Plugin Store Consistency**: Resolved an issue where the palette selector wouldn't initialize properly when installed via Marketplace.

## [1.0.4] - 2026-03-23

### Fixed
- **Button Visibility**: Removed conflicting theme detection logic that caused the toolbar icon to be hidden in certain states.

## [1.0.3] - 2026-03-23

### Improved
- **Startup Reliability**: Hardened the palette application logic with better DOM readiness checks.

## [1.0.2] - 2026-03-23

### Fixed
- **Selection State Persistence**: Improved how the active palette choice is stored and retrieved.

## [1.0.1] - 2026-03-22

### Added
- **Plugin Cleanup**: Implemented style removal during plugin unloading.
- **Sidebar UX**: Enhanced click-through behavior and item scaling.

## [1.0.0] - 2026-03-20

### Added
- Initial release of the **PeaceMind** theme.
- 7 curated color palettes (Sage, Slate, Sand, Rose, Horizon, Moss, Clay).
- Dynamic palette selector in the Logseq toolbar.
- Highly optimized checkbox and task marker styling.
- Zen-minimalist aesthetic for focus and deep work.
