# AGENTS.md — Coding Agent Instructions

## Project Overview

Electron desktop music player with a generative art visualizer. Renders
procedural animations on an HTML5 Canvas 2D while audio plays. 142
self-contained algorithm classes produce distinct visual patterns that
auto-cycle or can be manually triggered. No bundler — ES modules run directly in
Electron.

## Task Workflow

When requesting new work, I follow a standardized task workflow documented in
[WORKFLOW.md](WORKFLOW.md). This covers:

- Task intake and clarification
- GitHub issue creation
- Feature branch naming (conventional commits)
- Implementation per code conventions
- Verification and testing
- CHANGELOG updates
- Pull request creation

See [WORKFLOW.md](WORKFLOW.md) for the complete workflow and decision points.

## Tech Stack

| Layer           | Technology        | Notes                                        |
| --------------- | ----------------- | -------------------------------------------- |
| Desktop shell   | Electron v33      | ESM (`"type": "module"`)                     |
| Rendering       | HTML5 Canvas 2D   | No WebGL                                     |
| Animation lib   | GSAP              | Loaded from `assets/js/gsap.min.js`, not npm |
| Icons           | Ionicons v7       | CDN ESM — requires internet                  |
| Fonts           | DM Mono, Oswald   | Custom TTFs in `assets/fonts/`               |
| Package manager | pnpm              | Required — do not use npm/yarn               |
| Packaging       | electron-packager | Dev dependency                               |

No TypeScript. No bundler. No test framework. No linter/formatter config.

## Architecture

```
main.js              Electron main process — creates BrowserWindow
preload.js           Injects version info via contextBridge
index.html           DOM: canvas, HUD overlay, help screen, music player UI
renderer.js          Renderer entry — imports polyfills, instantiates Spiral
src/
  Spiral.js          Orchestrator — algorithm lifecycle, keyboard shortcuts, HUD, transitions,
                       owns MusicPlayer and FrequencyAnalyser
  MusicPlayer.js     Audio playback, playlist management, progress bar, P-key toggle
  AlgorithmChooser.js  Static imports of all 142 algos, random selection (avoids last 50)
  AlgorithmLoader.js   Base class for all algorithms (draw loop, helpers, stop/start)
  algos/             142 self-contained algorithm classes (one per file)
  utils/
    Vector.js        2D vector (add, subtract, multiply, divide, angle, length)
    Particle.js      Physics particle (position, velocity, gravity, springs, friction, bounce)
    math.js          norm, lerp, map, clamp, distance, collision, deg↔rad, randomRange, bezier
    randomUtils.js   random(min, max), randomColor() — used by renderer.js and Spiral.js
    roundRectExtra.js     Side-effect polyfill — patches CanvasRenderingContext2D prototype
    FrequencyAnalyser.js  Web Audio API wrapper — splits FFT into configurable bands (default 5)
assets/
  js/gsap.min.js     GSAP library (global)
  fonts/             Custom font files
```

## Electron Process Rules

- `contextIsolation: true`, `nodeIntegration: false` — **no Node APIs in
  renderer**
- **Main process:** only `main.js` — window creation, app lifecycle
- **Preload:** only `preload.js` — limited bridge via `contextBridge`
- **Renderer:** `renderer.js`, everything in `src/`, everything in `assets/` —
  browser context only
- Never `require()` or import Node built-in modules in renderer code
- IPC must go through preload's `contextBridge` if needed

## File Structure Map

| Path                      | Purpose                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| `main.js`                 | Electron main process entry                                                              |
| `preload.js`              | Context bridge, version injection                                                        |
| `renderer.js`             | Renderer entry: imports polyfills, instantiates Spiral                                   |
| `index.html`              | DOM structure: canvas, HUD, player controls                                              |
| `style.css`               | All styles                                                                               |
| `src/Spiral.js`           | Core orchestrator — owns MusicPlayer and FrequencyAnalyser                               |
| `src/MusicPlayer.js`      | Audio playback, playlist, progress bar, P-key toggle                                     |
| `src/AlgorithmChooser.js` | Algorithm registry and random picker                                                     |
| `src/AlgorithmLoader.js`  | Base class for algorithms                                                                |
| `src/algos/*.js`          | Individual algorithm classes (142 files)                                                 |
| `src/utils/*.js`          | Shared utilities (Vector, Particle, math, random, roundRect polyfill, FrequencyAnalyser) |
| `assets/js/`              | GSAP (loaded globally, not via npm)                                                      |
| `assets/fonts/`           | Custom font files                                                                        |

