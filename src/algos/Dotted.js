import { random, randomColor } from "../utils/random.js";

export default class Dotted {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.speed = random(2, 6);
        this.t = 0;
        this.stagger = 0;
        this.interval = null;

        this.vx1 = random(0, this.w);
        this.vx2 = random(0, this.w);
        this.vx3 = random(0, this.w);
        this.vy1 = random(0, this.h);
        this.vy2 = random(0, this.h);
        this.vy3 = random(0, this.h);

        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.strokeStyle = randomColor(5, 255, 0.75, 0.75);
        this.ctx.fillStyle = randomColor(5, 255, 0.015, 0.015);
        this.ctx.setLineDash([14, 6]);
        this.ctx.lineWidth = 2;

        this.draw = () => {
            if (this.t % this.speed === 0) {
                this.stagger = this.stagger % 3;

                if (this.stagger === 0) {
                    this.ctx.moveTo(this.w / 2, this.h / 2);
                    this.ctx.lineTo(this.vx2, this.vy2);
                    this.ctx.stroke();
                }
                if (this.stagger === 1) {
                    this.ctx.lineTo(this.vx3, this.vy3);
                    this.ctx.stroke();
                }
                if (this.stagger === 2) {
                    this.ctx.lineTo(this.vx1, this.vy1);
                    this.ctx.stroke();

                    this.ctx.beginPath();
                    this.vx1 = random(0, this.w);
                    this.vx2 = random(0, this.w);
                    this.vx3 = random(0, this.w);
                    this.vy1 = random(0, this.h);
                    this.vy2 = random(0, this.h);
                    this.vy3 = random(0, this.h);
                }
                this.stagger++;
            }
            this.t++;
            if (this.t % (this.speed * 5) === 0) {
                this.ctx.fillRect(0, 0, this.w, this.h);
            }
            if (this.t % (this.speed * 70) === 0) {
                this.ctx.setLineDash([random(1, 20), random(7, 50)]);
                this.ctx.lineWidth = random(1, 29);
            }
            if (this.t % (this.speed * 200) === 0) {
                this.ctx.fillStyle = randomColor(5, 255, 0.015, 0.015);
            }
            if (this.t % (this.speed * 280) === 0) {
                this.ctx.strokeStyle = randomColor(5, 255, 0.75, 0.75);
            }
            this.interval = requestAnimationFrame(this.draw);
        };
    }
}