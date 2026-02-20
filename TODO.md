# Code Review TODO

## Critical (must fix)

- None identified

## High (should fix soon)

- [x] [src/utils/Particle.js:44-46] Security: Potential division by zero in
      `gravitateTo()` if distance is 0
    - Suggestion: Add guard: `if (dist === 0) return;` before calculating force

- [x] [src/utils/Particle.js:86-87] Security: Potential division by zero in
      `springTo()` if distance is 0
    - Suggestion: Add guard: `if (distance === 0) return;` before calculating
      springForce

- [x] [src/algos/Pulsar.js:66-78] Performance: Canvas transform is applied 40
      times per frame without proper save/restore in `drawBezier()`
    - Suggestion: Wrap translate/rotate with `ctx.save()`/`ctx.restore()` or
      reset transform after each call

## Medium (should fix eventually)

- [x] [src/MusicPlayer.js:182-186] Memory: `_revokeBlobUrls()` only called on
      new file selection, not on app close or component destruction
    - Fixed: Added `destroy()` methods to MusicPlayer and Spiral, wired to
      `beforeunload` in renderer.js

- [ ] [src/utils/randomUtils.js:1-3] Code Quality: `random()` returns integer
      but name suggests generic random - inconsistent with `randomRange()` in
      math.js
    - Suggestion: Rename to `randomInt()` for clarity

- [x] [src/AlgorithmLoader.js:17] Code Quality: `gsap` referenced as global
      without declaration - relies on script load order
    - Suggestion: Add `/* global gsap */` comment or document the dependency

- [x] [src/Spiral.js:69-74] Code Quality: Multiple `setTimeout` calls for
      welcome messages create race conditions if app is closed quickly
    - Suggestion: Store timeout IDs and clear them in a destroy method

- [x] [src/AlgorithmChooser.js:11-12] Performance: `filter()` + `includes()` is
      O(n\*m) each call (m = lastAlgos size up to 50)
    - Suggestion: Use a Set for `lastAlgos` for O(1) lookups

- [x] [src/algos/Entropy.js:32-42] Performance: `width++` and `height++`
      unbounded growth can cause performance issues over time
    - Suggestion: Add bounds check or reset when dimensions exceed canvas

- [x] [src/HUDController.js:33-36] Memory: Timer IDs stored but never cleaned up
      if component is destroyed
    - Suggestion: Add `destroy()` method to clear timers

## Low (nice to have)

- [ ] [src/TransitionManager.js:5] Naming: `random` and `randomColor` imported
      but also available via AlgorithmLoader static methods
    - Suggestion: Use consistent import pattern across codebase

- [ ] [src/utils/Vector.js:8-18] Code Quality: Getter/setter methods (`setX`,
      `getX`) are unidiomatic in modern JS
    - Suggestion: Use ES6 getters/setters or direct property access

- [ ] [src/algos/*.js] Code Quality: Inconsistent method naming - some use
      `setupConstantStyles`, others `setupConstantProperties`, others combine
      both
    - Suggestion: Standardize to `initializeProperties()` and `setupStyles()`
      across all algorithms

- [ ] [src/AlgorithmLoader.js:39] Naming: `interval` is misleading - it stores
      `requestAnimationFrame` ID, not an interval
    - Suggestion: Rename to `animationFrameId` or `rafId`

- [ ] [src/KeyboardController.js:34] Code Quality: Switch statement missing
      `e.preventDefault()` for Space key which may scroll page
    - Suggestion: Add `e.preventDefault()` for Space case

- [ ] [renderer.js:7] Code Quality: Hardcoded `devMode = false` requires code
      change to enable
    - Suggestion: Use environment variable or URL parameter

## Info (observations)

- [index.html:7] Security: CSP is well-configured with appropriate restrictions
  for a desktop app
- [main.js:14-18] Security: Correct use of `contextIsolation: true` and
  `nodeIntegration: false`
- [preload.js:1] Code Quality: Uses CommonJS `require` which is correct for
  preload scripts
- [src/utils/roundRectExtra.js:21] Code Quality: Uses `== undefined` instead of
  `=== undefined`
- [src/Spiral.js:177-200] Code Quality: `_watchDprChange()` is well-implemented
  with proper cleanup via `{ once: true }`
- [src/generated/algorithmRegistry.js] Code Quality: Auto-generated file follows
  good patterns with clear header comments
- [scripts/generate-algorithm-registry.mjs] Code Quality: Good validation of
  file names as valid JS identifiers
- [src/FrequencyAnalyser.js] Code Quality: Well-documented with clear JSDoc
  comments
- [src/algos/TemplateBase.js, TemplateFrequency.js] Code Quality: Good template
  files for consistency

---

**Overall Assessment**: The codebase is well-structured with good separation of
concerns. The architecture follows clean patterns with proper Electron security
practices. Main areas for improvement are edge-case error handling (division by
zero), memory cleanup for long-running sessions, and minor naming/consistency
improvements across the 142 algorithm files.
