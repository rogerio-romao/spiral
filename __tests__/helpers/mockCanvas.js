/**
 *
 * @param {number} [width] - the canvas width, defaults to 1920
 * @param {number} [height] - the canvas height, defaults to 1080
 * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}} - an object containing the mocked canvas and its 2D rendering context
 */
export default function createMockCanvas(width = 1920, height = 1080) {
    // create a mock canvas element with the specified width and height, and a mocked 2D rendering context
    const canvas = {
        addEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        getContext: vi.fn(() => ctx),
        height,
        style: {},
        width,
    };

    // create a mocked 2D rendering context with all necessary properties and methods for testing
    const ctx = {
        beginPath: vi.fn(),
        canvas,
        clearRect: vi.fn(),
        direction: 'inherit',
        fillRect: vi.fn(),
        fillStyle: '#000',
        filter: 'none',
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
        lineCap: 'butt',
        lineDashOffset: 0,
        lineJoin: 'miter',
        lineWidth: 1,
        miterLimit: 10,
        resetTransform: vi.fn(),
        restore: vi.fn(),
        rotate: vi.fn(),
        save: vi.fn(),
        scale: vi.fn(),
        setLineDash: vi.fn(),
        shadowBlur: 0,
        shadowColor: 'transparent',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        strokeStyle: '#000',
        textAlign: 'start',
        textBaseline: 'alphabetic',
        translate: vi.fn(),
    };

    return { canvas, ctx };
}
