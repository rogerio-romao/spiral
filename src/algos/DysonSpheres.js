import { random, randomColor } from "../utils/random.js";

export default class DysonSpheres {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.t = 0;
        this.speed = random(2, 6);
        this.interval = null;

        this.length = random(60, Math.max(this.h / 2, this.h - 60));
        this.height = random(20, this.h / 2 - 40);
        this.rot1 = random(1, 6);

        ctx.shadowBlur = 11;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = ctx.strokeStyle = randomColor(5, 255, 0.33, 0.33);

        this.draw = () => {
            if (this.t % this.speed === 0) {
                this.ctx.ellipse(
                    this.w / 2,
                    this.h / 2,
                    this.length,
                    this.height,
                    this.rot1,
                    0,
                    0
                );
                this.ctx.stroke();
            }
            this.t++;
            if (this.t % (this.speed * 170) === 0) {
                this.ctx.beginPath();
                let color = Math.random();
                if (color < 0.2) {
                    this.ctx.shadowBlur = 1;
                    this.ctx.shadowOffsetX = 0;
                    this.ctx.shadowOffsetY = 0;
                    this.ctx.shadowColor = this.ctx.strokeStyle = 'black';
                } else if (color < 0.4) {
                    this.ctx.shadowBlur = 1;
                    this.ctx.shadowOffsetX = 0;
                    this.ctx.shadowOffsetY = 0;
                    this.ctx.shadowColor = this.ctx.strokeStyle = 'white';
                } else {
                    this.ctx.shadowBlur = 11;
                    this.ctx.shadowColor = this.ctx.strokeStyle = randomColor(
                        5,
                        255,
                        0.33,
                        0.33
                    );
                }
                this.length = random(60, Math.max(this.h / 2, this.h - 60));
                this.height = random(20, this.h / 2 - 40);
            }
            this.rot1 = random(0, 360);
            this.interval = requestAnimationFrame(this.draw);
        };
    }
}