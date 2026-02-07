# Copilot Instructions

> Full instructions: see `AGENTS.md` at the project root.

## Critical Rules

- **Electron app** — `contextIsolation: true`, `nodeIntegration: false`. No Node
  APIs in renderer code.
- **ES modules only** — `import`/`export`, no CommonJS. `"type": "module"` in
  package.json.
- **No runtime dependencies** without explicit approval. Dev deps are OK.
- **Use pnpm** — not npm or yarn.
- **No bundler** — code runs directly in Electron's renderer process.
- **GSAP is vendored** in `assets/js/gsap.min.js` — do not add as npm
  dependency.

## Code Style

- 4-space indentation
- Single quotes
- PascalCase for class files/names, camelCase for utilities/methods/variables
- Plain JavaScript — no TypeScript

## Key Gotchas

- `AlgorithmChooser.js` manually imports all 142 algorithms — update it when
  adding/removing algos.
- Keyboard shortcuts split between `Spiral.js` and `MusicPlayer.js` — check both.
- Canvas state is reset between algorithms by `Spiral.js` — don't rely on prior
  state.
- `ctx.save()`/`ctx.restore()` required when modifying transforms or composite
  operations.
