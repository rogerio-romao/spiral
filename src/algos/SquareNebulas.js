import { random, randomColor } from "../utils/random.js";

export default class SquareNebulas {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.speed = random(2, 6);
        this.t = 0;
        this.stagger = 0;
        this.interval = null;

        this.length = random(50, Math.min(w, h) / 1.5);
        this.maxLength = this.length;
        this.gap = random(4, 100);

        this.ctx.fillStyle = randomColor(5, 255, 0.025, 0.025);
        this.ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);

        this.draw = () => {
            if (this.t % this.speed === 0) {
                this.stagger = this.stagger % 3;

                if (this.stagger === 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.w / 2, this.h / 2);
                    this.ctx.fillRect(
                        random(0, this.w),
                        random(0, this.h),
                        this.length,
                        this.length
                    );
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
                if (this.stagger === 1) {
                    this.ctx.strokeRect(
                        this.w / 2,
                        this.h / 2,
                        this.length / 2,
                        this.length / 2
                    );
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
                if (this.stagger === 2) {
                    this.ctx.fillRect(
                        random(this.w / 2, this.w / 2 + this.length),
                        random(this.h / 2, this.h / 2 + this.length),
                        this.length / 8,
                        this.length / 8
                    );
                    this.ctx.fill();
                    this.ctx.closePath();
                    this.ctx.translate(this.w / 2, this.h / 2);
                    this.ctx.rotate(Math.random() * Math.PI);
                    this.ctx.translate(-this.w / 2, -this.h / 2);
                }
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.length -= this.gap;
                if (this.length < -this.maxLength) {
                    this.length = random(this.maxLength / 2, this.w / 3);
                    this.maxLength = 2 * this.length;
                    this.gap = random(2, 100);
                }
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(Math.random() * Math.PI);
                this.ctx.translate(-this.w / 2, -this.h / 2);
                this.stagger++;
            }
            this.t++;
            if (this.t % (this.speed * 300) === 0) {
                this.ctx.closePath();
                this.ctx.beginPath();
                this.ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);
                this.ctx.fillStyle = randomColor(5, 255, 0.025, 0.025);
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(Math.random() * Math.PI);
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }
            this.interval = requestAnimationFrame(this.draw);
        };
    }
}