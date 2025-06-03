import { random, randomColor } from "../utils/random.js";

export default class SpiralLines {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.speed = random(2, 6);
        this.t = 0;
        this.stagger = 0;
        this.interval = null;

        this.radius = random(10, this.h);
        this.length = random(50, Math.min(this.w, this.h) / 1.5);
        this.gap = random(4, 100);
        this.rot1 = (random(1, 359) * Math.PI) / 180;
        this.cycles = 1;
        this.bw = Math.random();

        this.ctx.strokeStyle = randomColor(5, 255, 0.5, 0.5);
        this.ctx.lineWidth = random(1, 8);
        this.ctx.moveTo(this.w / 2, this.h / 2);
        this.ctx.beginPath();

        this.draw = () => {
            if (this.t % this.speed === 0) {
                this.stagger = this.stagger % 3;
                if (this.stagger === 0) {
                    this.ctx.moveTo(
                        this.w / 2 - this.radius - this.length / 2,
                        this.h / 2 + this.length / 2
                    );
                    this.ctx.lineTo(
                        this.w / 2 - this.radius - this.length / 2,
                        this.h / 2 - this.length / 2
                    );
                    this.ctx.stroke();
                }
                if (this.stagger === 1) {
                    this.ctx.lineTo(this.w / 2 - this.radius - this.length, this.h / 2);
                    this.ctx.stroke();
                }
                if (this.stagger === 2) {
                    this.ctx.lineTo(
                        this.w / 2 - this.radius - this.length / 2,
                        this.h / 2 + this.length / 2
                    );
                    this.ctx.stroke();
                }
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rot1);
                this.ctx.translate(-this.w / 2, -this.h / 2);
                this.length += this.gap;
                if (this.length > Math.max(this.w, this.h)) {
                    this.cycles++;
                    this.length = this.gap;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = randomColor(5, 255, 0.5, 0.5);
                    this.ctx.arc(this.w / 2, this.h / 2, this.radius, 0, 360);
                    this.bw = Math.random();
                    this.radius = random(5, 65);
                    this.gap = random(2, 30);
                }
            }
            this.t++;
            if (this.cycles % 9 === 0) {
                this.bw < 0.5
                    ? (this.ctx.strokeStyle = 'rgba(255,255,255, .75)')
                    : (this.ctx.strokeStyle = 'rgba(0,0,0, .75)');
            }
            this.interval = requestAnimationFrame(this.draw);
        };
    }
}