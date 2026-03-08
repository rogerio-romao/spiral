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
    beforeEach(() => {
        const { ctx } = createMockCtx();
        AlgorithmLoader.ctx = ctx;
        AlgorithmLoader.w = 100;
        AlgorithmLoader.h = 200;
    });

    describe('constructor', () => {
        it('initialises state correctly', () => {
            const algo = new WorkingAlgo();

            expect(algo.t).toBe(0);
            expect(algo.isRunning).toBeTruthy();
            expect(algo.animationFrameId).toBeNull();
        });
    });

    describe('stop', () => {
        it('sets isRunning to false', () => {
            const algo = new WorkingAlgo();
            algo.stop();

            expect(algo.isRunning).toBeFalsy();
        });

        it('clears animationFrameId', () => {
            const algo = new WorkingAlgo();
            algo.animationFrameId = 42;
            algo.stop();

            expect(algo.animationFrameId).toBeNull();
        });
    });

    describe('draw error handling', () => {
        it('dispatches algorithm-error on the canvas when draw throws', () => {
            const { canvas, ctx } = createMockCtx();
            AlgorithmLoader.ctx = ctx;
            const algo = new BrokenAlgo();

            const handler = vi.fn();
            canvas.addEventListener('algorithm-error', handler);

            algo.draw();

            expect(handler).toHaveBeenCalledOnce();
        });

        it('stops the algorithm after a draw error', () => {
            const algo = new BrokenAlgo();
            algo.draw();

            expect(algo.isRunning).toBeFalsy();
        });

        it('skips draw when isRunning is false', () => {
            const drawSpy = vi.fn();
            class SpyAlgo extends AlgorithmLoader {
                draw() {
                    drawSpy();
                }
            }
            const algo = new SpyAlgo();
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
            expect(num).toBeLessThan(11);
        });

        it('pickRandomElement returns an element from the array', () => {
            const arr = ['a', 'b', 'c'];
            const result = AlgorithmLoader.pickRandomElement(arr);

            expect(arr).toContain(result);
        });

        it('pickRandomElement returns null for empty array', () => {
            expect(AlgorithmLoader.pickRandomElement([])).toBeNull();
        });

        it('pickRandomElement returns null for non-array input', () => {
            expect(AlgorithmLoader.pickRandomElement(null)).toBeNull();
            expect(AlgorithmLoader.pickRandomElement({})).toBeNull();
            expect(AlgorithmLoader.pickRandomElement('not an array')).toBeNull();
        });
    });

    describe('base draw throws when not overridden', () => {
        it('dispatches algorithm-error because base draw throws', () => {
            const { canvas, ctx } = createMockCtx();
            AlgorithmLoader.ctx = ctx;
            const algo = new AlgorithmLoader();

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

    describe('static properties: GSAP, frequencyAnalyser, waveformController', () => {
        it('gsap is null if not present on globalThis', () => {
            const original = globalThis.gsap;
            expect(AlgorithmLoader.gsap).toBe(original);

            delete globalThis.gsap;

            expect(AlgorithmLoader.gsap).toBeNull();
            globalThis.gsap = original;
        });

        it('frequencyAnalyser and waveformController are null by default', () => {
            expect(AlgorithmLoader.frequencyAnalyser).toBeNull();
            expect(AlgorithmLoader.waveformController).toBeNull();
        });

        it('frequencyAnalyser and waveformController can be set and used', () => {
            const fakeFreq = { getBands: () => [1, 2, 3] };
            const fakeWave = { getWave: () => [0.1, 0.2] };
            AlgorithmLoader.frequencyAnalyser = fakeFreq;
            AlgorithmLoader.waveformController = fakeWave;
            expect(AlgorithmLoader.frequencyAnalyser.getBands()).toStrictEqual([1, 2, 3]);
            expect(AlgorithmLoader.waveformController.getWave()).toStrictEqual([0.1, 0.2]);
            // Reset
            AlgorithmLoader.frequencyAnalyser = null;
            AlgorithmLoader.waveformController = null;
        });
    });

    describe('canvas instance methods', () => {
        it('requestFrame schedules draw via requestAnimationFrame', () => {
            const algo = new WorkingAlgo();
            const spy = vi.spyOn(globalThis, 'requestAnimationFrame');
            algo.requestFrame();

            expect(spy).toHaveBeenCalledWith(algo.draw);
        });

        it('clearScreen saves, resets transform, clears the full canvas, then restores', () => {
            const { canvas, ctx } = createMockCtx();
            canvas.width = 100;
            canvas.height = 100;
            AlgorithmLoader.ctx = ctx;
            const algo = new WorkingAlgo();
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
            AlgorithmLoader.ctx = ctx;
            const algo = new WorkingAlgo();
            algo.fillScreen();

            expect(ctx.save).toHaveBeenCalledOnce();
            expect(ctx.resetTransform).toHaveBeenCalledOnce();
            expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 100, 100);
            expect(ctx.restore).toHaveBeenCalledOnce();
        });

        it('rotateCanvasRadians translates to center, rotates, then translates back', () => {
            const { ctx } = createMockCtx();
            AlgorithmLoader.ctx = ctx;
            AlgorithmLoader.w = 100;
            AlgorithmLoader.h = 100;
            const algo = new WorkingAlgo();
            algo.rotateCanvasRadians(Math.PI);

            expect(ctx.translate).toHaveBeenNthCalledWith(1, 50, 50);
            expect(ctx.rotate).toHaveBeenCalledWith(Math.PI);
            expect(ctx.translate).toHaveBeenNthCalledWith(2, -50, -50);
        });

        it('rotateCanvasDegrees converts degrees to radians before rotating', () => {
            const { ctx } = createMockCtx();
            AlgorithmLoader.ctx = ctx;
            AlgorithmLoader.w = 100;
            AlgorithmLoader.h = 100;
            const algo = new WorkingAlgo();
            algo.rotateCanvasDegrees(90);

            expect(ctx.rotate).toHaveBeenCalledWith(Math.PI / 2);
        });
    });
});