## Code Conventions

- **ES modules** throughout — `import`/`export`, no CommonJS
- **4-space indentation**
- **Single quotes** for strings
- **PascalCase** for class files and class names (`AlgorithmLoader.js`,
  `class Spiral`)
- **camelCase** for utility files, methods, variables (`math.js`,
  `randomColor()`)
- Each algorithm file: single default-exported class extending `AlgorithmLoader`
- No TypeScript — all plain JavaScript
- No bundler — code runs directly in Electron's renderer
- `'use strict'` is used in `renderer.js` (modules are strict by default but the
  convention exists)

## Canvas 2D Rules

- `Spiral.js` resets canvas state (`save`/`restore`, styles,
  `globalCompositeOperation`) between algorithms — do not rely on prior state
- Always use `ctx.save()` / `ctx.restore()` when modifying transforms or
  composite operations
- `globalCompositeOperation` persists across draw calls if not reset — always be
  explicit
- `roundRectExtra` polyfill is added in `renderer.js` — available on all
  `CanvasRenderingContext2D` instances
- Canvas dimensions are set by `Spiral.js` — never hardcode canvas width/height
- The draw loop uses `requestAnimationFrame` — cancelled via `stop()` in
  `AlgorithmLoader`

## Frequency Analyser

- `FrequencyAnalyser` (`src/utils/FrequencyAnalyser.js`) wraps the Web Audio API
  to provide real-time frequency data from the `<audio>` element
- Audio graph: `MediaElementAudioSourceNode` → `AnalyserNode` →
  `AudioContext.destination` (audio still plays through speakers)
- `createMediaElementSource` can only be called **once** per `<audio>` element —
  the analyser is created once in `Spiral.js` constructor
- Exposed as `AlgorithmLoader.frequencyAnalyser` (static property, same pattern
  as `AlgorithmLoader.gsap`) — set by `Spiral.js`
- `getBands()` returns a plain `Array` of normalised 0–1 values; band count
  defaults to 5 (low / low-mid / mid / high-mid/ high) but is configurable via
  the `bandCount` setter
- `getRawData()` returns the full `Uint8Array` FFT buffer for advanced use
- `AudioContext` starts suspended — `Spiral.js` listens for the `audio`
  element's `play` event and calls `resume()` automatically
- Algorithms opt in by calling `AlgorithmLoader.frequencyAnalyser?.getBands()`
  inside their `draw()` loop; the call returns all zeros when nothing is playing

## Dependency Rules

- **No new runtime dependencies** without explicit approval
- **Dev dependencies** (linters, test frameworks, build tools) are allowed
- **Use pnpm** — do not use npm or yarn
- GSAP is vendored in `assets/js/` — do not add it as an npm dependency
- Ionicons loaded via CDN — do not bundle locally

## Common Pitfalls

- `AlgorithmChooser.js` reads from the generated registry at
  `src/generated/algorithmRegistry.js` — run `pnpm generate:algos` (or rely on
  the `prestart` hook) whenever algorithms are added or removed and never edit
  the generated file directly
- Algorithm `stop()` cancels `requestAnimationFrame` — always ensure `stop()` is
  called before switching algorithms
- `this.draw` in algorithms is **wrapped by `AlgorithmLoader`** to check
  `isRunning` — do not bypass this mechanism
- Keyboard shortcuts are split between `Spiral.js` (Space, F, I, D, M, S, H) and
  `MusicPlayer.js` (P key for player) — check both files when modifying
  shortcuts
- GSAP is **global** (`window.gsap`) from the vendored file — `AlgorithmLoader`
  exposes it as a static ref
- `FrequencyAnalyser` is instantiated once in `Spiral.js` constructor —
  `createMediaElementSource` throws if called twice on the same `<audio>`
  element
- No tests exist — when adding test tooling, there is no existing infrastructure
  to extend
- The `AlgorithmLoader` constructor receives `(ctx, w, h)` — these are the
  canvas context and dimensions, passed by `Spiral.js`
- Algorithm frame counter `this.t` and timing via `this.speed` are inherited
  from `AlgorithmLoader` — respect this pattern

## Run Commands

| Command               | Description                                     |
| --------------------- | ----------------------------------------------- |
| `pnpm start`          | Launch the app (`electron .`)                   |
| `pnpm generate:algos` | Regenerate `src/generated/algorithmRegistry.js` |

No test, lint, or build scripts are currently defined.
