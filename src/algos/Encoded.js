import AL from '../AlgorithmLoader.js';

export default class Encoded extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.letters = ['S', 'P', 'I', 'R', 'A', 'L'];
        this.letter = this.letters[AL.random(0, this.letters.length)];
        this.size = AL.random(100, 400);
        this.rot = (AL.random(1, 360) * Math.PI) / 180;
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.angles = [10, 12, 15, 18, 20, 24, 36, 45, 72];
        this.angle = this.angles[AL.random(0, this.angles.length)];
    }

    setupDrawingStyles() {
        this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor(
            30,
            255,
            0.2,
            0.6
        );
        this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
        this.ctx.font = `bold ${this.size}px serif`;
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 10;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText(this.letter, this.x, this.y);
            this.ctx.fillText(this.letter, this.x, this.y);
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.angle * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 72) === 0) {
            this.letter = this.letters[AL.random(0, this.letters.length)];
            this.size = AL.random(100, 400);
            this.rot = (AL.random(1, 360) * Math.PI) / 180;
            this.x = AL.random(0, this.w);
            this.y = AL.random(0, this.h);

            this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor(
                30,
                255,
                0.2,
                0.6
            );
            this.ctx.font = `bold ${this.size}px serif`;
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
