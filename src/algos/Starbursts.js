import { random, randomColor } from "../utils/random.js";

export default class Starbursts {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.speed = random(2, 6);
        this.t = 0;
        this.stagger = 0;
        this.interval = null;

        this.length = random(50, Math.min(this.w, this.h) / 1.5);
        this.maxLength = this.length;
        this.gap = random(4, 120);
        this.maxGap = this.gap;
        this.startAngle = random(0, 100);
        this.endAngle = random(101, 360);
        this.rot1 = random(1, 6);

        this.ctx.fillStyle = randomColor(5, 255, 0.1, 0.1);
        this.ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);

        this.draw = () => {
            if (this.t % this.speed === 0) {
                this.stagger = this.stagger % 3;
                if (this.stagger === 0) {
                    this.ctx.arc(
                        this.w / 2,
                        this.h / 2 - this.length,
                        this.maxGap / 2,
                        this.startAngle,
                        this.endAngle
                    );
                }
                if (this.stagger === 1) {
                    this.ctx.lineTo(this.w / 2 + this.length, this.h / 2 - this.length);
                }
                if (this.stagger === 2) {
                    this.ctx.beginPath();
                    this.ctx.arc(
                        this.w / 2 + this.length,
                        this.h / 2 - 2 * this.length,
                        this.maxGap,
                        this.startAngle,
                        this.endAngle
                    );
                    this.ctx.fill();
                }
                this.ctx.stroke();
                this.length -= this.gap;
                if (this.length < -this.maxLength) {
                    this.length = random(7, 100);
                    this.maxLength = 2 * this.length;
                    this.gap = random(2, 30);
                    this.maxGap = 2 * this.gap;
                }
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rot1);
                this.ctx.translate(-this.w / 2, -this.h / 2);
                this.stagger++;
            }
            this.t++;
            if (this.t % (this.speed * 420) === 0) {
                this.ctx.closePath();
                this.ctx.beginPath();
                this.ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);
                this.ctx.fillStyle = randomColor(5, 255, 0.1, 0.1);
                if (Math.random() < 0.15) this.ctx.fillStyle = 'rgb(0,0,0)';
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(Math.random() * Math.PI);
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }
            this.interval = requestAnimationFrame(this.draw);
        };
    }
}