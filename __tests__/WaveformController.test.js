// @vitest-environment jsdom

import WaveformController from '../src/WaveformController.js';

function createMockCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = {
        beginPath: vi.fn(),
        clearRect: vi.fn(),
        lineTo: vi.fn(),
        moveTo: vi.fn(),
        resetTransform: vi.fn(),
        scale: vi.fn(),
        stroke: vi.fn(),
    };
    vi.spyOn(canvas, 'getContext').mockReturnValue(ctx);
    return { canvas, ctx };
}

function createMockAnalyser(data) {
    return { getWaveform: vi.fn(() => [...data]) };
}

describe('waveformController', () => {
    beforeEach(() => {
        globalThis.devicePixelRatio = 1;
        globalThis.innerWidth = 180;
        globalThis.innerHeight = 500;
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('initialises state correctly', () => {
            const { canvas } = createMockCanvas();
            const wc = new WaveformController({ canvasElement: canvas, frequencyAnalyser: null });
            expect(wc.showWaveform).toBeFalsy();
            expect(wc.smoothing).toBe(0.6);
            expect(wc.waveformData).toBeNull();
            expect(wc.animationRafId).toBeNull();
        });

        it('calls resizeCanvas when canvas is provided', () => {
            const { canvas } = createMockCanvas();
            const wc = new WaveformController({ canvasElement: canvas, frequencyAnalyser: null });
            // dpr=1, w=180-80=100, h=min(400,500)=400
            expect(canvas.width).toBe(100);
            expect(canvas.height).toBe(400);
            expect(wc.showWaveform).toBeFalsy();
        });

        it('handles null canvas without throwing', () => {
            expect(
                () => new WaveformController({ canvasElement: null, frequencyAnalyser: null }),
            ).not.toThrow();
        });
    });

    describe('resizeCanvas', () => {
        it('sets canvas pixel dimensions using devicePixelRatio', () => {
            globalThis.devicePixelRatio = 2;
            // w = 130-80 = 50, dpr=2 → canvas.width = 100
            globalThis.innerWidth = 130;
            const { canvas } = createMockCanvas();
            const wc = new WaveformController({ canvasElement: canvas, frequencyAnalyser: null });
            expect(canvas.width).toBe(100);
            expect(canvas.style.width).toBe('50px');
            expect(wc.showWaveform).toBeFalsy();
        });

        it('calls ctx.resetTransform and ctx.scale with dpr', () => {
            globalThis.devicePixelRatio = 2;
            const { canvas, ctx } = createMockCanvas();
            const wc = new WaveformController({ canvasElement: canvas, frequencyAnalyser: null });
            expect(ctx.resetTransform).toHaveBeenCalledOnce();
            expect(ctx.scale).toHaveBeenCalledWith(2, 2);
            expect(wc.showWaveform).toBeFalsy();
        });

        it('no-ops when canvas is null', () => {
            const wc = new WaveformController({ canvasElement: null, frequencyAnalyser: null });
            expect(() => wc.resizeCanvas()).not.toThrow();
        });
    });

    describe('toggleWaveform', () => {
        it('first call sets showWaveform to true and returns true', () => {
            vi.useFakeTimers();
            const { canvas } = createMockCanvas();
            const wc = new WaveformController({
                canvasElement: canvas,
                frequencyAnalyser: createMockAnalyser([0.5, 0.5, 0.5]),
            });
            expect(wc.toggleWaveform()).toBeTruthy();
            expect(wc.showWaveform).toBeTruthy();
        });

        it('first call starts animation loop via requestAnimationFrame', () => {
            vi.useFakeTimers();
            const { canvas } = createMockCanvas();
            const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame');
            const wc = new WaveformController({
                canvasElement: canvas,
                frequencyAnalyser: createMockAnalyser([0.5, 0.5, 0.5]),
            });
            wc.toggleWaveform();
            expect(rafSpy).toHaveBeenCalledOnce();
        });

        it('second call sets showWaveform to false and returns false', () => {
            vi.useFakeTimers();
            const { canvas } = createMockCanvas();
            const wc = new WaveformController({
                canvasElement: canvas,
                frequencyAnalyser: createMockAnalyser([0.5, 0.5, 0.5]),
            });
            wc.toggleWaveform();
            expect(wc.toggleWaveform()).toBeFalsy();
            expect(wc.showWaveform).toBeFalsy();
        });

        it('second call triggers stop and clears the canvas', () => {
            vi.useFakeTimers();
            const { canvas, ctx } = createMockCanvas();
            const wc = new WaveformController({
                canvasElement: canvas,
                frequencyAnalyser: createMockAnalyser([0.5, 0.5, 0.5]),
            });
            wc.toggleWaveform();
            ctx.clearRect.mockClear();
            const cafSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');
            wc.toggleWaveform();
            expect(cafSpy).toHaveBeenCalledOnce();
            expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 100, 400);
        });
    });

    describe('start', () => {
        it('calls requestAnimationFrame', () => {
            vi.useFakeTimers();
            const { canvas } = createMockCanvas();
            const wc = new WaveformController({
                canvasElement: canvas,
                frequencyAnalyser: createMockAnalyser([0.5, 0.5, 0.5]),
            });
            wc.showWaveform = true;
            const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame');
            wc.start();
            expect(rafSpy).toHaveBeenCalledOnce();
        });

        it('no-ops if animationRafId is already set (prevents double-start)', () => {
            const { canvas } = createMockCanvas();
            const wc = new WaveformController({
                canvasElement: canvas,
                frequencyAnalyser: createMockAnalyser([0.5, 0.5, 0.5]),
            });
            wc.animationRafId = 999;
            const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame');
            wc.start();
            expect(rafSpy).not.toHaveBeenCalled();
        });
    });

    describe('stop and destroy', () => {
        it('stop cancels animation frame and clears canvas', () => {
            vi.useFakeTimers();
            const { canvas, ctx } = createMockCanvas();
            const wc = new WaveformController({
                canvasElement: canvas,
                frequencyAnalyser: createMockAnalyser([0.5, 0.5, 0.5]),
            });
            wc.showWaveform = true;
            wc.start();
            ctx.clearRect.mockClear();
            const cafSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');
            wc.destroy();
            expect(wc.animationRafId).toBeNull();
            expect(cafSpy).toHaveBeenCalledOnce();
            expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 100, 400);
        });

        it('destroy delegates to stop', () => {
            vi.useFakeTimers();
            const { canvas, ctx } = createMockCanvas();
            const wc = new WaveformController({
                canvasElement: canvas,
                frequencyAnalyser: createMockAnalyser([0.5, 0.5, 0.5]),
            });
            wc.showWaveform = true;
            wc.start();
            ctx.clearRect.mockClear();
            wc.destroy();
            expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 100, 400);
            expect(wc.animationRafId).toBeNull();
        });
    });

    describe('draw', () => {
        it('first draw initialises waveformData and calls canvas path methods', () => {
            const { canvas, ctx } = createMockCanvas();
            const wc = new WaveformController({
                canvasElement: canvas,
                frequencyAnalyser: createMockAnalyser([0.5, 0.5, 0.5]),
            });
            wc.showWaveform = true;
            wc.draw();
            expect(wc.waveformData).not.toBeNull();
            expect(ctx.beginPath).toHaveBeenCalledOnce();
            expect(ctx.moveTo).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
            expect(ctx.lineTo).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
            expect(ctx.stroke).toHaveBeenCalledOnce();
        });

        it('second draw applies exponential smoothing: prev * 0.6 + new * 0.4', () => {
            const { canvas } = createMockCanvas();
            const analyser = createMockAnalyser([0.5, 0.5, 0.5]);
            const wc = new WaveformController({
                canvasElement: canvas,
                frequencyAnalyser: analyser,
            });
            wc.showWaveform = true;
            // initialise waveformData with [0.5, 0.5, 0.5]
            wc.draw();
            analyser.getWaveform.mockReturnValue([1, 1, 1]);
            // smooth: 0.5 * 0.6 + 1 * 0.4
            wc.draw();
            const expected = 0.5 * 0.6 + 1 * 0.4;
            expect(wc.waveformData).toStrictEqual([expected, expected, expected]);
        });
    });

    describe('getWaveformData', () => {
        it('delegates to frequencyAnalyser.getWaveform and returns the result', () => {
            const { canvas } = createMockCanvas();
            const data = [0.1, 0.2, 0.3];
            const analyser = { getWaveform: vi.fn(() => data) };
            const wc = new WaveformController({
                canvasElement: canvas,
                frequencyAnalyser: analyser,
            });
            expect(wc.getWaveformData()).toBe(data);
            expect(analyser.getWaveform).toHaveBeenCalledOnce();
        });
    });
});
