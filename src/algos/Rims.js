import { random, randomColor } from "../utils/random.js";

export default class Rims {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.t = 0;
        this.stagger = 0;
        this.speed = random(1, 10);
        this.interval = null;

        this.radius = random(30, this.h);
        this.radius2 = random(10, this.radius);
        this.rot1 = random(1, 6);
        this.startAngle = random(0, 100);
        this.endAngle = random(101, 360);
        this.gap = random(4, 100);

        this.ctx.fillStyle = randomColor(5, 255, 0.01, 0.01);
        this.ctx.strokeStyle = ' black';

        this.draw = () => {
            if (this.t % this.speed === 0) {
                this.stagger = this.stagger % 3;
                if (this.stagger === 0) {
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
                if (this.stagger === 1) {
                    this.ctx.ellipse(
                        this.w / 2,
                        this.h / 2,
                        this.radius2,
                        this.radius,
                        this.rot1,
                        this.startAngle + this.gap,
                        this.endAngle + this.gap
                    );
                }
                if (this.stagger === 2) {
                    this.ctx.ellipse(
                        this.startAngle + this.gap,
                        this.endAngle + this.gap,
                        this.radius,
                        this.radius2,
                        -this.rot1,
                        this.w / 2,
                        this.h / 2
                    );
                }
            }
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rot1);
            this.ctx.translate(-this.w / 2, -this.h / 2);
            this.t++;
            if (this.t % (this.speed * 150) === 0) {
                this.ctx.beginPath();
                this.ctx.fillStyle = randomColor(5, 255, 0.01, 0.01);
                this.radius = random(10, this.w);
                this.radius2 = random(10, this.h);
                this.startAngle = random(0, 50);
                this.endAngle = random(51, 360);
                this.gap = random(2, this.w / 4);
                this.speed = random(1, 10);
            }
            this.interval = requestAnimationFrame(this.draw);
        };
    }
}