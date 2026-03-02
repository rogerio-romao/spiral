import Particle from '../../src/utils/Particle.js';

describe('particle', () => {
    describe('constructor', () => {
        it('sets position', () => {
            const particle = new Particle(10, 20, 0, 0);
            expect(particle.x).toBe(10);
            expect(particle.y).toBe(20);
        });

        it('sets velocity from speed and direction', () => {
            const particle = new Particle(0, 0, 5, 0);
            expect(particle.vx).toBeCloseTo(5);
            expect(particle.vy).toBeCloseTo(0);
        });

        it('sets defaults', () => {
            const particle = new Particle(0, 0, 0, 0);
            expect(particle.gravity).toBe(0);
            expect(particle.bounce).toBe(-1);
            expect(particle.friction).toBe(1);
            expect(particle.mass).toBe(1);
            expect(particle.springs).toStrictEqual([]);
            expect(particle.gravitations).toStrictEqual([]);
        });

        it('accepts optional gravity', () => {
            const particle = new Particle(0, 0, 0, 0, 0.5);
            expect(particle.gravity).toBe(0.5);
        });
    });

    describe('accelerate', () => {
        it('adds to velocity components', () => {
            const particle = new Particle(0, 0, 0, 0);
            particle.accelerate(2, 3);
            expect(particle.vx).toBeCloseTo(2);
            expect(particle.vy).toBeCloseTo(3);
        });
    });

    describe('distanceTo', () => {
        it('computes Euclidean distance', () => {
            const particle1 = new Particle(0, 0, 0, 0);
            const particle2 = new Particle(3, 4, 0, 0);
            expect(particle1.distanceTo(particle2)).toBe(5);
        });

        it('returns 0 for same position', () => {
            const particle = new Particle(5, 5, 0, 0);
            expect(particle.distanceTo(particle)).toBe(0);
        });
    });

    describe('angleTo', () => {
        it('returns 0 for a point directly to the right', () => {
            const particle1 = new Particle(0, 0, 0, 0);
            const particle2 = new Particle(5, 0, 0, 0);
            expect(particle1.angleTo(particle2)).toBeCloseTo(0);
        });

        it('returns PI/2 for a point directly below', () => {
            const particle1 = new Particle(0, 0, 0, 0);
            const particle2 = new Particle(0, 5, 0, 0);
            expect(particle1.angleTo(particle2)).toBeCloseTo(Math.PI / 2);
        });
    });

    describe('getSpeed and setSpeed', () => {
        it('getSpeed returns magnitude of velocity', () => {
            const particle = new Particle(0, 0, 5, 0);
            expect(particle.getSpeed()).toBeCloseTo(5);
        });

        it('setSpeed changes speed without changing direction', () => {
            const particle = new Particle(0, 0, 5, 0);
            const headingBefore = particle.getHeading();
            particle.setSpeed(10);
            expect(particle.getSpeed()).toBeCloseTo(10);
            expect(particle.getHeading()).toBeCloseTo(headingBefore);
        });
    });

    describe('getHeading and setHeading', () => {
        it('getHeading returns direction of velocity', () => {
            const particle = new Particle(0, 0, 5, 0);
            expect(particle.getHeading()).toBeCloseTo(0);
        });

        it('setHeading changes direction without changing speed', () => {
            const particle = new Particle(0, 0, 5, 0);
            const speedBefore = particle.getSpeed();
            particle.setHeading(Math.PI / 2);
            expect(particle.getSpeed()).toBeCloseTo(speedBefore);
            expect(particle.getHeading()).toBeCloseTo(Math.PI / 2);
        });
    });

    describe('update', () => {
        it('applies gravity to vy and moves position', () => {
            const particle = new Particle(0, 0, 0, 0, 1);
            particle.update();
            expect(particle.vy).toBeCloseTo(1);
            expect(particle.y).toBeCloseTo(1);
        });

        it('applies friction to velocity', () => {
            const particle = new Particle(0, 0, 10, 0);
            particle.friction = 0.5;
            particle.update();
            expect(particle.vx).toBeCloseTo(5);
        });

        it('moves x by vx and y by vy', () => {
            const particle = new Particle(5, 10, 0, 0);
            particle.vx = 3;
            particle.vy = -2;
            particle.update();
            expect(particle.x).toBeCloseTo(8);
            expect(particle.y).toBeCloseTo(8);
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
            const particle = new Particle(0, 0, 0, 0);
            const point = { x: 10, y: 0 };
            particle.springTo(point, 0.1, 0);
            expect(particle.vx).toBeGreaterThan(0);
        });

        it('does nothing when distance is zero', () => {
            const particle = new Particle(5, 5, 0, 0);
            expect(() => particle.springTo({ x: 5, y: 5 }, 0.1)).not.toThrow();
            expect(particle.vx).toBe(0);
        });
    });

    describe('addSpring and removeSpring', () => {
        it('adds a spring to the springs list', () => {
            const particle = new Particle(0, 0, 0, 0);
            const point = { x: 5, y: 5 };
            particle.addSpring(point, 0.1, 2);
            expect(particle.springs).toHaveLength(1);
            expect(particle.springs[0]).toMatchObject({
                k: 0.1,
                length: 2,
                point,
            });
        });

        it('adding the same point replaces the existing spring', () => {
            const particle = new Particle(0, 0, 0, 0);
            const point = { x: 5, y: 5 };
            particle.addSpring(point, 0.1, 2);
            particle.addSpring(point, 0.5, 3);
            expect(particle.springs).toHaveLength(1);
            expect(particle.springs[0].k).toBe(0.5);
        });

        it('removes a spring by point reference', () => {
            const particle = new Particle(0, 0, 0, 0);
            const point = { x: 5, y: 5 };
            particle.addSpring(point, 0.1);
            particle.removeSpring(point);
            expect(particle.springs).toHaveLength(0);
        });

        it('removeSpring is a no-op for unknown points', () => {
            const particle = new Particle(0, 0, 0, 0);
            expect(() => particle.removeSpring({ x: 0, y: 0 })).not.toThrow();
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
