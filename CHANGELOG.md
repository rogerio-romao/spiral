# Changelog

<!-- Format: ## YYYY-MM-DD followed by one-liner entries. -->

## 2026-02-15

- fix: Debounce cursor hide timeout and hide cursor on app launch
- fix: Optimize clearScreen/fillScreen to clear exact canvas area instead of 9x
- feat: Implement devicePixelRatio scaling for sharp rendering on HiDPI displays
- perf: Defer MusicPlayer and FrequencyAnalyser instantiation to init()
- fix: Add Content Security Policy meta tag to index.html
- fix: Move electron from dependencies to devDependencies
- fix: Rewrite preload.js to use contextBridge, remove dead DOM references
- fix: Add blob URL revocation in MusicPlayer to prevent memory leaks

## 2026-02-10

- refactor: Consolidate FrequencyAnalyser and MusicPlayer ownership under Spiral

## 2026-02-08

- feat: Add Web Audio frequency analyser for audio-reactive visualizations

## 2026-02-07

- docs: Rewrite README for end users with friendly tone
- chore: automate AlgorithmChooser registry generation
