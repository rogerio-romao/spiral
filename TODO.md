## Code Review Summary

### Critical (must fix)

- [x] [None found] No security vulnerabilities, crashes, or breaking bugs
      detected in the reviewed modules.

### High (should fix soon)

- [x] [src/AlgorithmLoader.js:17] Code Quality: `gsap` is referenced as a global
      (`static gsap = gsap;`), but GSAP is not imported or checked. If GSAP
      isn't loaded globally, algorithms depending on GSAP may break. Suggestion:
      Explicitly confirm GSAP is available on `window.gsap` before assignment,
      or document/guard its presence in AlgorithmLoader.
- [x] [src/Spiral.js:13-16, 166-173] Performance: `ctx.scale` is called in
      `_applyDpr()` every time dimensions change, without calling
      `ctx.resetTransform()` before scaling. This risks compounding scale
      transforms, which may lead to unexpected rendering. Suggestion: Before
      applying new scale, call `ctx.resetTransform()`. Ensure DPR scaling is not
      compounded.

### Medium (should fix eventually)

- [ ] [src/AlgorithmLoader.js:93-96] Simplification: The base `draw()` method
      throws a generic error if not implemented. While clear, this pattern could
      cause confusion if subclasses call `super.draw()` by mistake. Suggestion:
      Add explicit documentation for subclassers, and catch this scenario
      specifically in algorithms to avoid accidental errors.
- [ ] [src/HUDController.js:29-37, 40-50] Performance: Multiple `setTimeout`
      timers are managed for HUD updates, but these are not always cleared on
      new messages (`displayMessage`) or algorithm names, risking race
      conditions or stale content. Suggestion: Consider using a single timer for
      each HUD area, resetting/cancelling appropriately before setting a new
      timeout.
- [ ] [src/Spiral.js:119-132, 204-211] Performance/Simplification: Multiple
      debounce timers are used for resizing and devicePixelRatio changes; logic
      is duplicated in window resize and DPR event handlers. Suggestion: Extract
      debounce logic into a utility method to avoid code repetition and
      potential inconsistency.
- [ ] [src/algos/Wormhole.js:54-55, 56-57] Algorithmic Complexity: Variables
      (`width`, `height`, `ul`, `ur`) are incremented every frame, potentially
      growing indefinitely and impacting rendering performance or visuals.
      Suggestion: Add limits, recycling, or boundary checks to prevent excessive
      memory usage or visual artifacts.

### Low (nice to have)

- [ ] [src/algos/SoapyBubbles.js:7, src/algos/Wormhole.js:7] Naming: Algorithm
      classes define a `.name` property, but this is not strictly enforced or
      validated anywhere. Suggestion: Consider defining a convention for
      algorithm metadata (name, description, tags) and validating presence
      automatically.
- [ ] [src/Spiral.js:68-75] Info: The app displays welcome messages with tips
      using timeouts, but these are not internationalized or configurable.
      Suggestion: Move tips/messages to a config or resource file and consider
      internationalization for future flexibility.

### Info (suggestions/observations)

- [ ] [src/Spiral.js:112-114, src/AlgorithmLoader.js:51-54] Robustness: The
      orchestrator recovers gracefully from algorithm errors, auto-switching to
      the next algorithm, minimizing crash risk.
- [ ] [src/HUDController.js:56-61, 67-71] Simplification: The toggle methods for
      silent/help are clear and concise. State management is well handled.
- [ ] [src/AlgorithmLoader.js:34-57] Error Handling: Wrapping the draw loop with
      error catching and dispatching `algorithm-error` is a robust pattern.
- [ ] [src/algos/*] Naming Consistency: All algorithm classes use PascalCase for
      the class name, and extend the base AlgorithmLoader, following
      conventions.
