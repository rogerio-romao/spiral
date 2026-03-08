import AL from '../AlgorithmLoader.js';

export default class Shards extends AL {
    constructor() {
        super();

        this.name = 'Shards';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
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
        this.rotate = AL.random(1, 90);
        this.c1x1 = AL.random(0, AL.w);
        this.c1y1 = AL.random(0, AL.h);
        this.c1x2 = AL.random(0, AL.w);
        this.c1y2 = AL.random(0, AL.h);
        this.color = AL.randomColor(0, 255, 1, 1);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
        AL.ctx.globalCompositeOperation = AL.pickRandomElement(this.modes);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
            this.fillScreen();
            AL.ctx.fillStyle = this.color;
            this.drawTriangle();
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }

    drawTriangle() {
        AL.ctx.beginPath();
        AL.ctx.moveTo(AL.w / 2 + Math.sin(this.t) * 100, AL.h / 2 + Math.cos(this.t) * 100);
        AL.ctx.lineTo(this.c1x1, this.c1y1);
        AL.ctx.lineTo(this.c1x2, this.c1y2);
        AL.ctx.lineTo(
            AL.w / 2 + Math.sin(this.t) * this.deviation,
            AL.h / 2 + Math.cos(this.t) * this.deviation,
        );
        AL.ctx.stroke();
        AL.ctx.fill();
        AL.ctx.closePath();
    }
}
