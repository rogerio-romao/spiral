// Math utils
const utils = {
    circleCollision(c0, c1) {
        return this.distance(c0, c1) <= c0.radius + c1.radius;
    },

    circlePointCollision(x, y, circle) {
        return this.distanceXY(x, y, circle.x, circle.y) < circle.radius;
    },

    clamp(value, min, max) {
        return Math.min(
            Math.max(value, Math.min(min, max)),
            Math.max(min, max),
        );
    },

    // oxlint-disable-next-line max-params
    cubicBezier(p0, p1, p2, p3, timeFraction, pFinal = {}) {
        pFinal.x =
            (1 - timeFraction) ** 3 * p0.x +
            (1 - timeFraction) ** 2 * 3 * timeFraction * p1.x +
            (1 - timeFraction) * 3 * timeFraction * timeFraction * p2.x +
            timeFraction * timeFraction * timeFraction * p3.x;
        pFinal.y =
            (1 - timeFraction) ** 3 * p0.y +
            (1 - timeFraction) ** 2 * 3 * timeFraction * p1.y +
            (1 - timeFraction) * 3 * timeFraction * timeFraction * p2.y +
            timeFraction * timeFraction * timeFraction * p3.y;
        return pFinal;
    },

    degreesToRads(degrees) {
        return (degrees / 180) * Math.PI;
    },

    distance(p0, p1) {
        return this.distanceXY(p0.x, p0.y, p1.x, p1.y);
    },

    distanceXY(x0, y0, x1, y1) {
        const dx = x1 - x0;
        const dy = y1 - y0;
        return Math.sqrt(dx * dx + dy * dy);
    },

    inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    },

    lerp(norm, min, max) {
        return (max - min) * norm + min;
    },

    map(value, sourceMin, sourceMax, destMin, destMax) {
        return this.lerp(
            this.norm(value, sourceMin, sourceMax),
            destMin,
            destMax,
        );
    },

    norm(value, min, max) {
        return (value - min) / (max - min);
    },

    pointInRect(x, y, rect) {
        return (
            this.inRange(x, rect.x, rect.x + rect.width) &&
            this.inRange(y, rect.y, rect.y + rect.height)
        );
    },

    quadraticBezier(p0, p1, p2, timeFraction, pFinal = {}) {
        pFinal.x =
            (1 - timeFraction) ** 2 * p0.x +
            (1 - timeFraction) * 2 * timeFraction * p1.x +
            timeFraction * timeFraction * p2.x;
        pFinal.y =
            (1 - timeFraction) ** 2 * p0.y +
            (1 - timeFraction) * 2 * timeFraction * p1.y +
            timeFraction * timeFraction * p2.y;
        return pFinal;
    },

    radsToDegrees(radians) {
        return (radians * 180) / Math.PI;
    },

    randomInt(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    },

    randomRange(min, max) {
        return min + Math.random() * (max - min);
    },

    rangeIntersect(min0, max0, min1, max1) {
        return (
            Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1)
        );
    },

    rectIntersect(r0, r1) {
        return (
            this.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
            this.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height)
        );
    },

    roundNearest(value, nearest) {
        return Math.round(value / nearest) * nearest;
    },

    roundToPlaces(value, places) {
        return Math.round(value * places) / places;
    },
};

export default utils;
