## Code Review Summary

### Critical (must fix)
- [src/algos/TemplateFrequency.js:18] Security/State: Algorithm modifies shared global state (AL.frequencyAnalyser.bandCount) affecting all algorithms.
  Suggestion: Store band count locally in the algorithm instance.

- [src/algos/TemplateBase.js:32] Performance: rotateCanvasRadians() called every frame without resetting.
  Suggestion: Call conditionally or ensure rotation is reset properly each frame.

### High (should fix soon)
- [src/AlgorithmLoader.js:40] Code Quality: speed set in constructor - every algorithm gets new random speed even when switching.
- [src/TransitionManager.js:19-20] Performance: lastAlgos Set grows indefinitely.
- [src/MusicPlayer.js:158-161] Code Quality: Division by zero possible when audio.duration is 0/NaN.
- [src/AlgorithmLoader.js:44-56] Code Quality: Wrapped draw function could mask underlying issues.

### Medium (should fix eventually)
- [preload.js:1] Code Quality: Uses CommonJS require() in ESM project.
- [src/AlgorithmLoader.js:29-30] Performance: pickRandomElement() redundant.
- [src/MusicPlayer.js:62-83] Code Quality: No validation when files is empty.
- [src/AlgorithmChooser.js:20] Code Quality: Awkward Set iteration pattern.

### Low (nice to have)
- [src/utils/randomUtils.js:1-3] Naming: random() returns integers inconsistent with mathUtils.randomRange().
- [src/AlgorithmLoader.js:15] Naming: mathUtils shadows imported module name.
- [src/TransitionManager.js:120-127] Code Quality: Inconsistent stop pattern.

### Info
- Good: CSP, contextIsolation, proper ESM, separation of concerns, cleanup in destroy() methods.
