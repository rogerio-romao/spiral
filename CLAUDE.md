# Claude Code Instructions

> Full architecture docs, conventions, and pitfalls: see `AGENTS.md`.
> Task workflow (issues, branches, PRs, changelog): see `WORKFLOW.md`.

Electron desktop music-player + generative-art visualizer. 142 algorithm classes
render procedural Canvas 2D animations while audio plays. No bundler — ES modules
run directly in Electron.

## Task Workflow (MANDATORY)

**Every non-trivial task MUST follow the workflow defined in `WORKFLOW.md`.** Do not
skip phases without explicit user approval. The phases are:

1. **Intake** — clarify requirements, classify type (`feat`/`fix`/`docs`/`refactor`/`chore`), get approval
2. **Issue** — create GitHub issue via `gh issue create` (show title/body to user first)
3. **Branch** — create branch from `spiral2`: `<type>/issue-<N>-<slug>` (e.g. `feat/issue-42-fps-counter`)
4. **Implement** — code per AGENTS.md conventions
5. **Verify** — run `pnpm start`, check console, test the change
6. **Changelog** — add entry to `CHANGELOG.md` (propose to user first)
7. **PR** — create via `gh pr create --base spiral2 --assignee rogerio-romao` with the template from WORKFLOW.md

Pause for user confirmation at each decision point (see WORKFLOW.md table).

## Quick Architecture Reference

| File | Role |
|------|------|
| `main.js` | Electron main process — creates BrowserWindow |
| `preload.js` | contextBridge — injects version info |
| `renderer.js` | Entry — imports polyfills, instantiates `Spiral` |
| `src/Spiral.js` | **Orchestrator** — algorithm lifecycle, keyboard shortcuts, HUD, transitions, owns MusicPlayer + FrequencyAnalyser |
| `src/AlgorithmLoader.js` | **Base class** for all algorithms — draw-loop wrapping, helpers, stop/start |
| `src/AlgorithmChooser.js` | Static imports from generated registry, random picker (avoids last 50) |
| `src/MusicPlayer.js` | Audio playback, playlist, progress bar, P-key toggle |
| `src/utils/FrequencyAnalyser.js` | Web Audio wrapper — FFT split into configurable bands (default 5) |
| `src/utils/math.js` | norm, lerp, map, clamp, distance, collision, deg/rad, randomRange, bezier |
| `src/utils/randomUtils.js` | `random(min, max)`, `randomColor()` |
| `src/utils/Vector.js` | 2D vector class |
| `src/utils/Particle.js` | Physics particle (velocity, gravity, springs, friction, bounce) |
| `src/algos/*.js` | 142 algorithm classes (one per file, default export) |
| `src/generated/algorithmRegistry.js` | Auto-generated — never edit manually |

## Algorithm Lifecycle

Exact sequence when switching algorithms (`Spiral.changeAlgorithm()`):

```
1. stopCurrentAlgorithm()      → calls algo.stop(), cancels rAF, nulls ref
2. clearInterval(this.regen)    → cancels auto-change timer
3. Reset canvas state:
   a. ctx.resetTransform()      → clears accumulated rotation/scale
   b. ctx.globalAlpha = 1
   c. ctx.globalCompositeOperation = 'source-over'
   d. ctx.fillStyle = '#191919' → dark gray (NOT black — prevents color drift)
   e. ctx.fillRect(0, 0, canvas.width, canvas.height)  → physical pixels
   f. ctx.scale(dpr, dpr)       → reapply DPR so next algo uses logical pixels
   g. Reset stroke/fill to random colors
   h. ctx.beginPath()
4. chooseAlgos():
   a. Reset remaining ctx properties:
      - canvas.style.background = 'transparent'
      - imageSmoothingQuality, globalCompositeOperation, lineWidth
      - shadowBlur/Color/Offset → all cleared
      - globalAlpha = 1, filter = 'none', lineDash = []
   b. algorithmChooser.getRandomAlgorithm() → returns class
   c. new AlgorithmClass(ctx, w, h)         → constructor runs
   d. displayAlgorithmName()
5. Inside algorithm constructor:
   → super(ctx, w, h) → sets this.t=0, this.speed=random(2,6), wraps draw()
   → algorithm-specific init (particles, colors, geometry)
   → this.requestFrame()                    → starts the draw loop
```

## Canvas State Management

**Why `#191919` instead of black?** Pure black (`#000`) combined with certain
`globalCompositeOperation` modes (like `lighter` / `screen`) causes color
convergence — colours gradually wash out to black. Dark gray avoids this.

