// @vitest-environment jsdom

import AlgorithmLoader from '../src/AlgorithmLoader.js';

function createMockCtx() {
    const canvas = document.createElement('canvas');
    const ctx = {
        beginPath: vi.fn(),
        canvas,
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        resetTransform: vi.fn(),
        restore: vi.fn(),
        rotate: vi.fn(),
        save: vi.fn(),
        translate: vi.fn(),
    };
    return { canvas, ctx };
}

class WorkingAlgo extends AlgorithmLoader {
    draw() {
        // no-op
    }
}

class BrokenAlgo extends AlgorithmLoader {
    draw() {
        throw new Error('intentional draw error');
    }
}

describe('algorithmLoader', () => {
    describe('constructor', () => {
        it('initialises state correctly', () => {
            const { ctx } = createMockCtx();
            const algo = new WorkingAlgo(ctx, 100, 200);
            expect(algo.ctx).toBe(ctx);
            expect(algo.w).toBe(100);
            expect(algo.h).toBe(200);
            expect(algo.t).toBe(0);
            expect(algo.isRunning).toBeTruthy();
            expect(algo.animationFrameId).toBeNull();
        });
    });

    describe('stop', () => {
        it('sets isRunning to false', () => {
            const { ctx } = createMockCtx();
            const algo = new WorkingAlgo(ctx, 100, 100);
            algo.stop();
            expect(algo.isRunning).toBeFalsy();
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

            expect(handler).toHaveBeenCalledOnce();
        });

        it('stops the algorithm after a draw error', () => {
            const { ctx } = createMockCtx();
            const algo = new BrokenAlgo(ctx, 100, 100);
            algo.draw();
            expect(algo.isRunning).toBeFalsy();
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
            const vector = AlgorithmLoader.createVector(3, 4);
            expect(vector.x).toBe(3);
            expect(vector.y).toBe(4);
        });

        it('createParticle returns an object with position and velocity', () => {
            const particle = AlgorithmLoader.createParticle(10, 20, 5, 0);
            expect(particle.x).toBe(10);
            expect(particle.y).toBe(20);
        });

        it('random returns a number within range', () => {
            const num = AlgorithmLoader.random(1, 10);
            expect(num).toBeGreaterThanOrEqual(1);
            expect(num).toBeLessThan(10);
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

            expect(handler).toHaveBeenCalledOnce();
        });
    });

    describe('static color and palette methods', () => {
        it('randomColor returns an rgba string', () => {
            const color = AlgorithmLoader.randomColor();
            expect(color).toMatch(/^rgba\(/u);
        });

        it('generateRGBAPalette returns an array of the requested length', () => {
            const palette = AlgorithmLoader.generateRGBAPalette(3);
            expect(palette).toHaveLength(3);
            for (const color of palette) {
                expect(color).toMatch(/^rgba\(/u);
            }
        });

        it('generateHSLAPalette returns an array of the requested length', () => {
            const palette = AlgorithmLoader.generateHSLAPalette(3, 'hue');
            expect(palette).toHaveLength(3);
        });
    });

    describe('canvas instance methods', () => {
        it('requestFrame schedules draw via requestAnimationFrame', () => {
            const { ctx } = createMockCtx();
            const algo = new WorkingAlgo(ctx, 100, 100);
            const spy = vi.spyOn(globalThis, 'requestAnimationFrame');
            algo.requestFrame();
            expect(spy).toHaveBeenCalledWith(algo.draw);
        });

        it('clearScreen saves, resets transform, clears the full canvas, then restores', () => {
            const { canvas, ctx } = createMockCtx();
            canvas.width = 100;
            canvas.height = 100;
            const algo = new WorkingAlgo(ctx, 100, 100);
            algo.clearScreen();
            expect(ctx.save).toHaveBeenCalledOnce();
            expect(ctx.resetTransform).toHaveBeenCalledOnce();
            expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 100, 100);
            expect(ctx.restore).toHaveBeenCalledOnce();
        });

        it('fillScreen saves, resets transform, fills the full canvas, then restores', () => {
            const { canvas, ctx } = createMockCtx();
            canvas.width = 100;
            canvas.height = 100;
            const algo = new WorkingAlgo(ctx, 100, 100);
            algo.fillScreen();
            expect(ctx.save).toHaveBeenCalledOnce();
            expect(ctx.resetTransform).toHaveBeenCalledOnce();
            expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 100, 100);
            expect(ctx.restore).toHaveBeenCalledOnce();
        });

        it('rotateCanvasRadians translates to center, rotates, then translates back', () => {
            const { ctx } = createMockCtx();
            const algo = new WorkingAlgo(ctx, 100, 100);
            algo.rotateCanvasRadians(Math.PI);
            expect(ctx.translate).toHaveBeenNthCalledWith(1, 50, 50);
            expect(ctx.rotate).toHaveBeenCalledWith(Math.PI);
            expect(ctx.translate).toHaveBeenNthCalledWith(2, -50, -50);
        });

        it('rotateCanvasDegrees converts degrees to radians before rotating', () => {
            const { ctx } = createMockCtx();
            const algo = new WorkingAlgo(ctx, 100, 100);
            algo.rotateCanvasDegrees(90);
            expect(ctx.rotate).toHaveBeenCalledWith(Math.PI / 2);
        });
    });
});
