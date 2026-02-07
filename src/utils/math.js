// Math utils
const utils = {
    norm(value, min, max) {
        return (value - min) / (max - min);
    },

    lerp(norm, min, max) {
        return (max - min) * norm + min;
    },

    map(value, sourceMin, sourceMax, destMin, destMax) {
        return this.lerp(
            this.norm(value, sourceMin, sourceMax),
            destMin,
            destMax
        );
    },

    clamp(value, min, max) {
        return Math.min(
            Math.max(value, Math.min(min, max)),
            Math.max(min, max)
        );
    },

    distance(p0, p1) {
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceXY(x0, y0, x1, y1) {
        const dx = x1 - x0;
        const dy = y1 - y0;
        return Math.sqrt(dx * dx + dy * dy);
    },

    circleCollision(c0, c1) {
        return this.distance(c0, c1) <= c0.radius + c1.radius;
    },

    circlePointCollision(x, y, circle) {
        return this.distanceXY(x, y, circle.x, circle.y) < circle.radius;
    },

    pointInRect(x, y, rect) {
        return (
            this.inRange(x, rect.x, rect.x + rect.width) &&
            this.inRange(y, rect.y, rect.y + rect.height)
        );
    },

    inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
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

    degreesToRads(degrees) {
        return (degrees / 180) * Math.PI;
    },

    radsToDegrees(radians) {
        return (radians * 180) / Math.PI;
    },

    randomRange(min, max) {
        return min + Math.random() * (max - min);
    },

    randomInt(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    },

    roundToPlaces(value, places) {
        return Math.round(value * mult) / mult;
    },

    roundNearest(value, nearest) {
        return Math.round(value / nearest) * nearest;
    },

    quadraticBezier(p0, p1, p2, t, pFinal = {}) {
        pFinal.x =
            Math.pow(1 - t, 2) * p0.x + (1 - t) * 2 * t * p1.x + t * t * p2.x;
        pFinal.y =
            Math.pow(1 - t, 2) * p0.y + (1 - t) * 2 * t * p1.y + t * t * p2.y;
        return pFinal;
    },

    cubicBezier(p0, p1, p2, p3, t, pFinal = {}) {
        pFinal.x =
            Math.pow(1 - t, 3) * p0.x +
            Math.pow(1 - t, 2) * 3 * t * p1.x +
            (1 - t) * 3 * t * t * p2.x +
            t * t * t * p3.x;
        pFinal.y =
            Math.pow(1 - t, 3) * p0.y +
            Math.pow(1 - t, 2) * 3 * t * p1.y +
            (1 - t) * 3 * t * t * p2.y +
            t * t * t * p3.y;
        return pFinal;
    },
};

export default utils;
