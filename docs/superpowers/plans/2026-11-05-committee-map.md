# Committee Map Implementation Plan

**Goal:** Improve committee wayfinding and mobile readability.
**Architecture:** Preserve buildless HTML/CSS/JS and existing room data; wrap the SVG plans in building cards with text directories.
**Tech Stack:** HTML, CSS, vanilla JavaScript.
**Spec:** ../specs/2026-11-05-committee-map-design.md

## Constraints
Preserve room assignments, mirrored geometry, S2 → S3 → S4 order and static hosting. No additional dependencies in the website.

## Review focus
Phone overflow, long committee names, Press search, search reset, keyboard focus and reduced-motion scrolling.

## Steps
- [x] Add building cards, text directories, legend and accessible search status in dist/app.js and dist/index.html.
- [x] Restyle map linework and building accents in dist/styles.css; stack below 800px.
- [x] Verify rendered layouts at 360, 390, 768 and 1440 pixels, search all allocated committees, keyboard interaction and console errors.
- [x] Update README, check JavaScript syntax and git diff, then commit.

## Verification
Chromium/Playwright at 360, 390, 768 and 1440px: no page overflow; S2/S3/S4 stacked below 800px and columns on desktop. All 19 content.js allocations searched successfully; directory additionally includes Press in S3. Invalid and cleared searches remove stale selection. Keyboard Enter activates map controls; collapse/reopen and overview work. Press search and reduced-motion GA1 search highlight the expected entries. No JavaScript page errors. `node --check dist/app.js` and `git diff --check` pass. Author reviewed rendered screenshots and the final diff; no independent reviewer used.
