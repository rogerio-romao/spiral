# AGENTS.md

## Project

Electron music player with Canvas 2D generative art visualizer. 143 algorithm
classes.

## Run

- `pnpm start` - development
- `pnpm start:prod` - production
- `pnpm generate:algos` - regenerate algorithm registry

## Key Files

| File                                 | Purpose                           |
| ------------------------------------ | --------------------------------- |
| `main.js`                            | Electron main process             |
| `preload.js`                         | contextBridge API                 |
| `renderer.js`                        | Entry point                       |
| `src/Spiral.js`                      | Orchestrator                      |
| `src/TransitionManager.js`           | Algorithm lifecycle, canvas reset |
| `src/AlgorithmLoader.js`             | Base class for algos              |
| `src/AlgorithmChooser.js`            | Random algo picker                |
| `src/FrequencyAnalyser.js`           | Audio FFT data (5 bands)          |
| `src/algos/*.js`                     | 143 algorithm classes             |
| `src/generated/algorithmRegistry.js` | Auto-generated (never edit)       |

## Electron

- Renderer: `src/`, `assets/`, browser context only
- No Node APIs in renderer

## Algorithm Rules

- Run `pnpm generate:algos` after adding/removing algos
- `stop()` cancels requestAnimationFrame - always call before switching
- Access audio via `AlgorithmLoader.frequencyAnalyser?.getBands()`
- `this.t` (frame counter) and `this.speed` available from base class

## Keyboard (KeyboardController.js)

Space, F, I, D, M, S, H, P, E

## Dependencies

- GSAP: vendored in `assets/js/`, use `window.gsap`
- pnpm only - no npm/yarn
- No new runtime deps without approval
