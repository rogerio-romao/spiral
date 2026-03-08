# Changelog

<!-- Format: ## YYYY-MM-DD followed by one-liner entries. -->

## 2026-03-08

- fix: Move #msg element from bottom-right to bottom-center of screen — positions messages centered while keeping algorithm names at bottom-right

- refactor: Move AlgorithmChooser logic into TransitionManager — removes standalone AlgorithmChooser class, adds getRandomAlgorithm() method with lastAlgos history tracking to TransitionManager; updates tests accordingly

- refactor: Make canvas context, width, and height static properties on AlgorithmLoader — eliminates ctx/w/h constructor params from all 143 algorithms; values auto-update on resize (closes #138)

## 2026-03-02

- chore: Add unit tests for WaveformController (0%→100%) — 17 tests covering constructor, \_resizeCanvas, toggle, \_start, \_stop, destroy, \_draw (including exponential-smoothing assertion), and getWaveformData; total test count 260→277

- chore: Improve test coverage — add unit tests for KeyboardController (0%→~100%), extend AlgorithmLoader with color/palette/canvas method tests, add MusicPlayer prototype method tests, export and test generateAlgorithmRegistry run() with mocked fs; total test count 222→260

- chore: Add Vitest browser mode tests for HudController, DevModeController, and
  MusicPlayer — installs @vitest/browser-playwright, configures multi-project
  vitest.config.js (unit/node + browser/chromium), adds HudController jsdom tests,
  and browser tests covering DOM manipulation, module mocking, and real Canvas 2D

## 2026-02-28

- feat: Enhance playlist functionality — add tracks to existing playlist without
  replacing, remove individual tracks, drag-and-drop reordering, and duplicate
  track detection (MusicPlayer.js, style.css)

## 2026-02-28

- feat: Add hotkey summary to help modal — quick boxed hotkey overview between
  the heading and help text (index.html, style.css)

## 2026-02-22

- fix: Restrict Dev Mode (algorithm test modal, badge, and shortcut) to
  development only — all Dev Mode UI and logic are now inaccessible in
  production builds; enforced via environment flag and renderer checks

- feat: Add runtime dev mode for algorithm testing — modal with algorithm pair
  selectors (press E), visual DEV badge, reuses existing interval/manual
  controls; replaces hardcoded dev mode in renderer.js
- feat: Add playlist accordion with track-jump to music player — current track
  name and chevron toggle displayed in player bar; clicking chevron opens/closes
  animated accordion showing full playlist; clicking a track jumps to it with a
  200ms delay (debounced)
- feat: Add elapsed/remaining and total time display to music player progress
  bar
- refactor: Extract HUDController, KeyboardController, and TransitionManager
  from Spiral.js — reduce god object from ~375 to ~200 lines by splitting HUD
  overlay, keyboard shortcuts, and algorithm lifecycle into focused modules
- fix: Add comprehensive canvas context reset between algorithm transitions —
  add 7 missing property resets (textAlign, textBaseline, lineCap, lineJoin,
  miterLimit, imageSmoothingEnabled, direction) to prevent state leakage
- fix: Add re-entrancy guard to algorithm transitions — prevent overlapping
  transitions from rapid input or timer races
- refactor: Centralize all keyboard shortcuts in KeyboardController —
  consolidate handlers from Spiral.js and MusicPlayer.js into single module with
  destroy() cleanup

## 2026-02-19

- fix: Add error handling around algorithm lifecycle — try/catch in constructor
  instantiation and draw wrapper with auto-recovery to next algorithm
- fix: Algorithm name display now consistently shows for 5 seconds — clear stale
  timeout on each algorithm change to prevent premature hiding

## 2026-02-16

- feat: Add accessibility labels to player controls, progress bar, and canvas —
  add aria-label and title attributes for screen reader support
- refactor: Replace canvas.click() with direct method calls — decouple algorithm
  transition logic from DOM events by extracting changeAlgorithm() method
- refactor: Deduplicate stopCurrentAlgorithm() calls — remove redundant calls
  from clearMethod() and chooseAlgos(), keeping only the call in
  changeAlgorithm()
- refactor: Consolidate duplicate random/randomColor implementations — make
  AlgorithmLoader delegate to randomUtils.js for single source of truth

## 2026-02-15

- fix: Debounce cursor hide timeout and hide cursor on app launch
- fix: Optimize clearScreen/fillScreen to clear exact canvas area instead of 9x
- feat: Implement devicePixelRatio scaling for sharp rendering on HiDPI displays
- perf: Defer MusicPlayer and FrequencyAnalyser instantiation to init()
- fix: Add Content Security Policy meta tag to index.html
- fix: Move electron from dependencies to devDependencies
- fix: Rewrite preload.js to use contextBridge, remove dead DOM references
- fix: Add blob URL revocation in MusicPlayer to prevent memory leaks
- fix: Debounce resize handler and stop running algorithm on resize to prevent
  repeated restarts (TODO 3.4)

## 2026-02-10

- refactor: Consolidate FrequencyAnalyser and MusicPlayer ownership under Spiral

## 2026-02-08

- feat: Add Web Audio frequency analyser for audio-reactive visualizations

## 2026-02-07

- docs: Rewrite README for end users with friendly tone
- chore: automate AlgorithmChooser registry generation
