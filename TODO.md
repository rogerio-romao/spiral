# Refactor: Extract Spiral.js God Object (#78)

Extract three focused modules from `Spiral.js` (~375 lines → ~120 lines),
add comprehensive canvas context reset, and guarantee only one algorithm runs
at a time.

---

## Steps

### 1. Create `src/HUDController.js`

- [ ] Extract `displayMessage()`, `displayAlgorithmName()` from `Spiral.js`
- [ ] Extract silent mode toggle and help screen toggle
- [ ] State: `messageTimer`, `algorithmNameTimer`, `helpView`, `silent`

### 2. Create `src/TransitionManager.js`

- [ ] Extract `changeAlgorithm()`, `chooseAlgos()`, `stopCurrentAlgorithm()`
- [ ] Add comprehensive `_resetCanvasContext()` with 7 missing property resets
      (textAlign, textBaseline, lineCap, lineJoin, miterLimit,
      imageSmoothingEnabled, direction)
- [ ] Add `_isTransitioning` re-entrancy guard
- [ ] Extract auto-change timer management (`regen`, `autoChange`, `manual`)
- [ ] State: `currentAlgorithm`, `regen`, `autoChange`, `manual`, `t`,
      `stagger`, `_algoRetries`

### 3. Add `togglePlayerVisibility()` to `src/MusicPlayer.js`

- [ ] Add public method as bridge for `KeyboardController`

### 4. Create `src/KeyboardController.js`

- [ ] Centralize all keyboard shortcuts (Space, F, I, D, M, S, H, P)
- [ ] Add `bind()` and `destroy()` methods (addresses E.2 tech debt)
- [ ] Wire to `HUDController`, `TransitionManager`, `MusicPlayer`

### 5. Refactor `src/Spiral.js`

- [ ] Import and instantiate the three new modules
- [ ] Remove extracted code (chooseAlgos, changeAlgorithm, stopCurrentAlgorithm,
      displayMessage, displayAlgorithmName, keyboard handler)
- [ ] Keep: canvas setup, `_applyDpr()`, `_watchDprChange()`, resize handler,
      cursor hide, canvas click, `algorithm-error` listener

### 6. Clean up `src/MusicPlayer.js`

- [ ] Remove `_handleKeyboard()` method
- [ ] Remove `window.addEventListener('keyup', ...)` from `_bindEvents()`

### 7. Update documentation

- [ ] Update `AGENTS.md` architecture section with new module descriptions
- [ ] Update keyboard shortcuts note in `AGENTS.md` Common Pitfalls