**DPR (devicePixelRatio) handling:** `Spiral._applyDpr()` sets canvas buffer to
`w*dpr × h*dpr` physical pixels, CSS size to `w × h`, and calls
`ctx.scale(dpr, dpr)`. Algorithms work in logical CSS pixels (`this.w`, `this.h`)
and never touch the physical buffer size. On DPR change (monitor switch),
`_watchDprChange()` re-applies DPR and debounce-restarts the algorithm.

**Full reset between algorithms:** The reset is split across `changeAlgorithm()`
(transform, alpha, composite, fill) and `chooseAlgos()` (shadow, filter, lineDash,
lineWidth). Both must run — never call `chooseAlgos()` without the prior reset.

## AlgorithmLoader Base Class

```
src/AlgorithmLoader.js (97 lines)
```

**Constructor** `(ctx, w, h)`:
- Sets `this.ctx`, `this.w`, `this.h`
- `this.t = 0` — frame counter
- `this.speed = random(2, 6)` — used for modulo timing
- `this.isRunning = true`
- **Wraps `this.draw`** — the subclass `draw()` is intercepted; the wrapper
  checks `isRunning` before calling the original. Do not bypass this.

**Instance methods:**
- `requestFrame()` — calls `requestAnimationFrame(this.draw)`, stores ID in `this.interval`
- `clearScreen()` — `save → resetTransform → clearRect(physical) → restore`
- `fillScreen()` — `save → resetTransform → fillRect(physical) → restore`
- `rotateCanvasRadians(angle)` / `rotateCanvasDegrees(angle)` — translate-rotate-translate around center
- `stop()` — sets `isRunning = false`, cancels rAF, nulls interval
- `draw()` — abstract, throws if not overridden

**Static properties:**
- `gsap` — reference to `window.gsap` (vendored GSAP)
- `frequencyAnalyser` — set by `Spiral.js` after construction
- `mathUtils` — re-export of `src/utils/math.js`
- `random(min, max)`, `randomColor(minC, maxC, minA, maxA)`
- `createVector(x, y)`, `createParticle(x, y, speed, dir, grav)`
- `pickRandomElement(array)`

## Algorithm Authoring Pattern

```js
import AlgorithmLoader from '../AlgorithmLoader.js';

export default class MyAlgorithm extends AlgorithmLoader {
    constructor(ctx, w, h) {
        super(ctx, w, h);
        this.name = 'My Algorithm';
        // init: particles, colors, geometry...
        this.requestFrame();            // starts the loop
    }

    draw() {
        if (this.t % this.speed === 0) { // modulo timing
            // drawing operations...
        }
        this.t++;
        this.requestFrame();             // schedule next frame
    }
}
```

Key points:
- One class per file, default export, extends `AlgorithmLoader`
- Constructor: `super(ctx, w, h)` → set `this.name` → init → `this.requestFrame()`
- Draw: modulo check → draw ops → `this.t++` → `this.requestFrame()`
- Access helpers via `AlgorithmLoader.gsap`, `AlgorithmLoader.frequencyAnalyser?.getBands()`, etc.
- Audio data: `AlgorithmLoader.frequencyAnalyser?.getBands()` returns `[0-1, 0-1, ...]` (5 bands by default); returns zeros when nothing is playing

## Known Fixes and Gotchas

These bugs have been fixed. Understand them to avoid regressions:

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| **Transform leak** | Algorithms using `rotateCanvas*` accumulated transforms across transitions | `ctx.resetTransform()` in `changeAlgorithm()` before fill |
| **Filter leak** | `ctx.filter` persisted across algorithms (e.g. blur from previous algo) | `ctx.filter = 'none'` in `chooseAlgos()` |
| **Shadow leak** | `shadowBlur`/`shadowColor`/`shadowOffset` persisted | Reset all shadow properties in `chooseAlgos()` |
| **DPR bug** | Canvas not re-scaled on monitor change → blurry or offset rendering | `_watchDprChange()` + `_applyDpr()` + DPR re-scale in `changeAlgorithm()` |
| **Black screen (blend modes)** | `globalCompositeOperation` not reset → additive/multiply modes on wrong base | Explicit reset to `'source-over'` in both `changeAlgorithm()` and `chooseAlgos()` |
| **Color convergence** | `fillRect` with `#000` + blend modes → gradual colour washout | Changed canvas fill to `#191919` (dark gray) |

## Run Commands

| Command | Description |
|---------|-------------|
| `pnpm start` | Launch the app (runs `electron .`; `prestart` hook auto-generates registry) |
| `pnpm generate:algos` | Regenerate `src/generated/algorithmRegistry.js` |

No test, lint, or build scripts. Use **pnpm** only (not npm/yarn).

# currentDate
Today's date is 2026-02-19.
