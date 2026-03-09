// oxlint-disable vitest/max-expects
// oxlint-disable max-lines-per-function
// oxlint-disable max-classes-per-file
// oxlint-disable no-empty-function

import AlgorithmLoader from '../src/AlgorithmLoader.js';
import TransitionManager from '../src/TransitionManager.js';
import createMockCanvas from './helpers/mockCanvas.js';

vi.mock(import('../src/generated/algorithmRegistry.js'), () => ({
    algorithms: [
        class AlgoA {
            name = 'AlgoA';
            stop() {}
        },
        class AlgoB {
            name = 'AlgoB';
            stop() {}
        },
        class AlgoC {
            name = 'AlgoC';
            stop() {}
        },
        class AlgoD {
            name = 'AlgoD';
            stop() {}
        },
        class AlgoE {
            name = 'AlgoE';
            stop() {}
        },
    ],
}));

function createDeps(overrides = {}) {
    const { canvas, ctx } = createMockCanvas();
    const mockHud = { displayAlgorithmName: vi.fn() };

    AlgorithmLoader.ctx = ctx;
    AlgorithmLoader.w = 1920;
    AlgorithmLoader.h = 1080;

    return {
        algorithmLoader: { speed: 0 },
        canvas,
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
        it('instantiates a new algorithm', () => {
            const tm = new TransitionManager(createDeps());
            tm.changeAlgorithm();

            expect(tm.currentAlgorithm).not.toBeNull();
        });

        it('calls displayAlgorithmName on the hud', () => {
            const deps = createDeps();
            const tm = new TransitionManager(deps);
            tm.changeAlgorithm();

            expect(deps.hudController.displayAlgorithmName).toHaveBeenCalledWith(
                expect.any(String),
            );
        });

        it('does nothing when already transitioning', () => {
            const tm = new TransitionManager(createDeps());
            const initialAlgorithm = { name: 'test', stop() {} };
            tm.currentAlgorithm = initialAlgorithm;
            tm.isTransitioning = true;
            tm.changeAlgorithm();

            expect(tm.currentAlgorithm).toBe(initialAlgorithm);
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
            const tm = new TransitionManager(createDeps());
            const spy = vi.spyOn(tm, 'getRandomAlgorithm').mockImplementation(() => {
                callCount += 1;
                return class BadAlgo {
                    constructor() {
                        throw new Error('constructor failed');
                    }
                };
            });
            tm.chooseAlgos();

            expect(callCount).toBe(3);
            expect(tm.algoRetries).toBe(0);
            spy.mockRestore();
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
            const tm = new TransitionManager(createDeps());
            tm.autoChangeIntervalInSeconds = 2;
            tm.resetAutoChangeTimer();
            vi.advanceTimersByTime(2000);

            expect(tm.currentAlgorithm).not.toBeNull();
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

            AlgorithmLoader.ctx = ctx;

            const tm = new TransitionManager({
                algorithmLoader: { speed: 0 },
                canvas,
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

    describe('getRandomAlgorithm', () => {
        it('returns an algorithm class from the pool', () => {
            const tm = new TransitionManager(createDeps());
            const result = tm.getRandomAlgorithm();

            expect(result).toBeDefined();
            expect(result).not.toBeNull();
        });

        it('adds picked algorithms to the history set', () => {
            const tm = new TransitionManager(createDeps());
            tm.getRandomAlgorithm();

            expect(tm.lastAlgos.size).toBe(1);
        });

        it('does not repeat algorithms within the history window', () => {
            const tm = new TransitionManager(createDeps());
            const picks = new Set();
            for (let i = 0; i < 5; i++) {
                picks.add(tm.getRandomAlgorithm());
            }

            expect(picks.size).toBe(5);
        });

        it('trims history to the effective capacity before each pick', () => {
            const tm = new TransitionManager(createDeps());
            // Mock pool has 5 algos. Set lastAlgosCapacity=2 so effectiveCapacity = floor(5*2/5) = 2.
            tm.lastAlgosCapacity = 2;
            // Pick 4 times — history should never grow beyond effectiveCapacity+1 = 3
            for (let i = 0; i < 4; i++) {
                tm.getRandomAlgorithm();
            }

            expect(tm.lastAlgos.size).toBeLessThanOrEqual(3);
        });

        it('defaults to a capacity of 50', () => {
            const tm = new TransitionManager(createDeps());

            expect(tm.lastAlgosCapacity).toBe(50);
        });
    });

    describe('blocked algorithms', () => {
        it('defaults to an empty blocked set', () => {
            const tm = new TransitionManager(createDeps());

            expect(tm.blockedAlgorithms.size).toBe(0);
        });

        it('never picks a blocked algorithm', () => {
            const tm = new TransitionManager(createDeps());
            // Block 4 of 5 algos; only AlgoE remains
            tm.blockedAlgorithms = new Set(['AlgoA', 'AlgoB', 'AlgoC', 'AlgoD']);

            for (let i = 0; i < 10; i++) {
                const picked = tm.getRandomAlgorithm();
                expect(picked.name).toBe('AlgoE');
            }
        });

        it('scales effective capacity proportionally with active pool size', () => {
            const tm = new TransitionManager(createDeps());
            // lastAlgosCapacity=50, total pool in mock=5; block 3 → 2 active
            // effectiveCapacity = floor(2 * 50/5) = floor(20) = 20 → but capped by pool size naturally
            tm.blockedAlgorithms = new Set(['AlgoA', 'AlgoB', 'AlgoC']);
            // With 2 active algos and lastAlgosCapacity=2: effectiveCapacity = floor(2*2/5) = 0
            tm.lastAlgosCapacity = 2;

            for (let i = 0; i < 6; i++) {
                tm.getRandomAlgorithm();
            }

            // With effectiveCapacity=0 all entries are evicted each round; size stays at 1 after add
            expect(tm.lastAlgos.size).toBeLessThanOrEqual(2);
        });

        it('resets lastAlgos and uses full active pool when all active algos are in history', () => {
            const tm = new TransitionManager(createDeps());
            // Only 2 active algos
            tm.blockedAlgorithms = new Set(['AlgoA', 'AlgoB', 'AlgoC']);

            // Find the actual classes from the registry by picking twice
            const _first = tm.getRandomAlgorithm();
            const _second = tm.getRandomAlgorithm();
            // Now lastAlgos has both active algos — next pick should reset and still succeed
            const third = tm.getRandomAlgorithm();

            expect(third).toBeDefined();
        });

        it('setBlockedAlgorithms replaces the blocked set', () => {
            const tm = new TransitionManager(createDeps());
            tm.setBlockedAlgorithms(['AlgoA', 'AlgoB']);

            expect(tm.blockedAlgorithms.has('AlgoA')).toBeTruthy();
            expect(tm.blockedAlgorithms.has('AlgoB')).toBeTruthy();
            expect(tm.blockedAlgorithms.size).toBe(2);
        });

        it('setBlockedAlgorithms clears previous entries', () => {
            const tm = new TransitionManager(createDeps());
            tm.blockedAlgorithms = new Set(['AlgoC', 'AlgoD']);
            tm.setBlockedAlgorithms(['AlgoA']);

            expect(tm.blockedAlgorithms.has('AlgoC')).toBeFalsy();
            expect(tm.blockedAlgorithms.has('AlgoA')).toBeTruthy();
        });
    });
});
