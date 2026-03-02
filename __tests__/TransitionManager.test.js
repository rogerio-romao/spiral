// oxlint-disable no-empty-function
import createMockCanvas from './helpers/mockCanvas.js';
import TransitionManager from '../src/TransitionManager.js';

function createDeps(overrides = {}) {
    const { canvas, ctx } = createMockCanvas();
    const mockHud = { displayAlgorithmName: vi.fn() };
    const mockChooser = {
        getRandomAlgorithm: vi.fn(
            () =>
                class FakeAlgo {
                    name = 'FakeAlgo';

                    stop() {}
                },
        ),
    };

    return {
        algorithmChooser: mockChooser,
        algorithmLoader: { speed: 0 },
        canvas,
        ctx,
        getDimensions: () => ({ h: 1080, w: 1920 }),
        hud: mockHud,
        ...overrides,
    };
}

describe('transitionManager', () => {
    describe('constructor', () => {
        it('initialises with correct defaults', () => {
            const tm = new TransitionManager(createDeps());
            expect(tm.currentAlgorithm).toBeNull();
            expect(tm.autoChange).toBe(60);
            expect(tm.manual).toBeFalsy();
            expect(tm.isTransitioning).toBeFalsy();
        });
    });

    describe('stopCurrentAlgorithm', () => {
        it('calls stop() on the current algorithm', () => {
            const tm = new TransitionManager(createDeps());
            const stopSpy = vi.fn();
            tm._currentAlgorithm = { stop: stopSpy };
            tm.stopCurrentAlgorithm();
            expect(stopSpy).toHaveBeenCalledOnce();
        });

        it('sets currentAlgorithm to null', () => {
            const tm = new TransitionManager(createDeps());
            tm._currentAlgorithm = { stop: vi.fn() };
            tm.stopCurrentAlgorithm();
            expect(tm.currentAlgorithm).toBeNull();
        });

        it('is idempotent when no algorithm is running', () => {
            const tm = new TransitionManager(createDeps());
            expect(() => tm.stopCurrentAlgorithm()).not.toThrow();
        });
    });

    describe('changeAlgorithm', () => {
        it('instantiates a new algorithm via the chooser', () => {
            const deps = createDeps();
            const tm = new TransitionManager(deps);
            tm.changeAlgorithm();
            // oxlint-disable-next-line jest/prefer-called-with
            expect(deps.algorithmChooser.getRandomAlgorithm).toHaveBeenCalled();
            expect(tm.currentAlgorithm).not.toBeNull();
        });

        it('calls displayAlgorithmName on the hud', () => {
            const deps = createDeps();
            const tm = new TransitionManager(deps);
            tm.changeAlgorithm();
            expect(deps.hud.displayAlgorithmName).toHaveBeenCalledWith(
                'FakeAlgo',
            );
        });

        it('does nothing when already transitioning', () => {
            const deps = createDeps();
            const tm = new TransitionManager(deps);
            tm._isTransitioning = true;
            tm.changeAlgorithm();
            expect(
                deps.algorithmChooser.getRandomAlgorithm,
            ).not.toHaveBeenCalled();
        });

        it('resets isTransitioning to false after completion', () => {
            const tm = new TransitionManager(createDeps());
            tm.changeAlgorithm();
            expect(tm.isTransitioning).toBeFalsy();
        });
    });

    describe('_chooseAlgos retry logic', () => {
        it('retries up to 3 times when the algorithm constructor throws', () => {
            let callCount = 0;
            const chooser = {
                getRandomAlgorithm: vi.fn(() => {
                    callCount += 1;
                    return class BadAlgo {
                        constructor() {
                            throw new Error('constructor failed');
                        }
                    };
                }),
            };

            const tm = new TransitionManager(
                createDeps({ algorithmChooser: chooser }),
            );
            tm._chooseAlgos();

            // Should try 3 times (1 initial + 2 retries) then stop
            expect(callCount).toBe(3);
            expect(tm._algoRetries).toBe(0);
        });

        it('resets retry counter on success', () => {
            const tm = new TransitionManager(createDeps());
            tm._algoRetries = 2;
            tm._chooseAlgos();
            expect(tm._algoRetries).toBe(0);
        });
    });

    describe('resetAutoChangeTimer', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('starts an interval when manual is false', () => {
            const deps = createDeps();
            const tm = new TransitionManager(deps);
            tm.resetAutoChangeTimer();
            expect(tm._regen).not.toBeNull();
        });

        it('does not start an interval when manual is true', () => {
            const tm = new TransitionManager(createDeps());
            tm.manual = true;
            tm.resetAutoChangeTimer();
            expect(tm._regen).toBeNull();
        });

        it('calls changeAlgorithm after the autoChange interval elapses', () => {
            const deps = createDeps();
            const tm = new TransitionManager(deps);
            tm.autoChange = 5;
            tm.resetAutoChangeTimer();
            vi.advanceTimersByTime(5000);
            // oxlint-disable-next-line jest/prefer-called-with
            expect(deps.algorithmChooser.getRandomAlgorithm).toHaveBeenCalled();
        });
    });

    describe('dev mode', () => {
        it('setDevModeActive enables dev mode', () => {
            const tm = new TransitionManager(createDeps());
            tm.setDevModeActive(true);
            expect(tm._devModeActive).toBeTruthy();
            expect(tm._devModeAlternator).toBe(0);
        });

        it('setDevModeAlgos sets the algo slots', () => {
            const tm = new TransitionManager(createDeps());
            const AlgoA = class {};
            const AlgoB = class {};
            tm.setDevModeAlgos(AlgoA, AlgoB);
            expect(tm._devModeAlgoA).toBe(AlgoA);
            expect(tm._devModeAlgoB).toBe(AlgoB);
        });

        it('alternates between algoA and algoB in dev mode', () => {
            const AlgoA = class {
                name = 'A';

                stop() {}
            };
            const AlgoB = class {
                name = 'B';

                stop() {}
            };
            const deps = createDeps();
            const tm = new TransitionManager(deps);
            tm.setDevModeActive(true);
            tm.setDevModeAlgos(AlgoA, AlgoB);

            tm._chooseAlgos();
            const firstPick = tm.currentAlgorithm.name;
            tm._chooseAlgos();
            const secondPick = tm.currentAlgorithm.name;

            expect(firstPick).toBe('A');
            expect(secondPick).toBe('B');
        });
    });
});
