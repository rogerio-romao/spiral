import Vector from '../../src/utils/Vector.js';

describe('vector', () => {
    describe('constructor', () => {
        it('stores x and y', () => {
            const vector = new Vector(3, 4);
            expect(vector.x).toBe(3);
            expect(vector.y).toBe(4);
        });
    });

    describe('immutable operations', () => {
        it('add returns a new Vector with summed components', () => {
            const a = new Vector(1, 2);
            const b = new Vector(3, 4);
            const result = a.add(b);
            expect(result.x).toBe(4);
            expect(result.y).toBe(6);
            expect(result).not.toBe(a);
        });

        it('add does not mutate operands', () => {
            const a = new Vector(1, 2);
            const b = new Vector(3, 4);
            a.add(b);
            expect(a.x).toBe(1);
            expect(a.y).toBe(2);
        });

        it('subtract returns a new Vector with difference', () => {
            const a = new Vector(5, 7);
            const b = new Vector(2, 3);
            const result = a.subtract(b);
            expect(result.x).toBe(3);
            expect(result.y).toBe(4);
            expect(result).not.toBe(a);
        });

        it('multiply returns a new Vector scaled by value', () => {
            const vector = new Vector(3, 4);
            const result = vector.multiply(2);
            expect(result.x).toBe(6);
            expect(result.y).toBe(8);
            expect(result).not.toBe(vector);
        });

        it('divide returns a new Vector divided by value', () => {
            const vector = new Vector(6, 8);
            const result = vector.divide(2);
            expect(result.x).toBe(3);
            expect(result.y).toBe(4);
            expect(result).not.toBe(vector);
        });
    });

    describe('mutating operations', () => {
        it('addTo modifies the vector in place', () => {
            const a = new Vector(1, 2);
            a.addTo(new Vector(3, 4));
            expect(a.x).toBe(4);
            expect(a.y).toBe(6);
        });

        it('subtractFrom modifies the vector in place', () => {
            const a = new Vector(5, 7);
            a.subtractFrom(new Vector(2, 3));
            expect(a.x).toBe(3);
            expect(a.y).toBe(4);
        });

        it('multiplyBy scales the vector in place', () => {
            const vector = new Vector(3, 4);
            vector.multiplyBy(2);
            expect(vector.x).toBe(6);
            expect(vector.y).toBe(8);
        });

        it('divideBy scales the vector in place', () => {
            const vector = new Vector(6, 8);
            vector.divideBy(2);
            expect(vector.x).toBe(3);
            expect(vector.y).toBe(4);
        });
    });

    describe('length', () => {
        it('computes magnitude', () => {
            expect(new Vector(3, 4)).toHaveLength(5);
        });

        it('returns 0 for zero vector', () => {
            expect(new Vector(0, 0)).toHaveLength(0);
        });

        it('setting length scales components while preserving direction', () => {
            const vector = new Vector(3, 4);
            const angleBefore = vector.angle;
            vector.length = 10;
            expect(vector.length).toBeCloseTo(10);
            expect(vector.angle).toBeCloseTo(angleBefore);
        });
    });

    describe('angle', () => {
        it('returns 0 for a vector pointing right', () => {
            expect(new Vector(1, 0).angle).toBeCloseTo(0);
        });

        it('returns PI/2 for a vector pointing down', () => {
            expect(new Vector(0, 1).angle).toBeCloseTo(Math.PI / 2);
        });

        it('setting angle changes direction while preserving length', () => {
            const vector = new Vector(3, 4);
            const lengthBefore = vector.length;
            vector.angle = Math.PI / 2;
            expect(vector.length).toBeCloseTo(lengthBefore);
            expect(vector.angle).toBeCloseTo(Math.PI / 2);
        });
    });
});
