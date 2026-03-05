# DevModeController Test Coverage TODO

## Edge Cases and Features to Test

- [x] Error handling: throws if required DOM elements are missing in `initDomRefs()`
- [x] 'Random' option: selecting 'Random' sets `algoA`/`algoB` to null and calls `updateDevAlgos` with null
- [ ] Production mode: only `algorithms` (not `templateAlgorithms`) are used in selects
- [ ] Robustness: direct calls to `onDevAlgoChange`/`onToggleDevModeChange` with invalid input
- [ ] UI state: after disabling dev mode, badge and HUD message are correct
