import Particle from '../../src/utils/Particle.js';

describe('Particle', () => {
    describe('constructor', () => {
        it('sets position', () => {
            const p = new Particle(10, 20, 0, 0);
            expect(p.x).toBe(10);
            expect(p.y).toBe(20);
        });

        it('sets velocity from speed and direction', () => {
            const p = new Particle(0, 0, 5, 0);
            expect(p.vx).toBeCloseTo(5);
            expect(p.vy).toBeCloseTo(0);
        });

        it('sets defaults', () => {
            const p = new Particle(0, 0, 0, 0);
            expect(p.gravity).toBe(0);
            expect(p.bounce).toBe(-1);
            expect(p.friction).toBe(1);
            expect(p.mass).toBe(1);
            expect(p.springs).toEqual([]);
            expect(p.gravitations).toEqual([]);
        });

        it('accepts optional gravity', () => {
            const p = new Particle(0, 0, 0, 0, 0.5);
            expect(p.gravity).toBe(0.5);
        });
    });

    describe('accelerate', () => {
        it('adds to velocity components', () => {
            const p = new Particle(0, 0, 0, 0);
            p.accelerate(2, 3);
            expect(p.vx).toBeCloseTo(2);
            expect(p.vy).toBeCloseTo(3);
        });
    });

    describe('distanceTo', () => {
        it('computes Euclidean distance', () => {
            const p1 = new Particle(0, 0, 0, 0);
            const p2 = new Particle(3, 4, 0, 0);
            expect(p1.distanceTo(p2)).toBe(5);
        });

        it('returns 0 for same position', () => {
            const p = new Particle(5, 5, 0, 0);
            expect(p.distanceTo(p)).toBe(0);
        });
    });

    describe('angleTo', () => {
        it('returns 0 for a point directly to the right', () => {
            const p1 = new Particle(0, 0, 0, 0);
            const p2 = new Particle(5, 0, 0, 0);
            expect(p1.angleTo(p2)).toBeCloseTo(0);
        });

        it('returns PI/2 for a point directly below', () => {
            const p1 = new Particle(0, 0, 0, 0);
            const p2 = new Particle(0, 5, 0, 0);
            expect(p1.angleTo(p2)).toBeCloseTo(Math.PI / 2);
        });
    });

    describe('getSpeed and setSpeed', () => {
        it('getSpeed returns magnitude of velocity', () => {
            const p = new Particle(0, 0, 5, 0);
            expect(p.getSpeed()).toBeCloseTo(5);
        });

        it('setSpeed changes speed without changing direction', () => {
            const p = new Particle(0, 0, 5, 0);
            const headingBefore = p.getHeading();
            p.setSpeed(10);
            expect(p.getSpeed()).toBeCloseTo(10);
            expect(p.getHeading()).toBeCloseTo(headingBefore);
        });
    });

    describe('getHeading and setHeading', () => {
        it('getHeading returns direction of velocity', () => {
            const p = new Particle(0, 0, 5, 0);
            expect(p.getHeading()).toBeCloseTo(0);
        });

        it('setHeading changes direction without changing speed', () => {
            const p = new Particle(0, 0, 5, 0);
            const speedBefore = p.getSpeed();
            p.setHeading(Math.PI / 2);
            expect(p.getSpeed()).toBeCloseTo(speedBefore);
            expect(p.getHeading()).toBeCloseTo(Math.PI / 2);
        });
    });

    describe('update', () => {
        it('applies gravity to vy and moves position', () => {
            const p = new Particle(0, 0, 0, 0, 1);
            p.update();
            expect(p.vy).toBeCloseTo(1);
            expect(p.y).toBeCloseTo(1);
        });

        it('applies friction to velocity', () => {
            const p = new Particle(0, 0, 10, 0);
            p.friction = 0.5;
            p.update();
            expect(p.vx).toBeCloseTo(5);
        });

        it('moves x by vx and y by vy', () => {
            const p = new Particle(5, 10, 0, 0);
            p.vx = 3;
            p.vy = -2;
            p.update();
            expect(p.x).toBeCloseTo(8);
            expect(p.y).toBeCloseTo(8);
        });
    });

    describe('gravitateTo', () => {
        it('accelerates toward another particle', () => {
            const p1 = new Particle(0, 0, 0, 0);
            const p2 = new Particle(10, 0, 0, 0);
            p1.gravitateTo(p2);
            expect(p1.vx).toBeGreaterThan(0);
            expect(p1.vy).toBeCloseTo(0);
        });

        it('does nothing when distance is zero', () => {
            const p1 = new Particle(5, 5, 0, 0);
            const p2 = new Particle(5, 5, 0, 0);
            expect(() => p1.gravitateTo(p2)).not.toThrow();
            expect(p1.vx).toBe(0);
        });
    });

    describe('springTo', () => {
        it('applies spring force toward a point', () => {
            const p = new Particle(0, 0, 0, 0);
            const point = { x: 10, y: 0 };
            p.springTo(point, 0.1, 0);
            expect(p.vx).toBeGreaterThan(0);
        });

        it('does nothing when distance is zero', () => {
            const p = new Particle(5, 5, 0, 0);
            expect(() => p.springTo({ x: 5, y: 5 }, 0.1)).not.toThrow();
            expect(p.vx).toBe(0);
        });
    });

    describe('addSpring and removeSpring', () => {
        it('adds a spring to the springs list', () => {
            const p = new Particle(0, 0, 0, 0);
            const point = { x: 5, y: 5 };
            p.addSpring(point, 0.1, 2);
            expect(p.springs).toHaveLength(1);
            expect(p.springs[0]).toMatchObject({ k: 0.1, length: 2, point });
        });

        it('adding the same point replaces the existing spring', () => {
            const p = new Particle(0, 0, 0, 0);
            const point = { x: 5, y: 5 };
            p.addSpring(point, 0.1, 2);
            p.addSpring(point, 0.5, 3);
            expect(p.springs).toHaveLength(1);
            expect(p.springs[0].k).toBe(0.5);
        });

        it('removes a spring by point reference', () => {
            const p = new Particle(0, 0, 0, 0);
            const point = { x: 5, y: 5 };
            p.addSpring(point, 0.1);
            p.removeSpring(point);
            expect(p.springs).toHaveLength(0);
        });

        it('removeSpring is a no-op for unknown points', () => {
            const p = new Particle(0, 0, 0, 0);
            expect(() => p.removeSpring({ x: 0, y: 0 })).not.toThrow();
        });
    });

    describe('addGravitation and removeGravitation', () => {
        it('adds a gravitation particle', () => {
            const p1 = new Particle(0, 0, 0, 0);
            const p2 = new Particle(5, 5, 0, 0);
            p1.addGravitation(p2);
            expect(p1.gravitations).toHaveLength(1);
        });

        it('adding the same particle replaces the existing one', () => {
            const p1 = new Particle(0, 0, 0, 0);
            const p2 = new Particle(5, 5, 0, 0);
            p1.addGravitation(p2);
            p1.addGravitation(p2);
            expect(p1.gravitations).toHaveLength(1);
        });

        it('removes a gravitation particle', () => {
            const p1 = new Particle(0, 0, 0, 0);
            const p2 = new Particle(5, 5, 0, 0);
            p1.addGravitation(p2);
            p1.removeGravitation(p2);
            expect(p1.gravitations).toHaveLength(0);
        });
    });
});
