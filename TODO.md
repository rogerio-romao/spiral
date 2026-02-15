# Code Review & Improvement Plan

> Senior review of the Spiral codebase — Electron music visualizer with 142
> algorithm classes, Canvas 2D rendering, and audio playback.
>
> Created: 15 February 2026

---

## Phase 1: Bug Fixes (Critical)

### 1.1 — `roundToPlaces` uses undefined variable

- **File:** `src/utils/math.js` line 88
- **Issue:** References `mult` which is never declared. Throws `ReferenceError`
  at runtime.
- **Fix:** Add `const mult = Math.pow(10, places);` before the return statement.

- [ x ] Fix `roundToPlaces` in `src/utils/math.js`

### 1.2 — `Particle.removeGravitation` / `removeSpring` corrupts arrays

- **File:** `src/utils/Particle.js` lines 62–68
- **Issue:** When the item isn't found, `findIndex` returns `-1`, and
  `splice(-1, 1)` silently removes the **last** element. Called preemptively
  inside `addGravitation`/`addSpring` (lines 19–24), so every first-add on a
  non-empty array corrupts state.
- **Fix:** Guard with `if (index !== -1)` before splicing in both methods.

- [ x ] Guard `removeGravitation` in `src/utils/Particle.js`
- [ x ] Guard `removeSpring` in `src/utils/Particle.js`

### 1.3 — `cancelAnimationFrame` is a no-op after frame 1

- **File:** `src/AlgorithmLoader.js` lines 78–82, all 142 algorithm files
- **Issue:** Algorithms store the initial `requestAnimationFrame` ID in
  `this.interval` but never update it on subsequent frames. `stop()` cancels a
  long-expired ID. Only `isRunning = false` actually stops the loop.
- **Fix:** Add a `requestFrame()` method on `AlgorithmLoader` that wraps
  `requestAnimationFrame` and stores the returned ID in `this.interval`. Replace
  all direct `requestAnimationFrame(this.draw)` calls in algorithm files with
  `this.requestFrame()` via batch sed. This ensures `stop()` always cancels the
  correct pending frame.

- [x] Fix rAF ID tracking — added `requestFrame()` to `AlgorithmLoader`,
      batch-replaced 288 call sites across all algorithm files

### 1.4 — Leaked `setTimeout` in `VanishingPoint.js`

- **File:** `src/algos/VanishingPoint.js` line 46
- **Issue:** A 3500ms `setTimeout` isn't cancelled on `stop()`. If the algorithm
  changes before the timeout fires, the callback runs against stale state.
- **Fix:** Store the timeout ID, override `stop()` to clear it. Audit all other
  algorithm files for similar leaked timers.

- [x] Fix `VanishingPoint.js` timeout leak — stored timeout ID, added `stop()`
      override to clear it
- [x] Audit all algorithm files for leaked `setTimeout`/`setInterval` —
      `VanishingPoint.js` was the only one; no `setInterval` usage found

---

## Phase 2: Security Hardening

### 2.1 — No Content Security Policy

- **Files:** `main.js`, `index.html`
- **Issue:** No CSP meta tag and no CSP headers via Electron's session API.
  Inline scripts, `eval()`, and unrestricted resource origins are all permitted.
- **Fix:** Add a `<meta>` CSP tag in `index.html` or set headers via
  `session.defaultSession.webRequest.onHeadersReceived`. Restrict to `'self'`
  with exceptions for inline styles and the Ionicons CDN if still needed.

- [x] Add CSP to `index.html` — added meta tag restricting to `'self'` with
      `'unsafe-inline'` for styles and `blob:` for audio media

### 2.2 — Electron listed as runtime dependency

- **File:** `package.json` line 23
- **Issue:** `electron` is under `dependencies` instead of `devDependencies`.
  This is against Electron best practices and would bloat packaging.
- **Fix:** Move to `devDependencies`.

- [x] Move `electron` to `devDependencies` in `package.json`

### 2.3 — `preload.js` doesn't use `contextBridge`

- **File:** `preload.js`
- **Issue:** Directly manipulates DOM via `window.addEventListener` instead of
  using `contextBridge.exposeInMainWorld`. Also writes to DOM element IDs
  (`chrome-version`, `node-version`, `electron-version`) that don't exist in
  `index.html` — the code is dead.
- **Fix:** Rewrite using `contextBridge` pattern. Remove dead DOM references.

- [x] Rewrite `preload.js` to use `contextBridge`
- [x] Remove references to nonexistent DOM IDs

### 2.4 — Blob URLs never revoked

