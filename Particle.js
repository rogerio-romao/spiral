// Particle class
class Particle {
    constructor(x, y, speed, direction, grav = 0) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
        this.gravity = grav;
        this.bounce = -1;
        this.friction = 1;
        this.mass = 1;
        this.springs = [];
        this.gravitations = [];
    }
    accelerate(ax, ay) {
        this.vx += ax;
        this.vy += ay;
    }
    addGravitation(p) {
        this.removeGravitation(p); // case it already exists
        this.gravitations.push(p);
    }
    addSpring(point, k, length = 0) {
        this.removeSpring(point); // case it already exists
        this.springs.push({ point, k, length });
    }
    angleTo(p2) {
        return Math.atan2(p2.y - this.y, p2.x - this.x);
    }
    distanceTo(p2) {
        const dx = p2.x - this.x;
        const dy = p2.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    getHeading() {
        return Math.atan2(this.vy, this.vx);
    }
    getSpeed() {
        return Math.sqrt(this.vx ** 2 + this.vy ** 2);
    }
    gravitateTo(p2) {
        const dx = p2.x - this.x;
        const dy = p2.y - this.y;
        const dSq = dx * dx + dy * dy;
        const dist = Math.sqrt(dSq);
        const force = p2.mass / dSq;
        const ax = (dx / dist) * force;
        const ay = (dy / dist) * force;

        this.vx += ax;
        this.vy += ay;
    }
    handleGravitations() {
        this.gravitations.forEach(gravitation => this.gravitateTo(gravitation));
    }
    handleSprings() {
        this.springs.forEach(spring =>
            this.springTo(spring.point, spring.k, spring.length)
        );
    }
    removeGravitation(p) {
        const gravIndex = this.gravitations.findIndex(g => g === p);
        this.gravitations.splice(gravIndex, 1);
    }
    removeSpring(point) {
        const springIndex = this.springs.findIndex(s => s.point === point);
        this.springs.splice(springIndex, 1);
    }
    setHeading(heading) {
        const speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    }
    setSpeed(speed) {
        const heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    }
    springTo(point, k, length = 0) {
        const dx = point.x - this.x;
        const dy = point.y - this.y;
        const distance = Math.hypot(dx, dy);
        const springForce = (distance - length) * k;
        this.vx += (dx / distance) * springForce;
        this.vy += (dy / distance) * springForce;
    }
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

module.exports = Particle;
