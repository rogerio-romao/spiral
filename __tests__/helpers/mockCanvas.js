export default function createMockCanvas(width = 1920, height = 1080) {
    const canvas = {
        addEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        height,
        style: {},
        width,
    };

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
