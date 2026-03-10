// oxlint-disable max-lines-per-function
import utils from '../../src/utils/math.js';

describe('math utils', () => {
    describe('clamp', () => {
        it('returns value when in range', () => {
            expect(utils.clamp(5, 0, 10)).toBe(5);
        });

        it('clamps value below min', () => {
            expect(utils.clamp(-5, 0, 10)).toBe(0);
        });

        it('clamps value above max', () => {
            expect(utils.clamp(15, 0, 10)).toBe(10);
        });

        it('handles inverted min/max', () => {
            expect(utils.clamp(5, 10, 0)).toBe(5);
            expect(utils.clamp(-1, 10, 0)).toBe(0);
            expect(utils.clamp(11, 10, 0)).toBe(10);
        });
    });

    describe('lerp', () => {
        it('returns min at norm 0', () => {
            expect(utils.lerp(0, 10, 20)).toBe(10);
        });

        it('returns max at norm 1', () => {
            expect(utils.lerp(1, 10, 20)).toBe(20);
        });

        it('returns midpoint at norm 0.5', () => {
            expect(utils.lerp(0.5, 10, 20)).toBe(15);
        });
    });

    describe('norm', () => {
        it('returns 0 at min', () => {
            expect(utils.norm(10, 10, 20)).toBe(0);
        });

        it('returns 1 at max', () => {
            expect(utils.norm(20, 10, 20)).toBe(1);
        });

        it('returns 0.5 at midpoint', () => {
            expect(utils.norm(15, 10, 20)).toBe(0.5);
        });
    });

    describe('map', () => {
        it('maps value between ranges', () => {
            expect(utils.map(5, 0, 10, 0, 100)).toBe(50);
        });

        it('maps min to destMin', () => {
            expect(utils.map(0, 0, 10, 0, 100)).toBe(0);
        });

        it('maps max to destMax', () => {
            expect(utils.map(10, 0, 10, 0, 100)).toBe(100);
        });
    });

    describe('degreesToRads', () => {
        it('converts 180 degrees to PI', () => {
            expect(utils.degreesToRads(180)).toBeCloseTo(Math.PI);
        });

        it('converts 360 degrees to 2*PI', () => {
            expect(utils.degreesToRads(360)).toBeCloseTo(2 * Math.PI);
        });

        it('converts 0 degrees to 0', () => {
            expect(utils.degreesToRads(0)).toBe(0);
        });
    });

    describe('radsToDegrees', () => {
        it('converts PI to 180 degrees', () => {
            expect(utils.radsToDegrees(Math.PI)).toBeCloseTo(180);
        });

        it('converts 2*PI to 360 degrees', () => {
            expect(utils.radsToDegrees(2 * Math.PI)).toBeCloseTo(360);
        });

        it('round-trips with degreesToRads', () => {
            expect(utils.radsToDegrees(utils.degreesToRads(45))).toBeCloseTo(45);
        });
    });

    describe('distance', () => {
        it('computes Euclidean distance', () => {
            expect(utils.distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
        });

        it('returns 0 for same point', () => {
            expect(utils.distance({ x: 2, y: 3 }, { x: 2, y: 3 })).toBe(0);
        });
    });

    describe('distanceXY', () => {
        it('computes Euclidean distance from coordinates', () => {
            expect(utils.distanceXY(0, 0, 3, 4)).toBe(5);
        });

        it('matches distance()', () => {
            expect(utils.distanceXY(1, 2, 4, 6)).toBeCloseTo(
                utils.distance({ x: 1, y: 2 }, { x: 4, y: 6 }),
            );
        });
    });

    describe('circleCollision', () => {
        it('returns true when circles overlap', () => {
            const c0 = { radius: 5, x: 0, y: 0 };
            const c1 = { radius: 2, x: 3, y: 4 };

            expect(utils.circleCollision(c0, c1)).toBeTruthy();
        });

        it('returns true when circles touch', () => {
            const c0 = { radius: 3, x: 0, y: 0 };
            const c1 = { radius: 2, x: 5, y: 0 };

            expect(utils.circleCollision(c0, c1)).toBeTruthy();
        });

        it('returns false when circles do not overlap', () => {
            const c0 = { radius: 1, x: 0, y: 0 };
            const c1 = { radius: 1, x: 10, y: 0 };

            expect(utils.circleCollision(c0, c1)).toBeFalsy();
        });
    });

    describe('circlePointCollision', () => {
        it('returns true when point is inside circle', () => {
            const circle = { radius: 10, x: 0, y: 0 };

            expect(utils.circlePointCollision(3, 4, circle)).toBeTruthy();
        });

        it('returns false when point is outside circle', () => {
            const circle = { radius: 4, x: 0, y: 0 };

            expect(utils.circlePointCollision(3, 4, circle)).toBeFalsy();
        });
    });

    describe('pointInRect', () => {
        const rect = { height: 10, width: 10, x: 0, y: 0 };

        it('returns true for point inside rect', () => {
            expect(utils.pointInRect(5, 5, rect)).toBeTruthy();
        });

        it('returns true for point on rect edge', () => {
            expect(utils.pointInRect(0, 0, rect)).toBeTruthy();
            expect(utils.pointInRect(10, 10, rect)).toBeTruthy();
        });

        it('returns false for point outside rect', () => {
            expect(utils.pointInRect(11, 5, rect)).toBeFalsy();
            expect(utils.pointInRect(5, 11, rect)).toBeFalsy();
        });
    });

    describe('inRange', () => {
        it('returns true when value is in range', () => {
            expect(utils.inRange(5, 0, 10)).toBeTruthy();
        });

        it('returns true at boundaries', () => {
            expect(utils.inRange(0, 0, 10)).toBeTruthy();
            expect(utils.inRange(10, 0, 10)).toBeTruthy();
        });

        it('returns false outside range', () => {
            expect(utils.inRange(-1, 0, 10)).toBeFalsy();
            expect(utils.inRange(11, 0, 10)).toBeFalsy();
        });

        it('handles inverted min/max', () => {
            expect(utils.inRange(5, 10, 0)).toBeTruthy();
        });
    });

    describe('rangeIntersect', () => {
        it('returns true when ranges overlap', () => {
            expect(utils.rangeIntersect(0, 10, 5, 15)).toBeTruthy();
        });

        it('returns true when ranges touch at boundary', () => {
            expect(utils.rangeIntersect(0, 5, 5, 10)).toBeTruthy();
        });

        it('returns false when ranges do not overlap', () => {
            expect(utils.rangeIntersect(0, 4, 6, 10)).toBeFalsy();
        });
    });

    describe('rectIntersect', () => {
        it('returns true when rects overlap', () => {
            const r0 = { height: 10, width: 10, x: 0, y: 0 };
            const r1 = { height: 10, width: 10, x: 5, y: 5 };

            expect(utils.rectIntersect(r0, r1)).toBeTruthy();
        });

        it('returns false when rects do not overlap', () => {
            const r0 = { height: 5, width: 5, x: 0, y: 0 };
            const r1 = { height: 5, width: 5, x: 10, y: 10 };

            expect(utils.rectIntersect(r0, r1)).toBeFalsy();
        });
    });

    describe('quadraticBezier', () => {
        const p0 = { x: 0, y: 0 };
        const p1 = { x: 5, y: 10 };
        const p2 = { x: 10, y: 0 };

        it('returns p0 at t=0', () => {
            const result = utils.quadraticBezier(p0, p1, p2, 0);

            expect(result.x).toBeCloseTo(p0.x);
            expect(result.y).toBeCloseTo(p0.y);
        });

        it('returns p2 at t=1', () => {
            const result = utils.quadraticBezier(p0, p1, p2, 1);

            expect(result.x).toBeCloseTo(p2.x);
            expect(result.y).toBeCloseTo(p2.y);
        });
    });

    describe('cubicBezier', () => {
        const p0 = { x: 0, y: 0 };
        const p1 = { x: 3, y: 9 };
        const p2 = { x: 7, y: 9 };
        const p3 = { x: 10, y: 0 };

        it('returns p0 at t=0', () => {
            const result = utils.cubicBezier(p0, p1, p2, p3, 0);

            expect(result.x).toBeCloseTo(p0.x);
            expect(result.y).toBeCloseTo(p0.y);
        });

        it('returns p3 at t=1', () => {
            const result = utils.cubicBezier(p0, p1, p2, p3, 1);

            expect(result.x).toBeCloseTo(p3.x);
            expect(result.y).toBeCloseTo(p3.y);
        });
    });

    describe('roundNearest', () => {
        it('rounds to nearest multiple', () => {
            expect(utils.roundNearest(13, 5)).toBe(15);
            expect(utils.roundNearest(12, 5)).toBe(10);
        });

        it('returns the value unchanged when already on a multiple', () => {
            expect(utils.roundNearest(10, 5)).toBe(10);
        });
    });

    describe('roundToPlaces', () => {
        it('rounds to 2 decimal places (multiplier 100)', () => {
            expect(utils.roundToPlaces(Math.PI, 100)).toBeCloseTo(3.14);
        });

        it('rounds to 1 decimal place (multiplier 10)', () => {
            expect(utils.roundToPlaces(3.14, 10)).toBeCloseTo(3.1);
        });
    });

    describe('randomInt', () => {
        it('returns integers within [min, max] inclusive', () => {
            const results = Array.from({ length: 200 }, () => utils.randomInt(3, 7));

            for (const r of results) {
                expect(r).toBeGreaterThanOrEqual(3);
                expect(r).toBeLessThanOrEqual(7);
                expect(Number.isInteger(r)).toBeTruthy();
            }
        });
    });

    describe('randomRange', () => {
        it('returns floats within [min, max)', () => {
            const results = Array.from({ length: 200 }, () => utils.randomRange(1, 5));

            for (const r of results) {
                expect(r).toBeGreaterThanOrEqual(1);
                expect(r).toBeLessThan(5);
            }
        });
    });
});
