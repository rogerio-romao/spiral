// oxlint-disable jsdoc/require-returns
// oxlint-disable jsdoc/require-param
// note: the above is due to a bug in the linter where it doesn't recognize the JSDoc comments for `randomRange`, even though they are correct. Reported at https://github.com/oxc-project/oxc/issues/20037

/** @typedef {Object} Point
 *  @property {number} x - The x coordinate.
 *  @property {number} y - The y coordinate.
 */

/** @typedef {Object} Rect
 *  @property {number} x - The x coordinate of the top-left corner.
 *  @property {number} y - The y coordinate of the top-left corner.
 *  @property {number} width - The width of the rectangle.
 *  @property {number} height - The height of the rectangle.
 */

/** @typedef {Object} Circle
 *  @property {number} x - The x coordinate.
 *  @property {number} y - The y coordinate.
 *  @property {number} radius - The radius of the circle.
 */

/**
 * A collection of mathematical utility functions for common operations such as collision detection, interpolation, and range checking.
 *
 * @namespace utils
 * @example
 * // Check for collision between two circles
 * const circle1 = { x: 0, y: 0, radius: 10 };
 */
const utils = {
    /**
     * Check if two circles collide.
     * @param {Circle} c0 - First circle.
     * @param {Circle} c1 - Second circle.
     * @returns {boolean} True if circles collide, false otherwise.
     */
    circleCollision(c0, c1) {
        return this.distance(c0, c1) <= c0.radius + c1.radius;
    },

    /**
     * Check if a point is inside a circle.
     * @param {number} x - X coordinate of the point.
     * @param {number} y - Y coordinate of the point.
     * @param {Circle} circle - Circle with properties x, y, and radius.
     * @returns {boolean} True if the point is inside the circle, false otherwise.
     */
    circlePointCollision(x, y, circle) {
        return this.distanceXY(x, y, circle.x, circle.y) < circle.radius;
    },

    /**
     * Clamp a value between min and max.
     * @param {number} value - The value to clamp.
     * @param {number} min - The minimum value.
     * @param {number} max - The maximum value.
     * @returns {number} The clamped value.
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
    },

    /**
     * Cubic Bezier interpolation.
     * @param {Point} p0 - First control point with properties x and y.
     * @param {Point} p1 - Second control point with properties x and y.
     * @param {Point} p2 - Third control point with properties x and y.
     * @param {Point} p3 - Fourth control point with properties x and y.
     * @param {number} interpolationFactor - Fraction of time elapsed (0–1).
     * @returns {Point} The interpolated point with properties x and y.
     */
    // oxlint-disable-next-line max-params
    cubicBezier(p0, p1, p2, p3, interpolationFactor) {
        const pFinal = {
            x:
                (1 - interpolationFactor) ** 3 * p0.x +
                (1 - interpolationFactor) ** 2 * 3 * interpolationFactor * p1.x +
                (1 - interpolationFactor) * 3 * interpolationFactor * interpolationFactor * p2.x +
                interpolationFactor * interpolationFactor * interpolationFactor * p3.x,
            y:
                (1 - interpolationFactor) ** 3 * p0.y +
                (1 - interpolationFactor) ** 2 * 3 * interpolationFactor * p1.y +
                (1 - interpolationFactor) * 3 * interpolationFactor * interpolationFactor * p2.y +
                interpolationFactor * interpolationFactor * interpolationFactor * p3.y,
        };
        return pFinal;
    },

    /**
     * Convert degrees to radians.
     * @param {number} degrees - Angle in degrees.
     * @returns {number} Angle in radians.
     */
    degreesToRads(degrees) {
        return (degrees / 180) * Math.PI;
    },

    /**
     * Distance between two points.
     * @param {Point} p0 - First point with properties x and y.
     * @param {Point} p1 - Second point with properties x and y.
     * @returns {number} Distance between the two points.
     */
    distance(p0, p1) {
        return this.distanceXY(p0.x, p0.y, p1.x, p1.y);
    },

    /**
     * Distance between (x0, y0) and (x1, y1).
     * @param {number} x0 - X coordinate of the first point.
     * @param {number} y0 - Y coordinate of the first point.
     * @param {number} x1 - X coordinate of the second point.
     * @param {number} y1 - Y coordinate of the second point.
     * @returns {number} Distance between the two points.
     */
    distanceXY(x0, y0, x1, y1) {
        const dx = x1 - x0;
        const dy = y1 - y0;
        return Math.hypot(dx, dy);
    },

    /**
     * Check if value is in [min, max].
     * @param {number} value - The value to check.
     * @param {number} min - The minimum value.
     * @param {number} max - The maximum value.
     * @returns {boolean} True if the value is in the range, false otherwise.
     */
    inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    },

    /**
     * Linear interpolation.
     * @param {number} norm - Normalized value (0–1).
     * @param {number} min - Minimum value.
     * @param {number} max - Maximum value.
     * @returns {number} Interpolated value.
     */
    lerp(norm, min, max) {
        return (max - min) * norm + min;
    },

    /**
     * Map value from one range to another.
     * @param {number} value - The value to map.
     * @param {number} sourceMin - The minimum value of the source range.
     * @param {number} sourceMax - The maximum value of the source range.
     * @param {number} destMin - The minimum value of the destination range.
     * @param {number} destMax - The maximum value of the destination range.
     * @returns {number} The mapped value.
     */
    map(value, sourceMin, sourceMax, destMin, destMax) {
        return this.lerp(this.norm(value, sourceMin, sourceMax), destMin, destMax);
    },

    /**
     * Normalize value to [0, 1] in [min, max].
     * @param {number} value - The value to normalize.
     * @param {number} min - The minimum value of the range.
     * @param {number} max - The maximum value of the range.
     * @returns {number} Normalized value in [0, 1].
     */
    norm(value, min, max) {
        return (value - min) / (max - min);
    },

    /**
     * Check if point is inside rect.
     * @param {number} x - X coordinate of the point.
     * @param {number} y - Y coordinate of the point.
     * @param {Rect} rect - Rectangle with properties x, y, width, and height.
     * @returns {boolean} True if the point is inside the rectangle, false otherwise.
     */
    pointInRect(x, y, rect) {
        return (
            this.inRange(x, rect.x, rect.x + rect.width) &&
            this.inRange(y, rect.y, rect.y + rect.height)
        );
    },

    /**
     * Quadratic Bezier interpolation.
     * @param {Point} p0 - First control point with properties x and y.
     * @param {Point} p1 - Second control point with properties x and y.
     * @param {Point} p2 - Third control point with properties x and y.
     * @param {number} interpolationFactor - The interpolation factor (0–1).
     * @returns {Point} The interpolated point with properties x and y.
     */
    quadraticBezier(p0, p1, p2, interpolationFactor) {
        const pFinal = {
            x:
                (1 - interpolationFactor) ** 2 * p0.x +
                (1 - interpolationFactor) * 2 * interpolationFactor * p1.x +
                interpolationFactor * interpolationFactor * p2.x,
            y:
                (1 - interpolationFactor) ** 2 * p0.y +
                (1 - interpolationFactor) * 2 * interpolationFactor * p1.y +
                interpolationFactor * interpolationFactor * p2.y,
        };

        return pFinal;
    },

    /**
     * Convert radians to degrees.
     * @param {number} radians - Angle in radians.
     * @returns {number} Angle in degrees.
     */
    radsToDegrees(radians) {
        return (radians * 180) / Math.PI;
    },

    /**
     * Random integer in [min, max].
     * @param {number} min - Minimum integer value.
     * @param {number} max - Maximum integer value.
     * @returns {number} Random integer in [min, max].
     */
    randomInt(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    },

    /**
     * Random float in [min, max).
     * @param {number} min - Minimum float value.
     * @param {number} max - Maximum float value.
     * @returns {number} Random float in [min, max).
     */
    randomRange(min, max) {
        return min + Math.random() * (max - min);
    },

    /**
     * Check if two ranges intersect.
     * @param {number} min0 - Minimum value of the first range.
     * @param {number} max0 - Maximum value of the first range.
     * @param {number} min1 - Minimum value of the second range.
     * @param {number} max1 - Maximum value of the second range.
     * @returns {boolean} True if the ranges intersect, false otherwise.
     */
    rangeIntersect(min0, max0, min1, max1) {
        return (
            Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1)
        );
    },

    /**
     * Check if two rectangles intersect.
     * @param {Rect} r0 - First rectangle with properties x, y, width, and height.
     * @param {Rect} r1 - Second rectangle with properties x, y, width, and height.
     * @returns {boolean} True if the rectangles intersect, false otherwise.
     */
    rectIntersect(r0, r1) {
        return (
            this.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
            this.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height)
        );
    },

    /**
     * Round value to nearest multiple.
     * @param {number} value - The value to round.
     * @param {number} nearest - The multiple to round to.
     * @returns {number} The rounded value.
     */
    roundNearest(value, nearest) {
        return Math.round(value / nearest) * nearest;
    },

    /**
     * Round value to given decimal places.
     * @param {number} value - The value to round.
     * @param {number} places - The number of decimal places to round to.
     * @returns {number} The rounded value.
     */
    roundToPlaces(value, places) {
        return Math.round(value * places) / places;
    },
};

export default utils;
