/**
 * roundRectExtra polyfill for CanvasRenderingContext2D.
 * This was taken from somewhere on the internet, but I can't find the source anymore. If you know where this came from, please let me know so I can give proper credit. It was before canvas had native support for rounded rectangles, but it adds extra features like different radii for each corner and the option to only stroke or fill. @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect for the native method, which is now widely supported and should be preferred if you don't need the extra features.
 * Import this module for its side effect — it patches the prototype
 * so roundRectExtra is available on every canvas context.
 * @param {number} x - The x-coordinate of the rectangle.
 * @param {number} y - The y-coordinate of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 * @param {number|object} radius - The radius or corner radii object.
 * @param {boolean} fill - Whether to fill the rectangle.
 * @param {boolean} [stroke] - Whether to stroke the rectangle.
 */

// @ts-ignore complains that roundRectExtra is not defined on CanvasRenderingContext2D, but that's the whole point of this polyfill
// oxlint-disable-next-line max-params
CanvasRenderingContext2D.prototype.roundRectExtra = function roundRectExtra(
    x,
    y,
    width,
    height,
    radius,
    fill,
    stroke = true,
) {
    const cornerRadius = {
        lowerLeft: 0,
        lowerRight: 0,
        upperLeft: 0,
        upperRight: 0,
    };

    if (typeof radius === 'object') {
        for (const side in radius) {
            if (Object.hasOwn(radius, side)) {
                cornerRadius[side] = radius[side];
            }
        }
    }

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
};