- **File:** `src/MusicPlayer.js` line 62
- **Issue:** `URL.createObjectURL` is called for each audio file but
  `revokeObjectURL` is never called, leaking memory over repeated track
  additions.
- **Fix:** Track blob URLs and revoke them when tracks are removed, replaced, or
  the playlist is cleared.

- [x] Add `URL.revokeObjectURL` cleanup in `MusicPlayer.js` — blob URLs revoked
      via `_revokeBlobUrls()` before each new playlist load

---

## Phase 3: Performance

### 3.1 — No `devicePixelRatio` handling

- **File:** `src/Spiral.js` lines 99–107
- **Issue:** Hardcodes `const scale = 1`. On Retina/HiDPI displays, the canvas
  renders at CSS pixel resolution, producing blurry output.
- **Fix:** Use `window.devicePixelRatio` for the canvas backing store scale in
  both the resize handler and initial setup.

- [x] Implement `devicePixelRatio` scaling in `Spiral.js`

### 3.2 — `clearScreen`/`fillScreen` clear 9x the canvas area

- **File:** `src/AlgorithmLoader.js` lines 56–61
- **Issue:** `clearRect(-w, -h, 3*w, 3*h)` clears 9x the canvas area to handle
  rotated canvases. Wasteful for non-rotated cases.
- **Fix:** Use
  `ctx.save() → ctx.resetTransform() → ctx.clearRect(0, 0, w, h) → ctx.restore()`
  for efficient clearing regardless of transform state.

- [ ] Optimize `clearScreen`/`fillScreen` in `AlgorithmLoader.js`

### 3.3 — Cursor hide spawns unbounded timeouts

- **File:** `src/Spiral.js` lines 191–196
- **Issue:** Every `mousemove` creates a new `setTimeout` without clearing the
  previous one, spawning many concurrent timers during mouse movement.
- **Fix:** Store the timeout ID and `clearTimeout` before creating a new one.

- [ ] Debounce cursor hide timeout in `Spiral.js`

### 3.4 — Resize handler triggers immediate algorithm restart

- **File:** `src/Spiral.js` line 108
- **Issue:** Every resize event calls `canvas.click()`, restarting the algorithm
  on every frame of a window drag. No debounce.
- **Fix:** Debounce the resize handler (e.g., 250ms) to batch rapid resize
  events.

- [ ] Debounce resize handler in `Spiral.js`

---

## Phase 4: Architecture & Code Organization

### 4.1 — Replace `canvas.click()` with direct method calls

- **File:** `src/Spiral.js` lines 70–71, 108
- **Issue:** The auto-change timer and resize handler both call
  `this.canvas.click()` to trigger algorithm changes, coupling logic to DOM
  events unnecessarily.
- **Fix:** Extract a `changeAlgorithm()` method and call it directly from the
  timer and resize handler. Keep the click listener as a thin wrapper.

- [ ] Extract `changeAlgorithm()` method in `Spiral.js`
- [ ] Replace all programmatic `canvas.click()` calls

### 4.2 — `stopCurrentAlgorithm()` called 3 times per transition

- **File:** `src/Spiral.js` lines 163, 237, 209
- **Issue:** On each algorithm change, `stopCurrentAlgorithm()` is called in the
  click handler, then in `clearMethod()`, then again in `chooseAlgos()`. Only
  one call is needed.
- **Fix:** Remove redundant calls; keep only the first one in the transition
  flow.

- [ ] Deduplicate `stopCurrentAlgorithm()` calls

### 4.3 — Consolidate duplicate `random`/`randomColor`

- **Files:** `src/AlgorithmLoader.js` lines 6–17, `src/utils/randomUtils.js`
- **Issue:** Both files implement `random()` and `randomColor()` independently.
  `Spiral.js` imports from `randomUtils.js` while algorithms use
  `AlgorithmLoader.random()`.
- **Fix:** Make `AlgorithmLoader` static methods delegate to `randomUtils.js`
  (single source of truth).

- [ ] Consolidate `random`/`randomColor` into one implementation

### 4.4 — Fix `Vector` naming inconsistency

- **File:** `src/utils/Vector.js` lines 8–15
- **Issue:** X setter is `setPosX()` while Y setter is `setY()`. Inconsistent
  naming suggests copy-paste error.
- **Fix:** Rename `setPosX` to `setX` (check for usages first).

- [ ] Rename `setPosX` → `setX` in `Vector.js`
- [ ] Update all call sites

### 4.5 — Guard `roundRect` polyfill

- **File:** `src/utils/roundRect.js`
- **Issue:** Unconditionally overwrites
  `CanvasRenderingContext2D.prototype.roundRect` with a non-standard signature.
  Electron v33's Chromium already has native `roundRect` with a different API.
