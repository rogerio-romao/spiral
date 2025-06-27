import AL from '../AlgorithmLoader.js';

export default class PietriDish extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.y = 0;
        this.x = 0;
        this.size = AL.random(15, 115);
        this.rotate = AL.random(1, 90);
    }

    setupConstantStyles() {
        this.ctx.shadowBlur = 35;
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.shadowColor = AL.randomColor(100, 255, 0.75, 1);
    }

    setupDrawingStyles() {
        this.ctx.shadowColor = AL.randomColor(100, 255, 0.75, 1);
        this.ctx.fillStyle = AL.randomColor();
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.lineWidth = AL.random(2, 18);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(
                this.x - this.size / 2,
                this.y - this.size / 2,
                this.size / 2,
                0,
                2 * Math.PI
            );
            this.ctx.stroke();
            this.ctx.fill();

            this.x += this.size;
            if (this.x > this.w) {
                this.x = 0;
                this.y += this.size;
            }
            if (this.y > this.h) {
                this.x = 0;
                this.y = 0;
                this.size = AL.random(15, 115);
            }
        }

        this.t++;

        if (this.t % (this.speed * 150) === 0) {
            this.rotate = AL.random(1, 90);

            if (Math.random() < 0.2) {
                this.ctx.fillStyle = 'black';
            } else {
                this.ctx.fillStyle = AL.randomColor();
            }

            this.ctx.lineWidth = AL.random(2, 18);
            this.ctx.shadowColor = AL.randomColor(100, 255, 0.75, 1);
        }

        if (this.t % (this.speed * 450) === 0) {
            this.ctx.beginPath();
            this.size = AL.random(15, 85);
            this.ctx.strokeStyle = AL.randomColor();
        }

        this.rotateCanvasDegrees(this.rotate);

        requestAnimationFrame(this.draw);
    }
}
