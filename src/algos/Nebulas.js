import { random, randomColor } from "../utils/random.js";

export default class Nebulas {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.t = 0;
        this.speed = random(2, 6);
        this.interval = null;

        this.length = random(50, Math.min(this.w, this.h) / 1.5);
        this.gap = random(4, 100);
        this.rotate = random(3, 160);

        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = 'rgba(255,255,255,0.7)';
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
        this.ctx.fillStyle = this.ctx.strokeStyle = randomColor(5, 255, 0.02, 0.02);

        this.draw = () => {
            this.ctx.lineWidth = random(1, 200);
            if (this.t % this.speed === 0) {
                this.ctx.strokeRect(this.w / 2, this.h / 2, this.length, this.gap);
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rotate);
                this.ctx.translate(-this.w / 2, -this.h / 2);
                this.length = random(10, Math.max(this.w, this.h));
                this.gap += random(2, 10);
                if (this.gap > 1000) this.gap = 1;
                this.rotate = random(3, 160);
            }
            this.t++;
            if (this.t % (this.speed * 10) === 0) {
                this.ctx.fillRect(random(0, this.w), random(0, this.h), this.gap, this.gap);
            }
            if (this.t % (this.speed * 70) === 0) {
                this.rotate = -this.rotate;
                this.ctx.fillStyle = this.ctx.strokeStyle = randomColor(
                    5,
                    255,
                    0.02,
                    0.02
                );
            }
            this.interval = requestAnimationFrame(this.draw);
        };
    }
}