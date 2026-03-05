/**
 * Particle class for simulating physics-based movement, including gravity and spring forces.
 * Each particle has properties for position, velocity, mass, and can be influenced by other particles through gravitation and springs.
 * The class provides methods to update the particle's state based on these forces and to manipulate its velocity and direction.
 * This was taken from the Youtube channel CodingMath, see https://www.youtube.com/@codingmath.
 */
export default class Particle {
    // INSTANCE PROPERTIES
    bounce = -1;
    friction = 1;
    mass = 1;

    /**
     * @type {Array<{k: number, length: number, point: Particle}>}
     */
    springs = [];
    /**
     * @type {Particle[]}
     */
    gravitations = [];

    /**
     * Create a new particle.
     * @param {number} x - Initial x position.
     * @param {number} y - Initial y position.
     * @param {number} speed - Initial speed.
     * @param {number} direction - Initial direction in radians.
     * @param {number} [grav] - Optional gravity to apply each update.
     */
    constructor(x, y, speed, direction, grav = 0) {
        this.gravity = grav;
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
        this.x = x;
        this.y = y;
    }

    /**
     * Apply an acceleration to the particle, changing its velocity.
     * @param {number} ax - Acceleration in the x direction.
     * @param {number} ay - Acceleration in the y direction.
     */
    accelerate(ax, ay) {
        this.vx += ax;
        this.vy += ay;
    }

    /**
     * Add a gravitation effect from another particle.
     * @param {Particle} particle - The particle to gravitate towards.
     */
    addGravitation(particle) {
        // in case it already exists
        this.removeGravitation(particle);
        this.gravitations.push(particle);
    }

    /**
     * Add a spring connection to another point.
     * @param {Particle} point - The point to connect the spring to.
     * @param {number} k - The spring constant (stiffness).
     * @param {number} [length] - The rest length of the spring.
     */
    addSpring(point, k, length = 0) {
        // in case it already exists
        this.removeSpring(point);
        this.springs.push({ k, length, point });
    }

    /**
     * Calculate the angle to another particle.
     * @param {Particle} p2 - The other particle.
     * @returns {number} The angle in radians.
     */
    angleTo(p2) {
        return Math.atan2(p2.y - this.y, p2.x - this.x);
    }

    /**
     * Calculate the distance to another particle.
     * @param {Particle} p2 - The other particle.
     * @returns {number} The distance.
     */
    distanceTo(p2) {
        const dx = p2.x - this.x;
        const dy = p2.y - this.y;
        return Math.hypot(dx, dy);
    }

    /**
     * Get the current heading of the particle.
     * @returns {number} The heading in radians.
     */
    getHeading() {
        return Math.atan2(this.vy, this.vx);
    }

    /**
     * Get the current speed of the particle.
     * @returns {number} The speed.
     */
    getSpeed() {
        return Math.hypot(this.vx, this.vy);
    }

    /**
     * Apply gravitation towards another particle.
     * @param {Particle} p2 - The particle to gravitate towards.
     */
    gravitateTo(p2) {
        const dx = p2.x - this.x;
        const dy = p2.y - this.y;
        const dSq = dx * dx + dy * dy;
        const dist = Math.sqrt(dSq);
        if (dist === 0) {
            return;
        }
        const force = p2.mass / dSq;
        const ax = (dx / dist) * force;
        const ay = (dy / dist) * force;

        this.vx += ax;
        this.vy += ay;
    }

    /**
     * Apply all gravitation forces to update the particle's velocity.
     */
    handleGravitations() {
        this.gravitations.map((gravitation) => this.gravitateTo(gravitation));
    }

    /**
     * Apply all spring forces to update the particle's velocity.
     */
    handleSprings() {
        this.springs.map((spring) => this.springTo(spring.point, spring.k, spring.length));
    }

    /**
     * Remove a gravitation effect from another particle.
     * @param {Particle} particle - The particle to stop gravitating towards.
     */
    removeGravitation(particle) {
        const gravIndex = this.gravitations.indexOf(particle);
        if (gravIndex !== -1) {
            this.gravitations.splice(gravIndex, 1);
        }
    }

    /**
     * Remove a spring connection to another point.
     * @param {Particle} point - The point to disconnect the spring from.
     */
    removeSpring(point) {
        const springIndex = this.springs.findIndex((spring) => spring.point === point);
        if (springIndex !== -1) {
            this.springs.splice(springIndex, 1);
        }
    }

    /**
     * Set the heading of the particle.
     * @param {number} heading - The new heading in radians.
     */
    setHeading(heading) {
        const speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    }

    /**
     * Set the speed of the particle.
     * @param {number} speed - The new speed.
     */
    setSpeed(speed) {
        const heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    }

    /**
     * Apply a spring force towards another point.
     * @param {Particle} point - The point to spring towards.
     * @param {number} k - The spring constant.
     * @param {number} [length] - The rest length of the spring.
     */
    springTo(point, k, length = 0) {
        const dx = point.x - this.x;
        const dy = point.y - this.y;
        const distance = Math.hypot(dx, dy);
        if (distance === 0) {
            return;
        }
        const springForce = (distance - length) * k;
        this.vx += (dx / distance) * springForce;
        this.vy += (dy / distance) * springForce;
    }

    /**
     * Update the particle's position based on its velocity, applying friction and gravity.
     */
    update() {
        this.handleSprings();
        this.handleGravitations();
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
    }
}
