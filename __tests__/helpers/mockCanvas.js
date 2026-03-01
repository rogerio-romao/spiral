import { vi } from 'vitest';

export function createMockCanvas(width = 1920, height = 1080) {
    const canvas = {
        width,
        height,
        style: {},
        dispatchEvent: vi.fn(),
        addEventListener: vi.fn(),
    };

    const ctx = {
        canvas,
        resetTransform: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        scale: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        beginPath: vi.fn(),
        setLineDash: vi.fn(),
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        strokeStyle: '#000',
        fillStyle: '#000',
        lineWidth: 1,
        lineDashOffset: 0,
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10,
        shadowBlur: 0,
        shadowColor: 'transparent',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        textAlign: 'start',
        textBaseline: 'alphabetic',
        direction: 'inherit',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
        filter: 'none',
    };

    return { canvas, ctx };
}
