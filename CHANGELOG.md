# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-03-23

### Changed
- **Architectural Overhaul**: Migrated entry point from `index.js` to `index.html` to ensure `@logseq/libs` are fully loaded before plugin execution.
- **Improved Style Propagation**: Now using high-priority inline styles on `<html>` for color variables, ensuring they override defaults correctly with ZERO usage of `!important` in the plugin logic.

### Fixed
- **Theme Leakage**: Added a robust cleanup system that removes all custom CSS variables when switching to other themes or disabling the plugin.
- **Dynamic Visibility**: The palette button now intelligently hides/shows based on whether the PeaceMind theme is actually active, preventing it from appearing in other themes.
- **Race Condition**: Resolved the issue where the palette button wouldn't appear on first install due to timing differences in Logseq's internal loading.

## [1.0.5] - 2026-03-23

### Fixed
- **Plugin Store Consistency**: Resolved an issue where the palette selector wouldn't initialize properly when installed via the Logseq Marketplace.

## [1.0.4] - 2026-03-23

### Fixed
- **Button Visibility**: Removed conflicting theme detection logic that caused the toolbar icon to be hidden in certain states.

## [1.0.3] - 2026-03-23

### Improved
- **Startup Reliability**: Hardened the palette application logic with better DOM readiness checks for a smoother initial launch experience.

## [1.0.2] - 2026-03-23

### Fixed
- **Selection State Persistence**: Improved how the active palette choice is stored and retrieved from Logseq's configuration.

## [1.0.1] - 2026-03-22

### Added
- **Plugin Cleanup**: Implemented style removal during plugin unloading to prevent style pollution.
- **Sidebar UX**: Enhanced click-through behavior and item scaling in the sidebar.

## [1.0.0] - 2026-03-21

### Added
- Initial release of the **PeaceMind** theme.
- 7 curated color palettes (Sage, Slate, Sand, Rose, Horizon, Moss, Clay).
- Dynamic palette selector in the Logseq toolbar.
- Highly optimized checkbox and task marker styling.
- Zen-minimalist aesthetic for focus and deep work.
