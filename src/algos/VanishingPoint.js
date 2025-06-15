import AL from '../AlgorithmLoader.js';

export default class VanishingPoint extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.size = Math.min(this.w, this.h);
        this.decrease = AL.random(2, 11);
        this.rot = AL.random(1, 90);
        this.color1 = AL.randomColor(0, 255, 1, 1);
        this.color2 = AL.randomColor(0, 255, 1, 1);
        this.color3 = AL.randomColor(0, 255, 1, 1);
        this.color4 = AL.randomColor(0, 255, 1, 1);
        this.colors = [this.color1, this.color2, this.color3, this.color4];
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'black';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillStyle = this.colors[AL.random(0, this.colors.length)];
            this.drawTriangle(this.w / 2, this.h / 2);

            this.size -= this.decrease;
            if (this.size - this.decrease <= 1) {
                this.size = 1;
                this.decrease = 0;
                this.color1 = AL.randomColor(0, 255, 1, 1);
                this.color2 = AL.randomColor(0, 255, 1, 1);
                this.color3 = AL.randomColor(0, 255, 1, 1);
                this.color4 = AL.randomColor(0, 255, 1, 1);
                this.colors = [
                    this.color1,
                    this.color2,
                    this.color3,
                    this.color4,
                ];
                this.rot = AL.random(1, 90);
                setTimeout(() => {
                    this.size = Math.min(this.w, this.h);
                    this.decrease = AL.random(2, 11);
                }, 3500);
            }
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw);
    }

    drawTriangle = (x, y) => {
        this.ctx.moveTo(x, y);
        this.ctx.beginPath();
        this.ctx.lineTo(x + this.size, y);
        this.ctx.lineTo(x, y + this.size);
        this.ctx.lineTo(x, y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    };
}
