import { random } from "../utils/random.js";

export default class CamouflagePostits {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.speed = random(2, 6);
        this.t = 0;
        this.stagger = 0;
        this.interval = null;

        this.length = random(50, Math.min(this.w, this.h) / 1.5);
        this.x = random(0, w);
        this.y = random(0, w);
        this.rot1 = (random(0, 360) * Math.PI) / 180;
        this.randCol = random(0, 255);
        this.ctx.fillStyle = `rgb(${this.randCol + random(-8, 8)},${
            this.randCol + random(-8, 8)
        },${this.randCol + random(-8, 8)})`;

        this.modes = [
            'xor',
            'difference',
            'hard-light',
            'color-burn',
            'color-dodge',
            'lighten',
            'darken',
            'overlay',
            'source-atop',
        ];

        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(this.w / 2, this.h / 2);

        this.draw = () => {
            if (this.t % this.speed === 0) {
                this.ctx.fillRect(this.x, this.y, this.length, this.length);
                this.x = random(0, this.w);
                this.y = random(0, this.h);
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rot1);
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }
            if (this.t % (this.speed * 25) === 0) {
                this.length = random(5, 125);
                this.randCol = random(0, 255);
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
                this.ctx.fillStyle = `rgb(${this.randCol + random(-8, 8)},${
                    this.randCol + random(-8, 8)
                },${this.randCol + random(-8, 8)})`;
            }
            this.t++;
            if (this.t % (this.speed * 100) === 0) {
                this.rot1 = (random(0, 360) * Math.PI) / 180;
                this.ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length - 1)];
            }
            this.interval = requestAnimationFrame(this.draw);
        };
    }
}