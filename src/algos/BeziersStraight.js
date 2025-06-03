import { random, randomColor } from "../utils/random.js";

export default class BeziersStraight {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.speed = random(2, 6);
        this.t = 0;
        this.stagger = 0;
        this.interval = null;

        this.x = random(0, w);
        this.y = random(0, w);
        this.cp1X = random(0, w);
        this.cp1Y = random(0, w);
        this.cp2X = random(0, w);
        this.cp2Y = random(0, w);
        this.rot = random(1, 21);

        this.ctx.strokeStyle = randomColor(5, 255, 0.2, 0.2);

        this.draw = () => {
            if (this.t % this.speed === 0) {
                this.stagger = this.stagger % 3;
                if (this.stagger === 0) {
                    this.ctx.bezierCurveTo(
                        this.cp1X,
                        this.cp1Y,
                        this.cp2X,
                        this.cp2Y,
                        this.x,
                        this.y
                    );
                    this.ctx.stroke();
                }
                if (this.stagger === 1) {
                    this.ctx.moveTo(this.w / 2, this.h / 2);
                    this.ctx.bezierCurveTo(
                        this.cp2X,
                        this.cp2Y,
                        this.cp1X,
                        this.cp1Y,
                        this.x,
                        this.y
                    );
                    this.ctx.stroke();
                }
                if (this.stagger === 2) {
                    this.ctx.moveTo(this.w / 2, this.h / 2);
                    this.ctx.bezierCurveTo(
                        this.cp2Y,
                        this.cp1X,
                        this.cp1Y,
                        this.cp2X,
                        this.y,
                        this.x
                    );
                    this.ctx.stroke();

                    this.ctx.translate(this.w / 2, this.h / 2);
                    this.ctx.rotate(this.rot);
                    this.ctx.translate(-this.w / 2, -this.h / 2);
                }
                this.stagger++;
            }
            this.t++;
            if (this.t % (this.speed * 280) === 0) {
                this.ctx.closePath();
                this.ctx.beginPath();
                this.ctx.strokeStyle = randomColor(5, 255, 0.2, 0.2);
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(random(0, 3) * Math.PI);
                this.ctx.translate(-this.w / 2, -this.h / 2);
                this.cp2Y = random(0, this.h);
            }
            this.interval = requestAnimationFrame(this.draw);
        };
    }
}