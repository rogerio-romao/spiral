# Code Review TODO

## Critical (must fix)

- [src/AlgorithmChooser.js:20] Performance: `Set.values().next().value` does not reliably return the oldest entry - Set iteration order is implementation-dependent. Use an array or queue instead.
  Suggestion: Replace `this.lastAlgos` with an array and `shift()` to remove oldest entry.

- [index.html:7] Security: CSP allows `'unsafe-inline'` for styles, which weakens XSS protection.
  Suggestion: Move inline styles to external CSS classes.

## High (should fix soon)

- [src/MusicPlayer.js:64] Code Quality: File names are displayed directly without sanitization - potential XSS if malicious filenames are used.
  Suggestion: Sanitize `files[i].name` before setting `textContent`.

- [src/Spiral.js:117-134] Performance: Resize handler stops and restarts algorithm on every resize event despite debounce - could cause visible flicker.
  Suggestion: Only reset canvas dimensions, not full algorithm restart.

- [src/algos/SoapyBubbles.js:27-30] Dead Code: `setupConstantStyles()` is defined but never called.
  Suggestion: Either call it or remove it.

## Medium (should fix eventually)

- [src/AlgorithmLoader.js:44-56] Code Quality: The draw wrapper in constructor is redundant since algorithms override `draw()` directly - creates unnecessary complexity.
  Suggestion: Remove wrapper or document why it's needed.

- [src/utils/math.js:26-36] DRY: `distance()` and `distanceXY()` duplicate logic - consolidate into one.
  Suggestion: Make `distance()` call `distanceXY()` internally.

- [src/Spiral.js:54-56] Simplification: `cursorHideTimeout` and `resizeTimeout` are stored but never cleared in destroy().
  Suggestion: Add cleanup in `destroy()` method.

- [src/utils/randomUtils.js:1-4] Naming: `random()` returns integers but doesn't indicate this in name.
  Suggestion: Rename to `randomInt()` or document behavior.

## Low (nice to have)

- [src/Spiral.js:18] Naming: `devAlgorithmClass` option is camelCase but passed to `devAlgorithmClass` in constructor - consistent.
  Suggestion: Consider `devAlgorithm` for brevity.

- [src/AlgorithmLoader.js:15-17] Code Style: Static properties `gsap` and `frequencyAnalyser` assume global `gsap` exists at class definition time.
  Suggestion: Add null checks or lazy initialization.

- [src/TransitionManager.js:40] Magic Number: `_autoChange = 60` should be a named constant.
  Suggestion: Add `DEFAULT_AUTO_CHANGE = 60` at top of file.

- [src/FrequencyAnalyser.js:33] Code Quality: No error handling if `createMediaElementSource` throws (second call on same element).
  Suggestion: Wrap in try-catch or add guard.

## Info (suggestions/observations)

- [index.html:54] Grammar: "Spiral will do it's own thing" should be "its" (missing apostrophe).
- [style.css:2-11] Good: Custom fonts properly loaded via @font-face.
- [main.js:25] Good: DevTools commented out as expected for production.
- [src/TransitionManager.js:134] Code Quality: Comprehensive canvas context reset - well documented and implemented.
- [src/AlgorithmLoader.js:47-55] Good: Error handling in draw wrapper catches and dispatches custom event.

---

**Overall Assessment:** The codebase is well-structured with good separation of concerns. The critical issue with `AlgorithmChooser` could cause incorrect algorithm selection behavior. Security is generally good (CSP, contextIsolation), but inline styles and unsanitized filename display are concerns. Performance is acceptable with proper debouncing, though the algorithm restart on resize may cause UX issues.
