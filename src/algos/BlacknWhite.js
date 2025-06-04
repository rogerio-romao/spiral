import BaseAlgorithm from '../BaseAlgorithm.js';

export default class BlacknWhite extends BaseAlgorithm {
    constructor(ctx, w, h) {
        super(ctx, w, h);
        this.speed = random(2, 6);
        this.t = 0;
        this.stagger = 0;
        this.interval = null;

        this.length = random(50, Math.min(w, h) / 1.5);
        this.height = this.length / random(1, 5);
        this.modes = ['source-over', 'difference', 'destination-out'];

        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 4;

        this.draw = () => {
            if (this.t % this.speed === 0) {
                this.stagger = this.stagger % 4;
                if (this.stagger === 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.w / 2, this.h / 2);
                    this.ctx.strokeRect(
                        this.w / 2 - this.length / 2,
                        this.h / 2 - this.height / 2,
                        this.length,
                        this.height
                    );
                    //
                    this.length = random(20, Math.max(this.w, this.h));
                    this.height = this.length / random(1, 5);
                }
                if (this.stagger === 1) {
                    this.ctx.translate(this.w / 2, this.h / 2);
                    this.ctx.rotate((random(-180, 180) * Math.PI) / 180);
                    this.ctx.translate(-this.w / 2, -this.h / 2);
                }
                if (this.stagger === 2) {
                    this.ctx.arcTo(this.height, this.length, 0, this.h / 2, this.w / 2);
                    this.ctx.stroke();
                }
                if (this.stagger === 3) {
                    this.ctx.arcTo(
                        this.w / 2,
                        this.h / 2,
                        random(1, 10),
                        this.height,
                        this.length
                    );
                    this.ctx.stroke();
                }
                this.stagger++;
            }
            this.t++;
            if (this.t % (this.speed * 100) === 0) {
                this.ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length)];
            }
            this.interval = requestAnimationFrame(this.draw);
        };
    }
}