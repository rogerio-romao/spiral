import BA from '../BaseAlgorithm.js';

export default class Shards extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
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

        this.c1x1 = BA.random(0, this.w);
        this.c1y1 = BA.random(0, this.h);
        this.c1x2 = BA.random(0, this.w);
        this.c1y2 = BA.random(0, this.h);
        this.c2x1 = BA.random(0, this.w);
        this.c2y1 = BA.random(0, this.h);
        this.c2x2 = BA.random(0, this.w);
        this.c2y2 = BA.random(0, this.h);
        this.x = BA.random(0, this.w);
        this.y = BA.random(0, this.h);
        this.rot1 = BA.random(1, 90);
        this.rot2 = BA.random(1, 90);
        this.deviation1 = BA.random(50, 200);
        this.deviation2 = BA.random(50, 200);
        this.color1 = BA.randomColor(0, 255, 1, 1);
        this.color2 = BA.randomColor();
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(0, 255, 1, 1);
        this.ctx.globalCompositeOperation =
            this.modes[BA.random(0, this.modes.length)];
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
            this.ctx.fillRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
            this.ctx.fillStyle = this.color1;
            this.drawTriangle();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot1);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 150) === 0) {
            this.c1x1 = BA.random(0, this.w);
            this.c1y1 = BA.random(0, this.h);
            this.c1x2 = BA.random(0, this.w);
            this.c1y2 = BA.random(0, this.h);
            this.c2x1 = BA.random(0, this.w);
            this.c2y1 = BA.random(0, this.h);
            this.c2x2 = BA.random(0, this.w);
            this.c2y2 = BA.random(0, this.h);
            this.rot1 = BA.random(1, 90);
            this.rot2 = BA.random(1, 90);
            this.color1 = BA.randomColor(0, 255, 1, 1);
            this.color2 = BA.randomColor();

            this.ctx.globalCompositeOperation =
                this.modes[BA.random(0, this.modes.length)];
            this.ctx.strokeStyle = BA.randomColor(0, 255, 1, 1);
        }
        this.t++;
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
            this.w / 2 + Math.sin(this.t) * this.deviation1,
            this.h / 2 + Math.cos(this.t) * this.deviation1
        );
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    }
}
