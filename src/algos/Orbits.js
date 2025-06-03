import { random, randomColor } from "../utils/random.js";

export default class Orbits {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.speed = random(2, 6);
        this.t = 0;
        this.interval = null;

        this.radius = random(30, this.h);
        this.radius2 = random(10, this.radius);
        this.rot1 = random(1, 6);
        this.startAngle = random(0, 100);
        this.endAngle = random(101, 360);

        this.ctx.strokeStyle = randomColor(5, 255, 0.2, 0.2);

        this.draw = () => {
            if (this.t % this.speed === 0) {
                this.ctx.ellipse(
                    this.w / 2,
                    this.h / 2,
                    this.radius,
                    this.radius2,
                    this.rot1,
                    this.startAngle,
                    this.endAngle
                );
            }
            this.ctx.stroke();
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rot1);
            this.ctx.translate(-this.w / 2, -this.h / 2);
            this.t++;
            if (this.t % (this.speed * 150) === 0) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = randomColor(5, 255, 0.2, 0.2);
                this.radius = random(30, this.h);
                this.radius2 = random(10, this.radius);
                this.startAngle = random(0, 50);
                this.rot1 = random(-3, 3);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}