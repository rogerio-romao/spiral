import { random } from "../utils/random.js";

export default class TheBadge {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.speed = random(2, 6);
        this.t = 0;
        this.interval = null;

        this.length = random(50, Math.min(this.w, this.h) / 1.5);
        this.rot1 = (random(0, 360) * Math.PI) / 180;
        this.randCol = random(0, 255);
        this.ctx.fillStyle = `rgb(${this.randCol + random(-28, 28)},${
            this.randCol + random(-28, 28)
        },${this.randCol + random(-28, 28)})`;
        this.modes = [
            'difference',
            'soft-light',
            'color',
            'lighten',
            'darken',
            'overlay',
            'source-atop',
        ];

        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;

        this.draw = () => {
            if (this.t % this.speed === 0) {
                this.ctx.fillRect(
                    this.w / 2 - this.length * 1.5,
                    this.h / 2 - this.length * 1.5,
                    3 * this.length,
                    3 * this.length
                );
                this.ctx.strokeRect(
                    this.w / 2 - this.length * 1.5,
                    this.h / 2 - this.length * 1.5,
                    3 * this.length,
                    3 * this.length
                );
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rot1);
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }
            this.t++;
            if (this.t % (this.speed * 25) === 0) {
                this.length = random(5, Math.min(this.w, this.h) / 3);
                this.randCol = random(0, 255);

                this.ctx.fillStyle = `rgb(${this.randCol + random(-28, 28)},${
                    this.randCol + random(-28, 28)
                },${this.randCol + random(-28, 28)})`;
            }
            if (this.t % (this.speed * 50) === 0) {
                this.rot1 = (random(0, 360) * Math.PI) / 180;
                this.ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length - 1)];
            }
            this.interval = requestAnimationFrame(this.draw);
        };
    }
}