- **Fix:** Either guard with
  `if (!CanvasRenderingContext2D.prototype.roundRect)`, or rename the custom
  method to avoid shadowing the native API.

- [ ] Guard or rename the `roundRect` polyfill

### 4.6 — `Spiral.js` God Object (future refactor)

- **File:** `src/Spiral.js` (~294 lines)
- **Issue:** Owns algorithm lifecycle, canvas setup, HUD messages, help screen,
  keyboard shortcuts, transitions, auto-change timers, and resize handling.
- **Fix (optional, larger refactor):** Extract into focused modules:
    - `HUDController` — message display, algorithm name, silent mode
    - `KeyboardController` — centralized shortcut handling (currently split
      between `Spiral.js` and `MusicPlayer.js`)
    - `TransitionManager` — `clearMethod()` logic

- [ ] Extract `HUDController` from `Spiral.js`
- [ ] Extract `KeyboardController` from `Spiral.js` and `MusicPlayer.js`
- [ ] Extract `TransitionManager` from `Spiral.js`

---

## Phase 5: UI & Accessibility

### 5.1 — Player control buttons have no accessible names

- **File:** `index.html` lines 79–167
- **Issue:** Buttons contain only `<svg>` icons — no text labels, no
  `aria-label`, no `title` attributes. Invisible to screen readers.
- **Fix:** Add `aria-label` and `title` attributes to all player buttons.

- [ ] Add `aria-label` to all player control buttons
- [ ] Add `title` tooltips to player control buttons

### 5.2 — `<progress>` element has no accessible label

- **File:** `index.html`
- **Issue:** The progress bar has no label for assistive technology.
- **Fix:** Add `aria-label="Playback progress"` or a visually hidden `<label>`.

- [ ] Add accessible label to `<progress>` element

### 5.3 — Canvas has no text alternative

- **File:** `index.html`
- **Issue:** The `<canvas>` element has no `role` or `aria-label`.
- **Fix:** Add `role="img"` and `aria-label="Music visualizer"`.

- [ ] Add `role` and `aria-label` to canvas

---

## Phase 6: Documentation & Dependencies

### 6.1 — Outdated Ionicons reference in AGENTS.md

- **File:** `AGENTS.md`
- **Issue:** States "Ionicons v7 — CDN ESM — requires internet" but `index.html`
  doesn't load Ionicons at all. SVG icons are inlined.
- **Fix:** Remove or correct the Ionicons reference.

- [ ] Update Ionicons reference in `AGENTS.md`

### 6.2 — Dead preload DOM references

- **File:** `preload.js`
- **Issue:** References DOM IDs that don't exist. Covered by 2.3 above.

### 6.3 — Migrate `electron-packager` → `@electron/packager`

- **File:** `package.json`
- **Issue:** The unscoped `electron-packager@^17` is deprecated. The scoped
  `@electron/packager` is the maintained successor.
- **Fix:** `pnpm remove electron-packager && pnpm add -D @electron/packager`

- [ ] Migrate to `@electron/packager`

### 6.4 — GSAP version untracked

- **File:** `assets/js/gsap.min.js`
- **Issue:** Vendored with no version info. No way to check for updates or known
  issues.
- **Fix:** Add a `assets/js/GSAP_VERSION` file or a comment header.

- [ ] Add GSAP version marker

### 6.5 — `TODO.md` is empty

- **File:** `TODO.md`
- **Issue:** Has section headers but no tasks. This review document supersedes
  it.

- [ ] Populate or remove `TODO.md`

---

## Error Handling (Cross-cutting)

### E.1 — No try/catch in algorithm lifecycle

- **Files:** `src/Spiral.js`, `src/AlgorithmLoader.js`
- **Issue:** If an algorithm constructor or `draw()` throws, the animation loop
  silently dies with no recovery or feedback.
- **Fix:** Wrap algorithm instantiation in `chooseAlgos()` and the draw wrapper
  in `AlgorithmLoader` with try/catch. On error, log to console and attempt to
  load next algorithm.

- [ ] Add error handling around algorithm instantiation
- [ ] Add error handling in the `AlgorithmLoader` draw wrapper

### E.2 — Event listeners never removed

- **Files:** `src/Spiral.js`, `src/MusicPlayer.js`
- **Issue:** Both add `window.addEventListener('keyup', ...)` but never remove
  them. Harmless in a single-instance app but not a clean pattern.
- **Note:** Low priority — document as known technical debt.

- [ ] Document or address event listener cleanup
