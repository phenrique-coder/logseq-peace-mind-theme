# Changelog

All notable changes to this project will be documented in this file.

## [1.1.6] - 2026-03-31

### Added
- **Block Focus Indicator**: Implemented a modern 3px vertical accent border and soft background tint for the currently focused block, providing clear visual feedback during deep writing sessions.

### Fixed
- **Create Button**: Refined the "Create" button with a dashed border that dynamically adapts its color and opacity based on the active theme (Dark/Light), featuring a subtle transparency-based background for a more organic look.
- **Header Stability**: Consistently enforced sticky behavior for the main header with a solid background to maintain UI integrity.

## [1.1.5] - 2026-03-31

### Added
- **Capsule Tags**: Implemented a modern "pill" shape for tags (`#tag`) with subtle backgrounds and consistent accent coloring.
- **Enhanced Blockquotes**: Refined quote styling with left-border emphasis and sRGB color-mixing for soft background highlights.
- **Organic Highlighter**: Replaced default yellow highlights (`==text==`) with a dynamic, palette-aware background that matches the theme's active accent.

### Fixed
- **Autocomplete Modals**: Fully styled the command palette (`/commands`) and other modals to follow the theme's palette, including refined hover and keyboard-focus states.
- **Numbered List Geometry**: Final fixes for numbered list bullets to ensure a perfect capsule shape for long numerals (e.g., Roman) and correct alignment with text blocks.

## [1.1.4] - 2026-03-28

### Fixed
- **Numbered Lists**: Fixed formatting issue where numbered list background was displaying as an uneven oval. Improved the styling to dynamically use a capsule ("pill") format that cleanly adapts to numbers of any length (e.g., Roman numerals) while staying perfectly aligned with standard bullet points.
- **Hover Aesthetics**: Corrected highlight transparency to respect 50% opacity and properly adapt to typed lists versus standard blocks.


## [1.1.3] - 2026-03-25

### Changed
- **Typography & Contrast**: Refined standardized text colors for better readability across all themes (`--peace-text-dark` and `--peace-text-light`).
- **Header Aesthetics**: Adjusted light mode header background color for a cleaner look.

### Fixed
- **Button Styling**: Linked "Create" button text color back to theme variables for better consistency.

## [1.1.2] - 2026-03-25

### Fixed
- **Production Specifity**: Implemented "Super Shielded" CSS hover selectors for the "Create" button, ensuring the theme's visual identity prevails over Logseq's native production styles in the Marketplace version.

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
