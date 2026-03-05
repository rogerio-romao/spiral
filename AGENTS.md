# AGENTS.md

## Project

Electron music player with Canvas 2D generative art visualizer. 143 algorithm
classes.

## Run

- `pnpm start` - development
- `pnpm start:prod` - production
- `pnpm generate:algos` - regenerate algorithm registry

## Linting

- `pnpm lint` - runs oxlint on JS files
- `pnpm lint:fix` - runs oxlint with --fix
- `pnpm lint:css` - runs stylelint on CSS files
- `pnpm format` - runs oxfmt and formats files
- `pnpm format:check` - runs oxfmt with --check (no formatting, just checks for issues)

ALWAYS run lint before committing, and fix any errors. ALWAYS run lint:css after
editing CSS, and fix any errors before committing. ALWAYS run format before committing, and fix any formatting issues.

## Tests

- Tests use Vitest, located in `__tests__/` folder at project root
- Run with `pnpm test`

ALWAYS write tests for new features and bug fixes. Tests should cover expected behavior and edge cases. Run tests before committing, and ensure all tests pass.
ALWAYS update tests when changing existing functionality, and ensure all tests pass after changes.
ALWAYS run tests after modifying code, even if you think the changes are minor. This helps catch any unintended side effects and ensures code quality.

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

## Code Style

- NO inline comments - if comment is needed, write it in its own line above the
  code
- Dont use `_` prefix for private methods/props - just use normal names.
