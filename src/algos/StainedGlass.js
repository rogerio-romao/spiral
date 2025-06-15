import AL from '../AlgorithmLoader.js';

export default class StainedGlass extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.length = this.w / 6;
        this.height = this.h / 5;
        this.rand1 = AL.random(0, 3);
        this.rand2 = (AL.random(1, 359) * Math.PI) / 180;
    }

    setupDrawingStyles() {
        this.modes = ['color', 'hue', 'saturation', 'overlay'];

        this.ctx.globalCompositeOperation = 'color';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 5;
        this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
        this.ctx.beginPath();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = AL.random(0, 30);

            if (this.stagger === 0) {
                this.ctx.strokeRect(0, 0, this.length, this.height);
                this.ctx.fillRect(0, 0, this.length, this.height);
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 1) {
                this.ctx.strokeRect(this.length, 0, this.length, this.height);
                this.ctx.fillRect(this.length, 0, this.length, this.height);
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 2) {
                this.ctx.strokeRect(
                    2 * this.length,
                    0,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(2 * this.length, 0, this.length, this.height);
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 3) {
                this.ctx.strokeRect(
                    3 * this.length,
                    0,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(3 * this.length, 0, this.length, this.height);
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 4) {
                this.ctx.strokeRect(
                    4 * this.length,
                    0,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(4 * this.length, 0, this.length, this.height);
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 5) {
                this.ctx.strokeRect(
                    5 * this.length,
                    0,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(5 * this.length, 0, this.length, this.height);
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 6) {
                this.ctx.strokeRect(
                    5 * this.length,
                    this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    5 * this.length,
                    this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 7) {
                this.ctx.strokeRect(
                    4 * this.length,
                    this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    4 * this.length,
                    this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 8) {
                this.ctx.strokeRect(
                    3 * this.length,
                    this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    3 * this.length,
                    this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 9) {
                this.ctx.strokeRect(
                    2 * this.length,
                    this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    2 * this.length,
                    this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 10) {
                this.ctx.strokeRect(
                    this.length,
                    this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    this.length,
                    this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 11) {
                this.ctx.strokeRect(0, this.height, this.length, this.height);
                this.ctx.fillRect(0, this.height, this.length, this.height);
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 12) {
                this.ctx.strokeRect(
                    0,
                    2 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(0, 2 * this.height, this.length, this.height);
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 13) {
                this.ctx.strokeRect(
                    this.length,
                    2 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    this.length,
                    2 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 14) {
                this.ctx.strokeRect(
                    2 * this.length,
                    2 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    2 * this.length,
                    2 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 15) {
                this.ctx.strokeRect(
                    3 * this.length,
                    2 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    3 * this.length,
                    2 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 16) {
                this.ctx.strokeRect(
                    4 * this.length,
                    2 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    4 * this.length,
                    2 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 17) {
                this.ctx.strokeRect(
                    5 * this.length,
                    2 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    5 * this.length,
                    2 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 18) {
                this.ctx.strokeRect(
                    5 * this.length,
                    3 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    5 * this.length,
                    3 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 19) {
                this.ctx.strokeRect(
                    4 * this.length,
                    3 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    4 * this.length,
                    3 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 20) {
                this.ctx.strokeRect(
                    3 * this.length,
                    3 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    3 * this.length,
                    3 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 21) {
                this.ctx.strokeRect(
                    2 * this.length,
                    3 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    2 * this.length,
                    3 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 22) {
                this.ctx.strokeRect(
                    this.length,
                    3 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    this.length,
                    3 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 23) {
                this.ctx.strokeRect(
                    0,
                    3 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(0, 3 * this.height, this.length, this.height);
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 24) {
                this.ctx.strokeRect(
                    0,
                    4 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(0, 4 * this.height, this.length, this.height);
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 25) {
                this.ctx.strokeRect(
                    this.length,
                    4 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    this.length,
                    4 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 26) {
                this.ctx.strokeRect(
                    2 * this.length,
                    4 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    2 * this.length,
                    4 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 27) {
                this.ctx.strokeRect(
                    3 * this.length,
                    4 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    3 * this.length,
                    4 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 28) {
                this.ctx.strokeRect(
                    4 * this.length,
                    4 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    4 * this.length,
                    4 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }

            if (this.stagger === 29) {
                this.ctx.strokeRect(
                    5 * this.length,
                    4 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillRect(
                    5 * this.length,
                    4 * this.height,
                    this.length,
                    this.height
                );
                this.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
            }
        }

        if (this.t % (this.speed * 50) === 0) {
            this.rand1 = AL.random(0, 3);

            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rand2);
            this.ctx.translate(-this.w / 2, -this.h / 2);

            this.ctx.globalCompositeOperation =
                this.modes[AL.random(0, this.modes.length)];

            this.ctx.fillRect(
                this.w / 2 - this.rand1 * this.length,
                this.h / 2 - this.height * 1.5,
                this.rand1 * 2 * this.length,
                3 * this.height
            );
            this.ctx.strokeRect(
                this.w / 2 - this.rand1 * this.length,
                this.h / 2 - this.height * 2.5,
                this.rand1 * 2 * this.length,
                5 * this.height
            );
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
