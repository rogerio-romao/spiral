import AL from '../AlgorithmLoader.js';

export default class Portals extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.cols = AL.random(3, 13);
        this.rows = AL.random(3, 13);
        this.width = AL.random(20, this.w / this.cols + 3);
        this.height = AL.random(20, this.h / this.rows + 3);
        this.round = AL.random(0, 60);
        this.rot = AL.random(1, 33);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
        this.ctx.globalCompositeOperation = 'hard-light';
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.45, 0.45);
        this.ctx.globalAlpha = 0.6;
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let row = 0; row <= this.rows; row++) {
                for (let col = 0; col <= this.cols; col++) {
                    this.ctx.roundRect(
                        col * (this.w / this.cols),
                        row * (this.h / this.rows),
                        this.width,
                        this.height,
                        {
                            upperLeft: this.round,
                            upperRight: this.round,
                            lowerLeft: this.round,
                            lowerRight: this.round,
                        },
                        true,
                        true
                    );
                }
            }
        }

        if (this.t % (this.speed * 90) === 0) {
            this.cols = AL.random(3, 13);
            this.rows = AL.random(3, 13);
            this.width = AL.random(20, this.w / 8);
            this.height = AL.random(20, this.h / 8);
            this.round = AL.random(0, 60);
            this.rot = AL.random(1, 33);

            this.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
            this.ctx.fillStyle = AL.randomColor(0, 255, 0.45, 0.45);
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
