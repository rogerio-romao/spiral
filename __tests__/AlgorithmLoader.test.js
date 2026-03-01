// @vitest-environment jsdom

import AlgorithmLoader from '../src/AlgorithmLoader.js';

function createMockCtx() {
    const canvas = document.createElement('canvas');
    const ctx = {
        canvas,
        save: vi.fn(),
        restore: vi.fn(),
        resetTransform: vi.fn(),
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        beginPath: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
    };
    return { canvas, ctx };
}

class WorkingAlgo extends AlgorithmLoader {
    constructor(ctx, w, h) {
        super(ctx, w, h);
    }

    draw() {
        // no-op
    }
}

class BrokenAlgo extends AlgorithmLoader {
    constructor(ctx, w, h) {
        super(ctx, w, h);
    }

    draw() {
        throw new Error('intentional draw error');
    }
}

describe('AlgorithmLoader', () => {
    describe('constructor', () => {
        it('initialises state correctly', () => {
            const { ctx } = createMockCtx();
            const algo = new WorkingAlgo(ctx, 100, 200);
            expect(algo.ctx).toBe(ctx);
            expect(algo.w).toBe(100);
            expect(algo.h).toBe(200);
            expect(algo.t).toBe(0);
            expect(algo.isRunning).toBe(true);
            expect(algo.animationFrameId).toBeNull();
        });
    });

    describe('stop', () => {
        it('sets isRunning to false', () => {
            const { ctx } = createMockCtx();
            const algo = new WorkingAlgo(ctx, 100, 100);
            algo.stop();
            expect(algo.isRunning).toBe(false);
        });

        it('clears animationFrameId', () => {
            const { ctx } = createMockCtx();
            const algo = new WorkingAlgo(ctx, 100, 100);
            algo.animationFrameId = 42;
            algo.stop();
            expect(algo.animationFrameId).toBeNull();
        });
    });

    describe('draw error handling', () => {
        it('dispatches algorithm-error on the canvas when draw throws', () => {
            const { canvas, ctx } = createMockCtx();
            const algo = new BrokenAlgo(ctx, 100, 100);

            const handler = vi.fn();
            canvas.addEventListener('algorithm-error', handler);

            algo.draw();

            expect(handler).toHaveBeenCalledTimes(1);
        });

        it('stops the algorithm after a draw error', () => {
            const { ctx } = createMockCtx();
            const algo = new BrokenAlgo(ctx, 100, 100);
            algo.draw();
            expect(algo.isRunning).toBe(false);
        });

        it('skips draw when isRunning is false', () => {
            const { ctx } = createMockCtx();
            const drawSpy = vi.fn();
            class SpyAlgo extends AlgorithmLoader {
                draw() {
                    drawSpy();
                }
            }
            const algo = new SpyAlgo(ctx, 100, 100);
            algo.stop();
            algo.draw();
            expect(drawSpy).not.toHaveBeenCalled();
        });
    });

    describe('static factory methods', () => {
        it('createVector returns an object with x and y', () => {
            const v = AlgorithmLoader.createVector(3, 4);
            expect(v.x).toBe(3);
            expect(v.y).toBe(4);
        });

        it('createParticle returns an object with position and velocity', () => {
            const p = AlgorithmLoader.createParticle(10, 20, 5, 0);
            expect(p.x).toBe(10);
            expect(p.y).toBe(20);
        });

        it('random returns a number within range', () => {
            const n = AlgorithmLoader.random(1, 10);
            expect(n).toBeGreaterThanOrEqual(1);
            expect(n).toBeLessThan(10);
        });

        it('pickRandomElement returns an element from the array', () => {
            const arr = ['a', 'b', 'c'];
            const result = AlgorithmLoader.pickRandomElement(arr);
            expect(arr).toContain(result);
        });
    });

    describe('base draw throws when not overridden', () => {
        it('dispatches algorithm-error because base draw throws', () => {
            const { canvas, ctx } = createMockCtx();
            const algo = new AlgorithmLoader(ctx, 100, 100);

            const handler = vi.fn();
            canvas.addEventListener('algorithm-error', handler);

            algo.draw();

            expect(handler).toHaveBeenCalledTimes(1);
        });
    });
});
