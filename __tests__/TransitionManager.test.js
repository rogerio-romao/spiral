// oxlint-disable no-empty-function

import TransitionManager from '../src/TransitionManager.js';
import createMockCanvas from './helpers/mockCanvas.js';

function createDeps(overrides = {}) {
    const { canvas } = createMockCanvas();
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
        getDimensions: () => ({ h: 1080, w: 1920 }),
        hudController: mockHud,
        ...overrides,
    };
}

describe('transitionManager', () => {
    describe('constructor', () => {
        it('initialises with correct defaults', () => {
            const tm = new TransitionManager(createDeps());

            expect(tm.currentAlgorithm).toBeNull();
            expect(tm.autoChangeIntervalInSeconds).toBe(60);
            expect(tm.isInManualMode).toBeFalsy();
            expect(tm.isTransitioning).toBeFalsy();
        });
    });

    describe('stopCurrentAlgorithm', () => {
        it('calls stop() on the current algorithm', () => {
            const tm = new TransitionManager(createDeps());
            const stopSpy = vi.fn();
            tm.currentAlgorithm = { stop: stopSpy };
            tm.stopCurrentAlgorithm();

            expect(stopSpy).toHaveBeenCalledOnce();
        });

        it('sets currentAlgorithm to null', () => {
            const tm = new TransitionManager(createDeps());
            tm.currentAlgorithm = { stop: vi.fn() };
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

            expect(deps.algorithmChooser.getRandomAlgorithm).toHaveBeenCalledWith();
            expect(tm.currentAlgorithm).not.toBeNull();
        });

        it('calls displayAlgorithmName on the hud', () => {
            const deps = createDeps();
            const tm = new TransitionManager(deps);
            tm.changeAlgorithm();

            expect(deps.hudController.displayAlgorithmName).toHaveBeenCalledWith('FakeAlgo');
        });

        it('does nothing when already transitioning', () => {
            const deps = createDeps();
            const tm = new TransitionManager(deps);
            tm.isTransitioning = true;
            tm.changeAlgorithm();

            expect(deps.algorithmChooser.getRandomAlgorithm).not.toHaveBeenCalled();
        });

        it('resets isTransitioning to false after completion', () => {
            const tm = new TransitionManager(createDeps());
            tm.changeAlgorithm();

            expect(tm.isTransitioning).toBeFalsy();
        });
    });

    describe('chooseAlgos retry logic', () => {
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

            const tm = new TransitionManager(createDeps({ algorithmChooser: chooser }));
            tm.chooseAlgos();

            // Should try 3 times (1 initial + 2 retries) then stop
            expect(callCount).toBe(3);
            expect(tm.algoRetries).toBe(0);
        });

        it('resets retry counter on success', () => {
            const tm = new TransitionManager(createDeps());
            tm.algoRetries = 2;
            tm.chooseAlgos();

            expect(tm.algoRetries).toBe(0);
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

            expect(tm.autoChangeTimeout).not.toBeNull();
        });

        it('does not start an interval when manual is true', () => {
            const tm = new TransitionManager(createDeps());
            tm.isInManualMode = true;
            tm.resetAutoChangeTimer();

            expect(tm.autoChangeTimeout).toBeNull();
        });

        it('calls changeAlgorithm after the autoChange interval elapses', () => {
            const deps = createDeps();
            const tm = new TransitionManager(deps);
            tm.autoChangeIntervalInSeconds = 2;
            tm.resetAutoChangeTimer();
            vi.advanceTimersByTime(2000);

            expect(deps.algorithmChooser.getRandomAlgorithm).toHaveBeenCalledWith();
        });
    });

    describe('dev mode', () => {
        it('setDevModeActive enables dev mode', () => {
            const tm = new TransitionManager(createDeps());
            tm.setDevModeActive(true);

            expect(tm.devModeActive).toBeTruthy();
            expect(tm.devModeAlternator).toBe(0);
        });

        it('setDevModeAlgos sets the algo slots', () => {
            const tm = new TransitionManager(createDeps());
            const AlgoA = class {};
            const AlgoB = class {};
            tm.setDevModeAlgos(AlgoA, AlgoB);

            expect(tm.devModeAlgoA).toBe(AlgoA);
            expect(tm.devModeAlgoB).toBe(AlgoB);
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
            tm.chooseAlgos();
            const firstPick = tm.currentAlgorithm.name;
            tm.chooseAlgos();
            const secondPick = tm.currentAlgorithm.name;

            expect(firstPick).toBe('A');
            expect(secondPick).toBe('B');
        });
    });

    describe('resets canvas on transition', () => {
        it('resetCanvasContext sets all expected context properties and calls methods', () => {
            // Mock canvas and context
            const setProps = {};
            const ctx = {
                beginPath: vi.fn(),
                clearRect: vi.fn(),
                resetTransform: vi.fn(),
                scale: vi.fn(),
                setLineDash: vi.fn(),
            };
            // Spy on property assignments
            [
                'globalAlpha',
                'globalCompositeOperation',
                'strokeStyle',
                'fillStyle',
                'lineWidth',
                'lineDashOffset',
                'lineCap',
                'lineJoin',
                'miterLimit',
                'shadowBlur',
                'shadowColor',
                'shadowOffsetX',
                'shadowOffsetY',
                'textAlign',
                'textBaseline',
                'direction',
                'filter',
            ].map((prop) => {
                Object.defineProperty(ctx, prop, {
                    configurable: true,
                    get: () => setProps[prop],
                    set: (val) => {
                        setProps[prop] = val;
                    },
                });
                return prop;
            });
            const canvas = { getContext: () => ctx, height: 100, style: {}, width: 100 };

            // Patch globalThis.devicePixelRatio for DPR scaling
            globalThis.devicePixelRatio = 2;

            const tm = new TransitionManager({
                algorithmChooser: { getRandomAlgorithm: vi.fn() },
                algorithmLoader: { speed: 0 },
                canvas,
                getDimensions: () => ({ h: 100, w: 100 }),
                hudController: { displayAlgorithmName: vi.fn() },
            });

            tm.resetCanvasContext();

            // Check that all expected methods were called
            expect(ctx.resetTransform).toHaveBeenCalledWith();
            expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 100, 100);
            expect(ctx.scale).toHaveBeenCalledWith(2, 2);
            expect(ctx.setLineDash).toHaveBeenCalledWith([]);
            expect(ctx.beginPath).toHaveBeenCalledWith();

            // Check that all expected properties were set
            expect(setProps.globalAlpha).toBe(1);
            expect(setProps.globalCompositeOperation).toBe('source-over');
            expect(setProps.lineWidth).toBe(1);
            expect(setProps.lineDashOffset).toBe(0);
            expect(setProps.lineCap).toBe('butt');
            expect(setProps.lineJoin).toBe('miter');
            expect(setProps.miterLimit).toBe(10);
            expect(setProps.shadowBlur).toBe(0);
            expect(setProps.shadowColor).toBe('transparent');
            expect(setProps.shadowOffsetX).toBe(0);
            expect(setProps.shadowOffsetY).toBe(0);
            expect(setProps.textAlign).toBe('start');
            expect(setProps.textBaseline).toBe('alphabetic');
            expect(setProps.direction).toBe('inherit');
            expect(setProps.filter).toBe('none');
            expect(canvas.style.background).toBe('transparent');
        });
    });
});
