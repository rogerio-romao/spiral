import AL from '../AlgorithmLoader.js';

export default class Shards extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.modes = [
            'source-over',
            'hard-light',
            'soft-light',
            'overlay',
            'xor',
            'difference',
            'exclusion',
            'lighten',
            'darken',
            'hue',
            'color',
            'luminosity',
            'multiply',
            'screen',
        ];

        this.deviation = AL.random(50, 200);
    }

    initializeProperties() {
        this.c1x1 = AL.random(0, this.w);
        this.c1y1 = AL.random(0, this.h);
        this.c1x2 = AL.random(0, this.w);
        this.c1y2 = AL.random(0, this.h);
        this.rot = AL.random(1, 90);
        this.color = AL.randomColor(0, 255, 1, 1);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
        this.ctx.globalCompositeOperation = AL.pickRandomElement(this.modes);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
            this.fillScreen();
            this.ctx.fillStyle = this.color;
            this.drawTriangle();
        }

        this.t++;

        this.rotateCanvasRadians(this.rot);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }

    drawTriangle() {
        this.ctx.beginPath();
        this.ctx.moveTo(
            this.w / 2 + Math.sin(this.t) * 100,
            this.h / 2 + Math.cos(this.t) * 100
        );
        this.ctx.lineTo(this.c1x1, this.c1y1);
        this.ctx.lineTo(this.c1x2, this.c1y2);
        this.ctx.lineTo(
            this.w / 2 + Math.sin(this.t) * this.deviation,
            this.h / 2 + Math.cos(this.t) * this.deviation
        );
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    }
}
