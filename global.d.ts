// global.d.ts (create this file if it doesn't exist)
/**
 * Augment CanvasRenderingContext2D with roundRectExtra for editor intellisense.
 */
interface CanvasRenderingContext2D {
    roundRectExtra: (
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number | object,
        fill?: boolean,
        stroke?: boolean,
    ) => void;
}
